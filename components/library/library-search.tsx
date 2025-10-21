'use client'

import { useRef, useEffect } from 'react'

interface SearchResult {
  type: 'chapter' | 'item'
  id: string
  title: string
  content: string
  normalizedContent: string
  parentChapter: string
  snippet?: string
}

interface LibrarySearchProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  searchResults: SearchResult[]
  showSearchResults: boolean
  setShowSearchResults: (show: boolean) => void
  selectedResultIndex: number
  setSelectedResultIndex: (index: number) => void
  onSearchResultClick: (result: SearchResult) => void
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearchKeyDown: (e: React.KeyboardEvent) => void
  highlightSearchTerms: (text: string, query: string) => string
  translations: {
    vi: { searchPlaceholder: string; noResults: string }
    en: { searchPlaceholder: string; noResults: string }
  }
  language: 'vi' | 'en'
}

export function LibrarySearch({
  searchQuery,
  setSearchQuery,
  searchResults,
  showSearchResults,
  setShowSearchResults,
  selectedResultIndex,
  setSelectedResultIndex,
  onSearchResultClick,
  onSearchChange,
  onSearchKeyDown,
  highlightSearchTerms,
  translations,
  language
}: LibrarySearchProps) {
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
  }, [setShowSearchResults, setSelectedResultIndex])

  return (
    <div className='mb-6 relative z-40'>
      <div className='bg-background/20 backdrop-blur-sm border-2 border-[#2c2c2c]/30 rounded-2xl p-3 sm:p-4 shadow'>
        <div className='relative' ref={searchRef}>
          <input
            type='text'
            value={searchQuery}
            onChange={onSearchChange}
            onKeyDown={onSearchKeyDown}
            placeholder={translations[language].searchPlaceholder}
            className='w-full px-3 py-2 sm:px-4 sm:py-3 bg-transparent border border-[#991b1b]/30 rounded-xl text-[#991b1b] placeholder-[#991b1b]/50 font-serif focus:outline-none focus:border-[#991b1b]/60 focus:ring-2 focus:ring-[#991b1b]/20 text-sm sm:text-base'
          />
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2 text-[#991b1b]/50'>
            ⌕
          </div>

          {showSearchResults && searchResults.length > 0 && (
            <div className='absolute left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm border rounded-xl shadow max-h-96 overflow-y-auto z-[60] top-full'>
              {searchResults.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => onSearchResultClick(result)}
                  className={`w-full text-left p-3 sm:p-4 border-b border-[#991b1b]/10 last:border-b-0 hover:bg-[#991b1b]/10 transition-colors ${
                    index === selectedResultIndex ? 'bg-[#991b1b]/20' : ''
                  }`}
                >
                  <div className='font-serif text-sm text-[#991b1b] mb-1'>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: highlightSearchTerms(result.title, searchQuery)
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
                          __html: highlightSearchTerms(result.snippet, searchQuery)
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
              <div className='absolute left-0 right-0 mt-2 bg-background/95 border rounded-xl shadow p-4 z-[60] top-full text-center text-[#991b1b]/60 font-serif text-sm'>
                {translations[language].noResults}
              </div>
            )}
        </div>
      </div>
    </div>
  )
}


