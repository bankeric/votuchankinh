'use client'

import { ManagementLayout } from '@/components/layout/management-layout'
import { useOnce } from '@/hooks/use-once'
import { User } from '@/interfaces/user'
import { useUserStore } from '@/store/users'
import {
  AlertCircle,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  Edit,
  Eye,
  Plus,
  Trash2
} from 'lucide-react'

export default function ManagementUsersPage() {
  const handleCreate = () => {}
  const handleView = (user: User) => {}
  const handleEdit = (user: User) => {}
  const { users, fetchUsers } = useUserStore()

  useOnce(() => {
    fetchUsers()
  }, [])
  return (
    <ManagementLayout>
      <div>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-2xl font-serif font-bold text-[#991b1b] mb-1'>
              User Management
            </h2>
            <p className='text-sm font-serif text-[#2c2c2c]/60'>
              Quản lý người dùng và quyền truy cập
            </p>
          </div>
          <button
            onClick={handleCreate}
            className='flex items-center space-x-2 px-4 py-2 bg-[#991b1b] text-[#f6efe0] rounded-xl font-serif text-sm border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030] hover:bg-[#7a1515] transition-colors'
          >
            <Plus className='w-4 h-4' />
            <span>Thêm người dùng</span>
          </button>
        </div>

        <div className='bg-[#f3ead7] border-2 border-[#2c2c2c] rounded-xl shadow-[0_4px_0_#00000030] overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-[#EFE0BD] border-b-2 border-[#2c2c2c]/20'>
                <tr>
                  <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                    Tên
                  </th>
                  <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                    Email
                  </th>
                  <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                    Vai trò
                  </th>
                  <th className='px-4 py-3 text-left font-serif text-sm font-semibold text-[#2c2c2c]'>
                    Đăng nhập cuối
                  </th>
                  <th className='px-4 py-3 text-right font-serif text-sm font-semibold text-[#2c2c2c]'>
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user.uuid}
                    className={`border-b border-[#2c2c2c]/10 hover:bg-[#EFE0BD]/50 transition-colors ${
                      index === users.length - 1 ? 'border-b-0' : ''
                    }`}
                  >
                    <td className='px-4 py-3 font-serif text-sm text-[#2c2c2c]'>
                      {user.name}
                    </td>
                    <td className='px-4 py-3 font-serif text-sm text-[#2c2c2c]'>
                      {user.email}
                    </td>
                    <td className='px-4 py-3'>
                      <span className='px-2 py-1 bg-[#991b1b]/10 text-[#991b1b] rounded-lg font-serif text-xs capitalize'>
                        {user.role}
                      </span>
                    </td>
                    <td className='px-4 py-3 font-serif text-sm text-[#2c2c2c]'>
                      {user.last_login_at ? user.last_login_at.toString() : ''}
                    </td>
                    <td className='px-4 py-3'>
                      <div className='flex items-center justify-end space-x-2'>
                        <button
                          onClick={() => handleView(user)}
                          className='p-1.5 hover:bg-[#2c2c2c]/10 rounded-lg transition-colors'
                          title='Xem'
                        >
                          <Eye className='w-4 h-4 text-[#2c2c2c]' />
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
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
        </div>
      </div>
    </ManagementLayout>
  )
}
