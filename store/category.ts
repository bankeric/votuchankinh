import { Category, CreateCategoryRequest } from '@/interfaces/category'
import { Language } from '@/interfaces/chat'
import { categoryService } from '@/service/category'
import { list } from 'postcss'
import { create } from 'zustand'
import { toast } from 'react-toastify'

interface CategoryState {
  list: Category[]

  fetchCategories(
    limit?: number,
    offset?: number,
    includeStories?: boolean,
    language?: Language
  ): void
  addCategory(category: CreateCategoryRequest): void
  updateCategory(uuid: string, category: Partial<CreateCategoryRequest>): void
  deleteCategory(uuid: string): void
}

export const useCategoryStore = create<CategoryState>()((set, get) => {
  return {
    list: [],

    fetchCategories: async (
      limit?: number,
      offset?: number,
      includeStories?: boolean,
      language?: Language
    ) => {
      try {
        const { data } = await categoryService.getCategories(
          offset,
          limit,
          includeStories,
          language
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
        toast.success('Danh mục đã được tạo thành công!')
      } catch (error) {
        console.error('Error adding category:', error)
        toast.error('Có lỗi xảy ra khi tạo danh mục. Vui lòng thử lại!')
      }
    },

    updateCategory: async (
      uuid: string,
      category: Partial<CreateCategoryRequest>
    ) => {
      try {
        await categoryService.updateCategory(uuid, category)
        const { data } = await categoryService.getCategories()
        set({ list: data })
        toast.success('Danh mục đã được cập nhật thành công!')
      } catch (error) {
        console.error('Error updating category:', error)
        toast.error('Có lỗi xảy ra khi cập nhật danh mục. Vui lòng thử lại!')
      }
    },

    deleteCategory: async (uuid: string) => {
      try {
        await categoryService.deleteCategory(uuid)
        const { data } = await categoryService.getCategories()
        set({ list: data })
        toast.success('Danh mục đã được xóa thành công!')
      } catch (error) {
        console.error('Error deleting category:', error)
        toast.error('Có lỗi xảy ra khi xóa danh mục. Vui lòng thử lại!')
      }
    }
  }
})
