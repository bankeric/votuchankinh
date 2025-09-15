import { useState, useCallback, useEffect } from "react";
import { Chat } from "@/interfaces/chat";

interface UseInfiniteChatsProps {
  chats: Chat[];
  totalChats: number;
  onLoadMore?: (page: number) => Promise<void>;
}

export function useInfiniteChats({
  chats,
  totalChats,
  onLoadMore,
}: UseInfiniteChatsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Check if there are more chats to load
  const checkHasMore = useCallback(() => {
    if (totalChats === 0 || totalChats === 1) return false;
    const currentlyDisplayed = chats.length;
    return currentlyDisplayed < totalChats;
  }, [totalChats, chats.length]);

  // Update hasMore when totalChats changes
  useEffect(() => {
    const isHasMore = checkHasMore();
    setHasMore(isHasMore);
  }, [totalChats, chats.length, checkHasMore]);

  // Load more chats
  const loadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) {
      return;
    }

    setIsLoadingMore(true);

    try {
      if (onLoadMore) {
        await onLoadMore(currentPage + 1);
      }

      setCurrentPage((prev) => prev + 1);
    } catch (error) {
      console.error("Error loading more chats:", error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, onLoadMore, currentPage]);

  // Reset pagination
  const resetPagination = useCallback(() => {
    setCurrentPage(1);
    setHasMore(true);
  }, []);

  return {
    displayedChats: chats,
    isLoadingMore,
    hasMore,
    loadMore,
    resetPagination,
    currentPage,
    totalFiltered: totalChats,
    totalDisplayed: chats.length,
  };
}
