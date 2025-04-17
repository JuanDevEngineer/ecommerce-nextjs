'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/db/prisma'

import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '@/lib/constants'
import { convertToPlainObject, formatError } from '@/lib/utils'
import {
  insertProductSchema,
  updateProductSchema,
} from '@/core/infrastructure/validators/product'
import { z } from 'zod'
import { Prisma } from '@prisma/client'
import { Product } from '@/core/infrastructure/types'

export async function getProducts() {
  const products = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: 'desc',
    },
  })
  return convertToPlainObject(products)
}

export async function getProductById(value: string, type = 'slug') {
  if (type === 'slug') {
    const product = await prisma.product.findFirst({
      where: { slug: value },
    })
    return convertToPlainObject(product)
  }

  if (type === 'id') {
    const product = await prisma.product.findFirst({
      where: { id: value },
    })
    return convertToPlainObject(product)
  }

  return null
}

// Get all products
export async function getAllProducts({
  query,
  limit = PAGE_SIZE,
  page,
  category,
  price,
  rating,
  sort,
}: {
  query: string
  limit?: number
  page: number
  category?: string
  price?: string
  rating?: string
  sort?: string
}) {
  const queryFilter: Prisma.ProductWhereInput =
    query && query !== 'all'
      ? {
          name: {
            contains: query,
            mode: 'insensitive',
          } as Prisma.StringFilter,
        }
      : {}

  // Category filter
  const categoryFilter = category && category !== 'all' ? { category } : {}

  // Price filter
  const priceFilter: Prisma.ProductWhereInput =
    price && price !== 'all'
      ? {
          price: {
            gte: Number(price.split('-')[0]),
            lte: Number(price.split('-')[1]),
          },
        }
      : {}

  // Rating filter
  const ratingFilter =
    rating && rating !== 'all'
      ? {
          rating: {
            gte: Number(rating),
          },
        }
      : {}

  const data = await prisma.product.findMany({
    where: {
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    },
    orderBy:
      sort === 'lowest'
        ? { price: 'asc' }
        : sort === 'highest'
        ? { price: 'desc' }
        : sort === 'rating'
        ? { rating: 'desc' }
        : { createdAt: 'desc' },
    skip: (page - 1) * limit,
    take: limit,
  })
  const dataCount = await prisma.product.count()

  return {
    data,
    totalPages: Math.ceil(dataCount / limit),
  }
}

// Delete Product
export async function deleteProduct(id: string) {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    })

    if (!productExists) throw new Error('Product not found')

    await prisma.product.delete({ where: { id } })

    revalidatePath('/admin/products')

    return {
      success: true,
      message: 'Product deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Create Product
export async function createProduct(data: Product) {
  try {
    // Validate and create product
    const product = insertProductSchema.parse(data)
    await prisma.product.create({ data: product })

    revalidatePath('/admin/products')
    return {
      success: true,
      message: 'Product created successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// Update Product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {
  try {
    // Validate and find product
    const product = updateProductSchema.parse(data)
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    })

    if (!productExists) throw new Error('Product not found')

    // Update product
    await prisma.product.update({ where: { id: product.id }, data: product })

    revalidatePath('/admin/products')

    return {
      success: true,
      message: 'Product updated successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
