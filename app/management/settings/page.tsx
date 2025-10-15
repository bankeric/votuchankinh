import { ManagementLayout } from '@/components/layout/management-layout'

export default function ManagementSettingPage() {
  return (
    <ManagementLayout>
      <div>
        <h2 className='text-2xl font-serif font-bold text-[#991b1b] mb-6'>
          System Settings
        </h2>
        <div className='bg-[#f3ead7] border-2 border-[#2c2c2c] rounded-xl p-6 shadow-[0_4px_0_#00000030]'>
          <p className='font-serif text-[#2c2c2c]'>
            Cài đặt hệ thống đang được phát triển...
          </p>
        </div>
      </div>
    </ManagementLayout>
  )
}
