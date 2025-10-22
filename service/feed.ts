import { CreateFeedRequest, FeedListResponse } from '@/interfaces/feed'
import axiosInstance from '@/lib/axios'

class FeedService {
  private readonly BASE_URL = '/api/v1/feeds'

  async getFeeds(
    userId?: string,
    offset: number = 0,
    limit: number = 50
  ): Promise<FeedListResponse> {
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString()
    })

    const { data } = await axiosInstance.get<FeedListResponse>(
      `${this.BASE_URL}?${params.toString()}`,
      {
        params: { offset, limit, userId }
      }
    )
    return data
  }

  async likeFeed(feedId: string): Promise<void> {
    await axiosInstance.post(`/api/v1/feed/${feedId}/like`)
  }

  async reshareFeed(feedId: string, content: string): Promise<void> {
    await axiosInstance.post(`/api/v1/feed/${feedId}/retweet`, { content })
  }

  async createFeed(params: CreateFeedRequest): Promise<void> {
    await axiosInstance.post(`/api/v1/feed`, params)
  }
}

export const feedService = new FeedService()
