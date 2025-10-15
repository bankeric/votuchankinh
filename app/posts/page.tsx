'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Heart,
  Repeat2,
  MessageCircle,
  Home,
  Search,
  User,
  Bell,
  MoreVertical,
  UserPlus,
  TrendingUp,
  Hash,
  HelpCircle
} from 'lucide-react'

// Mock data for demonstration
const mockPosts = [
  {
    id: '1',
    user: {
      id: 'user1',
      displayName: 'Minh Tâm',
      username: 'minhtam',
      avatarUrl: '/buddhist-monk.jpg'
    },
    agentResponse: {
      agentName: 'Giác Ngộ',
      userQuestion: 'Làm thế nào để tìm thấy bình an trong tâm?',
      agentResponse:
        'Bình an không phải là điều ta tìm kiếm bên ngoài, mà là trạng thái ta nuôi dưỡng từ bên trong. Khi tâm không còn bám víu vào quá khứ, không lo âu về tương lai, chỉ an trú trong giây phút hiện tại - đó chính là bình an chân thật. Hãy bắt đầu bằng việc quan sát hơi thở, để tâm trở về với thân, và từ từ, bình an sẽ tự nhiên hiện ra.'
    },
    caption:
      'Lời dạy này đã giúp tôi tìm thấy sự bình yên trong những ngày khó khăn. Cảm ơn Phật pháp!',
    likesCount: 15,
    resharesCount: 3,
    commentsCount: 7,
    createdAt: '2025-01-10T10:30:00Z',
    isLiked: false,
    isReshared: false
  },
  {
    id: '2',
    user: {
      id: 'user2',
      displayName: 'Thanh Hương',
      username: 'thanhhuong',
      avatarUrl: '/meditation-woman.jpg'
    },
    agentResponse: {
      agentName: 'Tâm An',
      userQuestion:
        'Tôi cảm thấy lo lắng về tương lai. Phật dạy gì về điều này?',
      agentResponse:
        'Lo lắng về tương lai là khổ đau mà tâm tự tạo ra. Đức Phật dạy rằng tương lai chưa đến, quá khứ đã qua, chỉ có hiện tại là thật. Hãy sống trọn vẹn trong từng khoảnh khắc, làm tốt những gì có thể làm hôm nay, và tin tưởng vào nhân quả. Khi ta gieo nhân lành, quả tốt sẽ đến một cách tự nhiên.'
    },
    caption:
      'Đúng vậy, sống trong hiện tại là chìa khóa để giải thoát khỏi lo âu.',
    likesCount: 8,
    resharesCount: 1,
    commentsCount: 4,
    createdAt: '2025-01-10T09:15:00Z',
    isLiked: true,
    isReshared: false
  },
  {
    id: '3',
    user: {
      id: 'user3',
      displayName: 'Tuệ Minh',
      username: 'tueminh',
      avatarUrl: '/zen-master.jpg'
    },
    agentResponse: {
      agentName: 'Kệ Vấn Ngộ',
      userQuestion: 'Thế nào là vô ngã?',
      agentResponse:
        'Vô ngã không phải là không có "ta",\nMà là thấy rõ "ta" chỉ là giả danh.\nNăm uẩn hợp lại tạm gọi thân,\nNhư mây trôi, như sóng vỗ bờ tan.\n\nChấp ngã sinh phiền não vô biên,\nThả bỏ ngã chấp, tâm thanh nhàn.\nVô ngã là thấy tánh không không,\nLà sống tự tại, không vướng mắc phàm trần.'
    },
    caption:
      'Bài kệ này thật sâu sắc. Mỗi lần đọc lại là một lần hiểu thêm về vô ngã.',
    likesCount: 22,
    resharesCount: 5,
    commentsCount: 12,
    createdAt: '2025-01-09T16:45:00Z',
    isLiked: false,
    isReshared: true
  }
]

