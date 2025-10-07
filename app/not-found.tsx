'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Home, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Custom404Page() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-[#f4e4bc] via-[#e8d5a3] to-[#dcc48a] flex items-center justify-center p-4'>
      <div className='w-full max-w-2xl'>
        {/* Main Card */}
        <div className='bg-[#EFE0BD] border-2 border-[#991b1b] rounded-2xl p-8 md:p-12 shadow-[0_4px_0_#991b1b30,0_0_0_3px_#991b1b10_inset] hover:shadow-[0_6px_0_#991b1b40,0_0_0_3px_#991b1b15_inset] transition-all duration-200 animate-fade-in'>
          {/* Buddhist Symbol */}
          <div className='text-center mb-8'>
            <div className='flex justify-center mb-6'>
              <Image
                src='/images/wordless-sutra-404.png'
                alt='Wordless Sutra'
                width={140}
                height={140}
                className='opacity-80'
                style={{
                  mixBlendMode: 'multiply',
                  filter: 'contrast(1.1) brightness(0.95)'
                }}
              />
            </div>
            {/* </CHANGE> */}
            <div className='text-6xl md:text-7xl font-bold text-[#2c2c2c] mb-2 font-serif'>
              404
            </div>
            <h1 className='text-2xl md:text-3xl font-serif text-[#2c2c2c] mb-4 font-semibold'>
              Trang không tồn tại
            </h1>
            <p className='text-base md:text-lg font-serif text-[#2c2c2c]/70 max-w-md mx-auto leading-relaxed'>
              Như pháp vô tướng, trang này không hiện hữu trong không gian số.
              Hãy quay về con đường chánh niệm.
            </p>
          </div>

          {/* Divider */}
          <div className='w-24 h-0.5 bg-[#991b1b]/30 mx-auto mb-8'></div>

          {/* Buddhist Quote */}
          <div className='text-center mb-8'>
            <p className='text-sm md:text-base font-serif italic text-[#2c2c2c]/60 max-w-lg mx-auto'>
              "Tất cả pháp đều như huyễn, như mộng, như bọt nước, như bóng, như
              sương mai, như chớp."
            </p>
            <p className='text-xs md:text-sm font-serif text-[#991b1b] mt-2'>
              — Kim Cương Kinh
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
            <Button
              asChild
              className='w-full sm:w-auto bg-[#991b1b] hover:bg-[#7a1515] text-[#f6efe0] font-serif text-base px-8 py-6 rounded-xl shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset] hover:shadow-[0_3px_0_#00000040,0_0_0_3px_#00000015_inset] transition-all duration-200 active:translate-y-0.5'
            >
              <Link
                href='/'
                className='flex items-center gap-2'
              >
                <Home size={20} />
                Về trang chủ
              </Link>
            </Button>

            <Button
              asChild
              variant='outline'
              className='w-full sm:w-auto bg-transparent border-2 border-[#2c2c2c] text-[#2c2c2c] hover:bg-[#2c2c2c] hover:text-[#f6efe0] font-serif text-base px-8 py-6 rounded-xl shadow-[0_2px_0_#00000020] transition-all duration-200'
            >
              <Link
                href='/library'
                className='flex items-center gap-2'
              >
                <Search size={20} />
                Tìm kiếm
              </Link>
            </Button>
          </div>
        </div>

        {/* Footer Note */}
        <div className='text-center mt-6'>
          <p className='text-sm font-serif text-[#2c2c2c]/50'>
            Nếu bạn tin rằng đây là lỗi, vui lòng liên hệ với chúng tôi
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  )
}
