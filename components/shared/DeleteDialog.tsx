'use client'

import { FC, useState, useTransition } from 'react'
import { toast } from 'sonner'

import { Button } from '../ui/button'
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog'
import { CheckCircle, XCircle } from 'lucide-react'

interface DeleteDialogProps {
  id: string
  action: (id: string) => Promise<{ success: boolean; message: string }>
}

const DeleteDialog: FC<DeleteDialogProps> = ({ id, action }) => {
  const [open, setOpen] = useState<boolean>(false)
  const [isPending, startTransition] = useTransition()

  const handleDeleteClick = () => {
    startTransition(async () => {
      const res = await action(id)
      if (!res.success) {
        toast.error(res.message, {
          description: 'Item deleted successfully',
          icon: <XCircle className="text-red-500" />,
        })
      } else {
        setOpen(false)
        toast.success(res.message, {
          description: 'Item deleted successfully',
          icon: <CheckCircle className="text-green-500" />,
        })
      }
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            variant="destructive"
            size="sm"
            disabled={isPending}
            onClick={handleDeleteClick}
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export { DeleteDialog }
