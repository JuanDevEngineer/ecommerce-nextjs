'use client'

import { ThemeProvider } from 'next-themes'

interface ThemeProps {
  children: React.ReactNode
}

const Theme = ({ children }: ThemeProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}

export { Theme }