import { z } from 'zod'
import { inserProductValidator } from '../validators/product'

export type Product = z.infer<typeof inserProductValidator> & {
  id: string
  rating: number
  createdAt: Date
}
