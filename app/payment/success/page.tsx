'use client'

import Link from 'next/link'
import { Check, Home, MessageSquare, Crown } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'giac-ngo'
  const billingCycle = searchParams.get('cycle') || 'yearly'

  const planNames = {
    'giac-ngo': 'Giác Ngộ',
    'don-ngo': 'Đốn Ngộ',
    'tam-an': 'Tâm An'
  }

  return (
    <main className='min-h-screen bg-gradient-to-b from-background/20 to-background/40 flex items-center justify-center p-4'>
      <div
        className={`bg-[#EFE0BD] border-2 border-[#050505] rounded-2xl p-8 md:p-12 max-w-2xl w-full shadow-[0_4px_0_#991b1b30,0_0_0_3px_#991b1b10_inset] hover:shadow-[0_6px_0_#991b1b40,0_0_0_3px_#991b1b15_inset] transition-all duration-200 relative animate-scale-in`}
      >
        {/* Badge */}
        <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
          <div className='bg-[#991b1b] text-[#f6efe0] px-4 py-1 rounded-full text-xs font-serif font-semibold'>
            Thành công
          </div>
        </div>

        {/* Success Icon with Animation */}
        <div className='text-center mb-6'>
          <div className='flex justify-center mb-4'>
            <div className='w-20 h-20 bg-[#991b1b]/20 rounded-full flex items-center justify-center relative animate-bounce-in'>
              <div className='absolute inset-0 bg-[#991b1b]/10 rounded-full animate-ping'></div>
              <Check
                className='w-10 h-10 text-[#991b1b] relative z-10'
                strokeWidth={3}
              />
            </div>
          </div>

          {/* Title */}
          <h1 className='text-3xl md:text-4xl font-serif text-[#2c2c2c] font-bold mb-3'>
            Thanh toán thành công!
          </h1>

          {/* Subtitle */}
          <p className='text-base md:text-lg font-serif text-[#2c2c2c]/70 italic mb-2'>
            "Hành trình giác ngộ của bạn đã bắt đầu"
          </p>

          <p className='text-sm font-serif text-[#2c2c2c]/60'>
            Chúc mừng bạn đã nâng cấp lên gói{' '}
            <span className='font-semibold text-[#991b1b]'>
              {planNames[plan as keyof typeof planNames]}
            </span>
          </p>
        </div>

        {/* Plan Details */}
        <div className='bg-[#f3ead7] border-2 border-[#2c2c2c]/30 rounded-xl p-4 mb-6 shadow-[0_2px_0_#00000020,0_0_0_2px_#00000005_inset]'>
          <div className='flex items-center justify-between mb-3'>
            <span className='font-serif text-[#2c2c2c] font-semibold'>
              Gói đã chọn
            </span>
            {plan === 'don-ngo' ? (
              <Crown className='w-5 h-5 text-[#991b1b]' />
            ) : (
              <Check className='w-5 h-5 text-[#991b1b]' />
            )}
          </div>

          <div className='space-y-2 text-sm font-serif text-[#2c2c2c]/70'>
            <div className='flex justify-between'>
              <span>Gói thành viên:</span>
              <span className='font-semibold text-[#991b1b]'>
                {planNames[plan as keyof typeof planNames]}
              </span>
            </div>
            <div className='flex justify-between'>
              <span>Chu kỳ thanh toán:</span>
              <span className='font-semibold text-[#2c2c2c]'>
                {billingCycle === 'yearly' ? 'Hàng năm' : 'Hàng tháng'}
              </span>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className='mb-6'>
          <h3 className='text-sm font-serif text-[#2c2c2c] font-semibold mb-3'>
            Bạn đã mở khóa:
          </h3>
          <div className='space-y-2'>
            <div className='flex items-start space-x-3'>
              <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
              <span className='text-sm font-serif text-[#2c2c2c]'>
                Truy cập tác nhân AI cao cấp
              </span>
            </div>
            <div className='flex items-start space-x-3'>
              <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
              <span className='text-sm font-serif text-[#2c2c2c]'>
                Trả lời sâu sắc và chi tiết hơn
              </span>
            </div>
            <div className='flex items-start space-x-3'>
              <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
              <span className='text-sm font-serif text-[#2c2c2c]'>
                Lưu lịch sử trên nhiều thiết bị
              </span>
            </div>
            <div className='flex items-start space-x-3'>
              <Check className='w-4 h-4 text-[#991b1b] mt-0.5 flex-shrink-0' />
              <span className='text-sm font-serif text-[#2c2c2c]'>
                Hỗ trợ ưu tiên
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className='border-t-2 border-[#991b1b]/20 my-6'></div>

        {/* Action Buttons */}
        <div className='space-y-3'>
          <Link
            href='/ai'
            className='w-full flex items-center justify-center space-x-3 px-6 py-3 
                       bg-[#991b1b] text-[#f6efe0] font-serif text-sm rounded-xl
                       border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                       hover:bg-[#7a1515] transition-all duration-200'
          >
            <MessageSquare className='w-4 h-4' />
            <span>Bắt đầu trò chuyện</span>
          </Link>

          <Link
            href='/giacngo'
            className='w-full flex items-center justify-center space-x-3 px-6 py-3 
                       bg-[#f3ead7] text-[#2c2c2c] font-serif text-sm rounded-xl
                       border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                       hover:bg-[#efe2c9] transition-all duration-200'
          >
            <Home className='w-4 h-4' />
            <span>Về trang chủ</span>
          </Link>
        </div>

        {/* Footer Quote */}
        <div className='mt-6 text-center'>
          <p className='text-xs font-serif text-[#2c2c2c]/50 italic'>
            "Mỗi bước đi là một bước trên con đường giác ngộ"
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scaleIn 0.6s ease-out;
        }

        .animate-bounce-in {
          animation: bounceIn 0.6s ease-out 0.2s both;
        }
      `}</style>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className='min-h-screen bg-gradient-to-b from-background/20 to-background/40 flex items-center justify-center'>
          <div className='text-[#991b1b] font-serif'>Đang tải...</div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
