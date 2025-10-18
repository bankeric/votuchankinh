'use client'
import { FeedLayout } from '@/components/layout/feed-layout'
import { useOnce } from '@/hooks/use-once'
import { useAuthStore } from '@/store/auth'
import { useFeedStore } from '@/store/feed'

export default function ProfilePage() {
  const { user } = useAuthStore()
  const { list, fetchFeeds } = useFeedStore()

  useOnce(() => {
    if (user) {
      fetchFeeds(user.uuid)
    }
  }, [user])
  return (
    <FeedLayout>
      <div className='mb-6 bg-white border-2 border-[#991b1b]/20 rounded-2xl p-6 shadow-[0_2px_0_#991b1b20]'>
        {/* Profile Header */}
        <div className='flex items-start justify-between mb-4'>
          <div className='flex items-start gap-4'>
            {/* Profile Picture */}
            {/* <img
              src={currentUserProfile.avatarUrl || '/placeholder.svg'}
              alt={currentUserProfile.displayName}
              className='w-20 h-20 rounded-full border-3 border-[#d4af37] shadow-md'
            /> */}

            {/* Name and Username */}
            <div className='flex-1'>
              <h2 className='text-2xl font-bold text-[#2c2c2c] mb-1'>
                {user?.name}
              </h2>
              <p className='text-base text-[#2c2c2c]/60 mb-3'>@{user?.email}</p>

              {/* Bio */}
              {/* <p className='text-sm text-[#2c2c2c]/80 leading-relaxed mb-4 max-w-md'>
                {currentUserProfile.bio}
              </p> */}
            </div>
          </div>

          {/* Edit Profile Button */}
          <button
            className='px-5 py-2 bg-[#f3ead7] text-[#2c2c2c] rounded-xl border-2 border-[#2c2c2c] 
                shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset] hover:bg-[#efe2c9] transition-colors text-sm font-semibold'
          >
            Chỉnh sửa
          </button>
        </div>

        {/* Stats */}
        <div className='flex items-center gap-6 pt-4 border-t border-[#991b1b]/10'>
          <div className='text-center'>
            <p className='text-xl font-bold text-[#2c2c2c]'>{list.length}</p>
            <p className='text-sm text-[#2c2c2c]/60'>Bài viết</p>
          </div>
          {/* <div className='text-center'>
            <p className='text-xl font-bold text-[#2c2c2c]'>
              {currentUserProfile.followersCount}
            </p>
            <p className='text-sm text-[#2c2c2c]/60'>Người theo dõi</p>
          </div> */}
          {/* <div className='text-center'>
            <p className='text-xl font-bold text-[#2c2c2c]'>
              {currentUserProfile.followingCount}
            </p>
            <p className='text-sm text-[#2c2c2c]/60'>Đang theo dõi</p>
          </div> */}

          <div className='flex-1 flex justify-end'>
            <button
              className='px-6 py-2 bg-[#991b1b] text-white rounded-xl border-2 border-[#991b1b] 
                  shadow-[0_2px_0_#991b1b20] hover:bg-[#7a1515] hover:border-[#7a1515] transition-colors text-sm font-semibold'
            >
              Theo dõi
            </button>
          </div>
        </div>
      </div>
    </FeedLayout>
  )
}
