'use client'

import Link from 'next/link'
import { X, Home, CreditCard, MessageSquare } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function CancelPaymentContent() {
  const searchParams = useSearchParams()
  const plan = searchParams.get('plan') || 'giac-ngo'

  const planNames = {
    'giac-ngo': 'Giác Ngộ',
    'don-ngo': 'Đốn Ngộ',
    'tam-an': 'Tâm An'
  }

  return (
    <main className='min-h-screen bg-gradient-to-b from-background/20 to-background/40 flex items-center justify-center p-4'>
      <div className='bg-[#EFE0BD] border-2 border-[#991b1b] rounded-2xl p-8 md:p-12 max-w-2xl w-full shadow-[0_4px_0_#991b1b30,0_0_0_3px_#991b1b10_inset] hover:shadow-[0_6px_0_#991b1b40,0_0_0_3px_#991b1b15_inset] transition-all duration-200 relative animate-fade-in'>
        {/* Badge */}
        <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
          <div className='bg-[#2c2c2c] text-[#f6efe0] px-4 py-1 rounded-full text-xs font-serif font-semibold'>
            Đã hủy
          </div>
        </div>

        {/* Cancel Icon */}
        <div className='text-center mb-6'>
          <div className='flex justify-center mb-4'>
            <div className='w-20 h-20 bg-[#2c2c2c]/10 rounded-full flex items-center justify-center relative'>
              <X
                className='w-10 h-10 text-[#2c2c2c]'
                strokeWidth={3}
              />
            </div>
          </div>

          {/* Title */}
          <h1 className='text-3xl md:text-4xl font-serif text-[#2c2c2c] font-bold mb-3'>
            Thanh toán đã bị hủy
          </h1>

          {/* Subtitle */}
          <p className='text-base md:text-lg font-serif text-[#2c2c2c]/70 italic mb-2'>
            "Không sao cả, hành trình vẫn còn đó"
          </p>

          <p className='text-sm font-serif text-[#2c2c2c]/60'>
            Bạn đã hủy thanh toán cho gói{' '}
            <span className='font-semibold text-[#991b1b]'>
              {planNames[plan as keyof typeof planNames]}
            </span>
          </p>
        </div>

        {/* Reassurance Message */}
        <div className='bg-[#f3ead7] border-2 border-[#2c2c2c]/30 rounded-xl p-4 mb-6 shadow-[0_2px_0_#00000020,0_0_0_2px_#00000005_inset]'>
          <div className='space-y-2 text-sm font-serif text-[#2c2c2c]/70'>
            <p className='flex items-start space-x-2'>
              <span className='text-[#991b1b] font-bold'>✓</span>
              <span>Không có khoản phí nào được tính</span>
            </p>
            <p className='flex items-start space-x-2'>
              <span className='text-[#991b1b] font-bold'>✓</span>
              <span>Thông tin thanh toán của bạn được bảo mật</span>
            </p>
            <p className='flex items-start space-x-2'>
              <span className='text-[#991b1b] font-bold'>✓</span>
              <span>Bạn vẫn có thể sử dụng gói miễn phí</span>
            </p>
          </div>
        </div>

        {/* Why Upgrade Section */}
        <div className='mb-6'>
          <h3 className='text-sm font-serif text-[#2c2c2c] font-semibold mb-3'>
            Tại sao nên nâng cấp?
          </h3>
          <div className='space-y-2'>
            <div className='flex items-start space-x-3'>
              <span className='text-[#991b1b] text-lg'>•</span>
              <span className='text-sm font-serif text-[#2c2c2c]'>
                Truy cập tác nhân AI cao cấp với hiểu biết sâu sắc hơn
              </span>
            </div>
            <div className='flex items-start space-x-3'>
              <span className='text-[#991b1b] text-lg'>•</span>
              <span className='text-sm font-serif text-[#2c2c2c]'>
                Trả lời chi tiết và cá nhân hóa theo nhu cầu của bạn
              </span>
            </div>
            <div className='flex items-start space-x-3'>
              <span className='text-[#991b1b] text-lg'>•</span>
              <span className='text-sm font-serif text-[#2c2c2c]'>
                Lưu lịch sử và đồng bộ trên nhiều thiết bị
              </span>
            </div>
            <div className='flex items-start space-x-3'>
              <span className='text-[#991b1b] text-lg'>•</span>
              <span className='text-sm font-serif text-[#2c2c2c]'>
                Hỗ trợ ưu tiên từ đội ngũ của chúng tôi
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
            <CreditCard className='w-4 h-4' />
            <span>Thử lại thanh toán</span>
          </Link>

          <Link
            href='/ai'
            className='w-full flex items-center justify-center space-x-3 px-6 py-3 
                       bg-[#f3ead7] text-[#2c2c2c] font-serif text-sm rounded-xl
                       border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                       hover:bg-[#efe2c9] transition-all duration-200'
          >
            <MessageSquare className='w-4 h-4' />
            <span>Tiếp tục với gói miễn phí</span>
          </Link>

          <Link
            href='/'
            className='w-full flex items-center justify-center space-x-3 px-6 py-3 
                       bg-transparent text-[#2c2c2c] font-serif text-sm rounded-xl
                       border-2 border-[#2c2c2c]/30 hover:border-[#2c2c2c]/50
                       transition-all duration-200'
          >
            <Home className='w-4 h-4' />
            <span>Về trang chủ</span>
          </Link>
        </div>

        {/* Footer Quote */}
        <div className='mt-6 text-center'>
          <p className='text-xs font-serif text-[#2c2c2c]/50 italic'>
            "Mỗi quyết định đều là một phần của hành trình"
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </main>
  )
}

export default function CancelPaymentPage() {
  return (
    <Suspense
      fallback={
        <main className='min-h-screen bg-gradient-to-b from-background/20 to-background/40 flex items-center justify-center'>
          <div className='text-[#991b1b] font-serif'>Đang tải...</div>
        </main>
      }
    >
      <CancelPaymentContent />
    </Suspense>
  )
}
