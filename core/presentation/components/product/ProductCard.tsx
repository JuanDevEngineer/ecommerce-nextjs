import Image from 'next/image'
import Link from 'next/link'
import { FC } from 'react'

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { ProductPrice } from './ProductPrice'
import { Product } from '@/core/infrastructure/types'
import { Rating } from '@/components/shared/product/Rating'

interface ProductCardProps {
  product: Product
}

const ProductCard: FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="w-full p-0 max-w-sm">
      <CardHeader className="p-0 m-0 items-center">
        <Link href={`/product/${product.slug}`}>
          <Image
            className="rounded-t-xl"
            src={product.images[0]}
            alt={product.name}
            height={300}
            width={300}
            priority
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 grid gap-4">
        <div className="text-xs">{product.brand}</div>
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-sm font-medium">{product.name}</h2>
        </Link>
        <div className="flex-between gap-4">
          <Rating value={Number(product.rating)} />
          {product.stock > 0 ? (
            <ProductPrice value={Number(product.price)} />
          ) : (
            <div className="text-destructive">Out Of Stock</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { ProductCard }
