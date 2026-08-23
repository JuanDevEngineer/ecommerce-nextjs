import { type FC } from 'react'
import { FormEvent, useState } from 'react'

import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js/pure'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/utils'
import { SERVER_URL } from '@/lib/constants'

interface StripePaymentProps {
  priceInCents: number
  orderId: string
  clientSecret: string
}

const StripePayment: FC<StripePaymentProps> = ({
  priceInCents,
  orderId,
  clientSecret,
}) => {
  const { theme, systemTheme } = useTheme()

  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
  )

  // Stripe Form Component
  const StripeForm = () => {
    const stripe = useStripe()
    const elements = useElements()

    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [email, setEmail] = useState<string>()

    // Handle StripeForm submission
    async function handleSubmit(e: FormEvent) {
      e.preventDefault()
      if (stripe == null || elements == null || email == null) return
      setIsLoading(true)
      stripe
        .confirmPayment({
          elements,
          confirmParams: {
            return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
          },
        })
        .then(({ error }) => {
          if (
            error?.type === 'card_error' ||
            error?.type === 'validation_error'
          ) {
            setErrorMessage(error?.message ?? 'An unknown error occurred.')
          } else if (error) {
            setErrorMessage('An unknown error occurred.')
          }
        })
        .finally(() => setIsLoading(false))
    }

    // return for StripeForm
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-xl">Stripe Checkout</div>
        {errorMessage && <div className="text-destructive">{errorMessage}</div>}
        <PaymentElement />
        <div>
          <LinkAuthenticationElement
            onChange={(e) => setEmail(e.value.email)}
          />
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={stripe == null || elements == null || isLoading}
        >
          {isLoading
            ? 'Purchasing...'
            : `Purchase - ${formatCurrency(priceInCents / 100)}`}
        </Button>
      </form>
    )
  }

  return (
    <Elements
      options={{
        clientSecret,
        appearance: {
          theme:
            theme === 'dark'
              ? 'night'
              : theme === 'light'
                ? 'stripe'
                : systemTheme === 'light'
                  ? 'stripe'
                  : 'night',
        },
      }}
      stripe={stripePromise}
    >
      <StripeForm />
    </Elements>
  )
}

export { StripePayment }
