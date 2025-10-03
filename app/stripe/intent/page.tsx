'use client'
import React, { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import CheckoutIntentForm from '@/components/stripe/stripe-intent-form'

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

if (!publishableKey) {
  throw new Error('Missing publishable key')
}
const stripePromise = loadStripe(publishableKey)

export default function StripeIntent() {
  const [clientSecret, setClientSecret] = useState('')

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    fetch('http://localhost:3001/api/v1/stripe/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ id: 'xl-tshirt', amount: 1000 }] })
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
  }, [])

  // Enable the skeleton loader UI for optimal loading.
  const loader = 'auto'

  return (
    <div className='App'>
      {clientSecret && (
        <Elements
          options={{ clientSecret, loader }}
          stripe={stripePromise}
        >
          <CheckoutIntentForm />
        </Elements>
      )}
    </div>
  )
}
