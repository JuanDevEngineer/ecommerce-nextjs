'use client'

import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import { signUpDefaultValues } from '@/lib/constants'
import { signUp } from '../../actions/auth/auth.actions'
import { SignUpButton } from './SignUpButton'

const CredentialsSignUpForm = () => {
  const [data, action] = useActionState(signUp, {
    message: '',
    success: false,
  })

  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'

  return (
    <form action={action}>
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <div className="space-y-6">
        <div>
          <Label className="mb-2" htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            defaultValue={signUpDefaultValues.name}
            autoComplete="name"
          />
        </div>
        <div>
          <Label className="mb-2" htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={signUpDefaultValues.email}
            autoComplete="email"
          />
        </div>
        <div>
          <Label className="mb-2" htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            defaultValue={signUpDefaultValues.password}
            autoComplete="current-password"
          />
        </div>
        <div>
          <Label className="mb-2" htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            defaultValue={signUpDefaultValues.confirmPassword}
            autoComplete="current-password"
          />
        </div>
        <div>
          <SignUpButton />
        </div>

        {!data.success && (
          <div className="text-center text-destructive">{data.message}</div>
        )}

        <div className="text-sm text-center text-muted-foreground">
          Already have an account?{' '}
          <Link
            target="_self"
            className="link"
            href={`/sign-in?callbackUrl=${callbackUrl}`}
          >
            Sign In
          </Link>
        </div>
      </div>
    </form>
  )
}

export { CredentialsSignUpForm }
