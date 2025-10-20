import {
  CategoryListResponse,
  CreateCategoryRequest
} from '@/interfaces/category'
import axiosInstance from '@/lib/axios'

class CategoryService {
  private readonly BASE_URL = '/api/v1/categories'

  async getCategories(
    offset: number = 0,
    limit: number = 50
  ): Promise<CategoryListResponse> {
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString()
    })

    const { data } = await axiosInstance.get<CategoryListResponse>(
      `${this.BASE_URL}?${params.toString()}`,
      {
        params: { offset, limit }
      }
    )
    return data
  }

  async createCategory(request: CreateCategoryRequest): Promise<void> {
    await axiosInstance.post(`/api/v1/categories`, {
      ...request
    })
  }
}

export const categoryService = new CategoryService()
