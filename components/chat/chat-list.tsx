"use client";

import { useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2, Heart, Search, BookOpen, PenTool } from "lucide-react";
import { Chat, ChatMode } from "@/interfaces/chat";
import { useInfiniteChats } from "@/hooks/use-infinite-chats";
import { useTranslation } from "react-i18next";

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  loadingTitleChatId: string | null;
  totalChats: number;
  onChatSelect: (chatId: string) => void;
  onDeleteChat: (chatId: string, e: React.MouseEvent) => void;
  onEditChatTitle: (chatId: string, newTitle: string) => void;
  onLoadMore?: (page: number) => Promise<void>;
}

const modeIcon = {
  [ChatMode.GUIDANCE]: (
    <Heart className="w-4 h-4 text-gray-500 flex-shrink-0" />
  ),
  [ChatMode.SEARCH]: (
    <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
  ),
  [ChatMode.QUIZ]: (
    <BookOpen className="w-4 h-4 text-gray-500 flex-shrink-0" />
  ),
  [ChatMode.POETRY]: (
    <PenTool className="w-4 h-4 text-gray-500 flex-shrink-0" />
  ),
};

export function ChatList({
  chats,
  activeChatId,
  loadingTitleChatId,
  totalChats,
  onChatSelect,
  onDeleteChat,
  onEditChatTitle,
  onLoadMore,
}: ChatListProps) {
  const { t } = useTranslation();
  const observerRef = useRef<IntersectionObserver | null>(null);
  
  const {
    displayedChats,
    isLoadingMore,
    hasMore,
    loadMore,
    resetPagination,
  } = useInfiniteChats({
    chats,
    totalChats,
    onLoadMore,
  });
  // Reset pagination when totalChats changes (e.g., after search)
  // useEffect(() => {
  //   resetPagination();
  //   logging("useEffect totalChats", totalChats);
  // }, [totalChats, resetPagination]);

  // Intersection Observer for infinite scroll
  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoadingMore) return;
      
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore && !isLoadingMore) {
            loadMore();
          }
        },
        { threshold: 0.1 }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [hasMore, isLoadingMore, loadMore]
  );

  // Cleanup observer on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleChatClick = (chatId: string) => {
    if (chatId === activeChatId) return;
    onChatSelect(chatId);
  };

  const handleEditTitle = (chatId: string, currentTitle: string) => {
    const newTitle = prompt(t('chat.editTitlePrompt'), currentTitle);
    if (newTitle && newTitle.trim()) {
      onEditChatTitle(chatId, newTitle.trim());
    }
  };

  if (totalChats === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        {t('chat.noChats')}
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {displayedChats.map((chat, index) => {
        const isLast = index === displayedChats.length - 1;
        const isActive = chat.uuid === activeChatId;
        const isLoading = loadingTitleChatId === chat.uuid;

        return (
          <div
            key={chat.uuid}
            ref={isLast ? lastElementRef : null}
            onClick={() => handleChatClick(chat.uuid)}
            className={`flex items-center justify-between p-2 rounded-md cursor-pointer group transition-colors ${
              isActive
                ? "bg-orange-100 border border-orange-200"
                : "hover:bg-orange-50"
            }`}
          >
            <div className="flex items-center gap-2 overflow-hidden flex-1 min-w-0">
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-gray-500 flex-shrink-0 animate-spin" />
              ) : (
                <Heart className="w-4 h-4 text-gray-500 flex-shrink-0" />
              )}
              <span className="text-sm text-gray-700 truncate">
                {chat.title}
              </span>
            </div>
            
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-orange-100"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditTitle(chat.uuid, chat.title);
                }}
                title={t('common.edit')}
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                onClick={(e) => onDeleteChat(chat.uuid, e)}
                title={t('common.delete')}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        );
      })}
      
      {/* Loading indicator for infinite scroll */}
      {isLoadingMore && (
        <div className="flex justify-center py-2">
          <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
        </div>
      )}
      
      {/* End of list indicator */}
      {!hasMore && displayedChats.length > 0 && (
        <div className="text-center py-2 text-xs text-gray-400">
          {t('chat.allChatsDisplayed', { count: totalChats })}
        </div>
      )}
    </div>
  );
} 