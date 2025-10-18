'use client'

import Link from 'next/link'
import { ArrowLeft, Menu } from 'lucide-react'

interface LibraryHeaderProps {
  language: 'vi' | 'en'
  setLanguage: (lang: 'vi' | 'en') => void
  setIsMobileSidebarOpen: (open: boolean) => void
  translations: {
    vi: { returnToHome: string }
    en: { returnToHome: string }
  }
}

export function LibraryHeader({
  language,
  setLanguage,
  setIsMobileSidebarOpen,
  translations
}: LibraryHeaderProps) {
  return (
    <header className='fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-[#EFE0BD]/80 backdrop-blur-sm border-b border-[#8B4513]/10'>
      {/* Mobile Hamburger Menu Button */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className='md:hidden flex items-center justify-center w-10 h-10 text-[#8B4513]/80 hover:text-[#8B4513] transition-colors bg-[#D4AF8C]/30 backdrop-blur-sm rounded-full border border-[#8B4513]/20 hover:border-[#8B4513]/40'
      >
        <Menu className='w-5 h-5' />
      </button>

      {/* Desktop Return to Home Button */}
      <Link
        href='/'
        className='hidden md:flex items-center space-x-2 text-[#8B4513]/80 hover:text-[#8B4513] transition-colors bg-[#D4AF8C]/30 backdrop-blur-sm px-4 py-2 rounded-full border border-[#8B4513]/20 hover:border-[#8B4513]/40'
      >
        <ArrowLeft className='w-4 h-4' />
        <span className='font-serif text-sm'>
          {translations[language].returnToHome}
        </span>
      </Link>

      {/* Center Navigation - Community Button only */}
      <div className='flex items-center space-x-3'>
        <Link
          href='/community'
          className='flex items-center space-x-2 text-[#8B4513]/80 hover:text-[#8B4513] transition-all duration-300 bg-[#D4AF8C]/30 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-[#D4AF8C]/50 hover:scale-105 border border-[#8B4513]/20 hover:border-[#8B4513]/40'
        >
          <img
            src='/images/lotus-community-icon.png'
            alt='Community'
            className='w-5 h-5'
          />
          <span className='font-serif text-sm hidden sm:inline'>
            Community
          </span>
        </Link>
      </div>

      {/* Language Toggle Button */}
      <div className='flex items-center'>
        {/* Mobile: Capsule VN-EN button */}
        <div className='md:hidden'>
          <div className='rounded-full border-2 border-[#8B1E1E] p-0.5 bg-[#FAF2E2] shadow-[0_2px_0_rgba(139,30,30,0.25)]'>
            <div className='flex items-center h-8 gap-0.1 px-0.1'>
              <button
                onClick={() => setLanguage('vi')}
                className={`px-2 h-6 inline-flex items-center justify-center text-xs font-serif transition-colors rounded-full ${
                  language === 'vi'
                    ? 'bg-[#8B1E1E] text-white hover:bg-[#A12222]'
                    : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/10'
                }`}
              >
                VN
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 h-6 inline-flex items-center justify-center text-xs font-serif transition-colors rounded-full ${
                  language === 'en'
                    ? 'bg-[#8B1E1E] text-white hover:bg-[#A12222]'
                    : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/10'
                }`}
              >
                EN
              </button>
            </div>
          </div>
        </div>

        {/* Desktop: Enhanced capsule buttons */}
        <div className='hidden md:block'>
          <div className='rounded-full border-2 border-[#8B1E1E] p-0.5 bg-[#FAF2E2] shadow-[0_2px_0_rgba(139,30,30,0.25)]'>
            <div className='flex items-center h-10 gap-0.1 px-0.1'>
              <button
                onClick={() => setLanguage('vi')}
                className={`px-3 h-8 inline-flex items-center justify-center text-sm font-serif transition-colors rounded-full ${
                  language === 'vi'
                    ? 'bg-[#8B1E1E] text-white hover:bg-[#A12222]'
                    : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/10'
                }`}
              >
                VIE
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 h-8 inline-flex items-center justify-center text-sm font-serif transition-colors rounded-full ${
                  language === 'en'
                    ? 'bg-[#8B1E1E] text-white hover:bg-[#A12222]'
                    : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/10'
                }`}
              >
                ENG
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
