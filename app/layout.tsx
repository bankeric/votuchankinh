import type React from 'react'
import type { Metadata } from 'next'
import { EB_Garamond, Inter, Noto_Serif_SC } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ClientProvider } from '@/components/client-provider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'] })

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-serif-sc'
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond'
})

export const metadata: Metadata = {
  title: 'Buddha AI - Wisdom and Mindful Guidance',
  description: 'An AI assistant offering wisdom inspired by Buddhist teachings'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
    >
      <body
        className={cn(
          inter.className,
          notoSerifSC.className,
          ebGaramond.className
        )}
      >
        <ThemeProvider
          attribute='class'
          defaultTheme='light'
          enableSystem
          disableTransitionOnChange
        >
          <ClientProvider>{children}</ClientProvider>
          <ToastContainer />
        </ThemeProvider>
      </body>
    </html>
  )
}
