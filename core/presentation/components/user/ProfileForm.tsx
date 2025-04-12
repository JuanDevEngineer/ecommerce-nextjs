'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useSession } from 'next-auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { updateProfileSchema } from '@/core/infrastructure/validators/user'
import { updateProfile } from '../../actions/user/user.actions'
import { CheckCircle, XCircle } from 'lucide-react'

const ProfileForm = () => {
  const { data: session, update } = useSession()

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: session?.user?.name ?? '',
      email: session?.user?.email ?? '',
    },
  })

  const onSubmit = async (values: z.infer<typeof updateProfileSchema>) => {
    const res = await updateProfile(values)

    if (!res.success) {
      toast.error(res?.message, {
        description: 'Please try again later.',
        icon: <XCircle className="text-red-500" />,
      })
      return
    }

    const newSession = {
      ...session,
      user: {
        ...session?.user,
        name: values.name,
      },
    }

    await update(newSession)

    toast.success(res?.message, {
      description: 'Your profile has been updated.',
      icon: <CheckCircle className="text-green-500" />,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    disabled
                    placeholder="Email"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          size="lg"
          disabled={form.formState.isSubmitting}
          className="button col-span-2 w-full"
        >
          {form.formState.isSubmitting ? 'Submitting...' : 'Update Profile'}
        </Button>
      </form>
    </Form>
  )
}

export { ProfileForm }
