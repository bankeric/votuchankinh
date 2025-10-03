import { useState } from 'react'
import { useTranslations } from '@/hooks/use-translations'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Crown, Star, Zap } from 'lucide-react'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import Image from 'next/image'

interface SubscriptionModalProps {
  showMembership: boolean
  setShowMembership: (value: boolean) => void
}

export const SubscriptionModal = ({
  showMembership,
  setShowMembership
}: SubscriptionModalProps) => {
  const { t } = useTranslations()
  const [currentPlan, setCurrentPlan] = useState<'giac-ngo' | 'don-ngo' | null>(
    null
  )
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string
    type: 'giac-ngo' | 'don-ngo'
    monthlyPrice: number
    yearlyPrice: number
    discount: number
  } | null>(null)
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'yearly'
  )
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const handleUpgradeClick = (planType: 'giac-ngo' | 'don-ngo') => {
    const planDetails = {
      'giac-ngo': {
        name: t(``),
        type: 'giac-ngo' as const,
        monthlyPrice: 99000,
        yearlyPrice: 1069200,
        discount: 0
      },
      'don-ngo': {
        name: t(`donNgoTitle`),
        type: 'don-ngo' as const,
        monthlyPrice: 249000,
        yearlyPrice: 2688200,
        discount: 0
      }
    }

    setSelectedPlan(planDetails[planType])
    setShowMembership(false)
    setShowPayment(true)
  }

  const handleStripePayment = async () => {
    setIsProcessingPayment(true)

    // TODO: Implement actual Stripe payment integration
    // This is a placeholder for the Stripe checkout flow
    setTimeout(() => {
      setIsProcessingPayment(false)
      setCurrentPlan(selectedPlan?.type || null)
      setShowPayment(false)
      // Show success message or redirect
    }, 2000)
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
            {/* Header */}
            <div className='text-center mb-8'>
              <div className='text-4xl font-serif text-[#991b1b] mb-3'>法</div>
              <h2 className='text-2xl md:text-3xl font-serif text-[#2c2c2c] mb-3 font-semibold'>
                {t(`membershipTitle`)}
              </h2>
              <p className='text-sm md:text-base font-serif text-[#2c2c2c]/70 max-w-2xl mx-auto'>
                {t(`membershipSubtitle`)}
              </p>
            </div>

            {/* Membership Cards */}
            <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
              {/* Tâm An - Free Plan */}
              <div className='bg-[#EFE0BD] border-2 border-[#2c2c2c] rounded-2xl p-6 shadow-[0_4px_0_#00000030,0_0_0_3px_#00000010_inset] hover:shadow-[0_6px_0_#00000040,0_0_0_3px_#00000015_inset] transition-all duration-200'>
                <div className='text-center mb-6'>
                  <div className='w-12 h-12 bg-[#991b1b]/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Star className='w-6 h-6 text-[#991b1b]' />
                  </div>
                  <h3 className='text-xl font-serif text-[#2c2c2c] font-semibold mb-2'>
                    {t(`tamAnTitle`)}
                  </h3>
                  <div className='text-2xl font-serif text-[#991b1b] font-bold'>
                    Miễn phí
                  </div>
                </div>

                <div className='space-y-3 mb-6'>
                  <div className='flex items-start space-x-3'>
                    <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
                    <span className='text-sm font-serif text-[#2c2c2c]'>
                      {t(`tamAnFeature1`)}
                    </span>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
                    <span className='text-sm font-serif text-[#2c2c2c]'>
                      {t(`tamAnFeature2`)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowMembership(false)}
                  className='w-full py-3 bg-[#991b1b] text-[#f6efe0] font-serif text-sm rounded-xl
                       border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                       hover:bg-[#7a1515] transition-colors'
                >
                  {t(`tamAnCta`)}
                </button>
              </div>

              {/* Giác Ngộ - Pro Plan */}
              <div className='bg-[#EFE0BD] border-2 border-[#991b1b] rounded-2xl p-6 shadow-[0_4px_0_#991b1b30,0_0_0_3px_#991b1b10_inset] hover:shadow-[0_6px_0_#991b1b40,0_0_0_3px_#991b1b15_inset] transition-all duration-200 relative'>
                <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                  <div className='bg-[#991b1b] text-[#f6efe0] px-4 py-1 rounded-full text-xs font-serif font-semibold'>
                    Phổ biến
                  </div>
                </div>

                <div className='text-center mb-6'>
                  <div className='w-12 h-12 bg-[#991b1b]/20 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Zap className='w-6 h-6 text-[#991b1b]' />
                  </div>
                  <h3 className='text-xl font-serif text-[#2c2c2c] font-semibold mb-2'>
                    {t(`giacNgoTitle`)}
                  </h3>

                  {/* TODO: Fix it */}
                  {/* <div className='space-y-1'>
                    <div className='text-2xl font-serif text-[#991b1b] font-bold'>
                      {appliedDiscounts.giacNgo > 0 ? (
                        <>
                          <span className='line-through text-lg opacity-60'>
                            99.000 đ
                          </span>
                          <br />
                          {Math.round(
                            calculateDiscountedPrice(
                              99000,
                              appliedDiscounts.giacNgo
                            )
                          ).toLocaleString()}{' '}
                          đ/tháng
                        </>
                      ) : (
                        t.giacNgoPrice
                      )}
                    </div>
                    <div className='text-sm text-[#2c2c2c]/70'>
                      {appliedDiscounts.giacNgo > 0 ? (
                        <>
                          <span className='line-through opacity-60'>
                            1.069.200 đ
                          </span>
                          <br />
                          {Math.round(
                            calculateDiscountedPrice(
                              1069200,
                              appliedDiscounts.giacNgo
                            )
                          ).toLocaleString()}{' '}
                          đ/năm {t.yearDiscount}
                        </>
                      ) : (
                        `${t.giacNgoYearPrice} ${t.yearDiscount}`
                      )}
                    </div>
                  </div> */}
                </div>

                <div className='space-y-3 mb-6'>
                  <div className='flex items-start space-x-3'>
                    <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
                    <span className='text-sm font-serif text-[#2c2c2c]'>
                      {t(`giacNgoFeature1`)}
                    </span>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
                    <span className='text-sm font-serif text-[#2c2c2c]'>
                      {t(`giacNgoFeature2`)}
                    </span>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
                    <span className='text-sm font-serif text-[#2c2c2c]'>
                      {t(`giacNgoFeature3`)}
                    </span>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
                    <span className='text-sm font-serif text-[#2c2c2c]'>
                      {t(`giacNgoFeature4`)}
                    </span>
                  </div>
                </div>

                {/* Discount Code Input */}
                <div className='mb-4'>
                  <label className='block text-xs font-serif text-[#2c2c2c]/70 mb-2'>
                    {t(`discountCode`)}
                  </label>
                  <div className='flex space-x-2'>
                    <Input
                      //   value={discountCodes.giacNgo}
                      //   onChange={(e) =>
                      //     setDiscountCodes((prev) => ({
                      //       ...prev,
                      //       giacNgo: e.target.value
                      //     }))
                      //   }
                      placeholder={t(`enterCode`)}
                      className='flex-1 bg-[#f3ead7] border-2 border-[#2c2c2c] rounded-xl text-sm font-serif'
                    />
                    <Button
                      //   onClick={() => applyDiscountCode('giacNgo')}
                      className='px-4 py-2 bg-[#2c2c2c] text-[#f6efe0] font-serif text-xs rounded-xl
                           hover:bg-[#1a1a1a] transition-colors'
                    >
                      {t(`applyCode`)}
                    </Button>
                  </div>

                  {/* TODO: Fix it */}
                  {/* {appliedDiscounts.giacNgo > 0 && (
                    <p className='text-xs text-[#991b1b] mt-1 font-serif'>
                      Giảm {appliedDiscounts.giacNgo}% đã được áp dụng!
                    </p>
                  )} */}
                </div>

                <button
                  onClick={() => handleUpgradeClick('giac-ngo')}
                  className='w-full py-3 bg-[#991b1b] text-[#f6efe0] font-serif text-sm rounded-xl
                       border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                       hover:bg-[#7a1515] transition-colors'
                >
                  {currentPlan === 'giac-ngo' ? t('currentPlan') : t('upgrade')}
                </button>
              </div>

              {/* Đốn Ngộ - Premium Plan */}
              <div className='bg-[#EFE0BD] border-2 border-[#2c2c2c] rounded-2xl p-6 shadow-[0_4px_0_#00000030,0_0_0_3px_#00000010_inset] hover:shadow-[0_6px_0_#00000040,0_0_0_3px_#00000015_inset] transition-all duration-200'>
                <div className='text-center mb-6'>
                  <div className='bg-gradient-to-br from-[#991b1b] to-[#7a1515] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'>
                    <Crown className='w-6 h-6 text-[#f6efe0]' />
                  </div>
                  <h3 className='text-xl font-serif text-[#2c2c2c] font-semibold mb-2'>
                    {t('donNgoTitle')}
                  </h3>

                  {/* TODO: Fix it */}
                  {/* <div className='space-y-1'>
                    <div className='text-2xl font-serif text-[#991b1b] font-bold'>
                      {appliedDiscounts.donNgo > 0 ? (
                        <>
                          <span className='line-through text-lg opacity-60'>
                            249.000 đ
                          </span>
                          <br />
                          {Math.round(
                            calculateDiscountedPrice(
                              249000,
                              appliedDiscounts.donNgo
                            )
                          ).toLocaleString()}{' '}
                          đ/tháng
                        </>
                      ) : (
                        t.donNgoPrice
                      )}
                    </div>
                    <div className='text-sm text-[#2c2c2c]/70'>
                      {appliedDiscounts.donNgo > 0 ? (
                        <>
                          <span className='line-through opacity-60'>
                            2.688.200 đ
                          </span>
                          <br />
                          {Math.round(
                            calculateDiscountedPrice(
                              2688200,
                              appliedDiscounts.donNgo
                            )
                          ).toLocaleString()}{' '}
                          đ/năm {t.yearDiscount}
                        </>
                      ) : (
                        `${t.donNgoYearPrice} ${t.yearDiscount}`
                      )}
                    </div>
                  </div> */}
                </div>

                <div className='space-y-3 mb-6'>
                  <div className='flex items-start space-x-3'>
                    <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
                    <span className='text-sm font-serif text-[#2c2c2c]'>
                      {t('donNgoFeature1')}
                    </span>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
                    <span className='text-sm font-serif text-[#2c2c2c]'>
                      {t('donNgoFeature2')}
                    </span>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
                    <span className='text-sm font-serif text-[#2c2c2c]'>
                      {t('donNgoFeature3')}
                    </span>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
                    <span className='text-sm font-serif text-[#2c2c2c]'>
                      {t('donNgoFeature4')}
                    </span>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
                    <span className='text-sm font-serif text-[#2c2c2c]'>
                      {t('donNgoFeature5')}
                    </span>
                  </div>
                </div>

                {/* Discount Code Input */}
                {/* <div className='mb-4'>
                  <label className='block text-xs font-serif text-[#2c2c2c]/70 mb-2'>
                    {t.discountCode}
                  </label>
                  <div className='flex space-x-2'>
                    <Input
                      value={discountCodes.donNgo}
                      onChange={(e) =>
                        setDiscountCodes((prev) => ({
                          ...prev,
                          donNgo: e.target.value
                        }))
                      }
                      placeholder={t.enterCode}
                      className='flex-1 bg-[#f3ead7] border-2 border-[#2c2c2c] rounded-xl text-sm font-serif'
                    />
                    <Button
                      onClick={() => applyDiscountCode('donNgo')}
                      className='px-4 py-2 bg-[#2c2c2c] text-[#f6efe0] font-serif text-xs rounded-xl
                           hover:bg-[#1a1a1a] transition-colors'
                    >
                      {t.applyCode}
                    </Button>
                  </div>
                  {appliedDiscounts.donNgo > 0 && (
                    <p className='text-xs text-[#991b1b] mt-1 font-serif'>
                      Giảm {appliedDiscounts.donNgo}% đã được áp dụng!
                    </p>
                  )}
                </div> */}

                <button
                  onClick={() => handleUpgradeClick('don-ngo')}
                  className='w-full py-3 bg-[#991b1b] text-[#f6efe0] font-serif text-sm rounded-xl
                       border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                       hover:bg-[#7a1515] transition-colors'
                >
                  {currentPlan === 'don-ngo' ? t('currentPlan') : t('upgrade')}
                </button>
              </div>
            </div>

            {/* Close Button */}
            <div className='text-center'>
              <button
                onClick={() => setShowMembership(false)}
                className='px-6 py-2 bg-[#2c2c2c]/10 text-[#2c2c2c] font-serif text-sm rounded-xl
                     border-2 border-[#2c2c2c]/30 hover:bg-[#2c2c2c]/20 transition-colors'
              >
                Đóng
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <PaymentModal
        showPayment={showPayment}
        setShowPayment={setShowPayment}
        selectedPlan={selectedPlan}
        setSelectedPlan={setSelectedPlan}
        billingCycle={billingCycle}
        setBillingCycle={setBillingCycle}
        isProcessingPayment={isProcessingPayment}
        handleStripePayment={handleStripePayment}
      />
    </AnimatePresence>
  )
}

interface PaymentModalProps {
  showPayment: boolean
  setShowPayment: (value: boolean) => void
  selectedPlan: {
    name: string
    type: 'giac-ngo' | 'don-ngo'
    monthlyPrice: number
    yearlyPrice: number
    discount: number
  } | null
  setSelectedPlan: (
    plan: {
      name: string
      type: 'giac-ngo' | 'don-ngo'
      monthlyPrice: number
      yearlyPrice: number
      discount: number
    } | null
  ) => void
  billingCycle: 'monthly' | 'yearly'
  setBillingCycle: (cycle: 'monthly' | 'yearly') => void
  isProcessingPayment: boolean
  handleStripePayment: () => Promise<void>
}

const PaymentModal = ({
  showPayment,
  setShowPayment,
  selectedPlan,
  setSelectedPlan,
  billingCycle,
  setBillingCycle,
  isProcessingPayment,
  handleStripePayment
}: PaymentModalProps) => {
  const calculateDiscountedPrice = (
    originalPrice: number,
    discount: number
  ) => {
    return originalPrice - (originalPrice * discount) / 100
  }

  const calculateFinalPrice = () => {
    if (!selectedPlan) return 0
    const basePrice =
      billingCycle === 'monthly'
        ? selectedPlan.monthlyPrice
        : selectedPlan.yearlyPrice
    return calculateDiscountedPrice(basePrice, selectedPlan.discount)
  }

  return (
    <AnimatePresence>
      {showPayment && selectedPlan && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4'
          onClick={() => !isProcessingPayment && setShowPayment(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className='bg-[#f3ead7] border-2 border-[#2c2c2c] rounded-xl md:rounded-2xl p-6 max-w-md w-full shadow-[0_6px_0_#00000030]'
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className='text-center mb-6'>
              <div className='flex justify-center mb-3'>
                <Image
                  src='/images/lotus-payment-icon.png'
                  alt='Lotus Flower'
                  width={64}
                  height={64}
                  className='w-16 h-16 object-contain drop-shadow-md'
                  style={{
                    mixBlendMode: 'multiply',
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }}
                />
              </div>
              <h2 className='text-xl md:text-2xl font-serif text-[#2c2c2c] mb-2 font-semibold'>
                Thanh toán
              </h2>
              <p className='text-sm font-serif text-[#2c2c2c]/70'>
                Hoàn tất thanh toán để nâng cấp gói thành viên
              </p>
            </div>

            {/* Selected Plan Summary */}
            <div className='bg-[#EFE0BD] border-2 border-[#2c2c2c] rounded-xl p-4 mb-6 shadow-[0_2px_0_#00000030,0_0_0_2px_#00000010_inset]'>
              <div className='flex items-center justify-between mb-3'>
                <span className='font-serif text-[#2c2c2c] font-semibold'>
                  {selectedPlan.name}
                </span>
                {selectedPlan.type === 'giac-ngo' ? (
                  <Zap className='w-5 h-5 text-[#991b1b]' />
                ) : (
                  <Crown className='w-5 h-5 text-[#991b1b]' />
                )}
              </div>

              {/* Billing Cycle Selection */}
              <div className='space-y-2 mb-4'>
                <button
                  onClick={() => setBillingCycle('yearly')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg font-serif text-sm transition-all duration-200
                      ${
                        billingCycle === 'yearly'
                          ? 'bg-[#991b1b] text-[#f6efe0] border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030]'
                          : 'bg-[#f3ead7] text-[#2c2c2c] border-2 border-[#2c2c2c]/30 hover:border-[#2c2c2c]/50'
                      }`}
                >
                  <div className='flex items-center space-x-2'>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${
                          billingCycle === 'yearly'
                            ? 'border-[#f6efe0]'
                            : 'border-[#2c2c2c]'
                        }`}
                    >
                      {billingCycle === 'yearly' && (
                        <div className='w-2 h-2 rounded-full bg-[#f6efe0]'></div>
                      )}
                    </div>
                    <span>Thanh toán hàng năm</span>
                  </div>
                  <div className='text-right'>
                    <div className='font-semibold'>
                      {selectedPlan.discount > 0
                        ? Math.round(
                            calculateDiscountedPrice(
                              selectedPlan.yearlyPrice,
                              selectedPlan.discount
                            )
                          ).toLocaleString()
                        : selectedPlan.yearlyPrice.toLocaleString()}{' '}
                      đ
                    </div>
                    <div className='text-xs opacity-70'>Tiết kiệm 10%</div>
                  </div>
                </button>

                <button
                  onClick={() => setBillingCycle('monthly')}
                  className={`w-full flex items-center justify-between p-3 rounded-lg font-serif text-sm transition-all duration-200
                      ${
                        billingCycle === 'monthly'
                          ? 'bg-[#991b1b] text-[#f6efe0] border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030]'
                          : 'bg-[#f3ead7] text-[#2c2c2c] border-2 border-[#2c2c2c]/30 hover:border-[#2c2c2c]/50'
                      }`}
                >
                  <div className='flex items-center space-x-2'>
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center
                        ${
                          billingCycle === 'monthly'
                            ? 'border-[#f6efe0]'
                            : 'border-[#2c2c2c]'
                        }`}
                    >
                      {billingCycle === 'monthly' && (
                        <div className='w-2 h-2 rounded-full bg-[#f6efe0]'></div>
                      )}
                    </div>
                    <span>Thanh toán hàng tháng</span>
                  </div>
                  <div className='font-semibold'>
                    {selectedPlan.discount > 0
                      ? Math.round(
                          calculateDiscountedPrice(
                            selectedPlan.monthlyPrice,
                            selectedPlan.discount
                          )
                        ).toLocaleString()
                      : selectedPlan.monthlyPrice.toLocaleString()}{' '}
                    đ
                  </div>
                </button>
              </div>

              {/* Price Summary */}
              <div className='border-t-2 border-[#2c2c2c]/20 pt-3 space-y-2'>
                {selectedPlan.discount > 0 && (
                  <div className='flex justify-between text-sm font-serif text-[#2c2c2c]/70'>
                    <span>Giá gốc:</span>
                    <span className='line-through'>
                      {(billingCycle === 'monthly'
                        ? selectedPlan.monthlyPrice
                        : selectedPlan.yearlyPrice
                      ).toLocaleString()}{' '}
                      đ
                    </span>
                  </div>
                )}
                {selectedPlan.discount > 0 && (
                  <div className='flex justify-between text-sm font-serif text-[#991b1b]'>
                    <span>Giảm giá ({selectedPlan.discount}%):</span>
                    <span>
                      -
                      {Math.round(
                        ((billingCycle === 'monthly'
                          ? selectedPlan.monthlyPrice
                          : selectedPlan.yearlyPrice) *
                          selectedPlan.discount) /
                          100
                      ).toLocaleString()}{' '}
                      đ
                    </span>
                  </div>
                )}
                <div className='flex justify-between text-lg font-serif text-[#2c2c2c] font-bold'>
                  <span>Tổng cộng:</span>
                  <span>
                    {Math.round(calculateFinalPrice()).toLocaleString()} đ
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handleStripePayment}
              disabled={isProcessingPayment}
              className='w-full py-3 bg-[#991b1b] text-[#f6efe0] font-serif text-sm rounded-xl
                   border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                   hover:bg-[#7a1515] transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                   flex items-center justify-center space-x-2'
            >
              {isProcessingPayment ? (
                <>
                  <div className='w-4 h-4 border-2 border-[#f6efe0]/30 border-t-[#f6efe0] rounded-full animate-spin'></div>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <svg
                    className='w-5 h-5'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                  >
                    <path d='M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 1.315 0 2.36.562 2.36 1.673 0 .097.007.193.019.287H15.89c-.012-.09-.017-.182-.017-.277 0-1.755-1.47-2.88-3.619-2.88-2.112 0-3.505 1.113-3.505 2.88 0 1.73 1.506 2.772 3.919 3.65 2.172.806 3.356 1.426 3.356 2.409 0 .831-.683 1.305-1.901 1.305-1.315 0-2.36-.562-2.36-1.673 0-.097-.007-.193-.019-.287H8.11c.012.09.017.182.017.277 0 1.755 1.47 2.88 3.619 2.88 2.112 0 3.505-1.113 3.505-2.88 0-1.73-1.506-2.772-3.919-3.65z' />
                  </svg>
                  <span>Thanh toán với Stripe</span>
                </>
              )}
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => setShowPayment(false)}
              disabled={isProcessingPayment}
              className='w-full mt-3 py-2 bg-[#2c2c2c]/10 text-[#2c2c2c] font-serif text-sm rounded-xl
                   border-2 border-[#2c2c2c]/30 hover:bg-[#2c2c2c]/20 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Hủy
            </button>

            {/* Security Notice */}
            <p className='text-xs text-center text-[#2c2c2c]/60 font-serif mt-4'>
              🔒 Thanh toán được bảo mật bởi Stripe
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
