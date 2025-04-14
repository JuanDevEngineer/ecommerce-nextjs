import { Metadata } from 'next'

import { auth } from '@/auth'
import { CheckoutSteps } from '@/components/shared/CheckoutSteps'
import { getUserById } from '@/core/presentation/actions/user/user.actions'
import { PaymentMethodForm } from '@/core/presentation/components/shipping/PaymentMethodForm'

export const metadata: Metadata = {
  title: 'Payment Method',
}

const PaymentMethodPage = async () => {
  const session = await auth()
  const userId = session?.user?.id

  if (!userId) {
    throw new Error('User ID not found')
  }

  const user = await getUserById(userId)

  return (
    <>
      <CheckoutSteps current={2} />
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  )
}

export default PaymentMethodPage
