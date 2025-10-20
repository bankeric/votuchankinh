'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import SiteFooter from '@/components/site-footer'
import {
  LibraryHeader,
  LibrarySearch,
  LibrarySidebar,
  LibraryMobileSidebar,
  LibraryContent
} from '@/components/library'

// Dùng lại data từ bản 1
import tocData from './tocData'
import sutraContent from './sutraContent'
import { storyData } from './story/storyData'
import { storyContent } from './story/storyContent'

interface SutraContentItem {
  title?: string
  content: string
  date?: string
  author?: string
}

export default function LibraryPage() {
  // State
  const [language, setLanguage] = useState<'vi' | 'en'>('vi')
  const [selectedSutraItem, setSelectedSutraItem] = useState<string>('')
  const [expandedSection, setExpandedSection] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false)
  const [selectedResultIndex, setSelectedResultIndex] = useState<number>(-1)
  const [activeTab, setActiveTab] = useState<'ke' | 'story'>('ke')
  const [storyId, setStoryId] = useState<string>('')
  const [storySubTab, setStorySubTab] = useState<'su-tam-vo' | 'huynh-de'>('su-tam-vo')
  const [keSubTab, setKeSubTab] = useState<'su-tam-vo' | 'huynh-de'>('su-tam-vo')
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  // Validate data on mount
  useEffect(() => {
    if (!Array.isArray(tocData)) {
      console.error('tocData is not an array:', tocData)
    }
    if (!Array.isArray(storyData)) {
      console.error('storyData is not an array:', storyData)
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

  // Read story from URL and activate story tab
  const searchParams = useSearchParams()
  useEffect(() => {
    const s = searchParams?.get('story') || ''
    if (s) {
      setStoryId(s)
      setActiveTab('story')
    }
  }, [searchParams])

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
    if (!Array.isArray(tocData)) return searchIndex
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

  // Chia câu chuyện thành 2 nhóm
  const suTamVoStories = Array.isArray(storyData) && storyData[0] && Array.isArray(storyData[0].items) ? 
    storyData[0].items.filter(story => 
      ['c1', 'c2', 'c3'].includes(story.id) // Câu chuyện của Sư Tam Vô
    ) : []
  
  const huynhDeStories = Array.isArray(storyData) && storyData[0] && Array.isArray(storyData[0].items) ? 
    storyData[0].items.filter(story => 
      ['c4', 'c5', 'c6'].includes(story.id) // Câu chuyện của Huynh Đệ
    ) : []

  const getCurrentStories = () => {
    return storySubTab === 'su-tam-vo' ? suTamVoStories : huynhDeStories
  }

  // Chia các kệ thành 2 nhóm
  const suTamVoChapters = Array.isArray(tocData) ? tocData.filter(chapter => 
    ['section-01-tam-vo', 'section-02-gioi-luat', 'section-03-tim-dao'].includes(chapter.id)
  ) : []
  
  const huynhDeChapters = Array.isArray(tocData) ? tocData.filter(chapter => 
    !['section-01-tam-vo', 'section-02-gioi-luat', 'section-03-tim-dao'].includes(chapter.id)
  ) : []

  const getCurrentChapters = () => {
    return keSubTab === 'su-tam-vo' ? suTamVoChapters : huynhDeChapters
  }

  // Early return if data is invalid
  if (!Array.isArray(tocData) || !Array.isArray(storyData)) {
    return (
      <main className='min-h-screen text-[#2c2c2c] relative flex items-center justify-center'>
        <div className='text-center'>
          <h1 className='text-2xl font-serif text-[#991b1b] mb-4'>Đang tải dữ liệu...</h1>
          <p className='text-sm text-[#991b1b]/60'>Vui lòng thử lại sau ít phút.</p>
        </div>
      </main>
    )
  }

  return (
    <main className='min-h-screen text-[#2c2c2c] relative'>
      {/* Header */}
      <LibraryHeader
        language={language}
        setLanguage={setLanguage}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        translations={translations}
      />

      {/* Mobile Sidebar */}
      <LibraryMobileSidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        keSubTab={keSubTab}
        setKeSubTab={setKeSubTab}
        storySubTab={storySubTab}
        setStorySubTab={setStorySubTab}
        expandedSection={expandedSection}
        selectedSutraItem={selectedSutraItem}
        storyId={storyId}
        setStoryId={setStoryId}
        onChapterClick={handleChapterClick}
        onItemClick={handleItemClick}
        getCurrentChapters={getCurrentChapters}
        getCurrentStories={getCurrentStories}
        language={language}
        tocData={tocData}
        storyData={storyData}
      />

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

      <div className='pt-12 flex'>
        {/* TOC Desktop */}
        <LibrarySidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          keSubTab={keSubTab}
          setKeSubTab={setKeSubTab}
          storySubTab={storySubTab}
          setStorySubTab={setStorySubTab}
          expandedSection={expandedSection}
          selectedSutraItem={selectedSutraItem}
          storyId={storyId}
          setStoryId={setStoryId}
          onChapterClick={handleChapterClick}
          onItemClick={handleItemClick}
          getCurrentChapters={getCurrentChapters}
          getCurrentStories={getCurrentStories}
          translations={translations}
          language={language}
        />

        {/* Main Content */}
        <div className='flex-1 max-w-4xl mx-auto sm:pr-6'>
          {/* Search */}
          <div className='mt-12 mb-12 flex justify-center'></div>

          <LibrarySearch
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchResults={searchResults}
            showSearchResults={showSearchResults}
            setShowSearchResults={setShowSearchResults}
            selectedResultIndex={selectedResultIndex}
            setSelectedResultIndex={setSelectedResultIndex}
            onSearchResultClick={handleSearchResultClick}
            onSearchChange={handleSearchChange}
            onSearchKeyDown={handleSearchKeyDown}
            highlightSearchTerms={highlightSearchTerms}
            translations={translations}
            language={language}
          />

          {/* Sutra Content or Story */}
          <LibraryContent
            activeTab={activeTab}
            selectedSutraItem={selectedSutraItem}
            storyId={storyId}
            sutraContent={sutraContent}
            storyContent={storyContent}
            tocData={tocData}
            language={language}
            translations={translations}
          />
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
