import React, { useState, useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bold,
  FileText,
  ImageIcon,
  Italic,
  LinkIcon,
  List,
  ListOrdered,
  Paperclip,
  Underline,
  X
} from 'lucide-react'
import { CreateStoryRequest, Story, StoryStatus } from '@/interfaces/story'
import { useCategoryStore } from '@/store/category'

interface CreateDocumentModalProps {
  open: boolean
  onClose: () => void
  onConfirm?: (data: CreateStoryRequest) => void
  story?: Story
}

export const CreateDocumentModal = ({
  open,
  onClose,
  onConfirm,
  story
}: CreateDocumentModalProps) => {
  const { list: listCategories } = useCategoryStore()
  const contentEditableRef = useRef<HTMLDivElement>(null)
  const [data, setData] = useState<CreateStoryRequest>({
    author: '',
    title: '',
    content: '',
    language: 'vi',
    category_id: '',
    status: StoryStatus.DRAFT
  })

  const formatText = (command: string, value?: string) => {
    if (contentEditableRef.current) {
      contentEditableRef.current.focus()
      document.execCommand(command, false, value)

      // Update the content state
      const newContent = contentEditableRef.current.innerHTML
      setData((prev) => ({
        ...prev,
        content: newContent
      }))
    }
  }

  const handleContentChange = () => {
    if (contentEditableRef.current) {
      const newContent = contentEditableRef.current.innerHTML
      setData((prev) => ({
        ...prev,
        content: newContent
      }))
    }
  }

  // Initialize placeholder when component mounts
  useEffect(() => {
    if (contentEditableRef.current && !data.content) {
      contentEditableRef.current.innerHTML =
        '<p style="color: #9ca3af;">Nhập nội dung chi tiết tài liệu...</p>'
    }
  }, [open])

  const handleConfirm = () => {
    if (onConfirm) {
      // Get the final content from the contentEditable div
      const finalContent = contentEditableRef.current?.innerHTML || data.content
      const dataToSubmit = {
        ...data,
        content: finalContent
      }
      console.log('Data to confirm:', dataToSubmit)
      onConfirm(dataToSubmit)
    }
    onClose()
  }

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  console.log('Current data state:', data)

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
              <div className='flex items-center justify-between p-6 border-b-2 border-[#2c2c2c]/20'>
                <h3 className='text-2xl font-serif font-bold text-[#991b1b]'>
                  Tài liệu
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
                      Tiêu đề
                    </label>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b]'
                      placeholder='Nhập tiêu đề tài liệu...'
                      name='title'
                      value={data.title}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'>
                      Tác giả
                    </label>
                    <input
                      type='text'
                      className='w-full px-4 py-3 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b]'
                      placeholder='Nhập tên tác giả...'
                      name='author'
                      value={data.author}
                      onChange={handleChange}
                    />
                  </div>

                  <div>
                    <label className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'>
                      Nội dung chi tiết
                    </label>

                    {/* Formatting Toolbar */}
                    <div className='flex items-center gap-1 p-2 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-t-xl border-b-0'>
                      <button
                        type='button'
                        onClick={() => formatText('bold')}
                        className='p-2 hover:bg-[#f3ead7] rounded-lg transition-colors'
                        title='Bold'
                      >
                        <Bold className='w-4 h-4 text-[#2c2c2c]' />
                      </button>
                      <button
                        type='button'
                        onClick={() => formatText('italic')}
                        className='p-2 hover:bg-[#f3ead7] rounded-lg transition-colors'
                        title='Italic'
                      >
                        <Italic className='w-4 h-4 text-[#2c2c2c]' />
                      </button>
                      <button
                        type='button'
                        onClick={() => formatText('underline')}
                        className='p-2 hover:bg-[#f3ead7] rounded-lg transition-colors'
                        title='Underline'
                      >
                        <Underline className='w-4 h-4 text-[#2c2c2c]' />
                      </button>
                      <div className='w-px h-6 bg-[#2c2c2c]/20 mx-1' />
                      <button
                        type='button'
                        onClick={() => formatText('insertUnorderedList')}
                        className='p-2 hover:bg-[#f3ead7] rounded-lg transition-colors'
                        title='Bullet List'
                      >
                        <List className='w-4 h-4 text-[#2c2c2c]' />
                      </button>
                      <button
                        type='button'
                        onClick={() => formatText('insertOrderedList')}
                        className='p-2 hover:bg-[#f3ead7] rounded-lg transition-colors'
                        title='Numbered List'
                      >
                        <ListOrdered className='w-4 h-4 text-[#2c2c2c]' />
                      </button>
                      <div className='w-px h-6 bg-[#2c2c2c]/20 mx-1' />
                      <button
                        type='button'
                        onClick={() => {
                          const url = prompt('Nhập URL:')
                          if (url) formatText('createLink', url)
                        }}
                        className='p-2 hover:bg-[#f3ead7] rounded-lg transition-colors'
                        title='Insert Link'
                      >
                        <LinkIcon className='w-4 h-4 text-[#2c2c2c]' />
                      </button>
                    </div>

                    {/* Rich Text Editor */}
                    <div
                      ref={contentEditableRef}
                      contentEditable
                      onInput={handleContentChange}
                      className='w-full min-h-[200px] px-4 py-3 bg-white border-2 border-[#2c2c2c]/20 rounded-b-xl font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b] overflow-auto'
                      style={{ maxHeight: '300px' }}
                      suppressContentEditableWarning={true}
                      onBlur={() => {
                        if (contentEditableRef.current) {
                          const content =
                            contentEditableRef.current.innerHTML.trim()
                          if (
                            !content ||
                            content === '<p><br></p>' ||
                            content === '<br>'
                          ) {
                            contentEditableRef.current.innerHTML =
                              '<p style="color: #9ca3af;">Nhập nội dung chi tiết tài liệu...</p>'
                          }
                        }
                      }}
                      onFocus={() => {
                        if (contentEditableRef.current) {
                          const content = contentEditableRef.current.innerHTML
                          if (
                            content.includes(
                              'Nhập nội dung chi tiết tài liệu...'
                            )
                          ) {
                            contentEditableRef.current.innerHTML = ''
                          }
                        }
                      }}
                    />
                  </div>

                  {/* Select language */}
                  <div className='mt-4'>
                    <label
                      htmlFor='language'
                      className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'
                    >
                      Chọn ngôn ngữ
                    </label>
                    <select
                      id='language'
                      className='w-full px-4 py-3 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b]'
                      name='language'
                      value={data.language}
                      onChange={handleChange}
                    >
                      <option value='vi'>Tiếng Việt</option>
                      <option value='en'>English</option>
                    </select>
                  </div>

                  {/* Select category */}
                  <div className='mt-4'>
                    <label
                      htmlFor='language'
                      className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'
                    >
                      Chọn danh mục
                    </label>
                    <select
                      id='language'
                      className='w-full px-4 py-3 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b]'
                      name='category_id'
                      value={data.category_id}
                      onChange={handleChange}
                    >
                      {listCategories.map((category) => (
                        <option
                          key={category.uuid}
                          value={category.uuid}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select status */}
                  <div className='mt-4'>
                    <label
                      htmlFor='language'
                      className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'
                    >
                      Trạng thái
                    </label>
                    <select
                      id='language'
                      className='w-full px-4 py-3 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b]'
                      name='status'
                      value={data.status}
                      onChange={handleChange}
                    >
                      {Object.values(StoryStatus).map((status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className='flex items-center justify-end gap-3 p-6 border-t-2 border-[#2c2c2c]/20'>
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
                  {'Lưu thay đổi'}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
