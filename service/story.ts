import { CreateStoryRequest, StoryListResponse } from '@/interfaces/story'
import axiosInstance from '@/lib/axios'

class StoryService {
  private readonly BASE_URL = '/api/v1/stories'

  async getStories(
    offset: number = 0,
    limit: number = 50
  ): Promise<StoryListResponse> {
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString()
    })

    const { data } = await axiosInstance.get<StoryListResponse>(
      `${this.BASE_URL}?${params.toString()}`,
      {
        params: { offset, limit }
      }
    )
    return data
  }

  async createStory(request: CreateStoryRequest): Promise<void> {
    await axiosInstance.post(`/api/v1/stories`, {
      ...request
    })
  }
  async updateStory(
    uuid: string,
    request: Partial<CreateStoryRequest>
  ): Promise<void> {
    await axiosInstance.put(`/api/v1/stories/${uuid}`, {
      ...request
    })
  }
}

export const storyService = new StoryService()
