import { notFound } from 'next/navigation'

import { getOrderById } from '@/core/presentation/actions/order/order.actions'
import { OrderDetailsTable } from '@/components/shared/order/OrderDetailsTable'
import { ShippingAddress } from '@/core/infrastructure/types'
import { auth } from '@/auth'
import { stripe } from '@/lib/stripe'

export const metadata = {
  title: 'Order Details',
}

const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const params = await props.params
  
  const { id } = params
  
  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  let client_secret = null
    
  // Check if using Stripe and not paid
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    // Create a new payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(order.totalPrice) * 100),
      currency: 'USD',
      metadata: { orderId: order.id },
    })
    client_secret = paymentIntent.client_secret
  }

  return (
    <>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        stripeClientSecret={client_secret}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || ''}
        isAdmin={session?.user.role === 'admin' || false}
      />
    </>
  )
}

export default OrderDetailsPage
