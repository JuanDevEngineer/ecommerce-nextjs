import { z } from 'zod'

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
})
