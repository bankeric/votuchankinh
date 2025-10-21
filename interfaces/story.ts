export enum StoryStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export interface CreateStoryRequest {
  author: string
  title: string
  content: string
  language: string
  category_id: string
  status: StoryStatus
  image_url: string | null
  audio_url: string | null
}

export interface Story {
  author: string
  category_id: string
  content: string
  created_at: string
  language: string
  status: StoryStatus
  title: string
  updated_at: string
  uuid: string
  image_url: string | null
  audio_url: string | null
}

export interface StoryListResponse {
  data: Story[]
  status: string
}
