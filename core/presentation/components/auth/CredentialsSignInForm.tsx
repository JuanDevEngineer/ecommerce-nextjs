'use client'

import Link from 'next/link'
import { FC, useActionState } from 'react'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { signInDefaultValues } from '@/lib/constants'
import { signInWithCredentials } from '../../actions/auth/user.actions'
import { SignInButton } from './SignInButton'
import { useSearchParams } from 'next/navigation'

interface CredentialsSignInFormProps {}

const CredentialsSignInForm: FC<CredentialsSignInFormProps> = () => {
  const [data, action] = useActionState(signInWithCredentials, {
    message: '',
    success: false,
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  return (
    <form action={action}>
      <input type='hidden' name='callbackUrl' value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label className="mb-2" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            required
            type="email"
            defaultValue={signInDefaultValues.email}
            autoComplete="email"
          />
        </div>
        <div>
          <Label className="mb-2" htmlFor="password">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            required
            type="password"
            defaultValue={signInDefaultValues.password}
            autoComplete="current-password"
          />
        </div>
        <div>
          <SignInButton />
        </div>

        {data && !data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Link target="_self" className="link" href="/sign-up">
            Sign Up
          </Link>
        </div>
      </div>
    </form>
  )
}

export { CredentialsSignInForm }
