'use client'

import { FC, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { Plus, Minus, Loader, CheckCircle, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { Cart, CartItem } from '@/core/infrastructure/types'

import {
  addItemToCart,
  removeItemFromCart,
} from '../../actions/cart/cart.actions'

interface AddToCartProps {
  cart?: Cart
  item: Omit<CartItem, 'cartId'>
}

const AddToCart: FC<AddToCartProps> = ({ cart, item }) => {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleAddToCart = async () => {
    startTransition(async () => {
      const res = await addItemToCart(item)
      if (!res?.success) {
        toast.error(res?.message, {
          icon: <XCircle className="text-red-500" />,
        })
        return
      }

      toast.success(res?.message, {
        icon: <CheckCircle className="text-green-500" />,
        action: {
          label: 'Go to cart',
          onClick: () => router.push('/cart'),
        },
      })
    })
  }

  const handleRemoveFromCart = async () => {
    startTransition(async () => {
      const res = await removeItemFromCart(item.productId)
      if (!res?.success) {
        toast.error(res?.message, {
          icon: <XCircle className="text-red-500" />,
        })
        return
      }
      toast.success(res?.message, {
        icon: <CheckCircle className="text-green-500" />,
        action: {
          label: 'Go to cart',
          onClick: () => router.push('/cart'),
        },
      })
    })
  }

  const existItem =
    cart && cart.items.find((x) => x.productId === item.productId)

  return existItem ? (
    <div>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={handleRemoveFromCart}
      >
        {isPending ? (
          <Loader className="w-4 h-4  animate-spin" />
        ) : (
          <Minus className="w-4 h-4" />
        )}
      </Button>
      <span className="px-2">{existItem.qty}</span>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={handleAddToCart}
      >
        {isPending ? (
          <Loader className="w-4 h-4 animate-spin" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    </div>
  ) : (
    <Button
      className="w-full"
      type="button"
      disabled={isPending}
      onClick={handleAddToCart}
    >
      {isPending ? (
        <Loader className="w-4 h-4 animate-spin" />
      ) : (
        <Plus className="w-4 h-4" />
      )}
      Add to cart
    </Button>
  )
}

export { AddToCart }
