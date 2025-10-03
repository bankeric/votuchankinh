'use client'

import type React from 'react'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { UserPlus, Users, TrendingUp, Share2, HelpCircle } from 'lucide-react'
import axios from 'axios'
import axiosInstance from '@/lib/axios'

const characters = ['空', '無', '法']

interface Stat {
  title: string
  value: number
  description: string
  tooltip: string
  icon: React.ReactNode
  suffix?: string
}

function useCountAnimation(end: number, duration = 2000, isVisible: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [end, duration, isVisible])

  return count
}

function StatCard({ stat, isVisible }: { stat: Stat; isVisible: boolean }) {
  const count = useCountAnimation(stat.value, 2000, isVisible)
  // const [showTooltip, setShowTooltip] = useState(false)

  return (
    <div
      className={`relative flex flex-col items-center justify-center p-6 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Icon */}
      <div className='mb-3 text-[#eae6dd]/40'>{stat.icon}</div>

      {/* Value */}
      <div className='text-4xl md:text-5xl font-serif-sc text-[#eae6dd] mb-2 font-light tracking-wider'>
        {count}
        {stat.suffix}
      </div>

      {/* Title */}
      <h3 className='text-sm md:text-base font-serif text-[#eae6dd]/70 mb-2 text-center'>
        {stat.title}
      </h3>

      {/* Description */}
      <p className='text-xs text-[#eae6dd]/40 text-center max-w-[200px] font-light'>
        {stat.description}
      </p>

      {/* Tooltip */}
      {/* <div className='absolute top-2 right-2'>
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={() => setShowTooltip(!showTooltip)}
          className='text-[#eae6dd]/30 hover:text-[#eae6dd]/60 transition-colors'
        >
          <HelpCircle size={16} />
        </button>
        {showTooltip && (
          <div className='absolute top-6 right-0 w-48 p-3 bg-black/90 text-[#eae6dd] text-xs rounded-lg border border-[#eae6dd]/20 z-10 font-light leading-relaxed'>
            {stat.tooltip}
          </div>
        )}
      </div> */}
    </div>
  )
}

export default function WordlessSutraPage() {
  const [index, setIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [stats, setStats] = useState<Stat[]>([])
  const statsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await axiosInstance.get(`/api/v1/users/statistic`)
        const data = response.data as {
          active_users: number
          new_users: number
          retention_rate: number
          social_share: number
          subscriptions_this_month: number
        }

        setStats([
          {
            title: 'Đăng ký mới (30 ngày)',
            value: data.new_users || 0,
            description: 'Thước đo thu hút người dùng',
            tooltip: 'Số tài khoản mới được tạo trong 30 ngày gần nhất',
            icon: <UserPlus size={32} />
          },
          {
            title: 'Người dùng hoạt động',
            value: data.active_users || 0,
            description: 'Giá trị thực mang lại',
            tooltip:
              'Số người dùng hoạt động hàng ngày (DAU) và hàng tháng (MAU)',
            icon: <Users size={32} />,
            suffix: ' DAU'
          },
          {
            title: 'Nâng cấp gói',
            value: data.subscriptions_this_month || 0,
            description: 'Sẵn sàng trả phí',
            tooltip: 'Số lượt nâng cấp từ Basic lên Pro/Premium trong tháng',
            icon: <TrendingUp size={32} />
          },
          {
            title: 'Lượt chia sẻ',
            value: data.social_share || 0,
            description: 'Lan tỏa thông điệp',
            tooltip: 'Tổng số lần chia sẻ nội dung ra mạng xã hội',
            icon: <Share2 size={32} />
          }
        ])
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        // Use default values if API fails
        setStats([
          {
            title: 'Đăng ký mới (30 ngày)',
            value: 127,
            description: 'Thước đo thu hút người dùng',
            tooltip: 'Số tài khoản mới được tạo trong 30 ngày gần nhất',
            icon: (
              <Image
                src='/images/landing-1.png'
                alt='Giac Ngo logo'
                width={80}
                height={80}
              />
            )
          },
          {
            title: 'Người dùng hoạt động',
            value: 430,
            description: 'Giá trị thực mang lại',
            tooltip:
              'Số người dùng hoạt động hàng ngày (DAU) và hàng tháng (MAU)',
            icon: (
              <Image
                src='/images/landing-2.png'
                alt='Giac Ngo logo'
                width={80}
                height={80}
              />
            ),
            suffix: ' DAU'
          },
          {
            title: 'Nâng cấp gói',
            value: 23,
            description: 'Sẵn sàng trả phí',
            tooltip: 'Số lượt nâng cấp từ Basic lên Pro/Premium trong tháng',
            icon: (
              <Image
                src='/images/pricing-1.png'
                alt='Giac Ngo logo'
                width={80}
                height={80}
              />
            )
          },
          {
            title: 'Lượt chia sẻ',
            value: 856,
            description: 'Lan tỏa thông điệp',
            tooltip: 'Tổng số lần chia sẻ nội dung ra mạng xã hội',
            icon: (
              <Image
                src='/images/pricing-3.png'
                alt='Giac Ngo logo'
                width={80}
                height={80}
              />
            )
          }
        ])
      }
    }

    fetchStats()
  }, [])

  useEffect(() => {
    setIsVisible(true)

    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % characters.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [])

  const handleClick = () => {
    router.push('/sutra')
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes characterFade {
          0% {
            opacity: 0;
            filter: blur(4px);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
          }
        }

        .animate-fade-in-up {
          animation: fadeInUp 2s ease-out forwards;
        }

        .animate-fade-in {
          animation: fadeIn 2s ease-out forwards;
        }

        .animate-character {
          animation: characterFade 2s ease-in-out forwards;
        }

        .stagger-1 {
          animation-delay: 0.5s;
        }
        .stagger-2 {
          animation-delay: 1.3s;
        }
        .stagger-3 {
          animation-delay: 2.1s;
        }
        .stagger-4 {
          animation-delay: 2.9s;
        }
        .stagger-5 {
          animation-delay: 3.7s;
        }
      `}</style>

      <main className='flex flex-col items-center justify-start min-h-screen bg-black/30'>
        <div
          className='flex items-center justify-center min-h-screen w-full cursor-pointer'
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
                  filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.2))'
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
              "Chân lý không lời."
            </p>
            <p
              className={`text-xs md:text-sm text-[#eae6dd]/50 font-garamond italic font-light opacity-0 ${
                isVisible ? 'animate-fade-in-up stagger-5' : ''
              }`}
            >
              Click anywhere to enter
            </p>
          </div>
        </div>

        <div
          ref={statsRef}
          className='w-full max-w-6xl px-4 py-16 md:py-24'
        >
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12'>
            {stats.map((stat, idx) => (
              <StatCard
                key={idx}
                stat={stat}
                isVisible={statsVisible}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  )
}
