'use client'

import type React from 'react'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import SiteFooter from '@/components/site-footer'

// Dùng lại data từ bản 1
import tocData from './tocData'
import sutraContent from './sutraContent'

interface SutraContentItem {
  title?: string
  content: string
  date?: string
  author?: string
}

type SutraContentMap = Record<string, SutraContentItem | string>

export default function LibraryPage() {
  // State
  const [language, setLanguage] = useState<'vi' | 'en'>('vi')
  const [selectedSutraItem, setSelectedSutraItem] = useState<string>('')
  const [expandedSection, setExpandedSection] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false)
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(-1)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const searchRef = useRef<HTMLDivElement>(null)

  // Click outside search box
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowSearchResults(false)
        setSelectedResultIndex(-1)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Background setup
  useEffect(() => {
    document.body.style.background =
      'linear-gradient(135deg, #f4e4bc 0%, #e8d5a3 50%, #dcc48a 100%)'
    document.body.style.backgroundSize = 'cover'
    return () => {
      document.body.style.background = ''
      document.body.style.backgroundSize = ''
    }
  }, [])

  // Translations
  const translations = {
    vi: {
      returnToHome: 'Trở về Trang Chủ',
      library: 'THƯ VIỆN',
      subtitle: 'Kho Tàng Tri Thức và Trí Tuệ',
      tableOfContents: 'Mục Lục',
      selectContent: 'Chọn một mục để đọc nội dung',
      searchPlaceholder: 'Tìm kiếm trong thư viện...',
      noResults: 'Không tìm thấy kết quả nào'
    },
    en: {
      returnToHome: 'Return to Home',
      library: 'LIBRARY',
      subtitle: 'Treasury of Knowledge and Wisdom',
      tableOfContents: 'Table of Contents',
      selectContent: 'Select a section to read content',
      searchPlaceholder: 'Search in library...',
      noResults: 'No results found'
    }
  }

  // Normalize VN text
  const normalizeVietnamese = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'd')
  }

  // Build search index
  const buildSearchIndex = () => {
    const searchIndex: any[] = []
    tocData.forEach((chapter) => {
      // add chapter
      searchIndex.push({
        type: 'chapter',
        id: chapter.id,
        title: chapter.title,
        content: chapter.title,
        normalizedContent: normalizeVietnamese(chapter.title),
        parentChapter: chapter.title
      })
      chapter.items.forEach((item) => {
        const contentObj = sutraContent[item.id]
        if (contentObj) {
          const contentStr =
            typeof contentObj === 'string'
              ? contentObj
              : contentObj.content || ''
          const firstLine =
            contentStr.split('\n')[0] || contentStr.substring(0, 100) + '...'
          searchIndex.push({
            type: 'item',
            id: item.id,
            title: item.title,
            content: contentStr,
            normalizedContent: normalizeVietnamese(
              item.title + ' ' + contentStr
            ),
            parentChapter: chapter.title,
            snippet: firstLine
          })
        }
      })
    })
    return searchIndex
  }

  // Perform search
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }
    const normalizedQuery = normalizeVietnamese(query)
    const searchIndex = buildSearchIndex()
    const results = searchIndex
      .filter((item) => item.normalizedContent.includes(normalizedQuery))
      .slice(0, 10)
    setSearchResults(results)
    setShowSearchResults(true)
    setSelectedResultIndex(-1)
  }

  // Handlers
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    performSearch(query)
  }

  const handleSearchResultClick = (result: any) => {
    if (result.type === 'item') {
      const parentChapter = tocData.find((chapter) =>
        chapter.items.some((item) => item.id === result.id)
      )
      if (parentChapter) {
        setExpandedSection(parentChapter.id)
        setSelectedSutraItem(result.id)
      }
    } else if (result.type === 'chapter') {
      setExpandedSection(result.id)
      setSelectedSutraItem('')
    }
    setShowSearchResults(false)
    setSearchQuery('')
    setSelectedResultIndex(-1)
  }

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchResults || searchResults.length === 0) return
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedResultIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedResultIndex((prev) =>
          prev > 0 ? prev - 1 : searchResults.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedResultIndex >= 0) {
          handleSearchResultClick(searchResults[selectedResultIndex])
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowSearchResults(false)
        setSearchQuery('')
        setSelectedResultIndex(-1)
        break
    }
  }

  const highlightSearchTerms = (text: string, query: string) => {
    if (!query.trim()) return text
    const normalizedQuery = normalizeVietnamese(query)
    const words = normalizedQuery.split(' ').filter((w) => w.length > 0)
    let highlightedText = text
    words.forEach((word) => {
      const regex = new RegExp(`(${word})`, 'gi')
      highlightedText = highlightedText.replace(
        regex,
        '<mark class="bg-yellow-200 text-black">$1</mark>'
      )
    })
    return highlightedText
  }

  const handleChapterClick = (chapterId: string) => {
    setExpandedSection(expandedSection === chapterId ? '' : chapterId)
  }

  const handleItemClick = (itemId: string) => {
    setSelectedSutraItem(itemId)
  }

  return (
    <main className='min-h-screen text-[#2c2c2c] relative'>
      {/* Header */}
      <header className='fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-[#EFE0BD]/80 backdrop-blur-sm border-b border-[#8B4513]/10'>
        {/* Return to Home Button */}
        <Link
          href='/'
          className='flex items-center space-x-2 text-[#8B4513]/80 hover:text-[#8B4513] transition-colors bg-[#D4AF8C]/30 backdrop-blur-sm px-4 py-2 rounded-full border border-[#8B4513]/20 hover:border-[#8B4513]/40'
        >
          <ArrowLeft className='w-4 h-4' />
          <span className='font-serif text-sm hidden sm:inline'>
            {translations[language].returnToHome}
          </span>
        </Link>

        {/* Center Navigation - Library and Community Buttons */}
        <div className='flex items-center space-x-3'>
          <Link
            href='/library'
            className='flex items-center space-x-2 text-[#8B4513]/80 hover:text-[#8B4513] transition-all duration-300 bg-[#D4AF8C]/30 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-[#D4AF8C]/50 hover:scale-105 border border-[#8B4513]/20 hover:border-[#8B4513]/40'
          >
            <img
              src='/images/wordless-sutra-library-icon.png'
              alt='Library'
              className='w-5 h-5'
            />
            <span className='font-serif text-sm hidden sm:inline'>Library</span>
          </Link>
          <Link
            href='/community'
            className='flex items-center space-x-2 text-[#8B4513]/80 hover:text-[#8B4513] transition-all duration-300 bg-[#D4AF8C]/30 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-[#D4AF8C]/50 hover:scale-105 border border-[#8B4513]/20 hover:border-[#8B4513]/40'
          >
            <img
              src='/images/lotus-community-icon.png'
              alt='Community'
              className='w-5 h-5'
            />
            <span className='font-serif text-sm hidden sm:inline'>
              Community
            </span>
          </Link>
        </div>

        {/* Right Side - Language Toggle Button */}
        <div className='flex items-center'>
          <button
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className='flex items-center space-x-2 text-[#8B4513]/80 hover:text-[#8B4513] transition-colors bg-[#D4AF8C]/30 backdrop-blur-sm px-4 py-2 rounded-full border border-[#8B4513]/20 hover:border-[#8B4513]/40'
          >
            <span className='font-serif text-sm'>
              {language === 'vi' ? (
                <>
                  <span className='hidden sm:inline'>ENG | VIE</span>
                  <span className='sm:hidden'>VN - EN</span>
                </>
              ) : (
                <>
                  <span className='hidden sm:inline'>VIE | ENG</span>
                  <span className='sm:hidden'>EN - VN</span>
                </>
              )}
            </span>
          </button>
        </div>
      </header>

      {/* Floating AI Button */}
      <div
        className='fixed bottom-8 right-8 z-50'
        style={{ touchAction: 'manipulation' }}
      >
        <Link
          href='/ai/new'
          className='group relative flex items-center justify-center w-16 h-16 bg-[#EFE0BD] rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 hover:rotate-12 overflow-hidden'
          style={{
            WebkitTapHighlightColor: 'transparent',
            cursor: 'pointer'
          }}
        >
          <div className='absolute -inset-4 md:inset-0 z-20'></div>
          <div className='absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent animate-golden-sweep'></div>
          <div className='absolute inset-0 rounded-full bg-gradient-conic from-yellow-400/20 via-amber-300/30 via-yellow-200/25 to-yellow-400/20 animate-golden-rotate opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>
          <div className='absolute inset-0 rounded-full bg-gradient-radial from-yellow-200/40 via-amber-300/20 to-transparent animate-pulse-golden'></div>
          <div className='relative z-20 w-20 h-20'>
            <img
              src='/images/giac-ngo-logo-1.png'
              alt='Giac Ngo'
              className='w-full h-full object-contain filter sepia(100%) hue-rotate(-30deg) saturate(200%)'
            />
          </div>
          <div className='absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm font-serif rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap'>
            Wordless Sutra
            <div className='absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80'></div>
          </div>
          <div className='absolute inset-0 rounded-full border-2 border-yellow-400/50 animate-ping'></div>
          <div className='absolute inset-0 rounded-full bg-gradient-to-r from-[#991b1b]/10 to-[#991b1b]/15 group-hover:from-[#991b1b]/20 group-hover:to-[#991b1b]/25 transition-all duration-300'></div>
          <div className='absolute inset-0 overflow-hidden rounded-full pointer-events-none'>
            <div className='absolute w-1 h-1 bg-yellow-300/80 rounded-full animate-float-1 shadow-[0_0_4px_rgba(255,215,0,0.8)]'></div>
            <div className='absolute w-1 h-1 bg-amber-200/70 rounded-full animate-float-2 shadow-[0_0_3px_rgba(255,215,0,0.6)]'></div>
            <div className='absolute w-1 h-1 bg-yellow-400/90 rounded-full animate-float-3 shadow-[0_0_5px_rgba(255,215,0,1)]'></div>
          </div>
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute top-1/2 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-yellow-300/60 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-45 animate-ray-1'></div>
            <div className='absolute top-1/2 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-135 animate-ray-2'></div>
            <div className='absolute top-1/2 left-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-200/70 to-transparent transform -translate-x-1/2 -translate-y-1/2 animate-ray-3'></div>
            <div className='absolute top-1/2 left-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-90 animate-ray-4'></div>
          </div>
        </Link>
      </div>

      <div className='pt-20 flex'>
        {/* TOC Desktop */}
        <aside className='hidden sm:block w-80 lg:w-96 mr-6'>
          <div className='bg-[#EFE0BD]/90 backdrop-blur-sm border-2 border-[#2c2c2c]/30 rounded-2xl p-4 max-h-[calc(100vh-8rem)] overflow-y-auto shadow'>
            <h3 className='text-lg font-serif text-[#991b1b] mb-4'>
              {translations[language].tableOfContents}
            </h3>
            <nav className='space-y-2'>
              {tocData.map((chapter) => (
                <div key={chapter.id}>
                  <button
                    onClick={() => handleChapterClick(chapter.id)}
                    className='w-full text-left text-sm font-serif text-[#991b1b]/80 hover:text-[#991b1b] py-1 px-2 rounded hover:bg-[#991b1b]/10 transition-colors'
                  >
                    {chapter.title}
                  </button>
                  {expandedSection === chapter.id && (
                    <div className='ml-4 space-y-1 animate-slide-down'>
                      {chapter.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item.id)}
                          className={`block w-full text-left text-xs font-serif py-1 px-2 rounded transition-colors ${
                            selectedSutraItem === item.id
                              ? 'text-[#991b1b] bg-[#991b1b]/20'
                              : 'text-[#991b1b]/60 hover:text-[#991b1b] hover:bg-[#991b1b]/5'
                          }`}
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className='flex-1 max-w-4xl mx-auto sm:pr-6'>
          {/* Search */}
          <div className='mb-6 relative z-40'>
            <div className='bg-background/20 backdrop-blur-sm border-2 border-[#2c2c2c]/30 rounded-2xl p-3 sm:p-4 shadow'>
              <div
                className='relative'
                ref={searchRef}
              >
                <input
                  type='text'
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyDown}
                  placeholder={translations[language].searchPlaceholder}
                  className='w-full px-3 py-2 sm:px-4 sm:py-3 bg-transparent border border-[#991b1b]/30 rounded-xl text-[#991b1b] placeholder-[#991b1b]/50 font-serif focus:outline-none focus:border-[#991b1b]/60 focus:ring-2 focus:ring-[#991b1b]/20 text-sm sm:text-base'
                />
                <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[#991b1b]/50'>
                  ⌕
                </div>

                {showSearchResults && searchResults.length > 0 && (
                  <div className='absolute left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm border rounded-xl shadow max-h-96 overflow-y-auto z-[80] top-full'>
                    {searchResults.map((result, index) => (
                      <button
                        key={`${result.type}-${result.id}`}
                        onClick={() => handleSearchResultClick(result)}
                        className={`w-full text-left p-3 sm:p-4 border-b border-[#991b1b]/10 last:border-b-0 hover:bg-[#991b1b]/10 transition-colors ${
                          index === selectedResultIndex ? 'bg-[#991b1b]/20' : ''
                        }`}
                      >
                        <div className='font-serif text-sm text-[#991b1b] mb-1'>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: highlightSearchTerms(
                                result.title,
                                searchQuery
                              )
                            }}
                          />
                        </div>
                        <div className='text-xs text-[#991b1b]/60 mb-2'>
                          {result.parentChapter}
                          {result.type === 'item' && ' › ' + result.title}
                        </div>
                        {result.snippet && (
                          <div className='text-xs text-[#991b1b]/50 line-clamp-2'>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: highlightSearchTerms(
                                  result.snippet,
                                  searchQuery
                                )
                              }}
                            />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {showSearchResults &&
                  searchResults.length === 0 &&
                  searchQuery.trim() && (
                    <div className='absolute left-0 right-0 mt-2 bg-background/95 border rounded-xl shadow p-4 z-[80] top-full text-center text-[#991b1b]/60 font-serif text-sm'>
                      {translations[language].noResults}
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Sutra Content */}
          {selectedSutraItem && sutraContent[selectedSutraItem] ? (
            <div
              key={selectedSutraItem}
              className='animate-fade-in'
            >
              <div className='bg-background/20 backdrop-blur-sm border rounded-2xl p-6 sm:p-8 shadow min-h-[600px]'>
                {(() => {
                  const contentObj = sutraContent[selectedSutraItem] as
                    | SutraContentItem
                    | string
                  const chapter = tocData.find((chapter) =>
                    chapter.items.some((item) => item.id === selectedSutraItem)
                  )
                  const content: SutraContentItem =
                    typeof contentObj === 'string'
                      ? { content: contentObj }
                      : contentObj

                  return (
                    <>
                      <div className='text-center mb-6 sm:mb-8'>
                        <p className='text-base sm:text-lg font-serif text-[#991b1b]/70 mb-2'>
                          {chapter?.title}
                        </p>
                        <h2 className='text-2xl sm:text-3xl md:text-4xl font-serif text-[#991b1b] mb-4 sm:mb-6'>
                          {content.title || ''}
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
                      <div className='prose prose-lg max-w-none'>
                        <div className='font-serif text-[#991b1b]/90 leading-relaxed text-center space-y-4 sm:space-y-6'>
                          <div className='text-base sm:text-lg whitespace-pre-line'>
                            {content.content}
                          </div>
                          {/* <div className='text-3xl sm:text-4xl font-serif text-[#991b1b]/60 py-4 sm:py-6'>
                            無
                          </div> */}
                          {(content.date || content.author) && (
                            <div className='text-sm text-[#991b1b]/60 mt-6 sm:mt-8 pt-4 border-t border-[#991b1b]/20'>
                              {content.author && (
                                <p className='font-serif'>{content.author}</p>
                              )}
                              {content.date && (
                                <p className='font-serif'>{content.date}</p>
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
          ) : (
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
          )}
        </div>
      </div>

      <SiteFooter />

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }

        /* Golden Animation Styles */
        @keyframes float-1 {
          0%,
          100% {
            transform: translate(10px, 15px) rotate(0deg);
            opacity: 0.6;
          }
          50% {
            transform: translate(25px, 5px) rotate(180deg);
            opacity: 1;
          }
        }

        @keyframes float-2 {
          0%,
          100% {
            transform: translate(40px, 25px) rotate(0deg);
            opacity: 0.4;
          }
          50% {
            transform: translate(15px, 10px) rotate(-180deg);
            opacity: 0.8;
          }
        }

        @keyframes float-3 {
          0%,
          100% {
            transform: translate(20px, 8px) rotate(0deg);
            opacity: 0.5;
          }
          50% {
            transform: translate(35px, 20px) rotate(180deg);
            opacity: 0.9;
          }
        }

        .animate-float-1 {
          animation: float-1 3s ease-in-out infinite;
        }

        .animate-float-2 {
          animation: float-2 4s ease-in-out infinite;
        }

        .animate-float-3 {
          animation: float-3 3.5s ease-in-out infinite;
        }

        .animate-golden-sweep {
          animation: golden-sweep 3s ease-in-out infinite;
        }

        .animate-golden-rotate {
          animation: golden-rotate 8s linear infinite;
        }

        .animate-pulse-golden {
          animation: pulse-golden 4s ease-in-out infinite;
        }

        .animate-ray-1 {
          animation: ray-extend 2s ease-in-out infinite;
        }

        .animate-ray-2 {
          animation: ray-extend 2.5s ease-in-out infinite 0.5s;
        }

        .animate-ray-3 {
          animation: ray-extend 3s ease-in-out infinite 1s;
        }

        .animate-ray-4 {
          animation: ray-extend 2.2s ease-in-out infinite 1.5s;
        }

        @keyframes golden-sweep {
          0%,
          100% {
            transform: translateX(-100%) rotate(-45deg);
            opacity: 0;
          }
          50% {
            transform: translateX(100%) rotate(-45deg);
            opacity: 1;
          }
        }

        @keyframes golden-rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-golden {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes ray-extend {
          0%,
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          50% {
            opacity: 0.8;
            transform: translate(-50%, -50%) scale(1.2);
          }
        }

        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .bg-gradient-conic {
          background: conic-gradient(var(--tw-gradient-stops));
        }
      `}</style>
    </main>
  )
}
