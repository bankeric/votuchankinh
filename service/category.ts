import {
  CategoryListResponse,
  CreateCategoryRequest
} from '@/interfaces/category'
import { Language } from '@/interfaces/chat'
import axiosInstance from '@/lib/axios'

class CategoryService {
  private readonly BASE_URL = '/api/v1/categories'

  async getCategories(
    offset: number = 0,
    limit: number = 50,
    includeStories: boolean = false,
    language?: Language
  ): Promise<CategoryListResponse> {
    const { data } = await axiosInstance.get<CategoryListResponse>(
      `${this.BASE_URL}`,
      {
        params: { offset, limit, include_stories: includeStories, language }
      }
    )
    return data
  }

  async createCategory(request: CreateCategoryRequest): Promise<void> {
    await axiosInstance.post(`/api/v1/categories`, {
      ...request
    })
  }

  async updateCategory(
    uuid: string,
    category: Partial<CreateCategoryRequest>
  ): Promise<void> {
    await axiosInstance.put(`/api/v1/categories/${uuid}`, {
      ...category
    })
  }

  async deleteCategory(uuid: string): Promise<void> {
    await axiosInstance.delete(`/api/v1/categories/${uuid}`)
  }
}

export const categoryService = new CategoryService()
