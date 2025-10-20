import { CreateStoryRequest, Story } from '@/interfaces/story'
import { storyService } from '@/service/story'
import { create } from 'zustand'

interface StoryState {
  list: Story[]
  fetchStories: (limit?: number, offset?: number) => Promise<void>
  addStory: (story: CreateStoryRequest) => void
  updateStory: (uuid: string, story: Partial<CreateStoryRequest>) => void
}

export const useStoryStore = create<StoryState>()((set, get) => {
  return {
    list: [],
    fetchStories: async (limit?: number, offset?: number) => {
      // Fetch stories from API and update the list
      try {
        const { data } = await storyService.getStories(offset, limit)
        set({ list: data })
      } catch (error) {
        console.error('Error fetching stories:', error)
      }
    },
    addStory: async (story: CreateStoryRequest) => {
      // Add story to the list
      try {
        await storyService.createStory(story)
        const { data } = await storyService.getStories()
        set({ list: data })
      } catch (error) {
        console.error('Error adding story:', error)
      }
    },
    updateStory: async (uuid: string, story: Partial<CreateStoryRequest>) => {
      // Update story in the list
      try {
        await storyService.updateStory(uuid, story)
        const { data } = await storyService.getStories()
        set({ list: data })
      } catch (error) {
        console.error('Error updating story:', error)
      }
    }
  }
})
