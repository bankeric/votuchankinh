'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const characters = ['空', '無', '法']

export default function WordlessSutraPage() {
  const [index, setIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsVisible(true)

    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % characters.length)
    }, 4000) // Cycle every 4 seconds

    return () => clearInterval(timer)
  }, [])

  const handleClick = () => {
    router.push('/sutra')
  }

  return (
    <main
      className='flex items-center justify-center min-h-screen bg-black/30 cursor-pointer'
      onClick={handleClick}
    >
      <div
        className={`flex flex-col items-center w-full max-w-3xl px-4 py-32 space-y-12 text-center text-[#eae6dd] font-serif-sc transition-opacity duration-1000 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className='flex flex-col items-center'>
          <div
            className={`mb-2 opacity-0 ${
              isVisible ? 'animate-fade-in-up stagger-1' : ''
            }`}
          >
            <Image
              src='/images/logo.png'
              alt='Giac Ngo logo'
              width={120}
              height={120}
              className='h-30 w-30 object-contain mx-auto'
              priority
            />
          </div>
          <h1
            className={`text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-wider md:tracking-widest whitespace-nowrap relative opacity-0 ${
              isVisible ? 'animate-fade-in-up stagger-2' : ''
            }`}
            style={{
              textShadow:
                '2px 2px 4px rgba(0,0,0,0.3), -1px -1px 2px rgba(255,255,255,0.1)',
              background:
                'linear-gradient(45deg, #eae6dd 0%, #d4af37 30%, #eae6dd 60%, #c9a96e 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))',
            }}
          >
            VÔ TỰ CHÂN KINH
          </h1>
          <p
            className={`mt-4 text-lg md:text-xl italic font-garamond text-[#eae6dd]/60 opacity-0 ${
              isVisible ? 'animate-fade-in-up stagger-3' : ''
            }`}
          >
            The Wordless Sutra
          </p>
        </div>
        <div
          className={`flex justify-center space-x-8 md:space-x-16 text-6xl md:text-8xl h-24 opacity-0 ${
            isVisible ? 'animate-fade-in-up stagger-4' : ''
          }`}
        >
          <span
            key={characters[index]}
            className='animate-character'
          >
            {characters[index]}
          </span>
        </div>
        <p
          className={`text-lg md:text-xl text-[#eae6dd]/70 font-light opacity-0 ${
            isVisible ? 'animate-fade-in-up stagger-5' : ''
          }`}
        >
          &quot;Chân lý không lời.&quot;
        </p>
        <p
          className={`text-xs md:text-sm text-[#eae6dd]/50 font-garamond italic font-light opacity-0 ${
            isVisible ? 'animate-fade-in-up stagger-5' : ''
          }`}
        >
          Click anywhere to enter
        </p>
      </div>
    </main>
  )
}
