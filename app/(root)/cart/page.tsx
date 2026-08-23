import { getMyCart } from '@/core/presentation/actions/cart/cart.actions'
import { CartTable } from '@/components/shared/cart/CartTable'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart',
}

const CartPage = async () => {
  const cart = await getMyCart()
  return <CartTable cart={cart} />
}

export default CartPage
