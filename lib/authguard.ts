import { auth } from '@/auth'
import { Role } from '@/core/domain/enums/role'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const session = await auth()

  if (session?.user?.role !== Role.ADMIN) {
    redirect('/unauthorized')
  }

  return session
}
