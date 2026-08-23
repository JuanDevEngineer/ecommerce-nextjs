'use client'

import Image from 'next/image'
import { FC, useState } from 'react'

import { cn } from '@/lib/utils'

interface ProductImagesProps {
  images: string[]
}

const ProductImages: FC<ProductImagesProps> = ({ images }) => {
  const [current, setCurrent] = useState<number>(0)

  return (
    <div className="space-y-4">
      <Image
        src={images![current]}
        alt="hero image"
        width={1000}
        height={1000}
        className="min-h-[300px] object-cover object-center rounded-lg"
      />
      <div className="flex">
        {images.map((image, index) => (
          <div
            key={image}
            className={cn(
              'border   mr-2 cursor-pointer hover:border-orange-600 rounded-lg',
              current === index && '  border-orange-500'
            )}
            onClick={() => setCurrent(index)}
          >
            <Image src={image} alt={'image'} width={100} height={100} className="rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  )
}

export { ProductImages }
