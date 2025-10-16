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
import { useEffect, useState } from 'react'

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
  const [isAnimating, setIsAnimating] = useState(false)
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

  // Handle mount/unmount animations
  useEffect(() => {
    if (isMobileOpen) {
      setIsAnimating(true)
    } else if (isAnimating) {
      const timer = setTimeout(() => setIsAnimating(false), 250)
      return () => clearTimeout(timer)
    }
  }, [isMobileOpen])

  const shouldRenderLayer = isMobileOpen || isAnimating

  return (
    <>
      {/* Mobile overlay */}
      {shouldRenderLayer && (
        <div
          className={`fixed inset-0 z-40 md:hidden transition-opacity duration-250 ease-out ${
            isMobileOpen ? 'opacity-100 bg-black/50' : 'opacity-0 bg-black/0'
          }`}
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      {shouldRenderLayer && (
        <div
          className={`fixed left-0 top-0 h-full w-80 bg-[#efe0bd] border-r  border-[#2c2c2c]/30 flex flex-col z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
            isMobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
        {/* Header */}
        <div className='p-4 pb-0'>
          <div className='flex items-center justify-between mb-0'>
            <div className='flex items-center justify-center'>
              <Image
                src={'/images/giac-ngo-logo-6.png'}
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

          {/* Divider directly under logo - old color */}
          <div className='border-b border-[#2c2c2c]/30 my-3' />

          {/* Quick actions: Admin + Voice + Meditate (icons only on mobile) */}
          <div className='mb-3 flex justify-start gap-2'>
            {isAdmin && (
              <Button
                variant='ghost'
                size='sm'
                aria-label={t('navigation.admin')}
                onClick={() => {
                  router.push('/admin')
                  setIsMobileOpen(false)
                }}
                className='w-10 h-10 p-0 border border-black rounded-2xl bg-inherit'
              >
                <Image src={'/images/pricing-2.png'} alt='Admin' width={40} height={40} />
              </Button>
            )}

            {user && (
              <>
                <Button
                  variant='ghost'
                  size='sm'
                  aria-label={t('navigation.voiceChat')}
                  onClick={() => {
                    router.push('/voice')
                    setIsMobileOpen(false)
                  }}
                  className='w-10 h-10 p-0 border border-black rounded-2xl bg-inherit'
                >
                  <Image src={'/images/voice-chat.png'} alt='Voice Chat' width={40} height={40} />
                </Button>

                <Button
                  variant='ghost'
                  size='sm'
                  aria-label={t('navigation.meditate')}
                  onClick={() => {
                    const { setIsMeditationMode } = useChatStore.getState()
                    setIsMeditationMode(true)
                    setIsMobileOpen(false)
                  }}
                  className='w-10 h-10 p-0 border border-black rounded-2xl bg-inherit'
                >
                  <Image src={'/images/Meditate.png'} alt='Meditate' width={40} height={40} />
                </Button>
              </>
            )}
          </div>

          {/* End header content */}
        </div>

        {/* Search and Chats */}
        <div className='flex-1 overflow-y-auto p-2'>
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

          {/* New Chat Button above chat list */}
          {user && (
            <div className='mb-3'>
              <Button
                size='sm'
                onClick={handleCreateChat}
                className='w-full justify-start gap-2 rounded-2xl bg-[#991b1b] hover:bg-[#7a1515] text-[#f6efe0] border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]'
              >
                <Plus className='w-4 h-4 text-white' />
                <span>{t('chat.newChat')}</span>
              </Button>
            </div>
          )}

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
        <div className='p-2 border-t border-[#2c2c2c]/30'>
          <div className='flex items-center justify-between gap-2'>
            <div className='transition-all duration-300 ease-in-out'>
              {user && (
                <div className='animate-in fade-in-0 slide-in-from-bottom-2 duration-300'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        size='sm'
                        className='transition-colors duration-200 hover:bg-black/10'
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
                </div>
              )}
            </div>

            {language === Language.VI ? (
              <Button
                variant={'ghost'}
                size='sm'
                className={`text-xs text-black hover:bg-black/10 transition-colors duration-200`}
                onClick={() => changeLanguage(Language.EN)}
              >
                🇺🇸 {t('settings.english')}
              </Button>
            ) : (
              <Button
                variant={'ghost'}
                size='sm'
                className={`text-xs text-black hover:bg-black/10 transition-colors duration-200`}
                onClick={() => changeLanguage(Language.VI)}
              >
                🇻🇳 {t('settings.vietnamese')}
              </Button>
            )}

            <div className='transition-all duration-300 ease-in-out'>
              {!user && (
                <div className='animate-in fade-in-0 slide-in-from-bottom-2 duration-300'>
                  <Button
                    variant={'ghost'}
                    onClick={handleLogin}
                    className='text-black hover:bg-black/10 transition-colors duration-200'
                  >
                    <LogIn className='w-4 h-4' />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        </div>
      )}

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
