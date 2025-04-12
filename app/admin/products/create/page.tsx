import { ProductForm } from '@/components/shared/admin/ProductForm';
import { requireAdmin } from '@/lib/authguard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create product',
}

const ProductsAdminCreatePage = async () => {
  await requireAdmin()
  return (
    <>
      <h2 className='h2-bold'>Create Product</h2>
      <div className='my-8'>{/* Product Form Here */}
        <ProductForm type='Create' />
      </div>
    </>
  )
}

export default ProductsAdminCreatePage