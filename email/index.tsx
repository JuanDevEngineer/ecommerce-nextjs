import { Resend } from 'resend'
import dotenv from 'dotenv'
import { SENDER_EMAIL, APP_NAME } from '@/lib/constants'
import { Order } from '@/core/infrastructure/types'
import PurchaseReceiptEmail from './PurchaseReceipts'

dotenv.config()

const resend = new Resend(process.env.RESEND_API_KEY as string)

export const sendPurchaseReceipt = async ({ order }: { order: Order }) => {
  await resend.emails.send({
    from: `${APP_NAME} <${SENDER_EMAIL}>`,
    to: SENDER_EMAIL,
    subject: `Order Confirmation ${order.id}`,
    react: <PurchaseReceiptEmail order={order} />,
  })
}

// to: order.user.email,