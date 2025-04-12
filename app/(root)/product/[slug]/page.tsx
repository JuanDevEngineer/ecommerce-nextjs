import { FC } from 'react'
import { notFound } from 'next/navigation'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

import { ProductPrice } from '@/core/presentation/components/product/ProductPrice'
import { ProductImages } from '@/core/presentation/components/product/ProductImages'

import { getProductById } from '@/core/presentation/actions/product/product.actions'
import { AddToCart } from '@/core/presentation/components/product/AddToCart'
import { getMyCart } from '@/core/presentation/actions/cart/cart.actions'

interface ProductDetailspageProps {
  params: Promise<{ slug: string }>
}

const ProductDetailspage: FC<ProductDetailspageProps> = async ({ params }) => {
  const { slug } = await params
  const product = await getProductById(slug)

  if (!product) {
    return notFound()
  }

  const cart = await getMyCart()

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Images Column */}
        <div className="col-span-2">
          {/* Image Component */}
          <ProductImages images={product.images!} />
        </div>
        {/* Details Column */}
        <div className="col-span-2 p-5">
          <div className="flex flex-col gap-6">
            <p>
              {product.brand} {product.category}
            </p>
            <h1 className="h3-bold">{product.name}</h1>
            <p>
              {product.rating} of {product.numReviews.toString()} Reviews
            </p>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <ProductPrice
                value={Number(product.price)}
                className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
              />
            </div>
          </div>

          <div className="mt-10">
            <p className="font-semibold">Description</p>
            <p>{product.description}</p>
          </div>
        </div>
        {/* Actions Column */}
        <div>
          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex justify-between">
                <div>Price</div>
                <div>
                  <ProductPrice value={Number(product.price)} />
                </div>
              </div>
              <div className="flex justify-between mb-4">
                <div>Status</div>
                <div>
                  {product.stock > 0 ? (
                    <Badge variant="outline">In Stock</Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
              </div>
              {product.stock > 0 && (
                <div className=' flex-center'>
                <AddToCart
                  cart={cart}
                  item={{
                    productId: product.id,
                    name: product.name,
                    slug: product.slug,
                    price: Number(product.price),
                    qty: 1,
                    image: product.images![0],
                  }}
                />
              </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailspage
