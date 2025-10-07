'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronDown } from 'lucide-react'
import axiosInstance from '@/lib/axios'
import { useAuthStore } from '@/store/auth'

const characters = ['空', '無', '法']

interface Stat {
  title: string
  value: number
  description: string
  tooltip: string
  suffix?: string
}

function StatItem({ stat, isVisible, delay }: { stat: Stat; isVisible: boolean; delay: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / 2000, 1)
      setCount(Math.floor(progress * stat.value))
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }
    requestAnimationFrame(animate)
  }, [stat.value, isVisible])

  return (
    <div
      className={`transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className='text-[#eae6dd]/50 text-sm mb-1 font-light'>
        {stat.title}
      </div>
      <div className='text-3xl font-light text-[#eae6dd] tracking-wide'>
        {count.toLocaleString()}
      </div>
    </div>
  )
}

export default function WordlessSutraPage() {
  const [index, setIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [statsVisible, setStatsVisible] = useState(false)
  const [stats, setStats] = useState<Stat[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { user, getCurrentUser } = useAuthStore()

  // Load current user on mount
  useEffect(() => {
    getCurrentUser()
  }, [getCurrentUser])

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
            tooltip: 'Số tài khoản mới được tạo trong 30 ngày gần nhất'
          },
          {
            title: 'Người dùng hoạt động',
            value: data.active_users || 0,
            description: 'Giá trị thực mang lại',
            tooltip:
              'Số người dùng hoạt động hàng ngày (DAU) và hàng tháng (MAU)',
            suffix: ' DAU'
          },
          {
            title: 'Nâng cấp gói',
            value: data.subscriptions_this_month || 0,
            description: 'Sẵn sàng trả phí',
            tooltip: 'Số lượt nâng cấp từ Basic lên Pro/Premium trong tháng'
          },
          {
            title: 'Lượt chia sẻ',
            value: data.social_share || 0,
            description: 'Lan tỏa thông điệp',
            tooltip: 'Tổng số lần chia sẻ nội dung ra mạng xã hội'
          }
        ])
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        setStats([
          {
            title: 'Đăng ký mới (30 ngày)',
            value: 127,
            description: 'Thước đo thu hút người dùng',
            tooltip: 'Số tài khoản mới được tạo trong 30 ngày gần nhất'
          },
          {
            title: 'Người dùng hoạt động',
            value: 430,
            description: 'Giá trị thực mang lại',
            tooltip:
              'Số người dùng hoạt động hàng ngày (DAU) và hàng tháng (MAU)',
            suffix: ' DAU'
          },
          {
            title: 'Nâng cấp gói',
            value: 23,
            description: 'Sẵn sàng trả phí',
            tooltip: 'Số lượt nâng cấp từ Basic lên Pro/Premium trong tháng'
          },
          {
            title: 'Lượt chia sẻ',
            value: 856,
            description: 'Lan tỏa thông điệp',
            tooltip: 'Tổng số lần chia sẻ nội dung ra mạng xã hội'
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

  // Handle click outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

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

      {/* Navigation Bar */}
      <nav className='fixed top-0 left-0 right-0 z-50'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo with Dropdown */}
            <div 
              ref={dropdownRef}
              className='relative'
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className='flex items-center space-x-2 text-[#eae6dd] hover:text-[#d4af37] transition-colors'>
                <Image
                  src='/images/giac-ngo-logo-2.png'
                  alt='Giac Ngo logo'
                  width={130}
                  height={130}
                  className='object-contain'
                />
                <ChevronDown size={16} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <div className='absolute top-full left-0 w-48 bg-[#f9f0dc] border-2 border-red-800 rounded-lg overflow-hidden shadow-lg'>
                  <a href='/sutra' className='block px-4 py-3 text-black hover:text-red-800 hover:bg-red-50 transition-colors font-serif'>
                  Organsation
                  </a>
                  <a href='/library' className='block px-4 py-3 text-black hover:text-red-800 hover:bg-red-50 transition-colors font-serif'>
                    Library
                  </a>
                  <a href='/community' className='block px-4 py-3 text-black hover:text-red-800 hover:bg-red-50 transition-colors font-serif'>
                    Community
                    </a>
                  
                  {/* Separator */}
                  <div className='border-t border-red-300 my-2'></div>
                  
                  {/* Social Media Icons */}
                  <div className='flex justify-center items-center px-4 py-3 space-x-4'>
                    <a href='#' className='text-black hover:text-red-800 transition-colors'>
                      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
                      </svg>
                    </a>
                    <a href='#' className='text-black hover:text-red-800 transition-colors'>
                      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z'/>
                      </svg>
                    </a>
                    <a href='#' className='text-black hover:text-red-800 transition-colors'>
                      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z'/>
                      </svg>
                    </a>
                    <a href='#' className='text-black hover:text-red-800 transition-colors'>
                      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/>
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Login and Launch App Buttons */}
            <div className='flex items-center space-x-3'>
              {!user && (
                <button 
                  onClick={() => router.push('/auth/login')}
                  className='px-6 py-2 bg-transparent border border-[#eae6dd] text-[#eae6dd] hover:bg-[#eae6dd] hover:text-black rounded-full font-medium transition-colors'
                >
                  Login
                </button>
              )}
              <button 
                onClick={() => router.push('/sutra')}
                className='px-6 py-2 bg-red-800 hover:bg-red-900 text-white rounded-full font-medium transition-colors'
              >
                Launch App
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className='bg-black/30'>
        <div
          className='min-h-screen flex flex-col items-center justify-between w-full cursor-pointer pt-16'
          onClick={handleClick}
        >
          <div
            className={`flex flex-col items-center w-full max-w-3xl px-4 py-20 space-y-12 text-center text-[#eae6dd] font-serif-sc transition-opacity duration-1000 ${
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

          {/* Stats Section - Centered */}
          <div className='w-full px-4 sm:px-6 lg:px-8 pb-8'>
            <div className='max-w-7xl mx-auto flex flex-col items-center'>
              <div 
                ref={statsRef}
                className='flex flex-wrap justify-center gap-x-12 gap-y-6'
              >
                {stats.map((stat, idx) => (
                  <StatItem 
                    key={idx}
                    stat={stat}
                    isVisible={statsVisible}
                    delay={idx * 100}
                  />
                ))}
              </div>
              {/* <div className='mt-4 text-[#eae6dd]/30 text-xs font-light'>
                Scroll to explore
              </div> */}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}