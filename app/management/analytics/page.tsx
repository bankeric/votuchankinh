import { ManagementLayout } from '@/components/layout/management-layout'
import { BarChart3, FileText, Users } from 'lucide-react'

export default function ManagementAnalyticsPage() {
  return (
    <ManagementLayout>
      <div>
        <h2 className='text-2xl font-serif font-bold text-[#991b1b] mb-6'>
          Analytics Dashboard
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          {[
            { label: 'Tổng tài liệu', value: '156', icon: FileText },
            { label: 'Người dùng', value: '1,234', icon: Users },
            { label: 'Truy cập hôm nay', value: '456', icon: BarChart3 },
            { label: 'Tài liệu mới', value: '12', icon: FileText }
          ].map((stat, index) => (
            <div
              key={index}
              className='bg-[#f3ead7] border-2 border-[#2c2c2c] rounded-xl p-6 shadow-[0_4px_0_#00000030]'
            >
              <div className='flex items-center justify-between mb-4'>
                <stat.icon className='w-8 h-8 text-[#991b1b]' />
                <span className='text-3xl font-serif font-bold text-[#2c2c2c]'>
                  {stat.value}
                </span>
              </div>
              <p className='font-serif text-sm text-[#2c2c2c]/70'>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ManagementLayout>
  )
}
