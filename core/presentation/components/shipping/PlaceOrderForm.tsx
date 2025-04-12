'use client'

import { FC } from 'react'
import { useRouter } from 'next/navigation'

import { createOrder } from '../../actions/order/order.actions'
import { PlaceOrderButton } from './PlaceOrderButton'

const PlaceOrderForm: FC = () => {
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const res = await createOrder()
    if (res?.redirectTo) {
      router.push(res?.redirectTo)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full">
        <PlaceOrderButton />
      </form>
    </>
  )
}

export { PlaceOrderForm }
