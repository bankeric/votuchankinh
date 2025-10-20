'use client'

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
  activeTab: 'ke' | 'story'
  setActiveTab: (tab: 'ke' | 'story') => void
  keSubTab: 'su-tam-vo' | 'huynh-de'
  setKeSubTab: (tab: 'su-tam-vo' | 'huynh-de') => void
  storySubTab: 'su-tam-vo' | 'huynh-de'
  setStorySubTab: (tab: 'su-tam-vo' | 'huynh-de') => void
  expandedSection: string
  selectedSutraItem: string
  storyId: string
  setStoryId: (id: string) => void
  onChapterClick: (chapterId: string) => void
  onItemClick: (itemId: string) => void
  getCurrentChapters: () => TocChapter[]
  getCurrentStories: () => StoryItem[]
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
  selectedSutraItem,
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
              onClick={() => setActiveTab('ke')}
              className={`px-5 sm:px-6 h-10 inline-flex items-center justify-center text-sm font-serif transition-colors rounded-full ${
                activeTab === 'ke'
                  ? 'bg-[#8B1E1E] text-white hover:bg-[#A12222]'
                  : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/10'
              }`}
              aria-pressed={activeTab === 'ke'}
            >
              Kệ
            </button>
            <button
              onClick={() => setActiveTab('story')}
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

      <div className={`bg-[#EFE0BD]/90 backdrop-blur-sm border-2 border-[#2c2c2c]/30 rounded-2xl p-4 shadow ${
        activeTab === 'story'
          ? 'max-h-[calc(100vh-20rem)] overflow-y-auto'
          : 'max-h-[calc(100vh-20rem)] overflow-y-auto'
      }`}>
        {/* Sub-tabs cho Sư Tam Vô | Huynh Đệ - Trong khung mục lục */}
        <div className='flex justify-center mb-4'>
          <div className='rounded-full border border-[#8B1E1E] p-0.5 bg-[#FAF2E2] shadow-sm'>
            <div className='flex items-center h-8 gap-0.5 px-0.5'>
              <button
                onClick={() => {
                  if (activeTab === 'ke') {
                    setKeSubTab('su-tam-vo')
                  } else {
                    setStorySubTab('su-tam-vo')
                  }
                }}
                className={`px-3 h-7 inline-flex items-center justify-center text-sm font-serif transition-colors rounded-full ${
                  (activeTab === 'ke' ? keSubTab : storySubTab) === 'su-tam-vo'
                    ? 'bg-[#8B1E1E] text-white'
                    : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/10'
                }`}
              >
                Sư Tam Vô
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'ke') {
                    setKeSubTab('huynh-de')
                  } else {
                    setStorySubTab('huynh-de')
                  }
                }}
                className={`px-3 h-7 inline-flex items-center justify-center text-sm font-serif transition-colors rounded-full ${
                  (activeTab === 'ke' ? keSubTab : storySubTab) === 'huynh-de'
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
                {getCurrentStories().length > 0 ? getCurrentStories().map((story) => (
                  <button
                    key={story.id}
                    onClick={() => {
                      setStoryId(story.id)
                      setActiveTab('story')
                    }}
                    className={`w-full max-w-sm text-center text-sm font-serif py-2 px-3 rounded transition-colors ${
                      storyId === story.id
                        ? 'text-[#991b1b] bg-[#991b1b]/20'
                        : 'text-[#991b1b]/80 hover:text-[#991b1b] hover:bg-[#991b1b]/10'
                    }`}
                  >
                    {story.title[language]}
                  </button>
                )) : (
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
                  <div key={chapter.id} className='w-full'>
                    <button
                      onClick={() => onChapterClick(chapter.id)}
                      className='w-[70%] max-w-sm mx-auto text-left text-sm font-serif text-[#991b1b]/80 hover:text-[#991b1b] py-2 px-3 rounded hover:bg-[#991b1b]/10 transition-colors flex items-center'
                    >
                      <span className="inline-block w-10 text-right font-bold mr-2">{chapter.title.match(/^\d+\./)?.[0]}</span>
                      <span className="flex-1">{chapter.title.replace(/^\d+\.\s*/, '')}</span>
                    </button>
                    {expandedSection === chapter.id && (
                      <div className='mt-2 space-y-1 animate-slide-down flex flex-col items-center w-full'>
                        {chapter.items.map((item, index) => (
                          <button
                            key={item.id}
                            onClick={() => onItemClick(item.id)}
                            className={`w-[50%] max-w-md text-left text-xs font-serif py-1.5 px-3 rounded transition-colors ${
                              selectedSutraItem === item.id
                                ? 'text-[#991b1b] bg-[#991b1b]/15'
                                : 'text-[#991b1b]/60 hover:text-[#991b1b] hover:bg-[#991b1b]/8'
                            }`}
                          >
                            <span className="text-xs leading-relaxed">{item.title.replace(/^\d+\.\s*/, '')}</span>
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
