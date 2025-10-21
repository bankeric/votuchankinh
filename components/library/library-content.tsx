'use client'

import { CategoryType } from '@/interfaces/category'
import { Story } from '@/interfaces/story'
import Image from 'next/image'

interface SutraContentItem {
  title?: string
  content: string
  date?: string
  author?: string
}

interface StoryContentItem {
  title: { vi: string; en: string }
  content: { vi: string; en: string }
  date?: string
  author?: { vi: string; en: string }
}

interface TocChapter {
  id: string
  title: string
  items: { id: string; title: string }[]
}

interface LibraryContentProps {
  activeTab: CategoryType
  selectedStory?: Story
  storyId: string
  sutraContent: Record<string, SutraContentItem | string>
  storyContent: Record<string, StoryContentItem>
  tocData: TocChapter[]
  language: 'vi' | 'en'
  translations: {
    vi: { tableOfContents: string; selectContent: string }
    en: { tableOfContents: string; selectContent: string }
  }
}

export function LibraryContent({
  activeTab,
  selectedStory,
  storyId,
  sutraContent,
  storyContent,
  tocData,
  language,
  translations
}: LibraryContentProps) {
  if (activeTab === 'story') {
    if (storyId && storyContent[storyId]) {
      return (
        <div className='h-full flex items-start justify-center min-h-[600px] mt-4 mb-8'>
          <div className='w-full max-w-6xl bg-background/20 backdrop-blur-sm border rounded-2xl p-6 sm:p-8 shadow min-h-[600px]'>
            <div className='text-center mb-6 sm:mb-8'>
              <p className='text-base sm:text-lg font-serif text-[#991b1b]/70 mb-2'>
                {language === 'vi'
                  ? 'Câu Chuyện Ngộ Đạo'
                  : 'Enlightenment Stories'}
              </p>
              <h2 className='text-2xl sm:text-3xl md:text-4xl font-serif text-[#991b1b] mb-4 sm:mb-6'>
                {storyContent[storyId].title[language]}
              </h2>
              <div className='flex justify-center mb-6 sm:mb-8'>
                <div
                  className='w-24 h-2 bg-[#991b1b] rounded-full opacity-60'
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, #991b1b 20%, #991b1b 80%, transparent 100%)',
                    filter: 'blur(0.5px)'
                  }}
                />
              </div>
            </div>

            {/* Image - Centered */}
            <div className='mb-8 flex justify-center'>
              <div className='w-full max-w-md aspect-square overflow-hidden rounded-xl border border-[#8B4513]/20 bg-white'>
                <img
                  src={`/images/${storyId}.png`}
                  alt={storyContent[storyId].title[language]}
                  className='w-full h-full object-contain'
                />
              </div>
            </div>

            {/* Content - Full Width Left to Right */}
            <div className='w-full'>
              <div className='prose prose-lg max-w-none'>
                <div className='font-serif text-[#991b1b]/90 leading-relaxed space-y-4'>
                  <div className='text-sm sm:text-base whitespace-pre-line text-justify'>
                    {storyContent[storyId].content[language]}
                  </div>
                  {(storyContent[storyId].date ||
                    storyContent[storyId].author) && (
                    <div className='text-xs text-[#991b1b]/60 mt-6 pt-4 border-t border-[#991b1b]/20'>
                      {storyContent[storyId].author && (
                        <p className='font-serif'>
                          {language === 'vi' ? 'Tác giả: ' : 'Author: '}
                          {storyContent[storyId].author![language]}
                        </p>
                      )}
                      {storyContent[storyId].date && (
                        <p className='font-serif'>
                          {language === 'vi' ? 'Năm: ' : 'Year: '}
                          {storyContent[storyId].date}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return (
        <div className='h-full flex items-center justify-center min-h-[600px]'>
          <div className='text-center animate-fade-in px-4'>
            <div className='mb-4 sm:mb-6 flex items-center justify-center'>
              <Image
                src={'/images/library.png'}
                alt='Library Icon'
                width={160}
                height={160}
                className='w-24 h-24 sm:w-40 sm:h-40 object-contain'
              />
            </div>
            <h2 className='text-xl sm:text-2xl font-serif text-[#991b1b] mb-3 sm:mb-4'>
              {language === 'vi'
                ? 'Câu Chuyện Ngộ Đạo'
                : 'Enlightenment Stories'}
            </h2>
            <p className='text-base sm:text-lg font-serif text-[#991b1b]/60'>
              {language === 'vi'
                ? 'Chọn một câu chuyện để đọc nội dung'
                : 'Select a story to read content'}
            </p>
          </div>
        </div>
      )
    }
  } else if (selectedStory) {
    return (
      <div
        key={selectedStory.uuid}
        className='animate-fade-in'
      >
        <div className='bg-background/20 backdrop-blur-sm border rounded-2xl p-6 sm:p-8 shadow min-h-[600px]'>
          {(() => {
            console.log('Selected Story:', selectedStory.image_url)
            return (
              <>
                {/* Title */}
                <div className='text-center mb-6 sm:mb-8'>
                  <h2 className='text-2xl sm:text-3xl md:text-4xl font-serif text-[#991b1b] mb-4 sm:mb-6'>
                    {selectedStory.title || ''}
                  </h2>
                  <div className='flex justify-center mb-6 sm:mb-8'>
                    <div
                      className='w-24 h-2 bg-[#991b1b] rounded-full opacity-60'
                      style={{
                        background:
                          'linear-gradient(90deg, transparent 0%, #991b1b 20%, #991b1b 80%, transparent 100%)',
                        filter: 'blur(0.5px)'
                      }}
                    />
                  </div>
                </div>
                {/* Image */}
                {selectedStory.image_url && (
                  <div className='mb-8 flex justify-center'>
                    <div className='w-full max-w-md aspect-square overflow-hidden rounded-xl border border-[#8B4513]/20 bg-white'>
                      <img
                        src={selectedStory.image_url}
                        alt={selectedStory.title || 'Story Image'}
                        className='w-full h-full object-contain'
                      />
                    </div>
                  </div>
                )}
                {/* Content */}
                <div className='prose prose-lg max-w-none'>
                  <div className='font-serif text-[#991b1b]/90 leading-relaxed text-center space-y-4 sm:space-y-6'>
                    <div
                      className='text-base sm:text-lg whitespace-pre-line'
                      dangerouslySetInnerHTML={{
                        __html: selectedStory.content
                      }}
                    />

                    {/* Footer */}
                    {(selectedStory.created_at || selectedStory.author) && (
                      <div className='text-sm text-[#991b1b]/60 mt-6 sm:mt-8 pt-4 border-t border-[#991b1b]/20'>
                        {selectedStory.author && (
                          <p className='font-serif'>{selectedStory.author}</p>
                        )}
                        {selectedStory.created_at && (
                          <p className='font-serif'>
                            {selectedStory.created_at}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </>
            )
          })()}
        </div>
      </div>
    )
  } else {
    return (
      <div className='h-full flex items-center justify-center min-h-[600px]'>
        <div className='text-center animate-fade-in px-4'>
          <div className='mb-4 sm:mb-6 flex items-center justify-center'>
            <Image
              src={'/images/ai_1.png'}
              alt='Library Icon'
              width={160}
              height={160}
              className='w-24 h-24 sm:w-40 sm:h-40 object-contain'
            />
          </div>
          <h2 className='text-xl sm:text-2xl font-serif text-[#991b1b] mb-3 sm:mb-4'>
            {translations[language].tableOfContents}
          </h2>
          <p className='text-base sm:text-lg font-serif text-[#991b1b]/60'>
            {translations[language].selectContent}
          </p>
        </div>
      </div>
    )
  }
}
