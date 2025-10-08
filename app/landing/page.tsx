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
          <div className='flex items-center h-16 border-b border-[#eae6dd]/20'>
            {/* Left side - Logo with Dropdown */}
            <div 
              ref={dropdownRef}
              className='relative flex-1'
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <button className='flex items-center space-x-2 text-[#eae6dd] hover:text-[#d4af37] transition-colors opacity-80 hover:opacity-100'>
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
                <div className='absolute top-full left-0 w-48 bg-[#eae6dd]/10 backdrop-blur-sm border border-[#eae6dd]/20 rounded-lg overflow-hidden shadow-xl group'>
                  <a href='/sutra' className='block px-4 py-3 text-[#eae6dd] hover:text-[#d4af37] hover:bg-[#eae6dd]/10 transition-colors font-serif'>
                  Organization
                  </a>
                  <a href='/terms' className='block px-4 py-3 text-[#eae6dd] hover:text-[#d4af37] hover:bg-[#eae6dd]/10 transition-colors font-serif'>
                    Terms
                  </a>
                  <a href='/privacy' className='block px-4 py-3 text-[#eae6dd] hover:text-[#d4af37] hover:bg-[#eae6dd]/10 transition-colors font-serif'>
                    Privacy
                    </a>
                  
                  {/* Separator */}
                  <div className='border-t border-[#eae6dd]/20 my-2'></div>
                  
                  {/* Social Media Icons */}
                  <div className='flex justify-center items-center px-4 py-3 space-x-4 group-hover:opacity-100 opacity-60 transition-opacity'>
                    <a href='https://www.facebook.com/profile.php?id=61579805139150' target='_blank' rel='noopener noreferrer' className='text-[#eae6dd]/60 hover:text-[#d4af37] transition-colors'>
                      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/>
                      </svg>
                    </a>
                    <a href='https://www.instagram.com/giacngo000/' target='_blank' rel='noopener noreferrer' className='text-[#eae6dd]/60 hover:text-[#d4af37] transition-colors'>
                      <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                        <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/>
                      </svg>
                    </a>
                    <a href="https://www.threads.com/@giacngo000" title="threads icons" target="_blank" rel="noopener noreferrer" className="text-[#eae6dd]/60 hover:text-[#d4af37] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-5 h-5" viewBox="0 0 16 16">
                        <path d="M6.321 6.016c-.27-.18-1.166-.802-1.166-.802.756-1.081 1.753-1.502 3.132-1.502.975 0 1.803.327 2.394.948s.928 1.509 1.005 2.644q.492.207.905.484c1.109.745 1.719 1.86 1.719 3.137 0 2.716-2.226 5.075-6.256 5.075C4.594 16 1 13.987 1 7.994 1 2.034 4.482 0 8.044 0 9.69 0 13.55.243 15 5.036l-1.36.353C12.516 1.974 10.163 1.43 8.006 1.43c-3.565 0-5.582 2.171-5.582 6.79 0 4.143 2.254 6.343 5.63 6.343 2.777 0 4.847-1.443 4.847-3.556 0-1.438-1.208-2.127-1.27-2.127-.236 1.234-.868 3.31-3.644 3.31-1.618 0-3.013-1.118-3.013-2.582 0-2.09 1.984-2.847 3.55-2.847.586 0 1.294.04 1.663.114 0-.637-.54-1.728-1.9-1.728-1.25 0-1.566.405-1.967.868ZM8.716 8.19c-2.04 0-2.304.87-2.304 1.416 0 .878 1.043 1.168 1.6 1.168 1.02 0 2.067-.282 2.232-2.423a6.2 6.2 0 0 0-1.528-.161"/>
                      </svg>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Center - Library and Community */}
            <div className='flex items-center space-x-6'>
              <button 
                onClick={() => router.push('/library')}
                className='px-4 py-2 text-[#eae6dd] hover:text-[#d4af37] transition-colors font-medium'
              >
                Library
              </button>
              <div className='w-px h-4 bg-[#eae6dd]/50'></div>
              <button 
                onClick={() => router.push('/community')}
                className='px-4 py-2 text-[#eae6dd] hover:text-[#d4af37] transition-colors font-medium'
              >
                Community
              </button>
            </div>
            
            {/* Right side - Login and Launch App */}
            <div className='flex items-center space-x-3 flex-1 justify-end'>
              <div className='group relative'>
                <button 
                  onClick={() => router.push('/auth/login')}
                  className='px-6 py-2 bg-transparent border border-[#eae6dd] text-[#eae6dd] hover:bg-[#eae6dd] hover:text-black rounded-full font-medium transition-colors flex items-center justify-center w-20'
                >
                  <svg className='w-5 h-5 group-hover:hidden' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                  </svg>
                  <span className='hidden group-hover:block'>Login</span>
                </button>
              </div>
              
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
          className='min-h-screen flex flex-col w-full cursor-pointer'
          onClick={handleClick}
        >
          <div
            className={`flex flex-col items-center justify-center w-full h-screen px-4 space-y-12 text-center text-[#eae6dd] font-serif-sc transition-opacity duration-1000 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className='flex flex-col items-center'>
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
          </div>

          {/* Stats Section - Left aligned with Click anywhere to enter on right */}
          <div className='w-full px-4 sm:px-6 lg:px-8 pb-8 absolute bottom-0 left-0 right-0'>
            <div className='max-w-7xl mx-auto flex justify-between items-end'>
              <div 
                ref={statsRef}
                className='flex flex-wrap gap-x-12 gap-y-6'
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
              <div className='text-[#eae6dd]/50 text-xs font-light italic'>
                Click anywhere to enter
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}