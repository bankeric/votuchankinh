'use client'

import { Home, Search, User } from 'lucide-react'

enum Tab {
  HOME = 'home',
  SEARCH = 'search',
  PROFILE = 'profile'
}

export function FeedLayout({ children }: { children: React.ReactNode }) {
  const onChangeTab = (tab: Tab) => {
    window.location.href = `/posts/${tab}`
  }

  const activeTab =
    typeof window !== 'undefined'
      ? window.location.pathname.split('/').pop()
      : ''

  return (
    <div className='min-h-screen bg-[#EFE0BD] font-serif'>
      {/* Tabs */}
      <div className='bg-white/50 border-b border-[#991b1b]/20 sticky top-0 z-10'>
        <div className='max-w-3xl mx-auto px-4'>
          {/* Icon Buttons */}
          <div className='flex items-center justify-center gap-2 py-3'>
            <button
              onClick={() => {
                onChangeTab(Tab.HOME)
              }}
              className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl
                border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                transition-colors ${
                  activeTab === Tab.HOME
                    ? 'bg-[#d4af37] text-[#2c2c2c]'
                    : 'bg-[#f3ead7] text-[#1f1f1f] hover:bg-[#efe2c9]'
                }`}
              title='Trang chủ - Xem tất cả bài viết'
            >
              <Home className='w-4 h-4 md:w-5 md:h-5' />
            </button>

            <button
              onClick={() => onChangeTab(Tab.SEARCH)}
              className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl
                border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                transition-colors ${
                  activeTab === Tab.SEARCH
                    ? 'bg-[#d4af37] text-[#2c2c2c]'
                    : 'bg-[#f3ead7] text-[#1f1f1f] hover:bg-[#efe2c9]'
                }`}
              title='Tìm kiếm người dùng hoặc chủ đề'
            >
              <Search className='w-4 h-4 md:w-5 md:h-5' />
            </button>

            <button
              onClick={() => {
                onChangeTab(Tab.PROFILE)
              }}
              className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl
                border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                transition-colors ${
                  activeTab === Tab.PROFILE
                    ? 'bg-[#d4af37] text-[#2c2c2c]'
                    : 'bg-[#f3ead7] text-[#1f1f1f] hover:bg-[#efe2c9]'
                }`}
              title='Trang cá nhân - Xem bài viết của bạn'
            >
              <User className='w-4 h-4 md:w-5 md:h-5' />
            </button>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className='max-w-3xl mx-auto px-4 py-6'>{children}</div>
    </div>
  )
}
