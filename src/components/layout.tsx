import type React from 'react'
import type { Metadata } from 'next'
import { Noto_Serif_SC, EB_Garamond } from 'next/font/google'
import { cn } from '@/lib/utils'

const notoSerifSC = Noto_Serif_SC({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-serif-sc',
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-eb-garamond',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={cn('font-sans', notoSerifSC.variable, ebGaramond.variable)}
      >
        {children}
      </body>
    </html>
  )
}