const mockNotifications = [
  {
    id: 'notif1',
    type: 'like',
    user: {
      displayName: 'Thanh Hương',
      username: 'thanhhuong',
      avatarUrl: '/meditation-woman.jpg'
    },
    postId: '1',
    message: 'đã thích bài viết của bạn',
    timestamp: '2025-01-10T11:30:00Z',
    isRead: false
  },
  {
    id: 'notif2',
    type: 'comment',
    user: {
      displayName: 'Tuệ Minh',
      username: 'tueminh',
      avatarUrl: '/zen-master.jpg'
    },
    postId: '1',
    message: 'đã bình luận về bài viết của bạn',
    timestamp: '2025-01-10T10:45:00Z',
    isRead: false
  },
  {
    id: 'notif3',
    type: 'follow',
    user: {
      displayName: 'An Nhiên',
      username: 'annhien',
      avatarUrl: '/placeholder.svg'
    },
    message: 'đã bắt đầu theo dõi bạn',
    timestamp: '2025-01-10T09:20:00Z',
    isRead: false
  },
  {
    id: 'notif4',
    type: 'reshare',
    user: {
      displayName: 'Minh Đức',
      username: 'minhduc',
      avatarUrl: '/placeholder.svg'
    },
    postId: '2',
    message: 'đã chia sẻ lại bài viết của bạn',
    timestamp: '2025-01-09T18:30:00Z',
    isRead: true
  }
]

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<'recent' | 'viral'>('recent')
  const [posts, setPosts] = useState(mockPosts)
  const [viewMode, setViewMode] = useState<'all' | 'profile'>('all')
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const [notifications, setNotifications] = useState(mockNotifications)

  // Sort posts based on active tab
  const sortedPosts = [...posts].sort((a, b) => {
    if (activeTab === 'recent') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    } else {
      // Viral: sort by engagement (likes + reshares)
      const engagementA = a.likesCount + a.resharesCount
      const engagementB = b.likesCount + b.resharesCount
      return engagementB - engagementA
    }
  })

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isLiked: !post.isLiked,
            likesCount: post.isLiked ? post.likesCount - 1 : post.likesCount + 1
          }
        }
        return post
      })
    )
  }

  const handleReshare = (postId: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            isReshared: !post.isReshared,
            resharesCount: post.isReshared
              ? post.resharesCount - 1
              : post.resharesCount + 1
          }
        }
        return post
      })
    )
  }

  const handleEdit = (postId: string) => {
    console.log('[v0] Edit post:', postId)
    setOpenMenuId(null)
    // TODO: Implement edit functionality
  }

  const handleDelete = (postId: string) => {
    console.log('[v0] Delete post:', postId)
    setPosts(posts.filter((post) => post.id !== postId))
    setOpenMenuId(null)
  }

  const formatTimeAgo = (dateString: string) => {
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

  const currentUserProfile = {
    displayName: 'Minh Tâm',
    username: 'minhtam',
    avatarUrl: '/buddhist-monk.jpg',
    bio: 'Học Phật, tu tâm, sống an lạc. Chia sẻ những bài học từ Phật pháp và hành trình giác ngộ của bản thân.',
    postsCount: 24,
    followersCount: 156,
    followingCount: 89
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const markAsRead = (notifId: string) => {
    setNotifications(
      notifications.map((n) => (n.id === notifId ? { ...n, isRead: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className='w-4 h-4 text-[#991b1b]' />
      case 'comment':
        return <MessageCircle className='w-4 h-4 text-[#d4af37]' />
      case 'follow':
        return <UserPlus className='w-4 h-4 text-[#2c2c2c]' />
      case 'reshare':
        return <Repeat2 className='w-4 h-4 text-[#d4af37]' />
      default:
        return <Bell className='w-4 h-4 text-[#2c2c2c]' />
    }
  }

  const trendingSuggestions = {
    topics: ['ngã nhân', 'bình yên', 'giác ngộ', 'từ bi', 'thiền định'],
    keywords: ['vô ngã', 'nhân quả', 'tứ diệu đế', 'bát chánh đạo', 'niết bàn'],
    questions: [
      'A Di Đà nghĩa là gì?',
      'Cực Lạc Tây Phương là đâu?',
      'Làm sao để tu tập thiền?',
      'Vô thường có nghĩa gì?',
      'Phật dạy gì về khổ đau?'
    ]
  }

  return (
    <div className='min-h-screen bg-[#EFE0BD] font-serif'>
      {/* Tabs */}
      <div className='bg-white/50 border-b border-[#991b1b]/20 sticky top-0 z-10'>
        <div className='max-w-3xl mx-auto px-4'>
          {/* Icon Buttons */}
          <div className='flex items-center justify-center gap-2 py-3'>
            <button
              onClick={() => {
                setViewMode('all')
                setShowSearch(false)
              }}
              className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl
                border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                transition-colors ${
                  viewMode === 'all' && !showSearch
                    ? 'bg-[#d4af37] text-[#2c2c2c]'
                    : 'bg-[#f3ead7] text-[#1f1f1f] hover:bg-[#efe2c9]'
                }`}
              title='Trang chủ - Xem tất cả bài viết'
            >
              <Home className='w-4 h-4 md:w-5 md:h-5' />
            </button>

            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl
                border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                transition-colors ${
                  showSearch
                    ? 'bg-[#d4af37] text-[#2c2c2c]'
                    : 'bg-[#f3ead7] text-[#1f1f1f] hover:bg-[#efe2c9]'
                }`}
              title='Tìm kiếm người dùng hoặc chủ đề'
            >
              <Search className='w-4 h-4 md:w-5 md:h-5' />
            </button>

            <button
              onClick={() => {
                setViewMode('profile')
                setShowSearch(false)
              }}
              className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl
                border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                transition-colors ${
                  viewMode === 'profile' && !showSearch
                    ? 'bg-[#d4af37] text-[#2c2c2c]'
                    : 'bg-[#f3ead7] text-[#1f1f1f] hover:bg-[#efe2c9]'
                }`}
              title='Trang cá nhân - Xem bài viết của bạn'
            >
              <User className='w-4 h-4 md:w-5 md:h-5' />
            </button>

            <div className='relative'>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl
                  border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                  transition-colors relative ${
                    showNotifications
                      ? 'bg-[#d4af37] text-[#2c2c2c]'
                      : 'bg-[#f3ead7] text-[#1f1f1f] hover:bg-[#efe2c9]'
                  }`}
                title='Thông báo'
              >
                <Bell className='w-4 h-4 md:w-5 md:h-5' />
                {unreadCount > 0 && (
                  <span className='absolute -top-1 -right-1 w-5 h-5 bg-[#991b1b] text-white text-xs rounded-full flex items-center justify-center font-semibold'>
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className='absolute right-0 top-full mt-2 w-80 md:w-96 bg-white border-2 border-[#991b1b]/20 rounded-2xl shadow-[0_4px_0_#991b1b30] overflow-hidden z-20'>
                  {/* Header */}
                  <div className='flex items-center justify-between p-4 border-b border-[#991b1b]/10'>
                    <h3 className='text-lg font-bold text-[#2c2c2c]'>
                      Thông báo
                    </h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className='text-xs text-[#991b1b] hover:text-[#7a1515] font-semibold'
                      >
                        Đánh dấu đã đọc
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className='max-h-96 overflow-y-auto'>
                    {notifications.length === 0 ? (
                      <div className='p-8 text-center text-[#2c2c2c]/50'>
                        <Bell className='w-12 h-12 mx-auto mb-2 opacity-30' />
                        <p className='text-sm'>Chưa có thông báo nào</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => markAsRead(notif.id)}
                          className={`flex items-start gap-3 p-4 border-b border-[#991b1b]/5 hover:bg-[#EFE0BD]/30 transition-colors cursor-pointer ${
                            !notif.isRead ? 'bg-[#EFE0BD]/20' : ''
                          }`}
                        >
                          {/* User Avatar */}
                          <img
                            src={notif.user.avatarUrl || '/placeholder.svg'}
                            alt={notif.user.displayName}
                            className='w-10 h-10 rounded-full border-2 border-[#d4af37]'
                          />

                          {/* Notification Content */}
                          <div className='flex-1 min-w-0'>
                            <div className='flex items-start gap-2'>
                              <div className='flex-1'>
                                <p className='text-sm text-[#2c2c2c]'>
                                  <span className='font-semibold'>
                                    {notif.user.displayName}
                                  </span>{' '}
                                  <span className='text-[#2c2c2c]/70'>
                                    {notif.message}
                                  </span>
                                </p>
                                <p className='text-xs text-[#2c2c2c]/50 mt-1'>
                                  {formatTimeAgo(notif.timestamp)}
                                </p>
                              </div>
                              {/* Notification Type Icon */}
                              <div className='flex-shrink-0'>
                                {getNotificationIcon(notif.type)}
                              </div>
                            </div>
                          </div>

                          {/* Unread Indicator */}
                          {!notif.isRead && (
                            <div className='w-2 h-2 bg-[#991b1b] rounded-full flex-shrink-0 mt-2'></div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className='max-w-3xl mx-auto px-4 py-6'>
        {/* Search Bar */}
        {showSearch && (
          <div className='mb-4'>
            <input
              type='text'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder='Tìm kiếm người dùng hoặc chủ đề...'
              className='w-full px-4 py-3 bg-[#f3ead7] text-[#1f1f1f] placeholder-[#1f1f1f]/60 font-serif rounded-2xl
                border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                focus:outline-none focus:bg-[#efe2c9] transition-colors'
            />
          </div>
        )}

        {showSearch && !searchQuery && (
          <div className='mb-6 bg-white border-2 border-[#991b1b]/20 rounded-2xl p-5 shadow-[0_2px_0_#991b1b20]'>
            {/* Trending Topics */}
            <div className='mb-5'>
              <div className='flex items-center gap-2 mb-3'>
                <TrendingUp className='w-4 h-4 text-[#991b1b]' />
                <h3 className='text-sm font-bold text-[#2c2c2c]'>
                  Chủ đề nổi bật
                </h3>
              </div>
              <div className='flex flex-wrap gap-2'>
                {trendingSuggestions.topics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSearchQuery(topic)}
                    className='px-4 py-2 bg-[#EFE0BD] text-[#2c2c2c] rounded-full text-sm font-medium
                      border border-[#d4af37]/30 hover:bg-[#d4af37] hover:text-white transition-colors'
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Keywords */}
            <div className='mb-5'>
              <div className='flex items-center gap-2 mb-3'>
                <Hash className='w-4 h-4 text-[#d4af37]' />
                <h3 className='text-sm font-bold text-[#2c2c2c]'>
                  Từ khóa phổ biến
                </h3>
              </div>
              <div className='flex flex-wrap gap-2'>
                {trendingSuggestions.keywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => setSearchQuery(keyword)}
                    className='px-4 py-2 bg-[#f3ead7] text-[#2c2c2c] rounded-full text-sm font-medium
                      border border-[#2c2c2c]/20 hover:bg-[#2c2c2c] hover:text-white transition-colors'
                  >
                    #{keyword}
                  </button>
                ))}
              </div>
            </div>

            {/* Common Questions */}
            <div>
              <div className='flex items-center gap-2 mb-3'>
                <HelpCircle className='w-4 h-4 text-[#991b1b]' />
                <h3 className='text-sm font-bold text-[#2c2c2c]'>
                  Câu hỏi thường gặp
                </h3>
              </div>
              <div className='space-y-2'>
                {trendingSuggestions.questions.map((question) => (
                  <button
                    key={question}
                    onClick={() => setSearchQuery(question)}
                    className='w-full text-left px-4 py-3 bg-white border border-[#991b1b]/10 rounded-xl text-sm
                      text-[#2c2c2c] hover:bg-[#EFE0BD] hover:border-[#991b1b]/30 transition-colors'
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results Message */}
        {showSearch && searchQuery && (
          <div className='mb-4 p-4 bg-white/50 rounded-xl border border-[#d4af37]/30'>
            <p className='text-sm text-[#2c2c2c]/70'>
              Kết quả tìm kiếm cho:{' '}
              <span className='font-semibold text-[#991b1b]'>
                "{searchQuery}"
              </span>
            </p>
          </div>
        )}

        {/* Profile View Message */}
        {viewMode === 'profile' && (
          <div className='mb-6 bg-white border-2 border-[#991b1b]/20 rounded-2xl p-6 shadow-[0_2px_0_#991b1b20]'>
            {/* Profile Header */}
            <div className='flex items-start justify-between mb-4'>
              <div className='flex items-start gap-4'>
                {/* Profile Picture */}
                <img
                  src={currentUserProfile.avatarUrl || '/placeholder.svg'}
                  alt={currentUserProfile.displayName}
                  className='w-20 h-20 rounded-full border-3 border-[#d4af37] shadow-md'
                />

                {/* Name and Username */}
                <div className='flex-1'>
                  <h2 className='text-2xl font-bold text-[#2c2c2c] mb-1'>
                    {currentUserProfile.displayName}
                  </h2>
                  <p className='text-base text-[#2c2c2c]/60 mb-3'>
                    @{currentUserProfile.username}
                  </p>

                  {/* Bio */}
                  <p className='text-sm text-[#2c2c2c]/80 leading-relaxed mb-4 max-w-md'>
                    {currentUserProfile.bio}
                  </p>
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
                <p className='text-xl font-bold text-[#2c2c2c]'>
                  {currentUserProfile.postsCount}
                </p>
                <p className='text-sm text-[#2c2c2c]/60'>Bài viết</p>
              </div>
              <div className='text-center'>
                <p className='text-xl font-bold text-[#2c2c2c]'>
                  {currentUserProfile.followersCount}
                </p>
                <p className='text-sm text-[#2c2c2c]/60'>Người theo dõi</p>
              </div>
              <div className='text-center'>
                <p className='text-xl font-bold text-[#2c2c2c]'>
                  {currentUserProfile.followingCount}
                </p>
                <p className='text-sm text-[#2c2c2c]/60'>Đang theo dõi</p>
              </div>

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
        )}

        {!showSearch && (
          <div className='space-y-4'>
            {sortedPosts.map((post) => (
              <div
                key={post.id}
                className='bg-white border-2 border-[#991b1b]/20 rounded-2xl p-5 shadow-[0_2px_0_#991b1b20] hover:shadow-[0_3px_0_#991b1b30] transition-all'
              >
                {/* User Info */}
                <div className='flex items-start gap-3 mb-4 relative'>
                  <img
                    src={post.user.avatarUrl || '/placeholder.svg'}
                    alt={post.user.displayName}
                    className='w-10 h-10 rounded-full border-2 border-[#d4af37]'
                  />
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <span className='font-semibold text-[#2c2c2c]'>
                        {post.user.displayName}
                      </span>
                      <span className='text-sm text-[#2c2c2c]/50'>
                        @{post.user.username}
                      </span>
                      <span className='text-sm text-[#2c2c2c]/50'>·</span>
                      <span className='text-sm text-[#2c2c2c]/50'>
                        {formatTimeAgo(post.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className='relative'>
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === post.id ? null : post.id)
                      }
                      className='p-2 text-[#2c2c2c]/50 hover:text-[#2c2c2c] hover:bg-[#EFE0BD] rounded-full transition-colors'
                    >
                      <MoreVertical className='w-5 h-5' />
                    </button>

                    {openMenuId === post.id && (
                      <div className='absolute right-0 top-full mt-1 w-40 bg-white border-2 border-[#991b1b]/20 rounded-xl shadow-[0_2px_0_#991b1b20] overflow-hidden z-20'>
                        <button
                          onClick={() => handleEdit(post.id)}
                          className='w-full px-4 py-2 text-left text-sm text-[#2c2c2c] hover:bg-[#EFE0BD] transition-colors'
                        >
                          Chỉnh sửa
                        </button>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className='w-full px-4 py-2 text-left text-sm text-[#991b1b] hover:bg-[#EFE0BD] transition-colors'
                        >
                          Xóa
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* User Caption */}
                {post.caption && (
                  <p className='text-[#2c2c2c] mb-4 leading-relaxed'>
                    {post.caption}
                  </p>
                )}

                {/* AI Response Card */}
                <div className='bg-[#EFE0BD] border border-[#d4af37]/30 rounded-xl p-4 mb-4'>
                  <div className='flex items-center gap-2 mb-3'>
                    <div className='w-6 h-6 rounded-full bg-[#d4af37] flex items-center justify-center'>
                      <span className='text-xs text-[#2c2c2c] font-bold'>
                        AI
                      </span>
                    </div>
                    <span className='text-sm font-semibold text-[#991b1b]'>
                      {post.agentResponse.agentName}
                    </span>
                  </div>
                  <p className='text-sm text-[#2c2c2c]/70 mb-2 italic'>
                    "{post.agentResponse.userQuestion}"
                  </p>
                  <p className='text-[#2c2c2c] leading-relaxed whitespace-pre-line'>
                    {post.agentResponse.agentResponse}
                  </p>
                </div>

                {/* Actions */}
                <div className='flex items-center gap-6 pt-3 border-t border-[#991b1b]/10'>
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      post.isLiked
                        ? 'text-[#991b1b]'
                        : 'text-[#2c2c2c]/50 hover:text-[#991b1b]'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        post.isLiked ? 'fill-current' : ''
                      }`}
                    />
                    <span className='text-sm font-medium'>
                      {post.likesCount}
                    </span>
                  </button>
                  <button
                    onClick={() => handleReshare(post.id)}
                    className={`flex items-center gap-2 transition-colors ${
                      post.isReshared
                        ? 'text-[#d4af37]'
                        : 'text-[#2c2c2c]/50 hover:text-[#d4af37]'
                    }`}
                  >
                    <Repeat2 className='w-5 h-5' />
                    <span className='text-sm font-medium'>
                      {post.resharesCount}
                    </span>
                  </button>
                  <button className='flex items-center gap-2 text-[#2c2c2c]/50 hover:text-[#2c2c2c] transition-colors'>
                    <MessageCircle className='w-5 h-5' />
                    <span className='text-sm font-medium'>
                      {post.commentsCount}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!showSearch && sortedPosts.length === 0 && (
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
    </div>
  )
}
