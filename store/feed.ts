import { Feed } from '@/interfaces/feed'
import { User } from '@/interfaces/user'
import { removeAuthToken } from '@/lib/axios'
import { authService, LoginDto } from '@/service/auth'
import { feedService } from '@/service/feed'
import { AxiosError } from 'axios'

import { create } from 'zustand'

interface FeedState {
  list: Feed[]
  fetchFeeds: (userId?: string) => Promise<void>
  likeFeed: (feedId: string) => Promise<void>
  reshareFeed: (feedId: string, content: string) => Promise<void>
}

export const useFeedStore = create<FeedState>()((set, get) => {
  return {
    list: [],
    fetchFeeds: async (userId?: string) => {
      try {
        const data = await feedService.getFeeds(userId)
        set({ list: data.data })
      } catch (error) {
        console.error('Failed to fetch feeds:', error)
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            removeAuthToken()
            await authService.logout()
          }
        }
      }
    },
    likeFeed: async (feedId: string) => {
      try {
        await feedService.likeFeed(feedId)
        const data = await feedService.getFeeds()
        set({ list: data.data })
      } catch (error) {
        console.error('Failed to like feed:', error)
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            removeAuthToken()
            await authService.logout()
          }
        }
      }
    },
    reshareFeed: async (feedId: string, content: string) => {
      try {
        await feedService.reshareFeed(feedId, content)
        const data = await feedService.getFeeds()
        set({ list: data.data })
      } catch (error) {
        console.error('Failed to reshare feed:', error)
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            removeAuthToken()
            await authService.logout()
          }
        }
      }
    }
  }
})
