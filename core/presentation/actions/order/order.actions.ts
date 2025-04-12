'use server'

import { revalidatePath } from 'next/cache'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { Prisma } from '@prisma/client'

import { auth } from '@/auth'
import { getMyCart } from '../cart/cart.actions'
import { getUserById } from '../auth/user.actions'

import { insertOrderSchema } from '@/core/infrastructure/validators/shipping'

import { CartItem, PaymentResult } from '@/core/infrastructure/types'

import { prisma } from '@/db/prisma'
import { convertToPlainObject, formatError } from '@/lib/utils'
import { paypal } from '@/lib/paypal'
import { PAGE_SIZE } from '@/lib/constants'

type SalesDataType = {
  month: string
  totalSales: number
}[]

// Create Order
export const createOrder = async () => {
  try {
    const session = await auth()
    if (!session) throw new Error('User is not authenticated')

    const cart = await getMyCart()
    const userId = session?.user?.id
    if (!userId) throw new Error('User not found')

    const user = await getUserById(userId)

    // Check if the user has a cart and if it has items
    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: 'Your cart is empty',
        redirectTo: '/cart',
      }
    }

    if (!user.address) {
      return {
        success: false,
        message: 'No shipping address',
        redirectTo: '/shipping-address',
      }
    }

    if (!user.paymentMethod) {
      return {
        success: false,
        message: 'No payment method',
        redirectTo: '/payment-method',
      }
    }

    // Prepare the order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice: cart.itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice: cart.totalPrice,
    })

    // Create a transaction to create order and order items in database
    const insertedOrderId = await prisma.$transaction(async (tx) => {
      // Create order
      const insertedOrder = await tx.order.create({ data: order })
      // Create order items from the cart items
      for (const item of cart.items as CartItem[]) {
        await tx.orderItem.create({
          data: {
            ...item,
            price: item.price,
            orderId: insertedOrder.id,
          },
        })
      }
      // Clear cart
      await tx.cart.update({
        where: { id: cart.id },
        data: {
          items: [],
          totalPrice: 0,
          taxPrice: 0,
          shippingPrice: 0,
          itemsPrice: 0,
        },
      })

      return insertedOrder.id
    })

    if (!insertedOrderId) throw new Error('Order not created')
    return {
      success: true,
      message: 'Order created',
      redirectTo: `/order/${insertedOrderId}`,
    }
  } catch (error) {
    if (isRedirectError(error)) throw error
    return { success: false, message: formatError(error) }
  }
}

// Get Order by ID
export const getOrderById = async (orderId: string) => {
  const data = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  })
  return convertToPlainObject(data)
}

// Create a Paypal Order
export const createPayPalOrder = async (orderId: string) => {
  try {
    // Get order from database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    })
    if (order) {
      // Create a paypal order
      const paypalOrder = await paypal.createOrder(Number(order.totalPrice))

      // Update the order with the paypal order id
      await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          paymentResult: {
            id: paypalOrder.id,
            email_address: '',
            status: '',
            pricePaid: '0',
          },
        },
      })

      // Return the paypal order id
      return {
        success: true,
        message: 'PayPal order created successfully',
        data: paypalOrder.id,
      }
    } else {
      throw new Error('Order not found')
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

// Approve Paypal Order
export const approvePayPalOrder = async (
  orderId: string,
  data: { orderID: string }
) => {
  try {
    // Find the order in the database
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    })
    if (!order) throw new Error('Order not found')

    // Check if the order is already paid
    const captureData = await paypal.capturePayment(data.orderID)
    if (
      !captureData ||
      captureData.id !== (order.paymentResult as PaymentResult)?.id ||
      captureData.status !== 'COMPLETED'
    )
      throw new Error('Error in Paypal payment')

    //  @todo - Update order to paid
    await updateOrderToPaid({
      orderId,
      paymentResult: {
        id: captureData.id,
        email_address: captureData.payer.email_address,
        status: captureData.status,
        pricePaid:
          captureData.purchase_units[0]?.payments.captures[0]?.amount?.value,
      },
    })
    revalidatePath(`/order/${orderId}`)

    return {
      success: true,
      message: 'Your order has been successfully paid by PayPal',
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

// Get User Orders
export async function getMyOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number
  page: number
}) {
  const session = await auth()
  if (!session) throw new Error('User is not authenticated')

  const data = await prisma.order.findMany({
    where: { userId: session?.user?.id },
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
  })

  const dataCount = await prisma.order.count({
    where: { userId: session?.user?.id },
  })

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  }
}

// Update Order to Paid in Database
const updateOrderToPaid = async ({
  orderId,
  paymentResult,
}: {
  orderId: string
  paymentResult?: PaymentResult
}) => {
  // Find the order in the database and include the order items
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
    },
  })

  if (!order) throw new Error('Order not found')

  if (order.isPaid) throw new Error('Order is already paid')

  // Transaction to update the order and update the product quantities
  await prisma.$transaction(async (tx) => {
    // Update all item quantities in the database
    for (const item of order.orderItems) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { increment: -item.qty } },
      })
    }

    // Set the order to paid
    await tx.order.update({
      where: { id: orderId },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult,
      },
    })
  })

  // Get the updated order after the transaction
  const updatedOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
    },
    include: {
      orderItems: true,
      user: { select: { name: true, email: true } },
    },
  })

  if (!updatedOrder) {
    throw new Error('Order not found')
  }
}

// Get sales data and order summary
export async function getOrderSummary() {
  // Get counts for each resource
  const ordersCount = await prisma.order.count()
  const productsCount = await prisma.product.count()
  const usersCount = await prisma.user.count()

  // Calculate total sales
  const totalSales = await prisma.order.aggregate({
    _sum: { totalPrice: true },
  })

  // Get monthly sales
  const salesDataRaw = await prisma.$queryRaw<
    Array<{ month: string; totalSales: Prisma.Decimal }>
  >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`

  const salesData: SalesDataType = salesDataRaw.map((entry) => ({
    month: entry.month,
    totalSales: Number(entry.totalSales), // Convert Decimal to number
  }))

  // Get latest sales
  const latestOrders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: { select: { name: true } },
    },
    take: 6,
  })

  return {
    ordersCount,
    productsCount,
    usersCount,
    totalSales,
    latestOrders,
    salesData,
  }
}

// Get All Orders (Admin)
export async function getAllOrders({
  limit = PAGE_SIZE,
  page,
}: {
  limit?: number
  page: number
}) {
  const data = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    skip: (page - 1) * limit,
    include: { user: { select: { name: true } } },
  })

  const dataCount = await prisma.order.count()

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  }
}

// Delete Order
export async function deleteOrder(id: string) {
  try {
    await prisma.order.delete({ where: { id } })
    revalidatePath('/admin/orders')
    return {
      success: true,
      message: 'Order deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export async function updateOrderToPaidByCOD(orderId: string) {
  try {
    await updateOrderToPaid({ orderId })
    revalidatePath(`/order/${orderId}`)
    return { success: true, message: 'Order paid successfully' }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

// Update Order To Delivered
export async function deliverOrder(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
      },
    })

    if (!order) throw new Error('Order not found')
    if (!order.isPaid) throw new Error('Order is not paid')

    await prisma.order.update({
      where: { id: orderId },
      data: {
        isDelivered: true,
        deliveredAt: new Date(),
      },
    })

    revalidatePath(`/order/${orderId}`)

    return { success: true, message: 'Order delivered successfully' }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}
