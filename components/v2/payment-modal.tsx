'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Crown, Lock, DollarSign } from 'lucide-react'
import Image from 'next/image'

interface PaymentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plan: {
    id: string
    name: string
    icon: string
    monthlyPrice: string
    yearlyPrice: string
  }
}

export function PaymentModal({ open, onOpenChange, plan }: PaymentModalProps) {
  const [paymentType, setPaymentType] = useState<'monthly' | 'yearly'>('yearly')

  const handlePayment = () => {
    // Handle Stripe payment logic here
    console.log(`Processing ${paymentType} payment for ${plan.id}`)
    onOpenChange(false)
  }

  const totalPrice = paymentType === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto bg-amber-50 border-2 border-black rounded-lg">
        <DialogHeader className="text-center space-y-4">
          {/* Plan Logo */}
          <div className="flex justify-center">
            <Image
              src={plan.icon}
              alt={`${plan.name} logo`}
              width={130}
              height={130}
              className="object-contain"
            />
          </div>
          
          <DialogTitle className="text-3xl font-bold text-red-800">
            Thanh toán
          </DialogTitle>
          
          <p className="text-sm text-gray-700">
            Hoàn tất thanh toán để nâng cấp gói thành viên
          </p>
        </DialogHeader>

        {/* Plan Selection */}
        <div className="bg-white border-2 border-black rounded-lg p-6 space-y-4">
          {/* Plan Header */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black">
              {plan.name}
            </h3>
            <Image
              src={plan.icon}
              alt={`${plan.name} icon`}
              width={50}
              height={50}
              className="object-contain"
            />
          </div>

          {/* Payment Options */}
          <RadioGroup value={paymentType} onValueChange={(value) => setPaymentType(value as 'monthly' | 'yearly')}>
            {/* Yearly Option */}
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="yearly" id="yearly" className="border-black" />
              <Label 
                htmlFor="yearly" 
                className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentType === 'yearly' 
                    ? 'bg-red-800 border-red-800 text-white' 
                    : 'bg-amber-50 border-black text-black'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Thanh toán hàng năm</span>
                  <div className="text-right">
                    <div className={`font-semibold ${paymentType === 'yearly' ? 'text-white' : 'text-black'}`}>
                      {plan.yearlyPrice}
                    </div>
                    <div className={`text-xs ${paymentType === 'yearly' ? 'text-red-200' : 'text-gray-600'}`}>
                      Tiết kiệm 10%
                    </div>
                  </div>
                </div>
              </Label>
            </div>

            {/* Monthly Option */}
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="monthly" id="monthly" className="border-black" />
              <Label 
                htmlFor="monthly" 
                className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  paymentType === 'monthly' 
                    ? 'bg-red-800 border-red-800 text-white' 
                    : 'bg-amber-50 border-black text-black'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-medium">Thanh toán hàng tháng</span>
                  <div className={`font-semibold ${paymentType === 'monthly' ? 'text-white' : 'text-black'}`}>
                    {plan.monthlyPrice}
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>

          {/* Total */}
          <div className="flex justify-between items-center pt-4 border-t border-black">
            <span className="text-lg font-medium text-black">Tổng cộng:</span>
            <span className="text-lg font-semibold text-black">{totalPrice}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            onClick={handlePayment}
            className="w-full bg-red-800 hover:bg-red-900 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
          >
            <DollarSign className="w-5 h-5" />
            Thanh toán với Stripe
          </Button>
          
          <Button
            onClick={() => onOpenChange(false)}
            variant="outline"
            className="w-full bg-gray-200 hover:bg-gray-300 text-black border-2 border-black py-3 rounded-lg font-medium"
          >
            Hủy
          </Button>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Lock className="w-4 h-4" />
          <span>Thanh toán được bảo mật bởi Stripe</span>
        </div>
      </DialogContent>
    </Dialog>
  )
}
