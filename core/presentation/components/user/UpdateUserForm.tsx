'use client'

import { z } from 'zod'
import { ControllerRenderProps, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { updateUserSchema } from '@/core/infrastructure/validators/user'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { USER_ROLES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle } from 'lucide-react'
import { updateUser } from '../../actions/user/user.actions'
import { FC } from 'react'

interface UpdateUserFormProps {
  user: z.infer<typeof updateUserSchema>
}

const UpdateUserForm: FC<UpdateUserFormProps> = ({ user }) => {
  const router = useRouter()

  const form = useForm<z.infer<typeof updateUserSchema>>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: user,
  })

  const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
    try {
      const res = await updateUser({
        ...values,
        id: user.id,
      })
      if (!res.success) {
        toast.error(res.message, {
          icon: <XCircle className="bg-red-500" />,
        })
        return
      }
      form.reset()
      toast.success(res.message, {
        icon: <CheckCircle className="text-green-500" />,
      })
      router.push(`/admin/users`)
    } catch (error) {
      toast.error((error as Error).message, {
        icon: <XCircle className="bg-red-500" />,
      })
    }
  }

  return (
    <Form {...form}>
      <form method="POST" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Email */}
        <div>
          <FormField
            control={form.control}
            name="email"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                'email'
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    disabled={true}
                    placeholder="Enter user email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Name */}
        <div className="mt-4">
          <FormField
            control={form.control}
            name="name"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                'name'
              >
            }) => (
              <FormItem className="w-full">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter user name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        {/* Role */}
        <div className="mt-4">
          <FormField
            control={form.control}
            name="role"
            render={({
              field,
            }: {
              field: ControllerRenderProps<
                z.infer<typeof updateUserSchema>,
                'role'
              >
            }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value.toString()}
                >
                  <FormControl>
                    <SelectTrigger size="default" className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {USER_ROLES.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex-between mt-6">
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? 'Submitting...' : 'Update User'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export { UpdateUserForm }
