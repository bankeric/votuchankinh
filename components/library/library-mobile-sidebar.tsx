'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, X } from 'lucide-react'
import {
  Category,
  CategoryAuthorGroup,
  CategoryType
} from '@/interfaces/category'
import { Story } from '@/interfaces/story'

interface TocItem {
  id: string
  title: string
}

interface TocChapter {
  id: string
  title: string
  items: TocItem[]
}

interface StoryItem {
  id: string
  title: { vi: string; en: string }
}

interface LibraryMobileSidebarProps {
  isMobileSidebarOpen: boolean
  setIsMobileSidebarOpen: (open: boolean) => void
  activeTab: CategoryType
  setActiveTab: (tab: CategoryType) => void
  keSubTab: CategoryAuthorGroup
  setKeSubTab: (tab: CategoryAuthorGroup) => void
  storySubTab: CategoryAuthorGroup
  setStorySubTab: (tab: CategoryAuthorGroup) => void
  expandedSection: string
  selectedStory?: Story
  storyId: string
  setStoryId: (id: string) => void
  onChapterClick: (chapterId: string) => void
  onItemClick: (itemId: Story) => void
  getCurrentChapters: () => Category[]
  getCurrentStories: () => Category[]
  language: 'vi' | 'en'
  tocData: TocChapter[]
  storyData: any[]
}

