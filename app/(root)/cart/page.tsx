import { getMyCart } from '@/core/presentation/actions/cart/cart.actions'
import { CartTable } from '@/core/presentation/components/cart/CartTable'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shopping Cart',
}

const CartPage = async () => {
  const cart = await getMyCart()
  return <CartTable cart={cart} />
}

export default CartPage
