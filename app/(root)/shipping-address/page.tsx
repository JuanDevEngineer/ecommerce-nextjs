import { Metadata } from 'next'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'

import { ShippingAddress } from '@/core/infrastructure/types'
import { getMyCart } from '@/core/presentation/actions/cart/cart.actions'
import { getUserById } from '@/core/presentation/actions/user/user.actions'
import { ShippingAddressForm } from '@/core/presentation/components/shipping/ShippingAddressForm'
import { CheckoutSteps } from '@/components/shared/CheckoutSteps'

export const metadata: Metadata = {
  title: 'Shipping Cart',
}

const ShippingAddressPage = async () => {
  const cart = await getMyCart()

  if (!cart || cart.items.length === 0) redirect('/cart')

  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error('User ID not found')
  }

  const user = await getUserById(userId)

  return (
    <>
      <CheckoutSteps current={1} />
      <ShippingAddressForm  address={user.address as ShippingAddress} />
    </>
  ) 
}

export default ShippingAddressPage
