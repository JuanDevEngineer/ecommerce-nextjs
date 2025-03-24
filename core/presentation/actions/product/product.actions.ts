'use server'

import { LATEST_PRODUCTS_LIMIT } from '@/lib/constants'
import { convertToPlainObject } from '@/lib/utils'
import { prisma } from '@/db/prisma'

export const getProducts = async () => {
  const products = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: 'desc',
    },
  })
  return convertToPlainObject(products)
}
