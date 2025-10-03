'use client'

import { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setLoading(true)
    setMessage('')

    try {
      // Gọi Flask API tạo PaymentIntent
      const res = await fetch(
        'http://localhost:3001/api/v1/stripe/create-checkout-session',
        {
          method: 'POST'
        }
      )
      const { id, url } = await res.json()
      window.location.href = url

      // const cardElement = elements.getElement(CardElement)
      // if (!cardElement) return

      // const result = await stripe.confirmCardPayment(id, {
      //   payment_method: { card: cardElement }
      // })

      // if (result.error) {
      //   setMessage(result.error.message || 'Thanh toán thất bại')
      // } else if (result.paymentIntent?.status === 'succeeded') {
      //   setMessage('💰 Thanh toán thành công!')
      // }
    } catch (error) {
      console.error('Lỗi thanh toán:', error)
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='p-6 bg-white rounded shadow-md'
    >
      {/* <CardElement className='p-2 border rounded mb-4' /> */}
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
