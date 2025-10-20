export interface Category {
  created_at: string
  description: string
  name: string
  type: CategoryType
  updated_at: string
  uuid: string
}

export interface CategoryListResponse {
  data: Category[]
  status: string
}

export enum CategoryType {
  VERSE = 'verse',
  STORY = 'story'
}

export interface CreateCategoryRequest {
  name: string
  description: string
  type: CategoryType
}
