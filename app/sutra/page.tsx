'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SiteFooter from '@/components/site-footer'

const floatingCharacters = ['清', '靜', '無思']

export default function SutraScrollPage() {
  const [language, setLanguage] = useState<'vi' | 'en'>('vi')

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'))
  }

  const translations = {
    vi: {
      returnToSilence: 'Return to Silence',
      scrollSections: [
        { id: 'doi-song', title: 'TAM VÔ', label: 'Tam Vô' },
        {
          id: 'tam-thanh-tinh',
          title: 'TÂM THANH TỊNH',
          label: 'Tâm Thanh Tịnh'
        },
        {
          id: 'chung-sanh',
          title: 'CHÚNG SANH BÊN TRONG',
          label: 'Chúng Sanh'
        },
        { id: 'vong', title: 'VỌNG', label: 'Vọng' },
        { id: 'phat-da-hanh', title: 'PHẬT ĐÀ HÀNH', label: 'Phật Đà Hành' },
        { id: 'phap-mon', title: 'PHÁP MÔN VÔ TỰ', label: 'Kinh Không Chữ' },
        { id: 'tu-tanh', title: 'TRỞ VỀ TỰ TÁNH', label: 'Tự Tánh' },
        { id: 'huynh-de', title: 'HUYNH ĐỆ ĐỒNG HÀNH', label: 'Huynh Đệ' }
      ],
      sections: {
        tamThanhTinh: {
          title: 'THƯỜNG HÀNH TÂM THANH TỊNH',
          quote: 'Hành không dính mắc - Tâm bất động, bất loạn, bất si',
          description:
            'A mind that is pure, undisturbed, and free from ignorance'
        },
        chungSanh: {
          title: 'DIỆT CHÚNG SANH BÊN TRONG',
          defilements: [
            { viet: 'Tham', char: '貪' },
            { viet: 'Sân', char: '瞋' },
            { viet: 'Si', char: '癡' },
            { viet: 'Mạn', char: '慢' },
            { viet: 'Nghi', char: '疑' },
            { viet: 'Kiến', char: '見' },
            { viet: 'Ái', char: '愛' },
            { viet: 'Thủ', char: '取' },
            { viet: 'Hữu', char: '有' }
          ],
          quote: 'Diệt nhưng không thấy ai bị diệt — đó là Tánh Phật hiện tiền.'
        },
        vong: {
          title: 'KIẾN TƯỚNG BẤT HÀNH VỌNG',
          description: 'All forms are illusions - do not chase them',
          quote:
            'Vạn pháp là huyễn tướng - ngay khi không chạy theo vọng, bạn an trú nơi Tự Tánh'
        },
        phatDaHanh: {
          title: 'TỰ TÁNH PHÁP HẰNG SANH',
          description: 'Let all things arise naturally from your True Nature',
          quote:
            'An nhiên Phật Đà Hành — Khi an trú nơi Tự Tánh, mọi hành động đều thuận theo tự nhiên tự sinh diệt theo nhân duyên, không cần kiểm soát'
        },
        phapMon: {
          title: 'Bản thể là "Không"',
          description: 'Truth is formless, wordless, present here and now',
          fingerMoon: 'ngón tay chỉ trăng',
          realMoon: 'trăng thật',
          quote:
            'Chân lý không nằm trên giấy mực. Bản chất của mọi hiện tượng là rỗng rang không có thực thể. Tâm vọng tạo ra danh xưng, phân biệt -> bám chấp -> khổ đau. - Nhận ra Tánh Không là bắt đầu giải thoát khỏi vòng nghiệp - quả.'
        },
        tuTanh: {
          title: 'TRỞ VỀ VỚI TỰ TÁNH',
          beforeName: 'before name, before thought',
          whoAreYou: 'who are YOU?',
          hoverText: 'Hover to reveal the silent observer'
        },
        TamVo: {
          title: 'TAM VÔ',
          concepts: [
            {
              title: 'Vô Ngã',
              description:
                'Thiên địa luôn xoay vần\nTự Ngã thị tối cao\nTu Di Sơn tan rã\nTrực nhận Liên Hoa cành'
            },
            {
              title: 'Vô Tướng',
              description:
                'Pháp Tướng hằng sanh diệt\nKiến tướng bất thị tướng\nTrực nhận Pháp Tánh Không\nRõ Chân Như vạn pháp'
            },
            {
              title: 'Vô Niệm',
              description:
                'Kiến văn giác tri hành\nTrụ pháp thân thanh tịnh\nRõ vạn pháp hằng sanh\nNiệm khởi nơi vô niệm'
            }
          ],
          quote:
            'Người thấu suốt được ba pháp này sẽ nhận ra bản tánh của mình vốn thanh tịnh, không bị nhiễm ô bởi trần cảnh, và hành động không bị ràng buộc bởi bất cứ điều gì.'
        },
        huynhDe: {
          title: 'HUYNH ĐỆ ĐỒNG HÀNH',
          description:
            'You are not alone on this path. The Sangha is alive and walking together.',
          joinText: 'Join',
          communityText: 'Community',
          quote:
            'Nếu bạn thấy lời này thấm sâu, bạn đã là một phần của huynh đệ.',
          endText: 'The scroll ends in stillness...'
        }
      }
    },
    en: {
      returnToSilence: 'Return to Silence',
      scrollSections: [
        {
          id: 'doi-song',
          title: 'THREE EMPTINESSES',
          label: 'Three Emptinesses'
        },
        { id: 'tam-thanh-tinh', title: 'PURE MIND', label: 'Pure Mind' },
        { id: 'chung-sanh', title: 'INNER BEINGS', label: 'Inner Beings' },
        { id: 'vong', title: 'ILLUSION', label: 'ILLUSION' },
        {
          id: 'phat-da-hanh',
          title: 'BUDDHA PRACTICE',
          label: 'Buddha Practice'
        },
        { id: 'phap-mon', title: 'WORDLESS DHARMA', label: 'Wordless Dharma' },
        { id: 'tu-tanh', title: 'RETURN TO SELF-NATURE', label: 'Self-Nature' },
        { id: 'huynh-de', title: 'WALKING TOGETHER', label: 'Brotherhood' }
      ],
      sections: {
        tamThanhTinh: {
          title: 'CONSTANTLY PRACTICE PURE MIND',
          quote:
            'Mind without disturbance, without delusion, without attachment',
          description:
            'A mind that is pure, undisturbed, and free from ignorance'
        },
        chungSanh: {
          title: 'ELIMINATE INNER BEINGS',
          defilements: [
            { viet: 'Greed', char: '貪' },
            { viet: 'Anger', char: '瞋' },
            { viet: 'Ignorance', char: '癡' },
            { viet: 'Pride', char: '慢' },
            { viet: 'Doubt', char: '疑' },
            { viet: 'Wrong View', char: '見' },
            { viet: 'Craving', char: '愛' },
            { viet: 'Grasping', char: '取' },
            { viet: 'Becoming', char: '有' }
          ],
          quote:
            'Eliminate without seeing anyone being eliminated — that is Buddha Nature manifesting.'
        },
        vong: {
          title: 'SEE FORMS BUT DO NOT CHASE ILLUSIONS',
          description: 'All forms are illusions - do not chase them',
          quote:
            'The moment you stop chasing illusions, you return to True Nature.'
        },
        phatDaHanh: {
          title: 'DHARMA CONSTANTLY ARISES FROM SELF-NATURE',
          description: 'Let all things arise naturally from your True Nature',
          quote:
            'Peacefully practice Buddha Way — live in the world without being swept away by it.'
        },
        phapMon: {
          title: 'The Essence is "Emptiness"',
          description: 'Truth is formless, wordless, present here and now',
          fingerMoon: 'finger pointing at moon',
          realMoon: 'real moon',
          quote:
            'Truth is not found in ink and paper. It resides in Awakened Nature.'
        },
        tuTanh: {
          title: 'RETURN TO SELF-NATURE',
          beforeName: 'before name, before thought',
          whoAreYou: 'who are YOU?',
          hoverText: 'Hover to reveal the silent observer'
        },
        TamVo: {
          title: 'THREE EMPTINESSES',
          concepts: [
            {
              title: 'No-Self',
              description:
                'No longer clinging to the ego, not seeing anything as belonging to oneself.'
            },
            {
              title: 'No-Form',
              description:
                'Not clinging to any forms because they are all illusions.'
            },
            {
              title: 'No-Thought',
              description:
                'No longer having thoughts of desire, living according to conditions without attachment.'
            }
          ],
          quote:
            'Those who thoroughly understand these three dharmas will realize that their original nature is inherently pure, undefiled by worldly phenomena, and their actions are not bound by anything.'
        },
        huynhDe: {
          title: 'WALKING TOGETHER AS BROTHERS',
          description:
            'You are not alone on this path. The Sangha is alive and walking together.',
          joinText: 'Join',
          communityText: 'Community',
          quote:
            'If these words resonate deeply, you are already part of the brotherhood.',
          endText: 'The scroll ends in stillness...'
        }
      }
    }
  }
  const [activeSection, setActiveSection] = useState('doi-song')
  const [floatingIndex, setFloatingIndex] = useState(0)
  const [showKnowing, setShowKnowing] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFloatingIndex((prev) => (prev + 1) % floatingCharacters.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sections = translations[language].scrollSections.map(
        (section) => section.id
      )
      const scrollPosition = window.scrollY + 200 // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i])
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i])
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Call once to set initial state

    return () => window.removeEventListener('scroll', handleScroll)
  }, [translations[language].scrollSections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  const SectionDivider = () => (
    <div className='flex justify-center py-12 md:py-16'>
      <div className='w-32 h-1 bg-gradient-to-r from-transparent via-red-800/40 to-transparent rounded-full' />
      <div className='absolute w-8 h-8 bg-red-800/20 rounded-full border-2 border-red-800/40 flex items-center justify-center'>
        <div className='w-3 h-3 bg-red-800/60 rounded-full' />
      </div>
    </div>
  )

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.5, delayChildren: 0.3 }
    }
  }

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, ease: 'easeOut' }
    }
  }

  const scrollSections = translations[language].scrollSections
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  return (
    <main className='min-h-screen bg-[#EFE0BD] text-[#8B4513] relative'>
      <nav className='fixed left-4 top-1/2 transform -translate-y-1/2 z-50 hidden md:block'>
        <div className='flex flex-col space-y-3'>
          {scrollSections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`group relative w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                activeSection === section.id
                  ? 'bg-[#991b1b] shadow-lg shadow-[#991b1b]/30'
                  : 'bg-[#8B4513]/40 hover:bg-[#8B4513]/70'
              }`}
              aria-label={`Go to ${section.label}`}
            >
              {/* Tooltip */}
              <div className='absolute left-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none'>
                <div className='bg-[#991b1b] text-white px-3 py-1 rounded-lg text-sm font-serif whitespace-nowrap shadow-lg'>
                  {section.label}
                  <div className='absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-[#991b1b]'></div>
                </div>
              </div>

              {/* Active indicator ring */}
              {activeSection === section.id && (
                <div
                  className={`absolute inset-0 rounded-full border-2 animate-ping ${
                    index === 0
                      ? 'border-[#991b1b] shadow-lg shadow-[#991b1b]/50' // Special styling for first dot
                      : 'border-[#991b1b]/50'
                  }`}
                ></div>
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Top Navigation Bar */}
      <header className='fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-[#EFE0BD]/80 backdrop-blur-sm border-b border-[#8B4513]/10'>
        {/* Return to Silence Button */}
        <Link
          href='/'
          className='flex items-center space-x-2 text-[#8B4513]/80 hover:text-[#8B4513] transition-colors bg-[#D4AF8C]/30 backdrop-blur-sm px-4 py-2 rounded-full border border-[#8B4513]/20 hover:border-[#8B4513]/40'
        >
          <ArrowLeft className='w-4 h-4' />
          <span className='font-serif text-sm hidden sm:inline'>
            {translations[language].returnToSilence}
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
            onClick={toggleLanguage}
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

      {/* Floating AI Button - Bottom Right Corner với màu sắc mới */}
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
          {/* Thêm lớp phủ mở rộng khu vực click trên mobile */}
          <div className='absolute -inset-4 md:inset-0 z-20'></div>

          {/* Golden Light Effect */}
          <div className='absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent animate-golden-sweep'></div>
          <div className='absolute inset-0 rounded-full bg-gradient-conic from-yellow-400/20 via-amber-300/30 via-yellow-200/25 to-yellow-400/20 animate-golden-rotate opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>

          {/* Radial Golden Glow */}
          <div className='absolute inset-0 rounded-full bg-gradient-radial from-yellow-200/40 via-amber-300/20 to-transparent animate-pulse-golden'></div>

          <div className='relative z-20 w-20 h-20'>
            <img
              src='/images/giac-ngo-logo-1.png'
              alt='Giac Ngo'
              className='w-full h-full object-contain filter sepia(100%) hue-rotate(-30deg) saturate(200%)'
            />
          </div>

          {/* Tooltip */}
          <div className='absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm font-serif rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap'>
            Wordless Sutra
            <div className='absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80'></div>
          </div>

          {/* Animated Rings */}
          <div className='absolute inset-0 rounded-full border-2 border-yellow-400/50 animate-ping'></div>
          <div className='absolute inset-0 rounded-full bg-gradient-to-r from-[#991b1b]/10 to-[#991b1b]/15 group-hover:from-[#991b1b]/20 group-hover:to-[#991b1b]/25 transition-all duration-300'></div>

          {/* Golden Floating Particles Effect */}
          <div className='absolute inset-0 overflow-hidden rounded-full pointer-events-none'>
            <div className='absolute w-1 h-1 bg-yellow-300/80 rounded-full animate-float-1 shadow-[0_0_4px_rgba(255,215,0,0.8)]'></div>
            <div className='absolute w-1 h-1 bg-amber-200/70 rounded-full animate-float-2 shadow-[0_0_3px_rgba(255,215,0,0.6)]'></div>
            <div className='absolute w-1 h-1 bg-yellow-400/90 rounded-full animate-float-3 shadow-[0_0_5px_rgba(255,215,0,1)]'></div>
          </div>

          {/* Buddha Light Rays */}
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute top-1/2 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-yellow-300/60 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-45 animate-ray-1'></div>
            <div className='absolute top-1/2 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-135 animate-ray-2'></div>
            <div className='absolute top-1/2 left-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-200/70 to-transparent transform -translate-x-1/2 -translate-y-1/2 animate-ray-3'></div>
            <div className='absolute top-1/2 left-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-90 animate-ray-4'></div>
          </div>
        </Link>
      </div>
      {/* Section 1: Tam Vô */}
      <section
        id='doi-song'
        className='pt-24 pb-16 md:pt-32 md:pb-32'
      >
        <motion.div
          className='max-w-4xl mx-auto px-4 sm:px-8 text-center'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2
            className='text-3xl md:text-5xl font-serif mb-8 md:mb-12 text-[#991b1b]'
            variants={itemVariants}
          >
            {translations[language].sections.TamVo.title}
          </motion.h2>

          <motion.div
            className='grid grid-cols-3 gap-3 md:gap-6 mb-12 md:mb-16'
            variants={itemVariants}
          >
            {translations[language].sections.TamVo.concepts.map(
              (concept, index) => (
                <motion.div
                  key={index}
                  className='bg-[#991b1b]/5 border-2 border-[#991b1b]/20 rounded-xl p-3 md:p-6 hover:bg-[#991b1b]/10 hover:border-[#991b1b]/40 transition-all duration-300'
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02, y: -2 }}
                >
                  <h3 className='text-lg md:text-2xl lg:text-3xl font-serif font-bold text-[#991b1b] mb-2 md:mb-4'>
                    {concept.title}
                  </h3>
                  <p className='text-xs md:text-base lg:text-lg font-serif text-[#991b1b]/80 leading-relaxed whitespace-pre-line'>
                    {concept.description}
                  </p>
                </motion.div>
              )
            )}
          </motion.div>

          <motion.blockquote
            className='text-lg md:text-2xl font-serif italic leading-relaxed text-[#991b1b]/90'
            variants={itemVariants}
          >
            "{translations[language].sections.TamVo.quote}"
          </motion.blockquote>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 2: Tâm Thanh Tịnh */}
      <section
        id='tam-thanh-tinh'
        className='py-16 md:py-32'
      >
        <motion.div
          className='max-w-4xl mx-auto px-4 sm:px-8 text-center'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2
            className='text-3xl md:text-5xl font-serif mb-8 md:mb-12 text-[#991b1b]'
            variants={itemVariants}
          >
            {translations[language].sections.tamThanhTinh.title}
          </motion.h2>
          <motion.div
            className='text-2xl md:text-3xl font-serif mb-12 md:mb-16 space-y-4'
            variants={itemVariants}
          >
            <motion.div
              className='text-7xl md:text-9xl h-28 md:h-32 flex items-center justify-center'
              variants={itemVariants}
            >
              <AnimatePresence mode='wait'>
                <motion.span
                  key={floatingCharacters[floatingIndex]}
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(2px)' }}
                  transition={{ duration: 2 }}
                  className='text-[#991b1b]/90'
                >
                  {floatingCharacters[floatingIndex]}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          </motion.div>
          <motion.blockquote
            className='text-lg md:text-2xl font-serif italic leading-relaxed text-[#991b1b]/80 mb-8'
            variants={itemVariants}
          >
            "{translations[language].sections.tamThanhTinh.quote}"
          </motion.blockquote>
          <motion.p
            className='text-base md:text-lg font-serif text-[#991b1b]/70'
            variants={itemVariants}
          >
            {translations[language].sections.tamThanhTinh.description}
          </motion.p>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 3: Chúng Sanh Bên Trong */}
      <section
        id='chung-sanh'
        className='py-16 md:py-32'
      >
        <motion.div
          className='max-w-4xl mx-auto px-4 sm:px-8 text-center'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2
            className='text-3xl md:text-5xl font-serif mb-8 md:mb-12 text-[#991b1b]'
            variants={itemVariants}
          >
            {translations[language].sections.chungSanh.title}
          </motion.h2>
          <motion.div
            className='flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-12 md:mb-16 max-w-3xl mx-auto'
            variants={itemVariants}
          >
            {translations[language].sections.chungSanh.defilements.map(
              (item, index) => (
                <motion.div
                  key={index}
                  className='flex flex-col items-center space-y-2'
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.15, duration: 1.2 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1, y: -5 }}
                >
                  <span className='text-5xl md:text-7xl font-serif text-[#991b1b]/80 hover:text-[#991b1b] transition-colors duration-300'>
                    {item.char}
                  </span>
                  <span className='text-xs md:text-sm font-serif text-[#991b1b]/60 italic'>
                    {item.viet}
                  </span>
                </motion.div>
              )
            )}
          </motion.div>
          <motion.blockquote
            className='text-lg md:text-2xl font-serif italic leading-relaxed text-[#991b1b]/80'
            variants={itemVariants}
          >
            "{translations[language].sections.chungSanh.quote}"
          </motion.blockquote>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 4: Vọng */}
      <section
        id='vong'
        className='py-16 md:py-32'
      >
        <motion.div
          className='max-w-4xl mx-auto px-4 sm:px-8 text-center'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2
            className='text-3xl md:text-5xl font-serif mb-8 md:mb-12 text-[#991b1b]'
            variants={itemVariants}
          >
            {translations[language].sections.vong.title}
          </motion.h2>
          <motion.p
            className='text-lg md:text-2xl font-serif leading-relaxed mb-12 text-[#991b1b]/80'
            variants={itemVariants}
          >
            {translations[language].sections.vong.description}
          </motion.p>
          <motion.div
            className='relative'
            variants={itemVariants}
          >
            <motion.span
              className='text-5xl md:text-6xl font-serif text-[#991b1b]/60'
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              vọng
            </motion.span>
          </motion.div>
          <motion.blockquote
            className='text-lg md:text-2xl font-serif italic leading-relaxed text-[#991b1b]/80 mt-12'
            variants={itemVariants}
          >
            "{translations[language].sections.vong.quote}"
          </motion.blockquote>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 5: Phật Đà Hành */}
      <section
        id='phat-da-hanh'
        className='py-16 md:py-32'
      >
        <motion.div
          className='max-w-4xl mx-auto px-4 sm:px-8 text-center'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2
            className='text-3xl md:text-5xl font-serif mb-8 md:mb-12 text-[#991b1b]'
            variants={itemVariants}
          >
            {translations[language].sections.phatDaHanh.title}
          </motion.h2>
          <motion.p
            className='text-lg md:text-2xl font-serif leading-relaxed mb-12 text-[#991b1b]/80'
            variants={itemVariants}
          >
            {translations[language].sections.phatDaHanh.description}
          </motion.p>
          <motion.blockquote
            className='text-xl md:text-3xl font-serif italic leading-relaxed text-[#991b1b]/90'
            variants={itemVariants}
          >
            "{translations[language].sections.phatDaHanh.quote}"
          </motion.blockquote>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 6: Pháp Môn Vô Tự */}
      <section
        id='phap-mon'
        className='py-16 md:py-32'
      >
        <motion.div
          className='max-w-4xl mx-auto px-4 sm:px-8 text-center'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2
            className='text-3xl md:text-5xl font-serif mb-8 md:mb-12 text-[#991b1b]'
            variants={itemVariants}
          >
            {translations[language].sections.phapMon.title}
          </motion.h2>
          <motion.p
            className='text-lg md:text-2xl font-serif leading-relaxed mb-12 text-[#991b1b]/80'
            variants={itemVariants}
          >
            {translations[language].sections.phapMon.description}
          </motion.p>
          <motion.div
            className='flex justify-center items-center space-x-4 md:space-x-8 mb-12 md:mb-16'
            variants={itemVariants}
          >
            <span className='text-base md:text-lg font-serif text-[#991b1b]/60'>
              {translations[language].sections.phapMon.fingerMoon}
            </span>
            <span className='text-xl md:text-2xl'>≠</span>
            <span className='text-base md:text-lg font-serif text-[#991b1b]'>
              {translations[language].sections.phapMon.realMoon}
            </span>
          </motion.div>
          <motion.blockquote
            className='text-xl md:text-3xl font-serif italic leading-relaxed text-[#991b1b]/90'
            variants={itemVariants}
          >
            "{translations[language].sections.phapMon.quote}"
          </motion.blockquote>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 7: Trở Về Tự Tánh */}
      <section
        id='tu-tanh'
        className='py-16 md:py-32'
      >
        <motion.div
          className='max-w-4xl mx-auto px-4 sm:px-8 text-center'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
          onMouseEnter={() => setShowKnowing(true)}
          onMouseLeave={() => setShowKnowing(false)}
        >
          <motion.h2
            className='text-3xl md:text-5xl font-serif mb-8 md:mb-12 text-[#991b1b]'
            variants={itemVariants}
          >
            {translations[language].sections.tuTanh.title}
          </motion.h2>
          <motion.div
            className='space-y-8 mb-12 md:mb-16 min-h-[10rem]'
            variants={itemVariants}
          >
            <AnimatePresence mode='wait'>
              {!showKnowing ? (
                <motion.div
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className='space-y-6'
                >
                  <p className='text-lg md:text-2xl font-serif text-[#991b1b]/80'>
                    {translations[language].sections.tuTanh.beforeName}
                  </p>
                  <p className='text-lg md:text-2xl font-serif text-[#991b1b]/80'>
                    {translations[language].sections.tuTanh.whoAreYou}
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='text-7xl md:text-8xl font-serif text-[#991b1b]'
                >
                  知
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          <motion.p
            className='text-base md:text-lg font-serif text-[#991b1b]/60 italic'
            variants={itemVariants}
          >
            {translations[language].sections.tuTanh.hoverText}
          </motion.p>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 8: Huynh Đệ Đồng Hành */}
      <section
        id='huynh-de'
        className='py-16 md:py-32'
      >
        <motion.div
          className='max-w-4xl mx-auto px-4 sm:px-8 text-center'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2
            className='text-3xl md:text-5xl font-serif mb-8 md:mb-12 text-[#991b1b]'
            variants={itemVariants}
          >
            {translations[language].sections.huynhDe.title}
          </motion.h2>
          <motion.p
            className='text-lg md:text-2xl font-serif leading-relaxed mb-12 text-[#991b1b]/80'
            variants={itemVariants}
          >
            {translations[language].sections.huynhDe.description}
          </motion.p>
          <motion.div
            className='flex justify-center items-center space-x-4 mb-12'
            variants={itemVariants}
          >
            <Link
              href='/community'
              className='inline-flex items-center space-x-2 bg-[#991b1b] text-white px-8 py-4 rounded-full hover:bg-[#991b1b]/90 transition-all duration-300 hover:scale-105 font-serif text-lg'
            >
              <span>{translations[language].sections.huynhDe.joinText}</span>
              <span>
                {translations[language].sections.huynhDe.communityText}
              </span>
            </Link>
          </motion.div>
          <motion.blockquote
            className='text-lg md:text-2xl font-serif italic leading-relaxed text-[#991b1b]/80 mb-8'
            variants={itemVariants}
          >
            "{translations[language].sections.huynhDe.quote}"
          </motion.blockquote>
          <motion.p
            className='text-base md:text-lg font-serif text-[#991b1b]/60 italic'
            variants={itemVariants}
          >
            {translations[language].sections.huynhDe.endText}
          </motion.p>
        </motion.div>
      </section>

      {/* Final breathing space */}
      <div className='py-16'></div>

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

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
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

        /* Custom gradient for radial */
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }

        .bg-gradient-conic {
          background: conic-gradient(var(--tw-gradient-stops));
        }

        /* Mobile-specific improvements */
        @media (max-width: 768px) {
          /* Improve touch targets */
          button,
          a {
            min-height: 44px;
            min-width: 44px;
          }

          /* Improve text readability */
          .text-sm {
            font-size: 0.9rem;
          }

          /* Adjust spacing for mobile */
          section {
            padding-top: 1.5rem;
            padding-bottom: 1.5rem;
          }
        }
      `}</style>
    </main>
  )
}
