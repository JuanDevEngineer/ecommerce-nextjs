'use client'

import { useEffect, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { Input } from '@/components/ui/input'

const AdminSearch = () => {
  const pathname = usePathname()
  const formActionUrl = pathname.includes('/admin/orders')
    ? '/admin/orders'
    : pathname.includes('/admin/users')
    ? '/admin/users'
    : '/admin/products'

  const searchParams = useSearchParams()
  const [queryValue, setQueryValue] = useState<string>(searchParams.get('query') || '')

  useEffect(() => {
    setQueryValue(searchParams.get('query') || '')
  }, [searchParams])

  return (
    <form action={formActionUrl} method="GET">
      <Input
        type="search"
        placeholder="Search by name..."
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="md:w-[100px] lg:w-[300px]"
      />
      <button type="submit" className="sr-only">
        Search
      </button>
    </form>
  )
}

export { AdminSearch }
