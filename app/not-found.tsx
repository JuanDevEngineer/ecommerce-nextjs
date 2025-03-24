'use client'

import Image from 'next/image'

import { Button } from '@/components/ui/button'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image
        src="/images/logo.svg"
        alt="404 Not Found"
        width={48}
        height={48}
        priority
      />
      <div className="p-6 w-1/3 rounded-lg shadow md text-center">
        <h1 className="text-3xl font-bold mb-4">404 Not Found</h1>
        <p className="text-desctructive">
          The page you are looking for does not exist.
        </p>
        <Button
          variant="outline"
          className="mt-4 ml-2 cursor-pointer"
          onClick={() => (window.location.href = '/')}
        >
          Go back
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
