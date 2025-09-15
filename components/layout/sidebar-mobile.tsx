import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { LogOut, MoreVertical, Plus, Search, Settings, X } from 'lucide-react'
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
  const router = useRouter()
  const { t, language, changeLanguage } = useTranslations()
  const { handleCreateChat } = useCreateChat()
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

  return (
    <>
      {/* Mobile overlay */}
      <div
        className='fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden'
        onClick={() => setIsMobileOpen(false)}
      />

      {/* Mobile sidebar */}
      <div
        className={`fixed left-0 top-0 h-full w-80 bg-white border-r border-orange-200 flex flex-col z-50 md:hidden transform transition-transform duration-300 ease-in-out`}
      >
        {/* Header */}
        <div className='p-4 border-b border-orange-100'>
          <div className='flex items-center justify-between mb-4'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-8 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center'>
                <span className='text-orange-700 text-sm font-bold'>🙏</span>
              </div>
              <h1 className='font-bold text-lg text-gray-800'>
                {t('app.title')}
              </h1>
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
                className='w-full justify-start gap-2 h-8 text-xs border-orange-200 hover:bg-orange-50 hover:border-orange-300'
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
            className='w-full justify-start gap-2 bg-orange-500 hover:bg-orange-600'
          >
            <Plus className='w-4 h-4' />
            <span>{t('chat.newChat')}</span>
          </Button>
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
        <div className='p-4 border-t border-orange-100'>
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

            <Button
              variant={language === Language.VI ? 'outline' : 'ghost'}
              size='sm'
              className='text-xs'
              onClick={() => changeLanguage(Language.VI)}
            >
              🇻🇳 {t('settings.vietnamese')}
            </Button>
            <Button
              variant={language === Language.EN ? 'outline' : 'ghost'}
              size='sm'
              className='text-xs text-gray-500'
              onClick={() => changeLanguage(Language.EN)}
            >
              🇺🇸 {t('settings.english')}
            </Button>
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
    </>
  )
}
