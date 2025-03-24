import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { APP_NAME, SERVER_URL } from '@/lib/constants'

import { Theme } from '@/core/presentation/providers/theme/ThemeProvider'
import '@/assets/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: `%s | ${APP_NAME}`,
    default: `${APP_NAME}`,
  },
  description: 'A modern ecommerce store platform',
  metadataBase: new URL(SERVER_URL),
}

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Theme>{children}</Theme>
      </body>
    </html>
  )
}

export default RootLayout
