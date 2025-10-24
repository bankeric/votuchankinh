import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import {
  Category,
  CategoryAuthorGroup,
  CategoryType,
  CreateCategoryRequest
} from '@/interfaces/category'
import { Language } from '@/interfaces/chat'

interface CreateCategoryModalProps {
  open: boolean
  onClose: () => void
  category?: Category
  onConfirm?: (data: CreateCategoryRequest) => void
}

export const CreateCategoryModal = ({
  open,
  onClose,
  category,
  onConfirm
}: CreateCategoryModalProps) => {
  const [data, setData] = useState<CreateCategoryRequest>({
    name: '',
    description: '',
    type: CategoryType.STORY,
    author_group: CategoryAuthorGroup.TAMVO,
    language: Language.VI
  })

  useEffect(() => {
    if (category) {
      setData({
        name: category.name,
        description: category.description,
        type: category.type,
        author_group: category.author_group,
        language: category.language
      })
    }
  }, [category])

  useEffect(() => {
    if (!open) {
      setData({
        name: '',
        description: '',
        type: CategoryType.STORY,
        author_group: CategoryAuthorGroup.TAMVO,
        language: Language.VI
      })
    }
  }, [open])

  const handleConfirm = () => {
    if (onConfirm) {
      if (!data.name || !data.description) {
        alert('Vui lòng điền đầy đủ thông tin bắt buộc.')
        return
      }
      onConfirm(data)
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='w-full max-w-3xl max-h-[90vh] bg-[#f3ead7] border-2 border-[#2c2c2c] rounded-2xl shadow-[0_8px_0_#00000030] overflow-hidden flex flex-col'>
              {/* Header */}
              <div className='flex items-center justify-between p-6'>
                <h3 className='text-2xl font-serif font-bold text-[#991b1b]'>
                  Danh mục
                </h3>
                <button
                  onClick={onClose}
                  className='p-2 hover:bg-[#EFE0BD] rounded-lg transition-colors'
                >
                  <X className='w-5 h-5 text-[#2c2c2c]' />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className='flex-1 overflow-y-auto p-6'>
                <div className='space-y-6'>
                  {/* Title */}
                  <div>
                    <label className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'>
                      Tên danh mục *
                    </label>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b]'
                      placeholder='Nhập tên danh mục...'
                      value={data.name}
                      onChange={(e) =>
                        setData({ ...data, name: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'>
                      Mô tả danh mục *
                    </label>
                    <textarea
                      className='w-full px-4 py-3 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b]'
                      placeholder='Nhập mô tả danh mục...'
                      value={data.description}
                      onChange={(e) =>
                        setData({ ...data, description: e.target.value })
                      }
                    />
                  </div>

                  <div>
                    <label className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'>
                      Loại danh mục *
                    </label>
                    <select
                      className='w-full px-4 py-3 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b]'
                      defaultValue={data.type}
                      onChange={(e) =>
                        setData({
                          ...data,
                          type: e.target.value as CategoryType
                        })
                      }
                    >
                      <option value={CategoryType.VERSE}>Kệ</option>
                      <option value={CategoryType.STORY}>Câu chuyện</option>
                    </select>
                  </div>

                  <div>
                    <label className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'>
                      Nhóm tác giả *
                    </label>
                    <select
                      className='w-full px-4 py-3 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b]'
                      defaultValue={data.author_group}
                      onChange={(e) =>
                        setData({
                          ...data,
                          author_group: e.target.value as CategoryAuthorGroup
                        })
                      }
                    >
                      <option value={CategoryAuthorGroup.TAMVO}>
                        Sư Tam Vô
                      </option>
                      <option value={CategoryAuthorGroup.HUYNHDE}>
                        Huynh Đệ
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'>
                      Ngôn ngữ *
                    </label>
                    <select
                      className='w-full px-4 py-3 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b]'
                      defaultValue={data.language}
                      onChange={(e) =>
                        setData({
                          ...data,
                          language: e.target.value as Language
                        })
                      }
                    >
                      <option value={Language.VI}>Tiếng Việt</option>
                      <option value={Language.EN}>English</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}

              <div className='flex items-center justify-end gap-3 p-6'>
                <button
                  onClick={onClose}
                  className='px-6 py-2.5 bg-[#2c2c2c]/10 text-[#2c2c2c] rounded-xl font-serif text-sm hover:bg-[#2c2c2c]/20 transition-colors'
                >
                  Hủy
                </button>
                <button
                  className='px-6 py-2.5 bg-[#991b1b] text-[#f6efe0] rounded-xl font-serif text-sm border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030] hover:bg-[#7a1515] transition-colors'
                  onClick={handleConfirm}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
