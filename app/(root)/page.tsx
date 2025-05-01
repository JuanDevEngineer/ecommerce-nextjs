import { Metadata } from 'next'
import { ProductList } from '@/core/presentation/components/product/ProductList'
import { getFeaturedProducts, getProducts } from '@/core/presentation/actions/product/product.actions'
import { ProductCarousel } from '@/components/shared/product/ProductCarousel'
import { ViewAllProductsButton } from '@/core/presentation/components/product/ViewAllProductsButton'

export const metadata: Metadata = {
  title: 'Home',
}

const HomePage = async () => {
  const latestProducts = (await getProducts()).map(product => ({
    ...product,
    rating: Number(product.rating),
  }))

  const featuredProducts = (await getFeaturedProducts()).map(product => ({
    ...product,
    rating: Number(product.rating),
  }))

  console.log('HomePage',featuredProducts)

  return (
    <div>
      {featuredProducts.length > 0 && <ProductCarousel data={featuredProducts} />}
      <ProductList
        data={latestProducts}
        title="Newest Arrivals"
      />
      <ViewAllProductsButton />
    </div>
  )
}

export default HomePage
