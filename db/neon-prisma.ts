import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool, neonConfig } from '@neondatabase/serverless'

// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
import ws from 'ws'
neonConfig.webSocketConstructor = ws

const connectionString = `${process.env.DATABASE_URL}`

// Creates a new connection pool using the provided connection string, allowing multiple concurrent connections.
const pool = new Pool({ connectionString })

// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon(pool, { schema: 'public' })

// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString()
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString()
        },
      },
    },
  },
})
