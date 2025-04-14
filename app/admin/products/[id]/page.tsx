import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getProductById } from '@/core/presentation/actions/product/product.actions'
import { ProductForm } from '@/components/shared/admin/ProductForm'

export const metadata: Metadata = {
  title: 'Update product',
}

const ProductsAdminDetailPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const { id } = await props.params

  const product = await getProductById(id, 'id')

  if (!product) return notFound()

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Product</h1>
      <ProductForm
        type="Update"
        product={{ ...product, rating: Number(product.rating) }}
        productId={product.id}
      />
    </div>
  )
}

export default ProductsAdminDetailPage
