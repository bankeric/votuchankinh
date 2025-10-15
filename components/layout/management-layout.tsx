'use client'

import type React from 'react'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  FileText,
  Users,
  BarChart3,
  Settings,
  Search,
  Bell,
  Plus,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Clock,
  AlertCircle,
  Menu,
  LogOut,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  LinkIcon,
  ImageIcon,
  Paperclip
} from 'lucide-react'
import Image from 'next/image'
import { useAuthStore } from '@/store/auth'
import { useOnce } from '@/hooks/use-once'
import { Role } from '@/interfaces/user'

enum ActiveModule {
  DOCUMENTS = 'documents',
  USERS = 'users',
  ANALYTICS = 'analytics',
  SETTINGS = 'settings'
}

export const ManagementLayout = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  const { user, isAuthenticated } = useAuthStore()

  const activeModule =
    typeof window !== 'undefined'
      ? window.location.pathname.split('/').pop()
      : ''

  useOnce(() => {
    if (isAuthenticated !== undefined && (!user || user.role !== Role.ADMIN)) {
      window.location.href = '/ai/new'
    }
  }, [user, isAuthenticated])

  const onChangeModule = (module: ActiveModule) => {
    window.location.href = `/management/${module}`
  }
  return (
    <div className='min-h-screen bg-[#EFE0BD] flex'>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className='fixed lg:relative z-40 w-64 h-screen bg-[#f3ead7] border-r-2 border-[#2c2c2c]/20 flex flex-col'
          >
            {/* Logo */}
            <div className='p-4 border-b-2 border-[#2c2c2c]/20'>
              <div className='flex items-center space-x-3'>
                <Image
                  src='/images/logo.png'
                  alt='Logo'
                  width={40}
                  height={40}
                  className='w-10 h-10'
                />
                <div>
                  <h1 className='font-serif text-lg font-bold text-[#991b1b]'>
                    Giác Ngộ
                  </h1>
                  <p className='text-xs font-serif text-[#2c2c2c]/60'>
                    Management Dashboard
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className='flex-1 p-4 space-y-2'>
              <button
                onClick={() => onChangeModule(ActiveModule.DOCUMENTS)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-serif text-sm transition-all ${
                  activeModule === ActiveModule.DOCUMENTS
                    ? 'bg-[#991b1b] text-[#f6efe0] shadow-[0_2px_0_#00000030]'
                    : 'text-[#2c2c2c] hover:bg-[#EFE0BD]'
                }`}
              >
                <FileText className='w-4 h-4' />
                <span>Files & Documents</span>
              </button>

              <button
                onClick={() => onChangeModule(ActiveModule.USERS)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-serif text-sm transition-all ${
                  activeModule === 'users'
                    ? 'bg-[#991b1b] text-[#f6efe0] shadow-[0_2px_0_#00000030]'
                    : 'text-[#2c2c2c] hover:bg-[#EFE0BD]'
                }`}
              >
                <Users className='w-4 h-4' />
                <span>User Management</span>
              </button>

              <button
                onClick={() => onChangeModule(ActiveModule.ANALYTICS)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-serif text-sm transition-all ${
                  activeModule === 'analytics'
                    ? 'bg-[#991b1b] text-[#f6efe0] shadow-[0_2px_0_#00000030]'
                    : 'text-[#2c2c2c] hover:bg-[#EFE0BD]'
                }`}
              >
                <BarChart3 className='w-4 h-4' />
                <span>Analytics</span>
              </button>

              <button
                onClick={() => onChangeModule(ActiveModule.SETTINGS)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-serif text-sm transition-all ${
                  activeModule === 'settings'
                    ? 'bg-[#991b1b] text-[#f6efe0] shadow-[0_2px_0_#00000030]'
                    : 'text-[#2c2c2c] hover:bg-[#EFE0BD]'
                }`}
              >
                <Settings className='w-4 h-4' />
                <span>Settings</span>
              </button>
            </nav>

            {/* User Profile */}
            <div className='p-4 border-t-2 border-[#2c2c2c]/20'>
              <div className='flex items-center space-x-3 mb-3'>
                <div className='w-10 h-10 rounded-full bg-[#991b1b] flex items-center justify-center text-[#f6efe0] font-serif font-bold'>
                  A
                </div>
                <div className='flex-1'>
                  <p className='font-serif text-sm font-semibold text-[#2c2c2c]'>
                    Admin User
                  </p>
                  <p className='text-xs font-serif text-[#2c2c2c]/60'>
                    admin@giac.ngo
                  </p>
                </div>
              </div>
              <button className='w-full flex items-center justify-center space-x-2 px-4 py-2 bg-[#2c2c2c]/10 text-[#2c2c2c] rounded-xl font-serif text-sm hover:bg-[#2c2c2c]/20 transition-colors'>
                <LogOut className='w-4 h-4' />
                <span>Đăng xuất</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className='flex-1 flex flex-col min-h-screen'>
        {/* Top Bar */}
        <header className='bg-[#f3ead7] border-b-2 border-[#2c2c2c]/20 p-4'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-4'>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className='lg:hidden'
              >
                <Menu className='w-6 h-6 text-[#2c2c2c]' />
              </button>
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#2c2c2c]/60' />
                <input
                  type='text'
                  placeholder='Tìm kiếm...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='pl-10 pr-4 py-2 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] placeholder-[#2c2c2c]/40 focus:outline-none focus:border-[#991b1b] w-64'
                />
              </div>
            </div>

            <div className='flex items-center space-x-3'>
              <button className='relative p-2 hover:bg-[#EFE0BD] rounded-lg transition-colors'>
                <Bell className='w-5 h-5 text-[#2c2c2c]' />
                <span className='absolute top-1 right-1 w-2 h-2 bg-[#991b1b] rounded-full'></span>
              </button>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className='flex-1 p-6'>{children}</main>
      </div>
    </div>
  )
}
