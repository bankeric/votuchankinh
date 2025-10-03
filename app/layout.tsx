'use client'
import type React from 'react'
import type { Metadata } from 'next'
import { EB_Garamond, Inter, Noto_Serif_SC } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ClientProvider } from '@/components/client-provider'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { cn } from '@/lib/utils'
import { SessionProvider } from 'next-auth/react'
import { CheckoutProvider } from '@stripe/react-stripe-js/checkout'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useMemo } from 'react'

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

// export const metadata: Metadata = {
//   title: 'Buddha AI - Wisdom and Mindful Guidance',
//   description: 'An AI assistant offering wisdom inspired by Buddhist teachings'
// }

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error('Missing publishable key')
}
const stripePromise = loadStripe(publishableKey)

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const promise = useMemo(() => {
    return fetch(
      'http://localhost:3001/api/v1/stripe/create-checkout-session',
      {
        method: 'POST'
      }
    )
      .then((res) => res.json())
      .then((data) => data.clientSecret)
  }, [])
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
        <CheckoutProvider
          stripe={stripePromise}
          options={{ clientSecret: promise }}
        >
          <Elements stripe={stripePromise}>
            <SessionProvider>
              <ThemeProvider
                attribute='class'
                defaultTheme='light'
                enableSystem
                disableTransitionOnChange
              >
                <ClientProvider>{children}</ClientProvider>
                <ToastContainer />
              </ThemeProvider>
            </SessionProvider>
          </Elements>
        </CheckoutProvider>
      </body>
    </html>
  )
}
