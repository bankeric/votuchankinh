'use client'

import { useState } from 'react'
import {
  CardElement,
  useStripe,
  useElements,
  PaymentElement
} from '@stripe/react-stripe-js'

export default function CheckoutIntentForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setMessage('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: 'http://localhost:3000/complete'
      }
    })

    if (error.type === 'card_error' || error.type === 'validation_error') {
      setMessage(error.message as string)
    } else {
      setMessage('An unexpected error occurred.')
    }

    setLoading(false)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='p-6 bg-white rounded shadow-md'
    >
      <CardElement className='p-2 border rounded mb-4' />
      <PaymentElement id='payment-element' />
      <button
        type='submit'
        disabled={!stripe || loading}
        className='px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
      >
        {loading ? 'Đang xử lý...' : 'Thanh toán'}
      </button>
      {message && <p className='mt-2 text-sm text-gray-600'>{message}</p>}
    </form>
  )
}
