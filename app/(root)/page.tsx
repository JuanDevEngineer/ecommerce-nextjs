import { Metadata } from 'next'
import { IconBoxes } from '@/components/shared/IconBoxes'
import { DealCountdown } from '@/components/shared/DealCountdown'
import { ProductCarousel } from '@/components/shared/product/ProductCarousel'
import { ProductList } from '@/components/shared/product/ProductList'
import { ViewAllProductsButton } from '@/components/shared/product/ViewAllProductsButton'

import {
  getFeaturedProducts,
  getProducts,
} from '@/core/presentation/actions/product/product.actions'

export const metadata: Metadata = {
  title: 'Home',
}

const HomePage = async () => {
  const latestProducts = (await getProducts()).map((product) => ({
    ...product,
    rating: Number(product.rating),
  }))

  const featuredProducts = (await getFeaturedProducts()).map((product) => ({
    ...product,
    rating: Number(product.rating),
  }))

  return (
    <div>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts} title="Newest Arrivals" />
      <ViewAllProductsButton />
      <DealCountdown />
      <IconBoxes />
    </div>
  )
}

export default HomePage
