import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import {
  LogIn,
  LogOut,
  MoreVertical,
  Plus,
  Search,
  Settings,
  X
} from 'lucide-react'
import { useTranslations } from '@/hooks/use-translations'
import { Input } from '../ui/input'
import { ChatList } from '../chat/chat-list'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Language } from '@/interfaces/chat'
import { SettingsModal } from './settings-modal'
import useCreateChat from '@/hooks/use-create-chat'
import { useChatStore } from '@/store/chat'
import Image from 'next/image'
import { useAuthStore } from '@/store/auth'
import { appToast } from '@/lib/toastify'
import { LoginModal } from './login-modal'
import { useState } from 'react'

interface SidebarMobileProps {
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
  isAdmin?: boolean
  setIsSettingsModalOpen: (open: boolean) => void
  handleLogoutConfirmation: () => void
  isSettingsModalOpen: boolean
  renderLogoutDialog: () => React.ReactNode
  setActiveChatId: (chatId: string) => void
  handleDeleteChat: (chatId: string, e: React.MouseEvent) => void
  editChatTitle: (chatId: string, newTitle: string) => void
  handleLoadMore: (page: number) => Promise<void>
  setActiveChatAndGetMessages: (chatId: string) => void
}

export const SidebarMobile = ({
  isMobileOpen,
  setIsMobileOpen,
  isAdmin,
  handleLogoutConfirmation,
  setIsSettingsModalOpen,
  isSettingsModalOpen,
  renderLogoutDialog,
  handleDeleteChat,
  editChatTitle,
  handleLoadMore,
  setActiveChatAndGetMessages
}: SidebarMobileProps) => {
  const [isLogin, setIsLogin] = useState(false)
  const router = useRouter()
  const { t, language, changeLanguage } = useTranslations()
  const { handleCreateChat } = useCreateChat()
  const { user, logout } = useAuthStore()
  const { chats, activeChatId, loadingTitleChatId, totalChats } = useChatStore()

  const handleLogout = async () => {
    await logout()
    router.push('/landing')
    appToast(t('auth.logoutSuccess'), {
      type: 'success'
    })
    setIsMobileOpen(false)
  }

  const handleLogin = () => {
    setIsLogin(true)
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Mobile sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-[#efe0bd] border-r  border-[#2c2c2c]/30 flex flex-col z-50 md:hidden transform transition-transform duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className='p-4 border-b border-orange-100'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center justify-center'>
              <Image
                src={'/images/giac-ngo-logo-2.png'}
                alt='Logo'
                width={160}
                height={40}
                style={{ cursor: 'pointer' }}
                onClick={() => router.push('/landing')}
              />
            </div>

            <Button
              variant='ghost'
              size='sm'
              onClick={() => setIsMobileOpen(false)}
            >
              <X className='w-4 h-4' />
            </Button>
          </div>

          {/* Admin Panel Button */}
          {isAdmin && (
            <div
              className='mb-4'
              key='admin-panel-button'
            >
              <Button
                variant='outline'
                size='sm'
                onClick={() => {
                  router.push('/admin')
                  setIsMobileOpen(false)
                }}
                className='w-full justify-start gap-2 h-8 text-xs rounded-2xl border-black bg-inherit'
              >
                <span className='text-gray-700'>{t('navigation.admin')}</span>
              </Button>
            </div>
          )}

          {/* New Chat Button */}
          <Button
            variant='outline'
            size='sm'
            onClick={handleCreateChat}
            className='w-full justify-start gap-2 rounded-2xl border-black bg-inherit'
          >
            <Plus className='w-4 h-4' />
            <span>{t('chat.newChat')}</span>
          </Button>
        </div>

        {/* Search and Chats */}
        <div className='flex-1 overflow-y-auto p-2 border-t border-[#2c2c2c]/30'>
          {/* Search */}
          {/* <div className='relative mb-3'>
            <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
            <Input
              type='text'
              placeholder={t('common.search')}
              className='pl-9 h-9 text-sm'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div> */}

          {/* Chat List */}
          <ChatList
            chats={chats}
            activeChatId={activeChatId}
            loadingTitleChatId={loadingTitleChatId}
            totalChats={totalChats}
            onChatSelect={setActiveChatAndGetMessages}
            onDeleteChat={handleDeleteChat}
            onEditChatTitle={editChatTitle}
            onLoadMore={handleLoadMore}
          />
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-[#2c2c2c]/30'>
          <div className='flex items-center justify-center gap-2'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  size='sm'
                >
                  <MoreVertical className='w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side='top'
                align='center'
                className='w-48'
              >
                <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                  <Settings className='w-4 h-4 mr-2' />
                  {t('navigation.settings')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogoutConfirmation}>
                  <LogOut className='w-4 h-4 mr-2' />
                  {t('auth.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {language === Language.VI ? (
              <Button
                variant={'ghost'}
                size='sm'
                className={`text-xs text-black hover:bg-black/10`}
                onClick={() => changeLanguage(Language.EN)}
              >
                🇺🇸 {t('settings.english')}
              </Button>
            ) : (
              <Button
                variant={'ghost'}
                size='sm'
                className={`text-xs text-black hover:bg-black/10`}
                onClick={() => changeLanguage(Language.VI)}
              >
                🇻🇳 {t('settings.vietnamese')}
              </Button>
            )}

            {!user ? (
              <Button
                variant={'ghost'}
                onClick={handleLogin}
                className='text-black hover:bg-black/10'
              >
                <LogIn className='w-4 h-4' />
              </Button>
            ) : (
              <Button
                variant={'ghost'}
                onClick={handleLogout}
                className='text-black hover:bg-black/10'
              >
                <LogOut className='w-4 h-4' />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal - Mobile */}
      <SettingsModal
        open={isSettingsModalOpen}
        onOpenChange={setIsSettingsModalOpen}
      />

      {/* Logout Confirmation Dialog - Mobile */}
      {renderLogoutDialog()}

      {/* Login Modal */}
      <LoginModal
        open={isLogin}
        onClose={() => setIsLogin(false)}
      />
    </>
  )
}
