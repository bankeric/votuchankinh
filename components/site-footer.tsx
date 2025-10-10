'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer className='border-t border-[#991b1b]/20 bg-[#EFE0BD]/80 backdrop-blur-sm'>
      <div className='container mx-auto px-4 py-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
          {/* Left: Logo and Copyright */}
          <div className='flex flex-col items-center md:items-start space-y-3'>
            <Link
              href='/'
              aria-label='Home'
            >
              <Image
                src='/images/giac-ngo-logo-2.png'
                alt='Giac Ngo logo'
                width={120} // tăng từ 80 lên 120
                height={140} // tăng từ 100 lên 140
                className='h-30 w-30 object-contain filter sepia(100%) hue-rotate(-30deg) saturate(200%)'
                priority
              />
            </Link>
            <div className='text-center md:text-left'>
              <p className='font-serif text-sm text-[#8B4513]/70'>
                © {new Date().getFullYear()} Giac Ngo. All rights reserved.
              </p>
              <p className='font-serif text-xs text-[#8B4513]/60 mt-1'>
                Non-profit Buddhist Meditation Center
              </p>
            </div>
          </div>

          {/* Right: Follow Us and Legal grouped together */}
          <div className='flex flex-col md:flex-row md:justify-between md:items-start space-y-6 md:space-y-0 md:space-x-8'>
            {/* Follow Us - Email and Social Media */}
            <div className='flex flex-col items-center md:items-start space-y-3'>
              <h3 className='font-serif text-base text-[#991b1b] mb-1'>
                Social
              </h3>
              <div className='flex flex-col items-center md:items-start space-y-2'>
                <button
                  onClick={() => window.open('mailto:info@giac.ngo', '_blank')}
                  className='flex items-center space-x-2 text-[#8B4513]/80 hover:text-[#8B4513] transition-colors font-serif text-sm'
                  aria-label='Send email to info@giac.ngo'
                >
                  <Mail className='h-4 w-4' />
                  <span>info@giac.ngo</span>
                </button>
                <div className='flex space-x-3'>
                  <Link
                    href='https://www.facebook.com/profile.php?id=61579805139150'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Visit our Facebook page'
                    className='flex items-center justify-center w-8 h-8 bg-[#D4AF8C]/30 hover:bg-[#D4AF8C]/50 rounded-full transition-all duration-300 hover:scale-105'
                  >
                    <svg className='w-4 h-4 text-[#8B4513]' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
                    </svg>
                  </Link>
                  <Link
                    href='https://www.instagram.com/giacngo000/'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Visit our Instagram page'
                    className='flex items-center justify-center w-8 h-8 bg-[#D4AF8C]/30 hover:bg-[#D4AF8C]/50 rounded-full transition-all duration-300 hover:scale-105'
                  >
                    <svg className='w-4 h-4 text-[#8B4513]' fill='currentColor' viewBox='0 0 24 24'>
                      <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/>
                    </svg>
                  </Link>
                  <Link
                    href='https://www.threads.com/@giacngo000'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Visit our Threads page'
                    className='flex items-center justify-center w-8 h-8 bg-[#D4AF8C]/30 hover:bg-[#D4AF8C]/50 rounded-full transition-all duration-300 hover:scale-105'
                  >
                    <svg xmlns='http://www.w3.org/2000/svg' fill='currentColor' className='w-4 h-4 text-[#8B4513]' viewBox='0 0 16 16'>
                      <path d='M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161'/>
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Legal Links */}
            <div className='flex flex-col items-center md:items-start space-y-3'>
              <h3 className='font-serif text-base text-[#991b1b] mb-1'>
                Legal
              </h3>
              <div className='flex flex-col space-y-1 text-center md:text-left'>
                <Link
                  href='/terms'
                  className='font-serif text-sm text-[#8B4513]/80 hover:text-[#8B4513] transition-colors'
                >
                  Terms & Conditions
                </Link>
                <Link
                  href='/disclaimer'
                  className='font-serif text-sm text-[#8B4513]/80 hover:text-[#8B4513] transition-colors'
                >
                  Disclaimer
                </Link>
                <Link
                  href='/privacy'
                  className='font-serif text-sm text-[#8B4513]/80 hover:text-[#8B4513] transition-colors'
                >
                  Privacy Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
