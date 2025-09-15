'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Mail, Facebook, Youtube, Instagram } from 'lucide-react'

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
                Follow Us
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
                    href='https://facebook.com/giacngo'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Visit our Facebook page'
                    className='flex items-center justify-center w-8 h-8 bg-[#D4AF8C]/30 hover:bg-[#D4AF8C]/50 rounded-full transition-all duration-300 hover:scale-105'
                  >
                    <Facebook className='w-4 h-4 text-[#8B4513]' />
                  </Link>
                  <Link
                    href='https://youtube.com/@giacngo'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Visit our YouTube channel'
                    className='flex items-center justify-center w-8 h-8 bg-[#D4AF8C]/30 hover:bg-[#D4AF8C]/50 rounded-full transition-all duration-300 hover:scale-105'
                  >
                    <Youtube className='w-4 h-4 text-[#8B4513]' />
                  </Link>
                  <Link
                    href='https://instagram.com/giacngo'
                    target='_blank'
                    rel='noopener noreferrer'
                    aria-label='Visit our Instagram page'
                    className='flex items-center justify-center w-8 h-8 bg-[#D4AF8C]/30 hover:bg-[#D4AF8C]/50 rounded-full transition-all duration-300 hover:scale-105'
                  >
                    <Instagram className='w-4 h-4 text-[#8B4513]' />
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
