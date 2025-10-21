import {
  Category,
  CategoryAuthorGroup,
  CategoryType,
  CreateCategoryRequest
} from '@/interfaces/category'
import { Language } from '@/interfaces/chat'
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

interface CategoryTableProps {
  onEdit: (category: Category) => void
}

export const CategoryTable = ({ onEdit }: CategoryTableProps) => {
  const { list: categoryList } = useCategoryStore()
  return (
    <div className='bg-[#f3ead7] border-2 border-[#2c2c2c] rounded-xl shadow-[0_4px_0_#00000030] overflow-hidden'>
      <div className='overflow-x-auto'>
        <table className='w-full'>
          <thead className='bg-[#EFE0BD] border-b-2 border-[#2c2c2c]/20'>
            <tr>
              <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                Tên
              </th>
              <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                Mô tả
              </th>
              <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                Nhóm tác giả
              </th>
              <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                Loại
              </th>
              <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                Ngôn ngữ
              </th>
              <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                Ngày tạo
              </th>
              <th className='px-4 py-3 text-right font-serif text-sm font-semibold text-[#2c2c2c]'>
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {categoryList.map((item, index) => (
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
          Hiển thị 1-{categoryList.length} của {categoryList.length} kết quả
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
  item: Category
  index: number
  onEdit: (category: Category) => void
}) => {
  const {
    list: categoryList,
    updateCategory,
    deleteCategory
  } = useCategoryStore()

  const handleAuthorGroupChange = (value: CategoryAuthorGroup) => {
    updateCategory(item.uuid, { author_group: value })
  }

  const handleCategoryTypeChange = (value: CategoryType) => {
    updateCategory(item.uuid, { type: value })
  }

  const onDelete = (uuid: string) => {
    deleteCategory(uuid)
  }

  const handleCategoryLanguageChange = (value: Language) => {
    updateCategory(item.uuid, { language: value })
  }
  return (
    <tr
      className={`border-b border-[#2c2c2c]/10 hover:bg-[#EFE0BD]/50 transition-colors ${
        index === categoryList.length - 1 ? 'border-b-0' : ''
      }`}
    >
      <td className='px-4 py-3 font-serif text-sm text-[#2c2c2c]'>
        {item.name}
      </td>

      <td className='px-4 py-3 font-serif text-sm text-[#2c2c2c]'>
        {item.description}
      </td>

      <td className='px-4 py-3'>
        <div className='relative'>
          <select
            value={item.author_group}
            onChange={(e) =>
              handleAuthorGroupChange(e.target.value as CategoryAuthorGroup)
            }
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
            value={item.type}
            onChange={(e) =>
              handleCategoryTypeChange(e.target.value as CategoryType)
            }
            className='w-full px-3 py-1.5 pr-8 bg-white border border-[#2c2c2c]/20 rounded-lg font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b] appearance-none cursor-pointer hover:bg-[#EFE0BD]/30 transition-colors'
          >
            <option value={CategoryType.VERSE}>Kệ</option>
            <option value={CategoryType.STORY}>Câu chuyện</option>
          </select>
          <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2c2c2c]/60 pointer-events-none' />
        </div>
      </td>

      <td className='px-4 py-3'>
        <div className='relative'>
          <select
            value={item.language || ''}
            onChange={(e) =>
              handleCategoryLanguageChange(e.target.value as Language)
            }
            className='w-full px-3 py-1.5 pr-8 bg-white border border-[#2c2c2c]/20 rounded-lg font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b] appearance-none cursor-pointer hover:bg-[#EFE0BD]/30 transition-colors'
          >
            <option value=''>Chọn ngôn ngữ</option>
            <option value={Language.VI}>Tiếng Việt</option>
            <option value={Language.EN}>English</option>
          </select>
          <ChevronDown className='absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#2c2c2c]/60 pointer-events-none' />
        </div>
      </td>

      <td className='px-4 py-3 font-serif text-sm text-[#2c2c2c]'>
        {item.created_at}
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
            onClick={() => onDelete(item.uuid)}
          >
            <Trash2 className='w-4 h-4 text-red-600' />
          </button>
        </div>
      </td>
    </tr>
  )
}
