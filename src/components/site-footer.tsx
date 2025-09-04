'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, MessageSquare, Mail, Bot } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer className='border-t border-[#991b1b]/20 bg-background/30 backdrop-blur-sm'>
      <div className='container mx-auto px-4 py-4'>
        <div className='flex items-center justify-between gap-4'>
          {/* Left: Logo */}
          <div className='flex items-center'>
            <Link
              href='/'
              aria-label='Home'
            >
              <Image
                src='/images/logo.png'
                alt='Giac Ngo logo'
                width={80}
                height={80}
                className='h-20 w-20 object-contain'
                priority
              />
            </Link>
          </div>

          {/* Middle: Email, Library, and Facebook */}
          <div className='flex-1 flex items-center justify-center space-x-3'>
            <button
              onClick={() => window.open('mailto:info@giac.ngo', '_blank')}
              className='flex items-center space-x-2 text-[#991b1b]/80 hover:text-[#991b1b] transition-colors bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full font-serif text-sm'
              aria-label='Send email to info@giac.ngo'
            >
              <Mail className='h-4 w-4' />
              <span>info@giac.ngo</span>
            </button>
            <Link
              href='https://facebook.com/giacngo'
              target='_blank'
              rel='noopener noreferrer'
              aria-label='Visit our Facebook page'
              className='flex items-center text-[#991b1b]/80 hover:text-[#991b1b] transition-colors bg-black/20 backdrop-blur-sm px-3 py-2 rounded-full'
            >
              <Facebook className='h-4 w-4' />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
