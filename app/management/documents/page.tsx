'use client'

import React from 'react'
import { ManagementLayout } from '@/components/layout/management-layout'
import {
  AlertCircle,
  Check,
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

type FileStatus = 'draft' | 'approved' | 'archived'

interface FileItem {
  id: string
  title: string
  category: string
  tags: string[]
  uploadDate: Date
  uploadedBy: string
  status: FileStatus
}

// Mock data
const files: FileItem[] = [
  {
    id: '1',
    title: 'Kinh Kim Cương',
    category: 'Kinh',
    tags: ['Phật giáo', 'Thiền'],
    uploadDate: new Date('2024-01-15'),
    uploadedBy: 'Admin',
    status: 'approved'
  },
  {
    id: '2',
    title: 'Bài giảng Thiền Tông',
    category: 'Giác Ngộ',
    tags: ['Thiền', 'Giảng dạy'],
    uploadDate: new Date('2024-01-20'),
    uploadedBy: 'Contributor',
    status: 'draft'
  },
  {
    id: '3',
    title: 'Kệ Vấn Đáp',
    category: 'Kệ',
    tags: ['Kệ', 'Vấn đáp'],
    uploadDate: new Date('2024-01-10'),
    uploadedBy: 'Admin',
    status: 'approved'
  }
]

export default function ManagementDocumentsPage() {
  const [openModal, setOpenModal] = React.useState(false)
  const handleCreate = () => {
    setOpenModal(true)
  }
  const handleView = (file: FileItem) => {}
  const handleEdit = (file: FileItem) => {}

  const getStatusIcon = (status: FileStatus) => {
    switch (status) {
      case 'approved':
        return <Check className='w-3 h-3' />
      case 'draft':
        return <Clock className='w-3 h-3' />
      case 'archived':
        return <AlertCircle className='w-3 h-3' />
      default:
        return null
    }
  }

  const getStatusColor = (status: FileStatus) => {
    switch (status) {
      case 'approved':
        return 'text-green-700 bg-green-100'
      case 'draft':
        return 'text-yellow-700 bg-yellow-100'
      case 'archived':
        return 'text-gray-700 bg-gray-100'
      default:
        return 'text-gray-700 bg-gray-100'
    }
  }

  return (
    <ManagementLayout>
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
        <button
          onClick={handleCreate}
          className='flex items-center space-x-2 px-4 py-2 bg-[#991b1b] text-[#f6efe0] rounded-xl font-serif text-sm border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030] hover:bg-[#7a1515] transition-colors'
        >
          <Plus className='w-4 h-4' />
          <span>Tải lên tài liệu</span>
        </button>
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
                  Tags
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
              {files.map((file, index) => (
                <tr
                  key={file.id}
                  className={`border-b border-[#2c2c2c]/10 hover:bg-[#EFE0BD]/50 transition-colors ${
                    index === files.length - 1 ? 'border-b-0' : ''
                  }`}
                >
                  <td className='px-4 py-3 font-serif text-sm text-[#2c2c2c]'>
                    {file.title}
                  </td>
                  <td className='px-4 py-3 font-serif text-sm text-[#2c2c2c]'>
                    {file.category}
                  </td>
                  <td className='px-4 py-3'>
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
                  </td>
                  <td className='px-4 py-3 font-serif text-sm text-[#2c2c2c]'>
                    {file.uploadDate.toLocaleDateString('vi-VN')}
                  </td>
                  <td className='px-4 py-3'>
                    <span
                      className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg font-serif text-xs ${getStatusColor(
                        file.status
                      )}`}
                    >
                      {getStatusIcon(file.status)}
                      <span className='capitalize'>{file.status}</span>
                    </span>
                  </td>
                  <td className='px-4 py-3'>
                    <div className='flex items-center justify-end space-x-2'>
                      <button
                        onClick={() => handleView(file)}
                        className='p-1.5 hover:bg-[#2c2c2c]/10 rounded-lg transition-colors'
                        title='Xem'
                      >
                        <Eye className='w-4 h-4 text-[#2c2c2c]' />
                      </button>
                      <button
                        onClick={() => handleEdit(file)}
                        className='p-1.5 hover:bg-[#2c2c2c]/10 rounded-lg transition-colors'
                        title='Chỉnh sửa'
                      >
                        <Edit className='w-4 h-4 text-[#2c2c2c]' />
                      </button>
                      <button
                        className='p-1.5 hover:bg-red-100 rounded-lg transition-colors'
                        title='Xóa'
                      >
                        <Trash2 className='w-4 h-4 text-red-600' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className='flex items-center justify-between px-4 py-3 border-t-2 border-[#2c2c2c]/20 bg-[#EFE0BD]'>
          <p className='font-serif text-sm text-[#2c2c2c]'>
            Hiển thị 1-{files.length} của {files.length} kết quả
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

      {/* Modal */}
      <CreateDocumentModal
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </ManagementLayout>
  )
}
