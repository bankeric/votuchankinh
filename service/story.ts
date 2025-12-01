import { CreateStoryRequest, StoryListResponse } from '@/interfaces/story'

class StoryService {
  async getStories(
    offset: number = 0,
    limit: number = 50
  ): Promise<StoryListResponse> {
    return {
      data: [],
      status: 'success'
    }
  }

  async createStory(request: CreateStoryRequest): Promise<void> {
    return
  }
  async updateStory(
    uuid: string,
    request: Partial<CreateStoryRequest>
  ): Promise<void> {
    return
  }

  async deleteStory(uuid: string) {
    return
  }
}

export const storyService = new StoryService()
