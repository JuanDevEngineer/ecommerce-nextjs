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
import { DeleteDialog } from '@/components/shared/DeleteDialog'

import { auth } from '@/auth'
import { Role } from '@/core/domain/enums/role'
import {
  deleteOrder,
  getAllOrders,
} from '@/core/presentation/actions/order/order.actions'
import { requireAdmin } from '@/lib/authguard'
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Orders',
  description: 'Admin Dashboard',
}

const OrderAdminPage = async (props: {
  searchParams: Promise<{ page: string }>
}) => {
  await requireAdmin()
  const { page = '1' } = await props.searchParams

  const session = await auth()
  if (session?.user.role !== Role.ADMIN)
    throw new Error('admin permission required')

  const orders = await getAllOrders({
    page: Number(page),
  })

  return (
    <div className="space-y-2">
      <h2 className="h2-bold">Orders</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>DATE</TableHead>
              <TableHead>TOTAL</TableHead>
              <TableHead>PAID</TableHead>
              <TableHead>DELIVERED</TableHead>
              <TableHead>ACTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'Not Paid'}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'Not Delivered'}
                </TableCell>
                <TableCell className="flex gap-2">
                  <Button asChild className="bg-cyan-500 text-white" size="sm">
                    <Link href={`/order/${order.id}`}>Details</Link>
                  </Button>
                  {/* DELETE */}
                  <DeleteDialog id={order.id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={orders?.totalPages}
          />
        )}
      </div>
    </div>
  )
}

export default OrderAdminPage
