import { Metadata } from 'next'
import Link from 'next/link'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { getMyOrders } from '@/core/presentation/actions/order/order.actions'
import { formatCurrency, formatDateTime, formatId } from '@/lib/utils'
import { Pagination } from '@/components/shared/Pagination'

export const metadata: Metadata = {
  title: `Order | Dashboard`,
  description: 'User dashboard',
}

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string }>
}) => {
  const { page } = await props.searchParams
  const orders = await getMyOrders({
    page: Number(page) || 1,
  })

  return (
    <>
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
              {orders.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No orders found
                  </TableCell>
                </TableRow>
              )}
              {orders.data.map((order) => {
                const { dateOnly } = formatDateTime(order.createdAt)
                return (
                  <TableRow key={order.id}>
                    <TableCell>{formatId(order.id)}</TableCell>
                    <TableCell>{dateOnly}</TableCell>
                    <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                    <TableCell>
                      {order.isPaid && order.paidAt
                        ? formatDateTime(order.paidAt).dateTime
                        : 'not paid'}
                    </TableCell>
                    <TableCell>
                      {order.isDelivered && order.deliveredAt
                        ? formatDateTime(order.deliveredAt).dateTime
                        : 'not delivered'}
                    </TableCell>
                    <TableCell>
                      <Link href={`/order/${order.id}`}>
                        <span className="px-2 bg-cyan-500 p-1 rounded-sm">Details</span>
                      </Link>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {orders.totalPages > 1 && (
            <Pagination page={Number(page) || 1} totalPages={orders?.totalPages} />
          )}
        </div>
      </div>
    </>
  )
}

export default OrdersPage
