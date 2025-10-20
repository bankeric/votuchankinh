import { Category, CreateCategoryRequest } from '@/interfaces/category'
import { categoryService } from '@/service/category'
import { list } from 'postcss'
import { create } from 'zustand'

interface CategoryState {
  list: Category[]

  fetchCategories(
    limit?: number,
    offset?: number,
    includeStories?: boolean
  ): void
  addCategory(category: CreateCategoryRequest): void
}

export const useCategoryStore = create<CategoryState>()((set, get) => {
  return {
    list: [],

    fetchCategories: async (
      limit?: number,
      offset?: number,
      includeStories?: boolean
    ) => {
      try {
        const { data } = await categoryService.getCategories(
          offset,
          limit,
          includeStories
        )
        set({ list: data })
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },

    addCategory: async (category: CreateCategoryRequest) => {
      try {
        await categoryService.createCategory(category)
        const { data } = await categoryService.getCategories()
        set({ list: data })
      } catch (error) {
        console.error('Error adding category:', error)
      }
    }
  }
})
