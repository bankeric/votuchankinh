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
  CategoryAuthorGroup,
  CategoryType,
  CreateCategoryRequest
} from '@/interfaces/category'
import { CreateCategoryModal } from '@/components/layout/create-category-modal'

export default function ManagementDocumentsPage() {
  const [openModal, setOpenModal] = useState(false)
  const [selectedStory, setSelectedStory] = useState<Story>()
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
    list: categoryList
  } = useCategoryStore()

  useOnce(() => {
    fetchStories()
    fetchCategories()
  }, [])

  const handleCreate = () => {
    setOpenModal(true)
  }
  const handleEdit = (file: Story) => {
    setSelectedStory(file)
    setOpenModal(true)
  }
  const handleCreateCategory = () => {
    setOpenCategoryModal(true)
  }

  const onCloseModal = () => {
    setSelectedStory(undefined)
    setOpenModal(false)
  }
  // const handleView = (file: FileItem) => {}
  // const handleEdit = (file: FileItem) => {}

  const getStatusIcon = (status: StoryStatus) => {
    switch (status) {
      case StoryStatus.PUBLISHED:
        return <Check className='w-3 h-3' />
      case StoryStatus.DRAFT:
        return <Clock className='w-3 h-3' />
      case StoryStatus.ARCHIVED:
        return <AlertCircle className='w-3 h-3' />
      default:
        return null
    }
  }

  const getStatusColor = (status: StoryStatus) => {
    switch (status) {
      case StoryStatus.PUBLISHED:
        return 'text-green-700 bg-green-100'
      case StoryStatus.DRAFT:
        return 'text-yellow-700 bg-yellow-100'
      case StoryStatus.ARCHIVED:
        return 'text-gray-700 bg-gray-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  const handleSubcategoryChange = (fileId: string, newSubcategory: string) => {
    updateStory(fileId, { category_id: newSubcategory })
  }

  const handleStatusChange = (fileId: string, newStatus: StoryStatus) => {
    updateStory(fileId, { status: newStatus })
  }

  const handleAddCategory = (request: CreateCategoryRequest) => {
    addCategory(request)
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

  const TableRow = ({ item, index }: { item: Story; index: number }) => {
    const [selectedType, setSelectedType] = useState<CategoryType>(
      CategoryType.VERSE
    )
    const [selectedAuthorGroup, setSelectedAuthorGroup] =
      useState<CategoryAuthorGroup>(CategoryAuthorGroup.TAMVO)

    const handleCategoryChange = (newCategory: string) => {
      setSelectedType(newCategory as CategoryType)
    }

    const handleAuthorGroupChange = (newAuthorGroup: string) => {
      setSelectedAuthorGroup(newAuthorGroup as CategoryAuthorGroup)
    }

    const filteredCategories = useMemo(() => {
      return categoryList.filter(
        (category) =>
          category.type === selectedType &&
          category.author_group === selectedAuthorGroup
      )
    }, [categoryList, selectedType, selectedAuthorGroup])

    return (
      <tr
        className={`border-b border-[#2c2c2c]/10 hover:bg-[#EFE0BD]/50 transition-colors ${
          index === storyList.length - 1 ? 'border-b-0' : ''
        }`}
      >
        <td className='px-4 py-3 font-serif text-sm text-[#2c2c2c]'>
          {item.title}
        </td>

        <td className='px-4 py-3'>
          <div className='relative'>
            <select
              value={selectedType}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className='w-full px-3 py-1.5 pr-8 bg-white border border-[#2c2c2c]/20 rounded-lg font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b] appearance-none cursor-pointer hover:bg-[#EFE0BD]/30 transition-colors'
            >
              <option value={CategoryType.VERSE}>Kệ</option>
              <option value={CategoryType.STORY}>Câu Chuyện</option>
            </select>
            <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2c2c2c]/60 pointer-events-none' />
          </div>
        </td>

        <td className='px-4 py-3'>
          <div className='relative'>
            <select
              value={selectedType}
              onChange={(e) => handleAuthorGroupChange(e.target.value)}
              className='w-full px-3 py-1.5 pr-8 bg-white border border-[#2c2c2c]/20 rounded-lg font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b] appearance-none cursor-pointer hover:bg-[#EFE0BD]/30 transition-colors'
            >
              <option value={CategoryAuthorGroup.TAMVO}>Sư Tam Vô</option>
              <option value={CategoryAuthorGroup.HUYNHDE}>Huynh Đệ</option>
            </select>
            <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2c2c2c]/60 pointer-events-none' />
          </div>
        </td>

        <td className='px-4 py-3'>
          <div className='relative'>
            <select
              value={item.category_id}
              onChange={(e) =>
                handleSubcategoryChange(item.uuid, e.target.value)
              }
              className='w-full px-3 py-1.5 pr-8 bg-white border border-[#2c2c2c]/20 rounded-lg font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b] appearance-none cursor-pointer hover:bg-[#EFE0BD]/30 transition-colors'
            >
              <option value=''>Chọn...</option>

              {filteredCategories.map((category) => (
                <option
                  key={category.uuid}
                  value={category.uuid}
                >
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2c2c2c]/60 pointer-events-none' />
          </div>
        </td>

        {/* <td className='px-4 py-3'>
          <div className='flex flex-wrap gap-1'>
            {file.tags.map((tag) => (
                          <span
                            key={tag}
                            className='px-2 py-1 bg-[#991b1b]/10 text-[#991b1b] rounded-lg font-serif text-xs'
                          >
                            {tag}
                          </span>
                        ))}
          </div>
        </td> */}
        <td className='px-4 py-3 font-serif text-sm text-[#2c2c2c]'>
          {item.created_at}
        </td>

        <td className='px-4 py-3'>
          <div className='relative'>
            <select
              value={item.status}
              onChange={(e) =>
                handleStatusChange(item.uuid, e.target.value as StoryStatus)
              }
              className={`w-full px-3 py-1.5 pr-8 rounded-lg font-serif text-xs appearance-none cursor-pointer hover:opacity-80 transition-opacity border-2 ${getStatusColor(
                item.status
              )}`}
            >
              <option value='approved'>Approved</option>
              <option value='draft'>Draft</option>
              <option value='review'>Review</option>
            </select>
            <div className='absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none flex items-center gap-1'>
              {getStatusIcon(item.status)}
              <ChevronDown className='w-3 h-3' />
            </div>
          </div>
        </td>

        <td className='px-4 py-3'>
          <div className='flex items-center justify-end space-x-2'>
            {/* <button
                          onClick={() => handleView(file)}
                          className='p-1.5 hover:bg-[#2c2c2c]/10 rounded-lg transition-colors'
                          title='Xem'
                        >
                          <Eye className='w-4 h-4 text-[#2c2c2c]' />
                        </button> */}
            <button
              onClick={() => handleEdit(item)}
              className='p-1.5 hover:bg-[#2c2c2c]/10 rounded-lg transition-colors'
              title='Chỉnh sửa'
            >
              <Edit className='w-4 h-4 text-[#2c2c2c]' />
            </button>
            <button
              className='p-1.5 hover:bg-red-100 rounded-lg transition-colors'
              title='Xóa'
              onClick={() => deleteStory(item.uuid)}
            >
              <Trash2 className='w-4 h-4 text-red-600' />
            </button>
          </div>
        </td>
      </tr>
    )
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

        {/* Data Table */}
        <div className='bg-[#f3ead7] border-2 border-[#2c2c2c] rounded-xl shadow-[0_4px_0_#00000030] overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-[#EFE0BD] border-b-2 border-[#2c2c2c]/20'>
                <tr>
                  <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                    Tiêu đề
                  </th>
                  <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                    Danh mục
                  </th>
                  <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                    Nhóm tác giả
                  </th>
                  <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                    Danh mục phụ
                  </th>
                  <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                    Ngày tải
                  </th>
                  <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                    Trạng thái
                  </th>
                  <th className='px-4 py-3 text-right font-serif text-sm font-semibold text-[#2c2c2c]'>
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {storyList.map((item, index) => (
                  <TableRow
                    key={index}
                    item={item}
                    index={index}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className='flex items-center justify-between px-4 py-3 border-t-2 border-[#2c2c2c]/20 bg-[#EFE0BD]'>
            <p className='font-serif text-sm text-[#2c2c2c]'>
              Hiển thị 1-{storyList.length} của {storyList.length} kết quả
            </p>
            <div className='flex items-center space-x-2'>
              <button className='p-2 hover:bg-[#f3ead7] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                <ChevronLeft className='w-4 h-4 text-[#2c2c2c]' />
              </button>
              <button className='px-3 py-1 bg-[#991b1b] text-[#f6efe0] rounded-lg font-serif text-sm'>
                1
              </button>
              <button className='p-2 hover:bg-[#f3ead7] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
                <ChevronRight className='w-4 h-4 text-[#2c2c2c]' />
              </button>
            </div>
          </div>
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
        onClose={() => setOpenCategoryModal(false)}
        onConfirm={handleAddCategory}
      />
    </ManagementLayout>
  )
}
