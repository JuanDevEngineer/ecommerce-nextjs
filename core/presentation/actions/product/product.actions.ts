'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/db/prisma'

import { LATEST_PRODUCTS_LIMIT, PAGE_SIZE } from '@/lib/constants'
import { convertToPlainObject, formatError } from '@/lib/utils'
import { insertProductSchema, updateProductSchema } from '@/core/infrastructure/validators/product'

export const getProducts = async () => {
  const products = await prisma.product.findMany({
    take: LATEST_PRODUCTS_LIMIT,
    orderBy: {
      createdAt: 'desc',
    },
  })
  return convertToPlainObject(products)
}

export const getProductById = async (slug: string) => {
  const product = await prisma.product.findFirst({
    where: { slug: slug },
  })
  return convertToPlainObject(product)
}

// Get all products
export const getAllProducts = async ({
  query,
  limit = PAGE_SIZE,
  page,
  category,
}: {
  query: string
  limit?: number
  page: number
  category?: string
}) => {
  const data = await prisma.product.findMany({
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
export const deleteProduct = async (id: string) => {
  try {
    const productExists = await prisma.product.findFirst({
      where: { id },
    });

    if (!productExists) throw new Error('Product not found');

    await prisma.product.delete({ where: { id } });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Create Product
export const createProduct = async (data: z.infer<typeof insertProductSchema>) => {
  try {
    // Validate and create product
    const product = insertProductSchema.parse(data);
    await prisma.product.create({ data: product });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product created successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}

// Update Product
export const updateProduct = async(data: z.infer<typeof updateProductSchema>) => {
  try {
    // Validate and find product
    const product = updateProductSchema.parse(data);
    const productExists = await prisma.product.findFirst({
      where: { id: product.id },
    });

    if (!productExists) throw new Error('Product not found');

    // Update product
    await prisma.product.update({ where: { id: product.id }, data: product });

    revalidatePath('/admin/products');

    return {
      success: true,
      message: 'Product updated successfully',
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
}