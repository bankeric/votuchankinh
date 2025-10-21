'use client'

import React, { useMemo, useState } from 'react'
import { ManagementLayout } from '@/components/layout/management-layout'
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Eye,
  Plus,
  Trash2,
  X
} from 'lucide-react'
import { CreateDocumentModal } from '@/components/layout/create-document-modal'
import { useStoryStore } from '@/store/story'
import { CreateStoryRequest, Story, StoryStatus } from '@/interfaces/story'
import { useCategoryStore } from '@/store/category'
import { useOnce } from '@/hooks/use-once'
import {
  Category,
  CategoryAuthorGroup,
  CategoryType,
  CreateCategoryRequest
} from '@/interfaces/category'
import { CreateCategoryModal } from '@/components/layout/create-category-modal'
import { DocumentTable } from '@/components/management/document-table'
import { CategoryTable } from '@/components/management/category-table'

export default function ManagementDocumentsPage() {
  const [openModal, setOpenModal] = useState(false)
  const [selectedStory, setSelectedStory] = useState<Story>()
  const [selectedCategory, setSelectedCategory] = useState<Category>()
  const [openCategoryModal, setOpenCategoryModal] = useState(false)
  const {
    fetchStories,
    addStory,
    list: storyList,
    updateStory,
    deleteStory
  } = useStoryStore()
  const {
    fetchCategories,
    addCategory,
    updateCategory,
    list: categoryList
  } = useCategoryStore()

  useOnce(() => {
    fetchStories()
    fetchCategories()
  }, [])

  const handleCreate = () => {
    setOpenModal(true)
  }
  const handleDocumentEdit = (file: Story) => {
    setSelectedStory(file)
    setOpenModal(true)
  }

  const handleCreateCategory = () => {
    setOpenCategoryModal(true)
  }

  const handleCategoryEdit = (category: Category) => {
    setSelectedCategory(category)
    setOpenCategoryModal(true)
  }

  const onCloseModal = () => {
    setSelectedStory(undefined)
    setOpenModal(false)
  }

  const onCloseCategoryModal = () => {
    setSelectedCategory(undefined)
    setOpenCategoryModal(false)
  }

  const handleAddCategory = (request: CreateCategoryRequest) => {
    if (selectedCategory) {
      updateCategory(selectedCategory.uuid, request)
    } else {
      addCategory(request)
    }

    setOpenCategoryModal(false)
  }

  const handleAddDocument = (newStory: CreateStoryRequest) => {
    if (selectedStory) {
      updateStory(selectedStory.uuid, newStory)
    } else {
      addStory(newStory)
    }
    setOpenModal(false)
  }

  return (
    <ManagementLayout>
      <div>
        {/* Header */}
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-serif font-bold text-[#991b1b] mb-1'>
              Files & Documents
            </h2>
            <p className='text-sm font-serif text-[#2c2c2c]/60'>
              Quản lý tài liệu, kinh sách và nội dung
            </p>
          </div>
          <div className='flex items-center space-x-4'>
            <button
              onClick={handleCreateCategory}
              className='flex items-center space-x-2 px-4 py-2 bg-[#991b1b] text-[#f6efe0] rounded-xl font-serif text-sm border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030] hover:bg-[#7a1515] transition-colors'
            >
              <Plus className='w-4 h-4' />
              <span>Tạo danh mục</span>
            </button>
            <button
              onClick={handleCreate}
              className='flex items-center space-x-2 px-4 py-2 bg-[#991b1b] text-[#f6efe0] rounded-xl font-serif text-sm border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030] hover:bg-[#7a1515] transition-colors'
            >
              <Plus className='w-4 h-4' />
              <span>Tải lên tài liệu</span>
            </button>
          </div>
        </div>

        {/* Category Table */}
        <div>
          <h5 className='text-lg font-serif font-semibold text-[#2c2c2c] mb-2'>
            Danh sách danh mục
          </h5>
          <CategoryTable onEdit={handleCategoryEdit} />
        </div>

        {/* Document Table */}
        <div className='mt-10'>
          <h5 className='text-lg font-serif font-semibold text-[#2c2c2c] mb-2'>
            Danh sách tài liệu
          </h5>
          <DocumentTable onEdit={handleDocumentEdit} />
        </div>
      </div>

      <CreateDocumentModal
        open={openModal}
        onClose={onCloseModal}
        onConfirm={handleAddDocument}
        story={selectedStory}
      />
      <CreateCategoryModal
        open={openCategoryModal}
        onClose={onCloseCategoryModal}
        onConfirm={handleAddCategory}
        category={selectedCategory}
      />
    </ManagementLayout>
  )
}
