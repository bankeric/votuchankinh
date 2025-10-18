'use client'
import { FeedLayout } from '@/components/layout/feed-layout'
import { useOnce } from '@/hooks/use-once'
import { useAuthStore } from '@/store/auth'
import { useFeedStore } from '@/store/feed'
import { Heart, MessageCircle, MoreVertical, Repeat2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function NewFeedPage() {
  const { user } = useAuthStore()
  const { list, fetchFeeds, likeFeed, reshareFeed } = useFeedStore()

  const formatTimeAgo = (dateString: string) => {
    // Thu, 16 Oct 2025 03:04:04 GMT -> many ago
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return 'vừa xong'
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} phút trước`
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`
  }

  const handleLike = async (postId: string) => {
    await likeFeed(postId)
  }

  const handleReshare = async (postId: string) => {
    await reshareFeed(postId, '')
  }

  const isLiked = (postId: string) => {
    return user
      ? list.some(
          (post) => post.uuid === postId && post.like_ids.includes(user.uuid)
        )
      : false
  }

  const isRetweeted = (postId: string) => {
    return user
      ? list.some(
          (post) => post.uuid === postId && post.retweet_ids.includes(user.uuid)
        )
      : false
  }

  useOnce(() => {
    fetchFeeds()
  })
  return (
    <FeedLayout>
      <div className='space-y-4'>
        {list.length > 0 ? (
          list.map((post) => (
            <div
              key={post.uuid}
              className='bg-white border-2 border-[#991b1b]/20 rounded-2xl p-5 shadow-[0_2px_0_#991b1b20] hover:shadow-[0_3px_0_#991b1b30] transition-all'
            >
              {/* User Info */}
              <div className='flex items-start gap-3 mb-4 relative'>
                {/* <img
                  src={post.user.avatarUrl || '/placeholder.svg'}
                  alt={post.user.displayName}
                  className='w-10 h-10 rounded-full border-2 border-[#d4af37]'
                /> */}
                <div className='flex-1'>
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold text-[#2c2c2c]'>
                      {post.user_info.name}
                    </span>
                    {/* <span className='text-sm text-[#2c2c2c]/50'>
                      @{post.user.username}
                    </span> */}
                    <span className='text-sm text-[#2c2c2c]/50'>·</span>
                    <span className='text-sm text-[#2c2c2c]/50'>
                      {formatTimeAgo(post.created_at)}
                    </span>
                  </div>
                </div>

                <div className='relative'>
                  <button className='p-2 text-[#2c2c2c]/50 hover:text-[#2c2c2c] hover:bg-[#EFE0BD] rounded-full transition-colors'>
                    <MoreVertical className='w-5 h-5' />
                  </button>

                  {/* {openMenuId === post.uuid && (
                    <div className='absolute right-0 top-full mt-1 w-40 bg-white border-2 border-[#991b1b]/20 rounded-xl shadow-[0_2px_0_#991b1b20] overflow-hidden z-20'>
                      <button
                        onClick={() => handleEdit(post.uuid)}
                        className='w-full px-4 py-2 text-left text-sm text-[#2c2c2c] hover:bg-[#EFE0BD] transition-colors'
                      >
                        Chỉnh sửa
                      </button>
                      <button
                        onClick={() => handleDelete(post.uuid)}
                        className='w-full px-4 py-2 text-left text-sm text-[#991b1b] hover:bg-[#EFE0BD] transition-colors'
                      >
                        Xóa
                      </button>
                    </div>
                  )} */}
                </div>
              </div>

              {/* User Caption */}
              {post.content && (
                <p className='text-[#2c2c2c] mb-4 leading-relaxed'>
                  {post.content}
                </p>
              )}

              {/* AI Response Card */}
              <div className='bg-[#EFE0BD] border border-[#d4af37]/30 rounded-xl p-4 mb-4'>
                <div className='flex items-center gap-2 mb-3'>
                  <div className='w-6 h-6 rounded-full bg-[#d4af37] flex items-center justify-center'>
                    <span className='text-xs text-[#2c2c2c] font-bold'>AI</span>
                  </div>
                  <span className='text-sm font-semibold text-[#991b1b]'>
                    {post.agent_info.name}
                  </span>
                </div>
                <p className='text-sm text-[#2c2c2c]/70 mb-2 italic'>
                  "{post.user_question}"
                </p>
                <p className='text-[#2c2c2c] leading-relaxed whitespace-pre-line'>
                  {post.agent_content}
                </p>
              </div>

              {/* Actions */}
              <div className='flex items-center gap-6 pt-3 border-t border-[#991b1b]/10'>
                <button
                  onClick={() => handleLike(post.uuid)}
                  className={`flex items-center gap-2 transition-colors ${
                    isLiked(post.uuid)
                      ? 'text-[#991b1b]'
                      : 'text-[#2c2c2c]/50 hover:text-[#991b1b]'
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isLiked(post.uuid) ? 'fill-current' : ''
                    }`}
                  />
                  <span className='text-sm font-medium'>
                    {post.like_ids.length}
                  </span>
                </button>
                <button
                  onClick={() => handleReshare(post.uuid)}
                  className={`flex items-center gap-2 transition-colors ${
                    isRetweeted(post.uuid)
                      ? 'text-[#d4af37]'
                      : 'text-[#2c2c2c]/50 hover:text-[#d4af37]'
                  }`}
                >
                  <Repeat2 className='w-5 h-5' />
                  <span className='text-sm font-medium'>
                    {post.retweet_ids.length}
                  </span>
                </button>
                <button className='flex items-center gap-2 text-[#2c2c2c]/50 hover:text-[#2c2c2c] transition-colors'>
                  <MessageCircle className='w-5 h-5' />
                  <span className='text-sm font-medium'>
                    {/* {post.commentsCount} */}
                  </span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className='text-center py-12'>
            <p className='text-[#2c2c2c]/50 mb-4'>Chưa có bài viết nào</p>
            <Link
              href='/ai'
              className='inline-block px-6 py-3 bg-[#991b1b] text-white rounded-full font-semibold hover:bg-[#7a1515] transition-colors'
            >
              Chia sẻ câu trả lời AI đầu tiên
            </Link>
          </div>
        )}
      </div>
    </FeedLayout>
  )
}
