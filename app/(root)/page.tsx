import { Metadata } from 'next'
import { ProductList } from '@/core/presentation/components/product/ProductList'
import { getProducts } from '@/core/presentation/actions/product/product.actions'

export const metadata: Metadata = {
  title: 'Home',
}

const HomePage = async () => {
  const latestProducts = await getProducts()
  return (
    <div>
      <ProductList
        data={latestProducts}
        title="Featured Products"
      />
    </div>
  )
}

export default HomePage
