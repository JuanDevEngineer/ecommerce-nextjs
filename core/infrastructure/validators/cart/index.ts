import { formatNumberWithDecimal } from '@/lib/utils'
import { z } from 'zod'

const currency = z.string().refine((value) => {
  return new RegExp(/^\d+(\.\d{2})?$/).test(formatNumberWithDecimal(Number(value)))
}, 'Price must have exactly 2 decimal places')

export const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product is required'),
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  qty: z.number().int().nonnegative('Quantity must be a non-negative number'),
  image: z.string().min(1, 'Image is required'),
  price: z
    .number()
    .refine(
      (value) => /^\d+(\.\d{2})?$/.test(Number(value).toFixed(2)),
      'Price must have exactly two decimal places (e.g., 49.99)'
    ),
})

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, 'Session cart id is required'),
  userId: z.string().optional().nullable(),
})
