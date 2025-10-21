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
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette
} from 'lucide-react'
import { CreateStoryRequest, Story, StoryStatus } from '@/interfaces/story'
import { useCategoryStore } from '@/store/category'
import { CldUploadButton, CldUploadWidget } from 'next-cloudinary'

interface CreateDocumentModalProps {
  open: boolean
  onClose: () => void
  onConfirm?: (data: CreateStoryRequest) => void
  story?: Story
}

const preset =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'local-giacngo'

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
    status: StoryStatus.DRAFT,
    image_url: null,
    audio_url: null
  })
  const [selectedImages, setSelectedImages] = useState<string[]>([])

  useEffect(() => {
    if (story) {
      setData({
        author: story.author,
        title: story.title,
        content: story.content,
        language: story.language,
        category_id: story.category_id,
        status: story.status,
        image_url: story.image_url,
        audio_url: story.audio_url
      })
    }
  }, [story])

  useEffect(() => {
    if (!open) {
      // Reset data when modal is closed
      setData({
        author: '',
        title: '',
        content: '',
        language: 'vi',
        category_id: '',
        status: StoryStatus.DRAFT,
        image_url: null,
        audio_url: null
      })
    }
  }, [open])

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

  const setTextColor = (color: string) => {
    if (contentEditableRef.current) {
      contentEditableRef.current.focus()
      document.execCommand('foreColor', false, color)

      const newContent = contentEditableRef.current.innerHTML
      setData((prev) => ({
        ...prev,
        content: newContent
      }))
    }
  }

  const setTextAlign = (align: string) => {
    if (contentEditableRef.current) {
      contentEditableRef.current.focus()
      document.execCommand('justify' + align, false, '')

      const newContent = contentEditableRef.current.innerHTML
      setData((prev) => ({
        ...prev,
        content: newContent
      }))
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      const newImages: string[] = []

      Array.from(files).forEach((file) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          newImages.push(result)

          if (newImages.length === files.length) {
            setSelectedImages((prev) => [...prev, ...newImages])
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index))
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

                  {/* Image Upload */}
                  {/* <div>
                    <label className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'>
                      Hình ảnh
                    </label>
                    <div className='space-y-3'>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handleImageUpload}
                        className='hidden'
                        id='image-upload'
                        multiple
                      />
                      <label
                        htmlFor='image-upload'
                        className='flex items-center justify-center w-full px-4 py-3 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] hover:bg-[#f3ead7] transition-colors cursor-pointer'
                      >
                        <ImageIcon className='w-4 h-4 mr-2' />
                        Chọn hình ảnh
                      </label>
                      {selectedImages.length > 0 && (
                        <div className={`flex gap-3 ${selectedImages.length === 1 ? 'justify-center' : 'justify-start'}`}>
                          {selectedImages.map((image, index) => (
                            <div key={index} className='relative group'>
                              <img
                                src={image}
                                alt={`Preview ${index + 1}`}
                                className={`object-cover rounded-xl border-2 border-[#2c2c2c]/20 w-32 h-32`}
                              />
                              <button
                                type='button'
                                onClick={() => removeImage(index)}
                                className='absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100'
                              >
                                <X className='w-3 h-3' />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div> */}

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
                        onClick={() => setTextColor('#991b1b')}
                        className='p-2 hover:bg-[#f3ead7] rounded-lg transition-colors'
                        title='Màu đỏ'
                      >
                        <Palette className='w-4 h-4 text-[#991b1b]' />
                      </button>
                      <div className='w-px h-6 bg-[#2c2c2c]/20 mx-1' />
                      <button
                        type='button'
                        onClick={() => setTextAlign('Left')}
                        className='p-2 hover:bg-[#f3ead7] rounded-lg transition-colors'
                        title='Căn trái'
                      >
                        <AlignLeft className='w-4 h-4 text-[#2c2c2c]' />
                      </button>
                      <button
                        type='button'
                        onClick={() => setTextAlign('Center')}
                        className='p-2 hover:bg-[#f3ead7] rounded-lg transition-colors'
                        title='Căn giữa'
                      >
                        <AlignCenter className='w-4 h-4 text-[#2c2c2c]' />
                      </button>
                      <button
                        type='button'
                        onClick={() => setTextAlign('Right')}
                        className='p-2 hover:bg-[#f3ead7] rounded-lg transition-colors'
                        title='Căn phải'
                      >
                        <AlignRight className='w-4 h-4 text-[#2c2c2c]' />
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
                      dangerouslySetInnerHTML={{ __html: data.content }}
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

                  {/* Upload image */}
                  <div>
                    <label className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'>
                      Hình ảnh
                    </label>
                    {data.image_url ? (
                      <div className='relative w-fit'>
                        <img
                          src={data.image_url}
                          alt='Uploaded image'
                          className='w-full max-w-md h-auto rounded-xl border-2 border-[#2c2c2c]/20'
                        />
                        <button
                          onClick={() =>
                            setData((prev) => ({ ...prev, image_url: null }))
                          }
                          className='absolute top-2 right-2 p-1 bg-[#991b1b] text-white rounded-full hover:bg-[#7a1515] transition-colors'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    ) : (
                      <CldUploadWidget
                        uploadPreset={preset}
                        onSuccess={(result, { widget }) => {
                          setData((prev) => ({
                            ...prev,
                            image_url:
                              typeof result?.info === 'object' &&
                              result?.info?.secure_url
                                ? result.info.secure_url
                                : null
                          }))
                        }}
                        onQueuesEnd={(result, { widget }) => {
                          widget.close()
                        }}
                      >
                        {({ open }) => {
                          function handleOnClick() {
                            setData((prev) => ({ ...prev, image_url: null }))
                            open()
                          }
                          return (
                            <button
                              onClick={handleOnClick}
                              className='flex items-center gap-2 px-4 py-3 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] hover:bg-[#f3ead7] transition-colors'
                            >
                              <ImageIcon className='w-4 h-4' />
                              Tải lên hình ảnh
                            </button>
                          )
                        }}
                      </CldUploadWidget>
                    )}
                  </div>

                  {/* Upload audio  */}
                  <div>
                    <label className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'>
                      Âm thanh
                    </label>
                    {data.audio_url ? (
                      <div className='relative w-[400px]'>
                        <audio
                          src={data.audio_url}
                          controls
                          className='w-full max-w-md rounded-xl'
                        />
                        <button
                          onClick={() =>
                            setData((prev) => ({ ...prev, audio_url: null }))
                          }
                          className='absolute top-0 right-[-20px] p-1 bg-[#991b1b] text-white rounded-full hover:bg-[#7a1515] transition-colors'
                        >
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    ) : (
                      <CldUploadWidget
                        uploadPreset={preset}
                        onSuccess={(result, { widget }) => {
                          setData((prev) => ({
                            ...prev,
                            audio_url:
                              typeof result?.info === 'object' &&
                              result?.info?.secure_url
                                ? result.info.secure_url
                                : null
                          }))
                        }}
                        onQueuesEnd={(result, { widget }) => {
                          widget.close()
                        }}
                      >
                        {({ open }) => {
                          function handleOnClick() {
                            setData((prev) => ({ ...prev, audio_url: null }))
                            open()
                          }
                          return (
                            <button
                              onClick={handleOnClick}
                              className='flex items-center gap-2 px-4 py-3 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] hover:bg-[#f3ead7] transition-colors'
                            >
                              <ImageIcon className='w-4 h-4' />
                              Tải lên âm thanh
                            </button>
                          )
                        }}
                      </CldUploadWidget>
                    )}
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
