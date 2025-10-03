'use client'

import CheckoutForm from '@/components/stripe/stripe-form'
import { Elements } from '@stripe/react-stripe-js'
import { CheckoutProvider } from '@stripe/react-stripe-js/checkout'
import { loadStripe } from '@stripe/stripe-js'
import { useMemo } from 'react'

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error('Missing publishable key')
}
const stripePromise = loadStripe(publishableKey)

export default function StripeApp() {
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
    <CheckoutProvider
      stripe={stripePromise}
      options={{ clientSecret: promise }}
    >
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </CheckoutProvider>
  )
}
