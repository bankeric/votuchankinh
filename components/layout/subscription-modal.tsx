import { useState } from 'react'
import { useTranslations } from '@/hooks/use-translations'
import { useAuthStore } from '@/store/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Check, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { PaymentModal } from '@/components/v2/payment-modal'
import { AnimatePresence, motion } from 'framer-motion'
import { subScriptionPlans } from '@/constants/subscription'

interface SubscriptionModalProps {
  showMembership: boolean
  setShowMembership: (value: boolean) => void
}

export const SubscriptionModal = ({
  showMembership,
  setShowMembership
}: SubscriptionModalProps) => {
  const { t, language } = useTranslations()
  const { user } = useAuthStore()
  const router = useRouter()
  const [discountCodes, setDiscountCodes] = useState<{ [key: string]: string }>(
    {}
  )
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<any>(null)

  // Using static pricing plans data with new content

  // Use static pricing plans data

  const handleApplyDiscount = (planId: string) => {
    const code = discountCodes[planId]
    if (code) {
      // Handle discount code application logic here
      console.log(`Applying discount code ${code} for plan ${planId}`)
    }
  }

  const plans = subScriptionPlans[language]

  const handleUpgrade = (planId: string) => {
    console.log(`Upgrading to plan: ${planId}`)
    if (planId === 'tam-an') {
      router.push('/ai/new')
    } else {
      // Find the selected plan from static data
      const plan = plans.find((p) => p.id === planId)
      if (plan) {
        setSelectedPlan({
          ...plan,
          monthlyPrice: plan.price,
          yearlyPrice: plan.yearlyPrice
        })
        setIsPaymentModalOpen(true)
      }
    }
  }

  return (
    <AnimatePresence>
      {showMembership && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={() => setShowMembership(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className='bg-[#f3ead7] border-2 border-[#2c2c2c] rounded-xl md:rounded-2xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-[0_6px_0_#00000030]'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='max-w-6xl mx-auto'>
              {/* Header with Back Button and Title */}
              <div className='flex items-start justify-between mb-8'>
                <Button
                  variant='outline'
                  onClick={() => setShowMembership(false)}
                  className='flex items-center gap-2 border-red-800 text-red-800 hover:bg-red-50'
                >
                  <ArrowLeft className='w-4 h-4' />
                  {t('common.back')}
                </Button>
                {/* <div className='text-center flex-1'>
                  <div className='flex justify-center mb-1'>
                    <Image
                      src='/images/giac-ngo-logo-1.png'
                      alt='Giác Ngộ Logo'
                      width={120}
                      height={120}
                    />
                  </div>
                  <h1 className='text-4xl font-bold text-red-800 mb-2'>
                    {t('pricing.title')}
                  </h1>
                  <p className='text-xl text-red-700 max-w-3xl mx-auto leading-relaxed'>
                    {t('pricing.subtitle')}
                  </p>
                </div> */}
                <div className='w-32'></div> {/* Spacer for centering */}
              </div>

              <div className='grid md:grid-cols-3 gap-6 max-w-5xl mx-auto'>
                {plans.map((plan) => {
                  return (
                    <Card
                      key={plan.id}
                      className={`relative transition-all duration-300 hover:shadow-xl bg-[#EFE0BD] border-2 flex flex-col h-full ${
                        plan.popular
                          ? 'border-red-800 shadow-lg scale-105'
                          : 'border-black hover:border-gray-800'
                      }`}
                    >
                      {plan.popular && (
                        <Badge className='absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-800 text-white px-4 py-1'>
                          {t('pricing.popular')}
                        </Badge>
                      )}

                      <CardHeader className='text-center pb-6'>
                        <Image
                          src={plan.icon}
                          alt={`${plan.name} icon`}
                          width={130}
                          height={130}
                          className='object-contain mx-auto mb-6'
                        />
                        <CardTitle
                          className={`text-lg font-semibold text-black ${
                            plan.popular ? 'mt-2' : 'mt-4'
                          }`}
                        >
                          {plan.name}
                        </CardTitle>
                        {plan.subtitle && (
                          <p className='text-sm text-gray-600 mt-2 italic'>
                            {plan.subtitle}
                          </p>
                        )}
                        <div className='mt-6'>
                          <div className='text-3xl font-bold text-red-800'>
                            {plan.price}
                          </div>
                          {plan.yearlyPrice && (
                            <div className='text-sm mt-2 text-gray-700'>
                              {plan.yearlyPrice}
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className='space-y-6 flex flex-col h-full'>
                        <div className='space-y-3 flex-1'>
                          {plan.features.map((feature, index) => (
                            <div
                              key={index}
                              className='flex items-start gap-3'
                            >
                              <Check className='w-5 h-5 mt-0.5 flex-shrink-0 text-black' />
                              <span className='text-sm text-black'>
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Bottom section with discount and upgrade button */}
                        <div className='space-y-4 pt-4 '>
                          {plan.id !== 'tam-an' && (
                            <div className='space-y-3'>
                              <div className='text-sm font-medium text-black'>
                                {t('pricing.discountCode')}
                              </div>
                              <div className='flex gap-2 items-center'>
                                <Input
                                  placeholder={t('pricing.discountPlaceholder')}
                                  value={discountCodes[plan.id] || ''}
                                  onChange={(e) =>
                                    setDiscountCodes((prev) => ({
                                      ...prev,
                                      [plan.id]: e.target.value
                                    }))
                                  }
                                  className='flex-1 border-2 border-[#2c2c2c] rounded-xl bg-[#f3ead7]'
                                />
                                <Button
                                  variant='outline'
                                  size='sm'
                                  onClick={() => handleApplyDiscount(plan.id)}
                                  className='px-4 bg-[#2c2c2c] text-white border-gray-600 rounded-xl hover:bg-[#2c2c2c] hover:text-white'
                                >
                                  {t('pricing.applyDiscount')}
                                </Button>
                              </div>
                            </div>
                          )}

                          <Button
                            onClick={() => handleUpgrade(plan.id)}
                            className='w-full py-3 text-base font-medium transition-colors rounded-lg bg-red-800 hover:bg-red-900 text-white'
                          >
                            {plan.buttonText}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className='text-center mt-16 max-w-5xl mx-auto'>
                <p className='text-red-700 mb-4'>
                  {t('pricing.support.title')}
                </p>
                <Button
                  variant='outline'
                  onClick={() => router.push('/contact')}
                  className='border-red-300 text-red-700 hover:bg-red-100'
                >
                  {t('pricing.support.button')}
                </Button>
              </div>
            </div>

            {/* Payment Modal */}
            {selectedPlan && (
              <PaymentModal
                open={isPaymentModalOpen}
                onOpenChange={setIsPaymentModalOpen}
                plan={selectedPlan}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
