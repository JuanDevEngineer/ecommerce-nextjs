import { notFound } from 'next/navigation'

import { getOrderById } from '@/core/presentation/actions/order/order.actions'
import { OrderDetailsTable } from '@/core/presentation/components/order/OrderDetailsTable'
import { ShippingAddress } from '@/core/infrastructure/types'
import { auth } from '@/auth'

export const metadata = {
  title: 'Order Details',
}

const OrderDetailsPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const params = await props.params
  const session = await auth()

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  return <>
    <OrderDetailsTable
      order={{
        ...order,
        shippingAddress: order.shippingAddress as ShippingAddress,
      }}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || ''}
      isAdmin={session?.user.role === 'admin' || false}
    />
  </>
}

export default OrderDetailsPage
