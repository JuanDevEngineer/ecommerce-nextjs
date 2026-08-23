'use server'

import { isRedirectError } from 'next/dist/client/components/redirect-error'

import { prisma } from '@/db/prisma'
import { signIn, signOut } from '@/auth'
import {
  signInFormSchema,
  signUpFormSchema,
} from '@/core/infrastructure/validators/auth'
import { formatError } from '@/lib/utils'
import { hash } from '@/lib/encrypt'
import { getMyCart } from '../cart/cart.actions'

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const user = signInFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    })

    await signIn('credentials', user)

    return { success: true, message: 'Signed in successfully' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }
    return { success: false, message: 'Invalid email or password' }
  }
}

export async function signOutUser() { 
  // get current users cart and delete it so it does not persist to next user
  const currentCart = await getMyCart();
  if (currentCart) {
    await prisma.cart.delete({ where: { id: currentCart.id } });
  }
  await signOut() 
}

export async function signUp(prevState: unknown, formData: FormData) {
  try {
    const user = signUpFormSchema.parse({
      name: formData.get('name'),
      email: formData.get('email'),
      confirmPassword: formData.get('confirmPassword'),
      password: formData.get('password'),
    })

    const plainPassword = user.password

    user.password = await hash(user.password)

    await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
      },
    })

    await signIn('credentials', {
      email: user.email,
      password: plainPassword,
    })

    return { success: true, message: 'User created successfully' }
  } catch (error) {
    if (isRedirectError(error)) {
      throw error
    }

    return {
      success: false,
      message: formatError(error),
    }
  }
}