export function LibraryMobileSidebar({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  activeTab,
  setActiveTab,
  keSubTab,
  setKeSubTab,
  storySubTab,
  setStorySubTab,
  expandedSection,
  storyId,
  setStoryId,
  onChapterClick,
  onItemClick,
  getCurrentChapters,
  getCurrentStories,
  language,
  tocData,
  storyData,
  selectedStory
}: LibraryMobileSidebarProps) {
  return (
    <AnimatePresence>
      {isMobileSidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className='md:hidden fixed inset-0 bg-black/50 z-[90]'
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className='md:hidden fixed left-0 top-0 h-full w-80 bg-[#EFE0BD] border-r border-[#8B4513]/20 z-[100] shadow-2xl'
          >
            <div className='p-4 space-y-4 flex flex-col h-full'>
              {/* Top row: Home button (left) and Close button (right) */}
              <div className='flex justify-between items-center flex-shrink-0'>
                <Link
                  href='/'
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className='flex items-center space-x-2 text-[#8B4513]/80 hover:text-[#8B4513] hover:bg-[#D4AF8C]/30 p-2 rounded-lg transition-colors'
                >
                  <ArrowLeft className='w-4 h-4' />
                  <span className='font-serif text-sm'>Trang chủ</span>
                </Link>

                <button
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className='p-2 text-[#8B4513]/70 hover:text-[#8B4513] hover:bg-[#D4AF8C]/30 rounded-full transition-colors'
                >
                  <X className='w-5 h-5' />
                </button>
              </div>

              {/* Content toggles - Original style capsule */}
              <div className='flex justify-center flex-shrink-0'>
                <div className='rounded-full border-2 border-[#8B1E1E] p-0.5 bg-[#FAF2E2] shadow-[0_2px_0_rgba(139,30,30,0.25)]'>
                  <div className='flex items-center h-10 gap-0.1 px-0.1'>
                    <button
                      onClick={() => {
                        setActiveTab(CategoryType.VERSE)
                        // Auto-select first sutra item when switching to Kệ
                        if (tocData[0] && tocData[0].items[0]) {
                          // setExpandedSection(tocData[0].id)
                          // setSelectedSutraItem(tocData[0].items[0].id)
                        }
                      }}
                      className={`px-3 h-6 inline-flex items-center justify-center text-xs font-serif transition-colors rounded-full ${
                        activeTab === CategoryType.VERSE
                          ? 'bg-[#8B1E1E] text-white hover:bg-[#A12222]'
                          : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/10'
                      }`}
                    >
                      Kệ
                    </button>
                    <button
                      onClick={() => {
                        setActiveTab(CategoryType.STORY)
                        // Auto-select first story when switching to Câu Chuyện
                        if (
                          storyData &&
                          storyData[0] &&
                          storyData[0].items &&
                          storyData[0].items[0]
                        ) {
                          setStoryId(storyData[0].items[0].id)
                        }
                      }}
                      className={`px-2.5 h-6 inline-flex items-center justify-center text-xs font-serif transition-colors rounded-full ${
                        activeTab === 'story'
                          ? 'bg-[#8B1E1E] text-white hover:bg-[#A12222]'
                          : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/10'
                      }`}
                    >
                      Câu Chuyện
                    </button>
                  </div>
                </div>
              </div>

              {/* Content List */}
              <div className='flex-1 overflow-y-auto'>
                <div className='bg-[#EFE0BD]/90 backdrop-blur-sm border border-[#8B4513]/30 rounded-lg p-3 max-h-[calc(100vh-200px)] overflow-y-auto'>
                  {/* Sub-tabs cho Sư Tam Vô | Huynh Đệ - Trong khung mục lục Mobile */}
                  <div className='flex justify-center mb-3'>
                    <div className='rounded-full border border-[#8B1E1E] p-0.5 bg-[#FAF2E2] shadow-sm'>
                      <div className='flex items-center h-6 gap-0.1 px-0.1'>
                        <button
                          onClick={() => {
                            if (activeTab === CategoryType.VERSE) {
                              setKeSubTab(CategoryAuthorGroup.TAMVO)
                            } else {
                              setStorySubTab(CategoryAuthorGroup.TAMVO)
                            }
                          }}
                          className={`px-2 h-5 inline-flex items-center justify-center text-xs font-serif transition-colors rounded-full ${
                            (activeTab === CategoryType.VERSE
                              ? keSubTab
                              : storySubTab) === CategoryAuthorGroup.TAMVO
                              ? 'bg-[#8B1E1E] text-white'
                              : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/10'
                          }`}
                        >
                          Sư Tam Vô
                        </button>
                        <button
                          onClick={() => {
                            if (activeTab === CategoryType.VERSE) {
                              setKeSubTab(CategoryAuthorGroup.HUYNHDE)
                            } else {
                              setStorySubTab(CategoryAuthorGroup.HUYNHDE)
                            }
                          }}
                          className={`px-2 h-5 inline-flex items-center justify-center text-xs font-serif transition-colors rounded-full ${
                            (activeTab === CategoryType.VERSE
                              ? keSubTab
                              : storySubTab) === CategoryAuthorGroup.HUYNHDE
                              ? 'bg-[#8B1E1E] text-white'
                              : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/10'
                          }`}
                        >
                          Huynh Đệ
                        </button>
                      </div>
                    </div>
                  </div>

                  <h3 className='text-sm font-serif text-[#991b1b] mb-3 text-center'>
                    {activeTab === 'story' ? 'Câu Chuyện Ngộ Đạo' : 'Mục Lục'}
                  </h3>

                  <nav className='space-y-1'>
                    {activeTab === 'story' ? (
                      <>
                        {/* Danh sách câu chuyện theo sub-tab - Căn giữa */}
                        <div className='flex flex-col items-center space-y-1'>
                          {getCurrentStories().length > 0 ? (
                            getCurrentStories().map((story) => (
                              <button
                                key={story.uuid}
                                onClick={() => {
                                  setStoryId(story.uuid)
                                  setIsMobileSidebarOpen(false) // Close sidebar after selection
                                }}
                                className={`w-full max-w-xs text-center text-xs font-serif py-2 px-2 rounded transition-colors ${
                                  storyId === story.uuid
                                    ? 'text-[#991b1b] bg-[#991b1b]/20'
                                    : 'text-[#991b1b]/80 hover:text-[#991b1b] hover:bg-[#991b1b]/10'
                                }`}
                              >
                                {story.name}
                              </button>
                            ))
                          ) : (
                            <div className='text-center text-[#991b1b]/60 font-serif text-xs py-4'>
                              Không có câu chuyện nào
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Danh sách kệ theo sub-tab - Căn giữa */}
                        <div className='flex flex-col items-center space-y-1'>
                          {getCurrentChapters().map((chapter) => (
                            <div
                              key={chapter.uuid}
                              className='w-full max-w-xs'
                            >
                              <button
                                onClick={() => onChapterClick(chapter.uuid)}
                                className='w-full text-center text-xs font-serif text-[#991b1b]/80 hover:text-[#991b1b] py-1 px-2 rounded hover:bg-[#991b1b]/10 transition-colors'
                              >
                                {chapter.name}
                              </button>
                              {expandedSection === chapter.uuid && (
                                <div className='flex flex-col items-center space-y-0.5 animate-slide-down mt-1'>
                                  {chapter.stories.map((item, index) => (
                                    <button
                                      key={item.uuid}
                                      onClick={() => {
                                        onItemClick(item)
                                        setIsMobileSidebarOpen(false) // Close sidebar after selection
                                      }}
                                      className={`w-full text-center text-xs font-serif py-1 px-2 rounded transition-colors ${
                                        selectedStory?.uuid === item.uuid
                                          ? 'text-[#991b1b] bg-[#991b1b]/20'
                                          : 'text-[#991b1b]/60 hover:text-[#991b1b] hover:bg-[#991b1b]/5'
                                      }`}
                                    >
                                      <div className='flex flex-col items-center'>
                                        <div className='w-6 h-4 flex items-center justify-center bg-[#991b1b]/10 rounded-full mb-1'>
                                          <span className='text-xs font-bold text-[#991b1b]'>
                                            {index + 1}
                                          </span>
                                        </div>
                                        <span className='text-xs leading-tight text-center'>
                                          {item.title.replace(/^\d+\.\s*/, '')}
                                        </span>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </nav>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
