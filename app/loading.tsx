'use client'

import Image from 'next/image'
import loader from '@/assets/loader.gif'

const LoadingPage = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
      }}
    >
      <Image src={loader} alt="loading..." height={90} width={90} />
    </div>
  )
}

export default LoadingPage
