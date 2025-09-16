'use client'

import { useEffect, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import {
  Edit,
  Trash2,
  Loader2,
  Heart,
  Search,
  BookOpen,
  PenTool,
  MessageSquare
} from 'lucide-react'
import { Chat, ChatMode } from '@/interfaces/chat'
import { useInfiniteChats } from '@/hooks/use-infinite-chats'
import { useTranslation } from 'react-i18next'

interface ChatListProps {
  chats: Chat[]
  activeChatId: string | null
  loadingTitleChatId: string | null
  totalChats: number
  onChatSelect: (chatId: string) => void
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void
  onEditChatTitle: (chatId: string, newTitle: string) => void
  onLoadMore?: (page: number) => Promise<void>
}

const modeIcon = {
  [ChatMode.GUIDANCE]: (
    <Heart className='w-4 h-4 text-gray-500 flex-shrink-0' />
  ),
  [ChatMode.SEARCH]: <Search className='w-4 h-4 text-gray-500 flex-shrink-0' />,
  [ChatMode.QUIZ]: <BookOpen className='w-4 h-4 text-gray-500 flex-shrink-0' />,
  [ChatMode.POETRY]: <PenTool className='w-4 h-4 text-gray-500 flex-shrink-0' />
}

export function ChatList({
  chats,
  activeChatId,
  loadingTitleChatId,
  totalChats,
  onChatSelect,
  onDeleteChat,
  onEditChatTitle,
  onLoadMore
}: ChatListProps) {
  const { t } = useTranslation()
  const observerRef = useRef<IntersectionObserver | null>(null)

  const { displayedChats, isLoadingMore, hasMore, loadMore, resetPagination } =
    useInfiniteChats({
      chats,
      totalChats,
      onLoadMore
    })
  // Reset pagination when totalChats changes (e.g., after search)
  // useEffect(() => {
  //   resetPagination();
  //   logging("useEffect totalChats", totalChats);
  // }, [totalChats, resetPagination]);

  // Intersection Observer for infinite scroll
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return

      if (observerRef.current) {
        observerRef.current.disconnect()
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
            loadMore()
          }
        },
        { threshold: 0.1 }
      )

      if (node) {
        observerRef.current.observe(node)
      }
    },
    [hasMore, isLoadingMore, loadMore]
  )

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  const handleChatClick = (chatId: string) => {
    if (chatId === activeChatId) return
    onChatSelect(chatId)
  }

  const handleEditTitle = (chatId: string, currentTitle: string) => {
    const newTitle = prompt(t('chat.editTitlePrompt'), currentTitle)
    if (newTitle && newTitle.trim()) {
      onEditChatTitle(chatId, newTitle.trim())
    }
  }

  if (totalChats === 0) {
    return (
      <div className='text-center py-4 text-gray-500 text-sm'>
        {t('chat.noChats')}
      </div>
    )
  }

  const formatTime = (timestamp: number) => {
    // format timestamp to dd/mm/yyyy hh:mm
    const date = new Date(timestamp)
    return `${date.getDate().toString().padStart(2, '0')}/${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`
  }

  return (
    <div className='space-y-2'>
      {displayedChats.map((chat, index) => {
        const isLast = index === displayedChats.length - 1
        const isActive = chat.uuid === activeChatId
        const isLoading = loadingTitleChatId === chat.uuid

        return (
          <div
            key={chat.uuid}
            ref={isLast ? lastElementRef : null}
            onClick={() => handleChatClick(chat.uuid)}
            className={` p-2 cursor-pointer group border border-black rounded-2xl text-black 
              shadow-[0_2px_6px_rgba(0,0,0,0.3),0_0_0_3px_#00000010_inset] 
              hover:shadow-[0_4px_10px_rgba(0,0,0,0.4),0_0_0_3px_#00000020_inset] 
              transition-all duration-200 ${
                isActive ? 'bg-black/5' : 'hover:bg-black/5'
              }`}
          >
            <div className='flex justify-between gap-2'>
              {/* Icon */}
              {isLoading ? (
                <Loader2 className='w-4 h-4 text-inherit flex-shrink-0 animate-spin' />
              ) : (
                <MessageSquare className='h-4 w-4 mt-2' />
              )}

              {/* Message content */}
              <div className='overflow-hidden flex-1 min-w-0'>
                <div className='flex items-center justify-between gap-2'>
                  <span className='text-sm text-inherit truncate'>
                    {chat.title}
                  </span>
                  <div className='flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-6 w-6 p-0 text-inherit hover:bg-black/10'
                      onClick={(e) => {
                        e.stopPropagation()
                        handleEditTitle(chat.uuid, chat.title)
                      }}
                      title={t('common.edit')}
                    >
                      <Edit className='w-3 h-3' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='h-6 w-6 p-0 text-inherit hover:bg-black/10'
                      onClick={(e) => onDeleteChat(chat.uuid, e)}
                      title={t('common.delete')}
                    >
                      <Trash2 className='w-3 h-3' />
                    </Button>
                  </div>
                </div>

                <span className='text-xs font-light text-left opacity-70 truncate'>
                  {formatTime(new Date(chat.created_at || '').getTime())}
                </span>
              </div>
            </div>
          </div>
        )
      })}

      {/* Loading indicator for infinite scroll */}
      {isLoadingMore && (
        <div className='flex justify-center py-2'>
          <Loader2 className='w-4 h-4 text-gray-500 animate-spin' />
        </div>
      )}

      {/* End of list indicator */}
      {!hasMore && displayedChats.length > 0 && (
        <div className='text-center py-2 text-xs text-black'>
          {t('chat.allChatsDisplayed', { count: totalChats })}
        </div>
      )}
    </div>
  )
}
