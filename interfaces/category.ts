import { Story } from './story'

export interface Category {
  created_at: string
  description: string
  name: string
  author_group: CategoryAuthorGroup
  type: CategoryType
  updated_at: string
  uuid: string
  stories: Story[]
}

export interface CategoryListResponse {
  data: Category[]
  status: string
}

export enum CategoryType {
  VERSE = 'verse',
  STORY = 'story'
}

export enum CategoryAuthorGroup {
  TAMVO = 'tamvo',
  HUYNHDE = 'huynhde'
}

export interface CreateCategoryRequest {
  name: string
  description: string
  type: CategoryType
  author_group: CategoryAuthorGroup
}
