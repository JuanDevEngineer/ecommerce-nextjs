'use server'

import { auth } from '@/auth'
import { prisma } from '@/db/prisma'
import { formatError } from '@/lib/utils'

// Update User Profile
export async function updateProfile(user: { name: string; email: string }) {
  try {
    const session = await auth()

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    })

    if (!currentUser) throw new Error('User not found')

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name: user.name,
      },
    })

    return {
      success: true,
      message: 'User updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
