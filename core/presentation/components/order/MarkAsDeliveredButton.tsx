'use client'
import { FC, useTransition } from 'react'
import { toast } from 'sonner'
import { CheckCircle, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { deliverOrder } from '../../actions/order/order.actions'

interface MarkAsDeliveredButtonProps {
  id: string 
}

const MarkAsDeliveredButton: FC<MarkAsDeliveredButtonProps> = ({ id }) => {
  const [isPending, startTransition] = useTransition()
  return (
    <Button
      type="button"
      className='w-full cursor-pointer'
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await deliverOrder(id)
          if (!res?.success) {
            toast.error(res.message, {
              description: 'Error in marking order as delivered',
              icon: <XCircle className="text-red-500" />,
            })
          } else {
            toast.success(res.message, {
              description: 'Order marked as delivered successfully',
              icon: <CheckCircle className="text-green-500" />,
            })
          }
        })
      }
    >
      {isPending ? 'processing...' : 'Mark As Delivered'}
    </Button>
  )
}

export { MarkAsDeliveredButton }