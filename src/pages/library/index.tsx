'use client';

import type React from 'react';

import { useState, useEffect, useRef } from 'react';
import { tocData } from '../../components/staticContent/tocData'; // Import tocData
import { sutraContent } from '../../components/staticContent/sutraContent'; // Import sutraContent
import Link from 'next/link';

// Define CategoryType
type CategoryType = 'ke' | 'bai-giang' | 'thong-bao' | 'lich' | 'album';

interface SearchResult {
  id: string;
  title: string;
  content: string;
  chapter: string;
  snippet: string;
  type: 'content' | 'category';
}

const LibraryPage = () => {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi');
  const [activeCategory, setActiveCategory] = useState<CategoryType>('ke');
  const [selectedSutraItem, setSelectedSutraItem] = useState<string | null>(
    null,
  );
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(
    new Set(),
  );
  const [isSutraMode, setIsSutraMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const translations = {
    vi: {
      title: 'Thư Viện Kinh',
      backToHome: 'Về Trang Chủ',
      tableOfContents: 'Mục Lục Kinh',
      welcome: 'Chào Mừng Đến Thư Viện Kinh',
      welcomeMessage: 'Chọn một mục từ danh sách bên trái để đọc nội dung.',
      searchPlaceholder: 'Tìm kiếm trong thư viện...',
      noResults: 'Không tìm thấy kết quả nào',
    },
    en: {
      title: 'Sutra Library',
      backToHome: 'Back to Home',
      tableOfContents: 'Table of Contents',
      welcome: 'Welcome to Sutra Library',
      welcomeMessage:
        'Select an item from the list on the left to read the content.',
      searchPlaceholder: 'Search in library...',
      noResults: 'No results found',
    },
  };

  // Search functionality
  const normalizeVietnamese = (text: string): string => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  const buildSearchIndex = () => {
    const index: SearchResult[] = [];

    tocData.forEach(chapter => {
      chapter.items.forEach(item => {
        const content = sutraContent[item.id];
        if (content && typeof content === 'string') {
          const firstLine = content.split('\n')[0] || '';
          const snippet =
            content.substring(0, 100) + (content.length > 100 ? '...' : '');

          index.push({
            id: item.id,
            title: item.title,
            content: content,
            chapter: chapter.title,
            snippet: snippet,
            type: 'content',
          });
        }
      });
    });

    return index;
  };

  const performSearch = (query: string): SearchResult[] => {
    if (!query.trim()) return [];

    const normalizedQuery = normalizeVietnamese(query);
    const searchIndex = buildSearchIndex();

    return searchIndex
      .filter(item => {
        const normalizedTitle = normalizeVietnamese(item.title);
        const normalizedContent = normalizeVietnamese(String(item.content));
        const normalizedChapter = normalizeVietnamese(item.chapter);

        return (
          normalizedTitle.includes(normalizedQuery) ||
          normalizedContent.includes(normalizedQuery) ||
          normalizedChapter.includes(normalizedQuery)
        );
      })
      .slice(0, 10);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      const results = performSearch(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const handleSearchResultClick = (result: SearchResult) => {
    setSelectedSutraItem(result.id);
    setSearchQuery('');
    setShowSearchResults(false);

    const chapterIndex = tocData.findIndex(chapter =>
      chapter.items.some(item => item.id === result.id),
    );
    if (chapterIndex !== -1) {
      setExpandedChapters(prev => new Set([...prev, chapterIndex]));
    }
  };

  const highlightSearchTerm = (text: string, query: string) => {
    if (!query.trim()) return text;

    const normalizedQuery = normalizeVietnamese(query);
    const normalizedText = normalizeVietnamese(text);
    const index = normalizedText.indexOf(normalizedQuery);

    if (index === -1) return text;

    const start = Math.max(0, index - 20);
    const end = Math.min(text.length, index + query.length + 20);
    const snippet = text.substring(start, end);

    return snippet.replace(
      new RegExp(`(${query})`, 'gi'),
      '<mark class="bg-yellow-200">$1</mark>',
    );
  };

  useEffect(() => {
    setIsSutraMode(true);
    document.body.style.background =
      'linear-gradient(135deg, #f4e4bc 0%, #e8d5a3 50%, #dcc48a 100%)';
    document.body.style.backgroundAttachment = 'fixed';

    return () => {
      document.body.style.background = '';
      document.body.style.backgroundAttachment = '';
    };
  }, []);

  const toggleChapter = (chapterIndex: number) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(chapterIndex)) {
        newSet.delete(chapterIndex);
      } else {
        newSet.add(chapterIndex);
      }
      return newSet;
    });
  };

  const handleItemClick = (itemId: string) => {
    setSelectedSutraItem(itemId);
  };

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-[#2c2c2c]/20">
        <div className="flex items-center justify-between p-4">
          <Link
            href="/"
            className="flex items-center space-x-2 text-[#991b1b] hover:text-[#991b1b]/80 transition-colors font-serif"
          >
            <span>←</span>
            <span>{translations[language].backToHome}</span>
          </Link>

          <h1 className="text-xl font-serif text-[#991b1b] font-semibold">
            {translations[language].title}
          </h1>

          <button
            onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
            className="px-3 py-1 text-sm font-serif text-[#991b1b] border border-[#991b1b]/30 rounded-lg hover:bg-[#991b1b]/10 transition-colors"
          >
            {language === 'vi' ? 'ENG' : 'VIE'}
          </button>
        </div>
      </header>

      <div className="pt-20">
        {/* Floating TOC - positioned outside main content */}
        <div className="fixed left-6 top-24 z-40 w-80 lg:left-12 lg:w-96">
          <div className="bg-background/20 backdrop-blur-sm border-2 border-[#2c2c2c]/30 rounded-2xl p-4 max-h-[calc(100vh-8rem)] overflow-y-auto shadow-[0_4px_0_#00000020]">
            <h3 className="text-lg font-serif text-[#991b1b] mb-4">
              {translations[language].tableOfContents}
            </h3>
            <nav className="space-y-2">
              {tocData.map((chapter, chapterIndex) => (
                <div key={chapterIndex}>
                  <button
                    onClick={() => toggleChapter(chapterIndex)}
                    className="w-full text-left p-2 font-serif text-[#991b1b] hover:bg-[#991b1b]/10 rounded-lg transition-colors flex items-center justify-between"
                  >
                    <span>{chapter.title}</span>
                    <span className="text-xs">
                      {expandedChapters.has(chapterIndex) ? '−' : '+'}
                    </span>
                  </button>

                  {expandedChapters.has(chapterIndex) && (
                    <div className="ml-4 mt-2 space-y-1">
                      {chapter.items.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleItemClick(item.id)}
                          className={`w-full text-left p-2 text-sm font-serif rounded-lg transition-colors ${
                            selectedSutraItem === item.id
                              ? 'bg-[#991b1b]/20 text-[#991b1b] font-medium'
                              : 'text-[#2c2c2c] hover:bg-[#991b1b]/10 hover:text-[#991b1b]'
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
        </div>

        {/* Main Content Area */}
        <div className="max-w-4xl mx-auto ml-96 lg:ml-[28rem] pr-6">
          {/* Search Bar */}
          <div className="mb-6 relative">
            <div className="bg-background/20 backdrop-blur-sm border-2 border-[#2c2c2c]/30 rounded-2xl p-4 shadow-[0_4px_0_#00000020]">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder={translations[language].searchPlaceholder}
                  className="w-full px-4 py-3 bg-transparent border border-[#991b1b]/30 rounded-xl text-[#991b1b] placeholder-[#991b1b]/50 font-serif focus:outline-none focus:border-[#991b1b]/60 focus:ring-2 focus:ring-[#991b1b]/20"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#991b1b]/50">
                  ⌕
                </div>
              </div>
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-background/95 backdrop-blur-sm border-2 border-[#2c2c2c]/30 rounded-2xl shadow-[0_4px_0_#00000020] z-[200] max-h-96 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="p-2">
                    {searchResults.map((result, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearchResultClick(result)}
                        className="w-full text-left p-3 hover:bg-[#991b1b]/10 rounded-lg transition-colors border-b border-[#2c2c2c]/10 last:border-b-0"
                      >
                        <div className="font-serif text-[#991b1b] font-medium mb-1">
                          {result.chapter} › {result.title}
                        </div>
                        <div
                          className="text-sm text-[#2c2c2c]/70 font-serif"
                          dangerouslySetInnerHTML={{
                            __html: highlightSearchTerm(
                              result.snippet,
                              searchQuery,
                            ),
                          }}
                        />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-[#2c2c2c]/70 font-serif z-[200]">
                    {translations[language].noResults}
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedSutraItem && sutraContent[selectedSutraItem] ? (
            <div key={selectedSutraItem} className="h-full animate-fade-in">
              <div className="bg-background/20 backdrop-blur-sm border-2 border-[#2c2c2c]/30 rounded-2xl p-8 shadow-[0_4px_0_#00000020] min-h-[600px]">
                {(() => {
                  const content = sutraContent[selectedSutraItem];
                  const chapter = tocData.find(chapter =>
                    chapter.items.some(item => item.id === selectedSutraItem),
                  );
                  const item = chapter?.items.find(
                    item => item.id === selectedSutraItem,
                  );

                  return (
                    <div className="space-y-6">
                      <div className="text-center border-b border-[#2c2c2c]/20 pb-6">
                        <h2 className="text-2xl md:text-3xl font-serif text-[#991b1b] mb-2">
                          {item?.title}
                        </h2>
                        <p className="text-sm text-[#2c2c2c]/70 font-serif">
                          {chapter?.title}
                        </p>
                      </div>

                      <div className="prose prose-lg max-w-none">
                        <div className="font-serif text-[#2c2c2c] leading-relaxed whitespace-pre-line text-center">
                          {typeof content === 'string'
                            ? content
                            : String(content)}
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          ) : (
            // Show welcome message when no item is selected
            <div className="bg-background/20 backdrop-blur-sm border-2 border-[#2c2c2c]/30 rounded-2xl p-8 shadow-[0_4px_0_#00000020] min-h-[600px] flex flex-col items-center justify-center text-center">
              <h2 className="text-3xl font-serif text-[#991b1b] mb-4">
                {translations[language].welcome}
              </h2>
              <p className="text-lg font-serif text-[#2c2c2c]/70 mb-8">
                {translations[language].welcomeMessage}
              </p>
              <div className="text-6xl text-[#991b1b]/20 font-serif">無</div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default LibraryPage;
