'use client'

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

interface LibrarySidebarProps {
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
  translations: {
    vi: { tableOfContents: string }
    en: { tableOfContents: string }
  }
  language: 'vi' | 'en'
}

export function LibrarySidebar({
  activeTab,
  setActiveTab,
  keSubTab,
  setKeSubTab,
  storySubTab,
  setStorySubTab,
  expandedSection,
  selectedStory,
  storyId,
  setStoryId,
  onChapterClick,
  onItemClick,
  getCurrentChapters,
  getCurrentStories,
  translations,
  language
}: LibrarySidebarProps) {
  return (
    <aside className='hidden sm:block w-80 lg:w-96 mr-6 mt-16 ml-4'>
      {/* Capsule Toggle - moved to sidebar top */}
      <div className='flex justify-center mb-4'>
        <div className='rounded-full border-2 border-[#8B1E1E] p-1.5 bg-[#FAF2E2] shadow-[0_2px_0_rgba(139,30,30,0.25)]'>
          <div className='flex items-center h-10 gap-2 px-0.5'>
            <button
              onClick={() => setActiveTab(CategoryType.VERSE)}
              className={`px-5 sm:px-6 h-10 inline-flex items-center justify-center text-sm font-serif transition-colors rounded-full ${
                activeTab === CategoryType.VERSE
                  ? 'bg-[#8B1E1E] text-white hover:bg-[#A12222]'
                  : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/10'
              }`}
              aria-pressed={activeTab === CategoryType.VERSE}
            >
              Kệ
            </button>
            <button
              onClick={() => setActiveTab(CategoryType.STORY)}
              className={`px-5 sm:px-6 h-10 inline-flex items-center justify-center text-sm font-serif transition-colors rounded-full ${
                activeTab === 'story'
                  ? 'bg-[#8B1E1E] text-white hover:bg-[#A12222]'
                  : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/10'
              }`}
              aria-pressed={activeTab === 'story'}
            >
              Câu Chuyện
            </button>
          </div>
        </div>
      </div>

      <div
        className={`bg-[#EFE0BD]/90 backdrop-blur-sm border-2 border-[#2c2c2c]/30 rounded-2xl p-4 shadow ${
          activeTab === 'story'
            ? 'max-h-[calc(100vh-20rem)] overflow-y-auto'
            : 'max-h-[calc(100vh-20rem)] overflow-y-auto'
        }`}
      >
        {/* Sub-tabs cho Sư Tam Vô | Huynh Đệ - Trong khung mục lục */}
        <div className='flex justify-center mb-4'>
          <div className='rounded-full border border-[#8B1E1E] p-0.5 bg-[#FAF2E2] shadow-sm'>
            <div className='flex items-center h-8 gap-0.5 px-0.5'>
              <button
                onClick={() => {
                  if (activeTab === CategoryType.VERSE) {
                    setKeSubTab(CategoryAuthorGroup.TAMVO)
                  } else {
                    setStorySubTab(CategoryAuthorGroup.TAMVO)
                  }
                }}
                className={`px-3 h-7 inline-flex items-center justify-center text-sm font-serif transition-colors rounded-full ${
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
                className={`px-3 h-7 inline-flex items-center justify-center text-sm font-serif transition-colors rounded-full ${
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

        <h3 className='text-lg font-serif text-[#991b1b] mb-4 text-center'>
          {activeTab === 'story'
            ? 'Câu Chuyện Ngộ Đạo'
            : translations[language].tableOfContents}
        </h3>
        <nav className='space-y-2'>
          {activeTab === 'story' ? (
            <>
              {/* Danh sách câu chuyện theo sub-tab - Desktop - Căn giữa */}
              <div className='flex flex-col items-center space-y-2'>
                {getCurrentStories().length > 0 ? (
                  getCurrentStories().map((story) => (
                    <button
                      key={story.uuid}
                      onClick={() => {
                        setStoryId(story.uuid)
                        setActiveTab(CategoryType.STORY)
                      }}
                      className={`w-full max-w-sm text-center text-sm font-serif py-2 px-3 rounded transition-colors ${
                        storyId === story.uuid
                          ? 'text-[#991b1b] bg-[#991b1b]/20'
                          : 'text-[#991b1b]/80 hover:text-[#991b1b] hover:bg-[#991b1b]/10'
                      }`}
                    >
                      {story.name}
                    </button>
                  ))
                ) : (
                  <div className='text-center text-[#991b1b]/60 font-serif text-sm py-4'>
                    Không có câu chuyện nào
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <div className='flex flex-col space-y-3 items-center px-4'>
                {getCurrentChapters().map((chapter) => (
                  <div
                    key={chapter.uuid}
                    className='w-full'
                  >
                    <button
                      onClick={() => onChapterClick(chapter.uuid)}
                      className='w-[70%] max-w-sm mx-auto text-left text-sm font-serif text-[#991b1b]/80 hover:text-[#991b1b] py-2 px-3 rounded hover:bg-[#991b1b]/10 transition-colors flex items-center'
                    >
                      <span className='inline-block w-10 text-right font-bold mr-2'>
                        {chapter.name.match(/^\d+\./)?.[0]}
                      </span>
                      <span className='flex-1'>
                        {chapter.name.replace(/^\d+\.\s*/, '')}
                      </span>
                    </button>
                    {expandedSection === chapter.uuid && (
                      <div className='mt-2 space-y-1 animate-slide-down flex flex-col items-center w-full'>
                        {chapter.stories.map((item, index) => (
                          <button
                            key={item.uuid}
                            onClick={() => onItemClick(item)}
                            className={`w-[50%] max-w-md text-left text-xs font-serif py-1.5 px-3 rounded transition-colors ${
                              selectedStory?.uuid === item.uuid
                                ? 'text-[#991b1b] bg-[#991b1b]/15'
                                : 'text-[#991b1b]/60 hover:text-[#991b1b] hover:bg-[#991b1b]/8'
                            }`}
                          >
                            <span className='text-xs leading-relaxed'>
                              {item.title.replace(/^\d+\.\s*/, '')}
                            </span>
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
    </aside>
  )
}
