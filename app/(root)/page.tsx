import { Metadata } from 'next'
import { ProductList } from '@/core/presentation/components/product/ProductList'
import { getProducts } from '@/core/presentation/actions/product/product.actions'

export const metadata: Metadata = {
  title: 'Home',
}

const HomePage = async () => {
  const latestProducts = (await getProducts()).map(product => ({
    ...product,
    rating: Number(product.rating),
  }))
  return (
    <div>
      <ProductList
        data={latestProducts}
        title="Newest Arrivals"
      />
    </div>
  )
}

export default HomePage
