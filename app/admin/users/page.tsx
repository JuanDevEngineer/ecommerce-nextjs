import { Metadata } from 'next'
import Link from 'next/link'

import { Pagination } from '@/components/shared/Pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  deleteUser,
  getAllUsers,
} from '@/core/presentation/actions/user/user.actions'
import { requireAdmin } from '@/lib/authguard'
import { formatId } from '@/lib/utils'
import { DeleteDialog } from '@/components/shared/DeleteDialog'

export const metadata: Metadata = {
  title: 'Admin Users',
  description: 'Admin Dashboard',
}

const UsersAdminPage = async (props: {
  searchParams: Promise<{
    page: string
    query: string
  }>
}) => {
  await requireAdmin()

  const searchParams = await props.searchParams

  const { page = '1', query: searchText } = searchParams

  const users = await getAllUsers({ page: Number(page), query: searchText })

  return (
    <div className="space-y-2">
      <h1 className="h2-bold">Users</h1>
      {searchText && (
        <div>
          Filtered by <i>&quot;{searchText}&quot;</i>{' '}
          <Link href={`/admin/users`}>
            <Button variant="outline" size="sm">
              Remove Filter
            </Button>
          </Link>
        </div>
      )}
      <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell className="flex gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${user.id}`}>Edit</Link>
                  </Button>
                  {/* DELETE DIALOG HERE */}
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users?.totalPages && users.totalPages > 1 && (
          <Pagination page={page} totalPages={users.totalPages} />
        )}
      </div>
    </div>
  )
}

export default UsersAdminPage
