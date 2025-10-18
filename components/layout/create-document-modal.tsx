import React, { useState } from 'react'
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

interface CreateDocumentModalProps {
  open: boolean
  onClose: () => void
}

export const CreateDocumentModal = ({
  open,
  onClose
}: CreateDocumentModalProps) => {
  const [drawerMode, setDrawerMode] = useState<'create' | 'edit' | 'view'>(
    'create'
  )
  const [attachments, setAttachments] = useState<File[]>([])
  const [photos, setPhotos] = useState<File[]>([])

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value)
  }

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)])
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos([...photos, ...Array.from(e.target.files)])
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
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
                  {drawerMode === 'create'
                    ? 'Tạo tài liệu mới'
                    : drawerMode === 'edit'
                    ? 'Chỉnh sửa tài liệu'
                    : 'Chi tiết tài liệu'}
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
                      disabled={drawerMode === 'view'}
                    />
                  </div>

                  <div>
                    <label className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'>
                      Nội dung chi tiết
                    </label>

                    {/* Formatting Toolbar */}
                    {drawerMode !== 'view' && (
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
                    )}

                    {/* Content Editable Area */}
                    <div
                      contentEditable={drawerMode !== 'view'}
                      className={`w-full min-h-[200px] px-4 py-3 bg-white border-2 border-[#2c2c2c]/20 ${
                        drawerMode !== 'view' ? 'rounded-b-xl' : 'rounded-xl'
                      } font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b] overflow-auto`}
                      suppressContentEditableWarning
                    >
                      <p className='text-[#2c2c2c]/40'>
                        Nhập nội dung chi tiết tài liệu...
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'>
                      Tệp đính kèm
                    </label>

                    {drawerMode !== 'view' && (
                      <div className='mb-3'>
                        <input
                          type='file'
                          id='attachment-upload'
                          multiple
                          onChange={handleAttachmentUpload}
                          className='hidden'
                          accept='.pdf,.doc,.docx,.txt,.zip'
                        />
                        <button
                          type='button'
                          onClick={() =>
                            document
                              .getElementById('attachment-upload')
                              ?.click()
                          }
                          className='flex items-center gap-2 px-4 py-2 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] hover:bg-[#f3ead7] transition-colors'
                        >
                          <Paperclip className='w-4 h-4' />
                          <span>Chọn tệp đính kèm</span>
                        </button>
                      </div>
                    )}

                    {/* Attachment List */}
                    {attachments.length > 0 && (
                      <div className='space-y-2'>
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className='flex items-center justify-between p-3 bg-white border-2 border-[#2c2c2c]/20 rounded-xl'
                          >
                            <div className='flex items-center gap-3'>
                              <FileText className='w-5 h-5 text-[#991b1b]' />
                              <div>
                                <p className='font-serif text-sm text-[#2c2c2c]'>
                                  {file.name}
                                </p>
                                <p className='font-serif text-xs text-[#2c2c2c]/60'>
                                  {(file.size / 1024).toFixed(2)} KB
                                </p>
                              </div>
                            </div>
                            {drawerMode !== 'view' && (
                              <button
                                type='button'
                                onClick={() => removeAttachment(index)}
                                className='p-1 hover:bg-red-100 rounded-lg transition-colors'
                              >
                                <X className='w-4 h-4 text-red-600' />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className='block font-serif text-sm font-semibold text-[#2c2c2c] mb-2'>
                      Hình ảnh
                    </label>

                    {drawerMode !== 'view' && (
                      <div className='mb-3'>
                        <input
                          type='file'
                          id='photo-upload'
                          multiple
                          onChange={handlePhotoUpload}
                          className='hidden'
                          accept='image/*'
                        />
                        <button
                          type='button'
                          onClick={() =>
                            document.getElementById('photo-upload')?.click()
                          }
                          className='flex items-center gap-2 px-4 py-2 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] hover:bg-[#f3ead7] transition-colors'
                        >
                          <ImageIcon className='w-4 h-4' />
                          <span>Chọn hình ảnh</span>
                        </button>
                      </div>
                    )}

                    {/* Photo Grid */}
                    {photos.length > 0 && (
                      <div className='grid grid-cols-3 gap-3'>
                        {photos.map((file, index) => (
                          <div
                            key={index}
                            className='relative group'
                          >
                            <div className='aspect-square bg-white border-2 border-[#2c2c2c]/20 rounded-xl overflow-hidden'>
                              <img
                                src={
                                  URL.createObjectURL(file) ||
                                  '/placeholder.svg'
                                }
                                alt={file.name}
                                className='w-full h-full object-cover'
                              />
                            </div>
                            {drawerMode !== 'view' && (
                              <button
                                type='button'
                                onClick={() => removePhoto(index)}
                                className='absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity'
                              >
                                <X className='w-3 h-3' />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              {drawerMode !== 'view' && (
                <div className='flex items-center justify-end gap-3 p-6 border-t-2 border-[#2c2c2c]/20'>
                  <button
                    onClick={onClose}
                    className='px-6 py-2.5 bg-[#2c2c2c]/10 text-[#2c2c2c] rounded-xl font-serif text-sm hover:bg-[#2c2c2c]/20 transition-colors'
                  >
                    Hủy
                  </button>
                  <button className='px-6 py-2.5 bg-[#991b1b] text-[#f6efe0] rounded-xl font-serif text-sm border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030] hover:bg-[#7a1515] transition-colors'>
                    {drawerMode === 'create' ? 'Tạo tài liệu' : 'Lưu thay đổi'}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
