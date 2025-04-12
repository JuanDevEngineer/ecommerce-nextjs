import { FC, useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'
import { updateOrderToPaidByCOD } from '../../actions/order/order.actions'

interface MarkAsPaidButtonProps {
  id: string
}

const MarkAsPaidButton: FC<MarkAsPaidButtonProps> = ({ id }) => {
  const [isPending, startTransition] = useTransition()
  return (
    <Button
      type="button"
      className='w-full cursor-pointer'
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await updateOrderToPaidByCOD(id)
          if (!res?.success) {
            toast.error(res.message, {
              description: 'Error in marking order as paid',
              icon: <XCircle className="text-red-500" />,
            })
          } else {
            toast.success(res.message, {
              description: 'Order marked as paid successfully',
              icon: <CheckCircle className="text-green-500" />,
            })
          }
        })
      }
    >
      {isPending ? 'processing...' : 'Mark As Paid'}
    </Button>
  )
}

export { MarkAsPaidButton }