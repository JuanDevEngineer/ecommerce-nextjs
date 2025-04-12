import { FC, Fragment } from 'react'

import { cn } from '@/lib/utils'

interface CheckoutStepsProps {
  current?: number
  steps?: string[]
}

const defaultSteps = [
  'User Login',
  'Shipping Address',
  'Payment Method',
  'Place Order',
]

const CheckoutSteps: FC<CheckoutStepsProps> = ({
  current = 0,
  steps = defaultSteps,
}) => {
  return (
    <div className="flex-between  flex-col md:flex-row  space-x-2 space-y-2 mb-10">
      {steps.map((step, index) => (
        <Fragment key={step}>
          <div
            className={cn(
              'p-2 w-56 rounded-full text-center  text-sm',
              index === current ? 'bg-secondary' : ''
            )}
          >
            {step}
          </div>
          {step !== 'Place Order' && (
            <hr className="w-16 border-t border-gray-300 mx-2" />
          )}
        </Fragment>
      ))}
    </div>
  )
}

export { CheckoutSteps }
