'use client'
import React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChatList } from '@/components/chat/chat-list'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { SettingsModal } from '@/components/layout/settings-modal'
import useCreateChat from '@/hooks/use-create-chat'
import { useTranslations } from '@/hooks/use-translations'
import { Language } from '@/interfaces/chat'
import { useChatStore } from '@/store/chat'
import {
  BookOpen,
  Edit,
  Heart,
  Loader2,
  LogIn,
  LogOut,
  Menu,
  MessageSquare,
  MoreVertical,
  PenTool,
  Plus,
  Search,
  Settings,
  Trash2,
  X,
  ChevronsLeft,
  ChevronDown
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authService } from '@/service/auth'
import { appToast } from '@/lib/toastify'
import { Role } from '@/interfaces/user'
import { useAuthStore } from '@/store/auth'
import useAgents from '@/hooks/use-agents'
import Image from 'next/image'
import { SidebarMobile } from './sidebar-mobile'
import { LoginModal } from './login-modal'

export function Sidebar({
  isMobileOpen,
  setIsMobileOpen
}: {
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
}) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(true)
  const isAnyModalOpen = isSettingsModalOpen || isLogin || isLogoutDialogOpen
  const { user, logout } = useAuthStore()

  // Show quick feature icons when any modal open, or when collapsed AND user is logged in
  const shouldShowQuickFeatures = isAnyModalOpen || (isCollapsed && !!user)

  const { t, language, changeLanguage } = useTranslations()
  const {
    chats,
    deleteChat,
    updateChat,
    activeChatId,
    setActiveChatId,
    getMessages,
    loadingTitleChatId,
    getChats,
    totalChats
  } = useChatStore()
  const isAdmin = user?.role === Role.ADMIN
  const router = useRouter()
  const { handleCreateChat } = useCreateChat()
  const { setSelectedAgentId } = useAgents()

  const renderLogoutDialog = () => {
    return (
      <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <AlertDialogContent className='sm:max-w-[425px]'>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex items-center gap-2'>
              <LogOut className='w-5 h-5 text-orange-600' />
              {t('auth.confirmLogout')}
            </AlertDialogTitle>
            <AlertDialogDescription className='text-gray-600'>
              {t('auth.logoutConfirmation')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className='border-orange-200 hover:bg-orange-50'>
              {t('common.cancel')}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className='bg-orange-600 hover:bg-orange-700 text-white'
            >
              {t('auth.logoutConfirmButton')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  const handleLogoutConfirmation = () => {
    console.log('handleLogoutConfirmation')
    setIsLogoutDialogOpen(true)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/landing')
    appToast(t('auth.logoutSuccess'), { type: 'success' })
    setIsLogoutDialogOpen(false)
  }

  const handleCreateNewChat = () => {
    const uuid = handleCreateChat()
    setActiveChatId(uuid)
    setIsMobileOpen(false) // Close mobile sidebar after creating new chat
  }

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteChat(chatId)
    // If the active chat is deleted, select the first available chat
    if (chatId === activeChatId && chats.length > 1) {
      const remainingChats = chats.filter((chat) => chat.uuid !== chatId)
      setActiveChatId(remainingChats[0].uuid)
    } else {
      router.push('/ai/new')
    }
  }

  const editChatTitle = (chatId: string, newTitle: string) => {
    updateChat(chatId, { title: newTitle })
  }

  const setActiveChatAndGetMessages = async (chatId: string) => {
    setActiveChatId(chatId)
    const messages = await getMessages(chatId)
    let agentId = chats.find((chat) => chat.uuid === chatId)?.agent_id
    if (!agentId && messages && messages.length > 0) {
      agentId = messages[0].agent_id
    }
    if (agentId) {
      setSelectedAgentId(agentId)
    }
    setIsMobileOpen(false) // Close mobile sidebar when selecting chat
  }

  const handleLoadMore = async (page: number) => {
    try {
      await getChats(page)
    } catch (error) {
      console.error('Error loading more chats:', error)
    }
  }

  // Mobile overlay
  if (isMobileOpen) {
    return (
      <SidebarMobile
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        isAdmin={isAdmin}
        setIsSettingsModalOpen={setIsSettingsModalOpen}
        handleLogoutConfirmation={handleLogoutConfirmation}
        isSettingsModalOpen={isSettingsModalOpen}
        renderLogoutDialog={renderLogoutDialog}
        handleLoadMore={handleLoadMore}
        setActiveChatAndGetMessages={setActiveChatAndGetMessages}
        setActiveChatId={setActiveChatId}
        handleDeleteChat={handleDeleteChat}
        editChatTitle={editChatTitle}
      />
    )
  }

  // Collapsed sidebar
  if (isCollapsed) {
    return (
      <div className='hidden md:flex w-16 bg-[#efe0bd] flex-col items-center py-4'>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => {
            setIsCollapsed(false)
          }}
          className='mb-4 hover:bg-red-800 hover:text-white'
        >
          <Menu className='w-5 h-5' />
        </Button>

        {/* Quick Features - Collapsed (shown when collapsed or modal open) */}
        {shouldShowQuickFeatures && (
          <>
            {isAdmin && (
              <Button
                variant='ghost'
                size='sm'
                onClick={() => router.push('/admin')}
                className='w-10 h-10 p-0 mb-4 hover:bg-red-800 hover:text-white'
                title={t('navigation.admin')}
              >
                <Image
                  src={'/images/pricing-2.png'}
                  alt='Admin'
                  width={40}
                  height={40}
                />
              </Button>
            )}
            <Button
              variant='ghost'
              size='sm'
              onClick={() => {
                const { setIsMeditationMode } = useChatStore.getState()
                setIsMeditationMode(true)
              }}
              className='w-10 h-10 p-0 mb-4 hover:bg-red-800 hover:text-white'
              title='Meditate'
            >
              <Image
                src={'/images/Meditate.png'}
                alt='Meditate'
                width={40}
                height={40}
              />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/voice')}
              className='w-10 h-10 p-0 mb-4 hover:bg-red-800 hover:text-white'
              title='Voice Chat'
            >
              <Image
                src={'/images/voice-chat.png'}
                alt='Voice Chat'
                width={40}
                height={40}
              />
            </Button>
            <Button
              variant='ghost'
              size='sm'
              onClick={() => router.push('/community')}
              className='w-10 h-10 p-0 mb-6 hover:bg-red-800 hover:text-white'
              title={t('navigation.socialFeed')}
            >
              <Image
                src={'/images/pricing-1.png'}
                alt='Social Feed'
                width={40}
                height={40}
              />
            </Button>
          </>
        )}

        {/* New Chat Button - Collapsed right under Meditate */}
        {user && (
          <Button
            variant='outline'
            size='sm'
            onClick={handleCreateNewChat}
            className='w-10 h-10 p-0 mb-4 bg-[#f9f0dc] border border-black text-black hover:bg-red-800 hover:text-white'
            title={t('chat.newChat')}
          >
            <Plus className='w-4 h-4' />
          </Button>
        )}

        {/* Bottom Area - Collapsed */}
        <div className='mt-auto w-full flex flex-col items-center'>
          {/* User Menu - Collapsed */}
          <div className='transition-all duration-300 ease-in-out'>
            {user ? (
              <div className='animate-in fade-in-0 slide-in-from-bottom-2 duration-300'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='w-10 h-10 p-0 transition-colors duration-200 hover:bg-red-800 hover:text-white'
                    >
                      <MoreVertical className='w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side='right' align='end' className='w-48'>
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
            ) : (
              <div className='animate-in fade-in-0 slide-in-from-bottom-2 duration-300'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsLogin(true)}
                  className='w-10 h-10 p-0 transition-colors duration-200 hover:bg-red-800 hover:text-white'
                  title={t('auth.signIn')}
                >
                  <LogIn className='w-4 h-4' />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Desktop expanded sidebar
  return (
    <div className='hidden md:flex w-80 bg-[#efe0bd] border-r border-[#2c2c2c]/30 flex-col transform transition-all duration-300 ease-in-out'>
      {/* Header */}
      <div className='px-4 py-4'>
        <div className='flex items-center justify-between mb-4'>
          <div className='' />
          <Image
            src={'/images/giac-ngo-logo-6.png'}
            alt='Logo'
            width={160}
            height={40}
            objectFit='contain'
            style={{ cursor: 'pointer' }}
            onClick={() => router.push('/landing')}
          />
          <Button
            variant='ghost'
            size='sm'
            onClick={() => setIsCollapsed(true)}
            className='text-black hover:bg-red-800 hover:text-white'
            title={t('common.collapse')}
          >
            <ChevronsLeft className='w-4 h-4' />
          </Button>
        </div>

        {/* Divider line - Right after logo */}
        <div className='border-t border-[#2c2c2c]/30 mb-3'></div>

        {/* Admin Button */}
        {/* {isAdmin && (
          <div className='mb-3'>
            <Button
              variant='outline'
              size='sm'
              onClick={() => router.push('/admin')}
              className='w-full justify-center items-center border border-black text-black rounded-lg bg-[#f9f0dc] h-8 text-xs hover:bg-red-800 hover:text-white'
            >
              <span>Admin</span>
            </Button>
          </div>
        )} */}

        {/* New Chat Button */}
        {user && (
          <div className='mb-4'>
            <Button
              variant='outline'
              size='sm'
              onClick={handleCreateNewChat}
              className='w-full justify-center items-center gap-2 border border-black text-black rounded-lg bg-[#f9f0dc] h-8 text-xs hover:bg-red-800 hover:text-white'
            >
              <Plus className='w-3 h-3' />
              <span>{t('chat.newChat')}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Search and Chats */}
      <div className='flex-1 overflow-y-auto p-4'>
        {/* Search */}
        {/* <div className='relative mb-4'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-500' />
          <Input
            type='text'
            placeholder={t('common.search')}
            className='pl-9 h-9'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div> */}

        {/* History Dropdown - hidden when not logged in */}
        {user && (
          <>
            <div className='mb-3'>
              <button
                onClick={() => setIsHistoryOpen((v) => !v)}
                className='w-full flex items-center justify-between text-sm text-black hover:bg-red-800 hover:text-white rounded-lg px-3 py-2 bg-red-800 text-white'
              >
                <span>{t('navigation.history') || 'Lịch sử'}</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    isHistoryOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>
            {isHistoryOpen && (
              <div className='mt-2'>
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
            )}
          </>
        )}
      </div>

      {/* Footer V2 */}
      <div className='px-4 pt-6 pb-5 border-t border-[#2c2c2c]/40'>
        <div className='flex items-center justify-center gap-4 flex-wrap'>
          <div className='transition-all duration-300 ease-in-out'>
            {user && (
              <div className='animate-in fade-in-0 slide-in-from-bottom-2 duration-300'>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-black hover:bg-red-800 hover:text-white transition-colors duration-200 px-2'
                    >
                      <Settings className='w-4 h-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side='top' align='center' className='w-48'>
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
              className={`text-xs text-black hover:bg-red-800 hover:text-white transition-colors duration-200 px-2`}
              onClick={() => changeLanguage(Language.EN)}
            >
              🇺🇸 {t('settings.english')}
            </Button>
          ) : (
            <Button
              variant={'ghost'}
              size='sm'
              className={`text-xs text-black hover:bg-red-800 hover:text-white transition-colors duration-200 px-2`}
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
                  onClick={() => setIsLogin(true)}
                  className='text-black hover:bg-red-800 hover:text-white transition-colors duration-200 px-2'
                >
                  <LogIn className='w-4 h-4' />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen} />

      {/* Logout Confirmation Dialog */}
      {renderLogoutDialog()}

      {/* Login Modal */}
      <LoginModal open={isLogin} onClose={() => setIsLogin(false)} />
    </div>
  )
}

// Export mobile trigger component
export function MobileSidebarTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <Button
      variant='ghost'
      size='sm'
      onClick={onOpen}
      className='md:hidden fixed top-4 left-4 z-30 bg-white border border-orange-200 shadow-sm'
    >
      <Menu className='w-5 h-5' />
    </Button>
  )
}