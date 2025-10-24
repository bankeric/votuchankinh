import { CategoryAuthorGroup, CategoryType } from '@/interfaces/category'
import { Story, StoryStatus } from '@/interfaces/story'
import { useCategoryStore } from '@/store/category'
import { useStoryStore } from '@/store/story'
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Trash2
} from 'lucide-react'
import { useMemo, useState } from 'react'

interface DocumentTableProps {
  onEdit: (file: Story) => void
}

export const DocumentTable = ({ onEdit }: DocumentTableProps) => {
  const { list: storyList } = useStoryStore()
  return (
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
                onEdit={onEdit}
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
  )
}

const TableRow = ({
  item,
  index,
  onEdit
}: {
  item: Story
  index: number
  onEdit: (file: Story) => void
}) => {
  const [selectedType, setSelectedType] = useState<CategoryType>(
    CategoryType.VERSE
  )
  const [selectedAuthorGroup, setSelectedAuthorGroup] =
    useState<CategoryAuthorGroup>(CategoryAuthorGroup.TAMVO)

  const { list: categoryList } = useCategoryStore()
  const { updateStory, deleteStory, list: storyList } = useStoryStore()

  const handleCategoryChange = (newCategory: string) => {
    setSelectedType(newCategory as CategoryType)
  }

  const handleAuthorGroupChange = (newAuthorGroup: string) => {
    setSelectedAuthorGroup(newAuthorGroup as CategoryAuthorGroup)
  }

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
            onChange={(e) => handleSubcategoryChange(item.uuid, e.target.value)}
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
            <option value={StoryStatus.ARCHIVED}>Archived</option>
            <option value={StoryStatus.DRAFT}>Draft</option>
            <option value={StoryStatus.PUBLISHED}>Published</option>
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
            onClick={() => onEdit(item)}
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
