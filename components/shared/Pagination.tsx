'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { FC } from 'react'

import { Button } from '@/components/ui/button'
import { formUrlQuery } from '@/lib/utils'

interface PaginationProps {
  page: number | string
  totalPages: number
  urlParamName?: string
}
const Pagination: FC<PaginationProps> = ({ page, totalPages, urlParamName }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onClick = (btnType: string) => {
    const pageValue = btnType === 'next' ? Number(page) + 1 : Number(page) - 1

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName || 'page',
      value: pageValue.toString(),
    })

    router.push(newUrl, { scroll: false })
  }

  return (
    <div className="flex gap-2">
      <Button
        size="lg"
        className="w-28 bg-amber-300 mt-5"
        onClick={() => onClick('prev')}
        disabled={Number(page) <= 1}
      >
        Previous
      </Button>
      <Button
        size="lg"
        className="w-28 bg-amber-300 mt-5"
        onClick={() => onClick('next')}
        disabled={Number(page) >= totalPages}
      >
        Next
      </Button>
    </div>
  )
}

export { Pagination }
