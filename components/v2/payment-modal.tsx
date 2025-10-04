'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Crown, Lock, DollarSign } from 'lucide-react'
import Image from 'next/image'
import { useElements, useStripe } from '@stripe/react-stripe-js'
import { useTranslations } from '@/hooks/use-translations'
import axios from 'axios'
import axiosInstance from '@/lib/axios'

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: {
    id: string
    name: string
    yearlyName: string
    icon: string
    monthlyPrice: string
    yearlyPrice: string
    monthly: number
    yearly: number
    currency: string
  }
}

const textVi = {
  title: 'Thanh toán',
  decription: 'Hoàn tất thanh toán để nâng cấp gói thành viên',
  monthly: 'Thanh toán hàng tháng',
  yearly: 'Thanh toán hàng năm',
  total: 'Tổng cộng:',
  payWithStripe: 'Thanh toán với Stripe',
  cancel: 'Hủy',
  secureNote: 'Thanh toán được bảo mật bởi Stripe',
  save: 'Tiết kiệm 10%'
}

const textEn = {
  title: 'Payment',
  decription: 'Complete the payment to upgrade your membership plan',
  monthly: 'Pay Monthly',
  yearly: 'Pay Yearly',
  total: 'Total:',
  payWithStripe: 'Pay with Stripe',
  cancel: 'Cancel',
  secureNote: 'Payment secured by Stripe',
  save: 'Save 10%'
}

export function PaymentModal({ open, onOpenChange, plan }: PaymentModalProps) {
  const [paymentType, setPaymentType] = useState<'monthly' | 'yearly'>('yearly')
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { language } = useTranslations()

  const text = language === 'en' ? textEn : textVi

  const handlePayment = async () => {
    // Handle Stripe payment logic here
    console.log(`Processing ${paymentType} payment for ${plan.id}`)

    if (!stripe || !elements) return

    setLoading(true)
    setMessage('')

    try {
      // Gọi Flask API tạo PaymentIntent
      const res = await axiosInstance.post(
        '/api/v1/stripe/create-checkout-session',
        {
          currency: plan.currency,
          amount: paymentType === 'yearly' ? plan.yearly : plan.monthly,
          product_name: paymentType === 'yearly' ? plan.yearlyName : plan.name
        }
      )
      const { id, url } = res.data
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
    onOpenChange(false)
  }

  const totalPrice =
    paymentType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className='max-w-md mx-auto bg-[#f3ead7] border-2 border-black rounded-lg'>
        <DialogHeader className='text-center space-y-4'>
          {/* Plan Logo */}
          <div className='flex justify-center'>
            <Image
              src={plan.icon}
              alt={`${plan.name} logo`}
              width={130}
              height={130}
              className='object-contain'
            />
          </div>

          <DialogTitle className='text-3xl font-bold text-red-800'>
            {text.title}
          </DialogTitle>

          <p className='text-sm text-gray-700'>{text.decription}</p>
        </DialogHeader>

        {/* Plan Selection */}
        <div className='bg-[#EFE0BD] border-2 border-black rounded-lg p-6 space-y-4'>
          {/* Plan Header */}
          <div className='flex items-center justify-between'>
            <h3 className='text-lg font-semibold text-black'>{plan.name}</h3>
            <Image
              src={plan.icon}
              alt={`${plan.name} icon`}
              width={50}
              height={50}
              className='object-contain'
            />
          </div>

          {/* Payment Options */}
          <RadioGroup
            value={paymentType}
            onValueChange={(value) =>
              setPaymentType(value as 'monthly' | 'yearly')
            }
          >
            {/* Yearly Option */}
            <div className='flex items-center space-x-3'>
              <RadioGroupItem
                value='yearly'
                id='yearly'
                className='border-black'
              />
              <Label
                htmlFor='yearly'
                className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentType === 'yearly'
                    ? 'bg-red-800 border-red-800 text-white'
                    : 'bg-amber-50 border-black text-black'
                }`}
              >
                <div className='flex justify-between items-center'>
                  <span className='font-medium'>{text.yearly}</span>
                  <div className='text-right'>
                    <div
                      className={`font-semibold ${
                        paymentType === 'yearly' ? 'text-white' : 'text-black'
                      }`}
                    >
                      {plan.yearlyPrice}
                    </div>
                    <div
                      className={`text-xs ${
                        paymentType === 'yearly'
                          ? 'text-red-200'
                          : 'text-gray-600'
                      }`}
                    >
                      {text.save}
                    </div>
                  </div>
                </div>
              </Label>
            </div>

            {/* Monthly Option */}
            <div className='flex items-center space-x-3'>
              <RadioGroupItem
                value='monthly'
                id='monthly'
                className='border-black'
              />
              <Label
                htmlFor='monthly'
                className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentType === 'monthly'
                    ? 'bg-red-800 border-red-800 text-white'
                    : 'bg-amber-50 border-black text-black'
                }`}
              >
                <div className='flex justify-between items-center'>
                  <span className='font-medium'>{text.monthly}</span>
                  <div
                    className={`font-semibold ${
                      paymentType === 'monthly' ? 'text-white' : 'text-black'
                    }`}
                  >
                    {plan.monthlyPrice}
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {/* Total */}
          <div className='flex justify-between items-center pt-4 border-t border-black'>
            <span className='text-lg font-medium text-black'>{text.total}</span>
            <span className='text-lg font-semibold text-black'>
              {totalPrice}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className='space-y-3'>
          <Button
            onClick={handlePayment}
            className='w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2'
          >
            <DollarSign className='w-5 h-5' />
            {text.payWithStripe}
          </Button>

          <Button
            onClick={() => onOpenChange(false)}
            variant='outline'
            className='w-full bg-gray-200 hover:bg-gray-300 text-black border-2 border-black py-3 rounded-lg font-medium'
          >
            {text.cancel}
          </Button>
        </div>

        {/* Security Note */}
        <div className='flex items-center justify-center gap-2 text-sm text-gray-500'>
          <Lock className='w-4 h-4' />
          <span>{text.secureNote}</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
