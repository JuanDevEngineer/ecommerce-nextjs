import { z } from 'zod'
import { insertProductSchema } from '../validators/product'
import { cartItemSchema, insertCartSchema } from '../validators/cart'
import {
  insertOrderItemSchema,
  insertOrderSchema,
  shippingAddressSchema,
} from '../validators/shipping'
import { paymentResultSchema } from '../validators/paypal'

export type Product = z.infer<typeof insertProductSchema> & {
  id: string
  rating: number
  createdAt: Date
}

export type Cart = z.infer<typeof insertCartSchema>

export type CartItem = z.infer<typeof cartItemSchema>

export type ShippingAddress = z.infer<typeof shippingAddressSchema>

export type OrderItem = z.infer<typeof insertOrderItemSchema>

export type Order = z.infer<typeof insertOrderSchema> & {
  id: string
  createdAt: Date
  isPaid: boolean
  paidAt: Date | null
  isDelivered: boolean
  deliveredAt: Date | null
  orderItems: OrderItem[]
  user: { name: string; email: string }
}

export type PaymentResult = z.infer<typeof paymentResultSchema>
