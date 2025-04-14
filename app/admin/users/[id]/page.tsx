import { getUserById } from '@/core/presentation/actions/user/user.actions'
import { UpdateUserForm } from '@/core/presentation/components/user/UpdateUserForm'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Update user',
}

const UpdateUserPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await props.params

  const user = await getUserById(id)

  if (!user) notFound()

  console.log(user)

  return (
    <div className="space-y-8 max-w-lg mx-auto">
      <h1 className="h2-bold">Update User</h1>
      {/* FORM HERE */}
      <UpdateUserForm user={user} />
    </div>
  )
}

export default UpdateUserPage
