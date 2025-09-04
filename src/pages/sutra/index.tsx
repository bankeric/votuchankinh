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
        {
          id: 'tam-thanh-tinh',
          title: 'TÂM THANH TỊNH',
          label: 'Tâm Thanh Tịnh',
        },
        {
          id: 'chung-sanh',
          title: 'CHÚNG SANH BÊN TRONG',
          label: 'Chúng Sanh',
        },
        { id: 'tanh-chon', title: 'TÁNH CHƠN', label: 'Tánh Chơn' },
        { id: 'phat-da-hanh', title: 'PHẬT ĐÀ HÀNH', label: 'Phật Đà Hành' },
        { id: 'phap-mon', title: 'PHÁP MÔN VÔ TỰ', label: 'Kinh Không Chữ' },
        { id: 'tu-tanh', title: 'TRỞ VỀ TỰ TÁNH', label: 'Tự Tánh' },
        { id: 'doi-song', title: 'HÀNH TRONG ĐỜI', label: 'Hành Đạo' },
        { id: 'huynh-de', title: 'HUYNH ĐỆ ĐỒNG HÀNH', label: 'Huynh Đệ' },
      ],
      sections: {
        tamThanhTinh: {
          title: 'THƯỜNG HÀNH TÂM THANH TỊNH',
          quote: 'Tâm không loạn động, không si mê, không dính mắc',
          description:
            'A mind that is pure, undisturbed, and free from ignorance',
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
            { viet: 'Hữu', char: '有' },
          ],
          quote:
            'Diệt nhưng không thấy ai bị diệt — đó là Tánh Phật hiện tiền.',
        },
        tanhChon: {
          title: 'KIẾN TƯỚNG BẤT HÀNH VỌNG',
          description: 'All forms are illusions - do not chase them',
          quote: 'Ngay khi không chạy theo vọng, bạn trở về nơi Tánh Chơn.',
        },
        phatDaHanh: {
          title: 'TỰ TÁNH PHÁP HẰNG SANH',
          description: 'Let all things arise naturally from your True Nature',
          quote:
            'An nhiên Phật Đà Hành — sống trong đời nhưng không bị đời cuốn đi.',
        },
        phapMon: {
          title: 'Bản thể là "Không"',
          description: 'Truth is formless, wordless, present here and now',
          fingerMoon: 'ngón tay chỉ trăng',
          realMoon: 'trăng thật',
          quote: 'Chân lý không nằm trên giấy mực. Nó nằm nơi Tánh Giác.',
        },
        tuTanh: {
          title: 'TRỞ VỀ VỚI TỰ TÁNH',
          beforeName: 'before name, before thought',
          whoAreYou: 'who are YOU?',
          hoverText: 'Hover to reveal the silent observer',
        },
        doiSong: {
          title: 'HÀNH TRONG ĐỜI SỐNG',
          practices: [
            'Nghe không dính mắc',
            'Làm mà không bị trói buộc',
            'Thiền không phải ngồi',
          ],
          quote: 'Đạo và đời không tách rời. Mọi khoảnh khắc đều là pháp tu.',
        },
        huynhDe: {
          title: 'HUYNH ĐỆ ĐỒNG HÀNH',
          description:
            'You are not alone on this path. The Sangha is alive and walking together.',
          joinText: 'Join',
          communityText: 'Community',
          quote:
            'Nếu bạn thấy lời này thấm sâu, bạn đã là một phần của huynh đệ.',
          endText: 'The scroll ends in stillness...',
        },
      },
    },
    en: {
      returnToSilence: 'Return to Silence',
      scrollSections: [
        { id: 'tam-thanh-tinh', title: 'PURE MIND', label: 'Pure Mind' },
        { id: 'chung-sanh', title: 'INNER BEINGS', label: 'Inner Beings' },
        { id: 'tanh-chon', title: 'TRUE NATURE', label: 'True Nature' },
        {
          id: 'phat-da-hanh',
          title: 'BUDDHA PRACTICE',
          label: 'Buddha Practice',
        },
        { id: 'phap-mon', title: 'WORDLESS DHARMA', label: 'Wordless Dharma' },
        { id: 'tu-tanh', title: 'RETURN TO SELF-NATURE', label: 'Self-Nature' },
        { id: 'doi-song', title: 'PRACTICE IN LIFE', label: 'Life Practice' },
        { id: 'huynh-de', title: 'WALKING TOGETHER', label: 'Brotherhood' },
      ],
      sections: {
        tamThanhTinh: {
          title: 'CONSTANTLY PRACTICE PURE MIND',
          quote:
            'Mind without disturbance, without delusion, without attachment',
          description:
            'A mind that is pure, undisturbed, and free from ignorance',
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
            { viet: 'Becoming', char: '有' },
          ],
          quote:
            'Eliminate without seeing anyone being eliminated — that is Buddha Nature manifesting.',
        },
        tanhChon: {
          title: 'SEE FORMS BUT DO NOT CHASE ILLUSIONS',
          description: 'All forms are illusions - do not chase them',
          quote:
            'The moment you stop chasing illusions, you return to True Nature.',
        },
        phatDaHanh: {
          title: 'DHARMA CONSTANTLY ARISES FROM SELF-NATURE',
          description: 'Let all things arise naturally from your True Nature',
          quote:
            'Peacefully practice Buddha Way — live in the world without being swept away by it.',
        },
        phapMon: {
          title: 'The Essence is "Emptiness"',
          description: 'Truth is formless, wordless, present here and now',
          fingerMoon: 'finger pointing at moon',
          realMoon: 'real moon',
          quote:
            'Truth is not found in ink and paper. It resides in Awakened Nature.',
        },
        tuTanh: {
          title: 'RETURN TO SELF-NATURE',
          beforeName: 'before name, before thought',
          whoAreYou: 'who are YOU?',
          hoverText: 'Hover to reveal the silent observer',
        },
        doiSong: {
          title: 'PRACTICE IN DAILY LIFE',
          practices: [
            'Listen without attachment',
            'Act without being bound',
            'Meditation is not sitting',
          ],
          quote:
            'The Way and life are not separate. Every moment is dharma practice.',
        },
        huynhDe: {
          title: 'WALKING TOGETHER AS BROTHERS',
          description:
            'You are not alone on this path. The Sangha is alive and walking together.',
          joinText: 'Join',
          communityText: 'Community',
          quote:
            'If these words resonate deeply, you are already part of the brotherhood.',
          endText: 'The scroll ends in stillness...',
        },
      },
    },
  }
  const [activeSection, setActiveSection] = useState('tam-thanh-tinh')
  const [floatingIndex, setFloatingIndex] = useState(0)
  const [showKnowing, setShowKnowing] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFloatingIndex((prev) => (prev + 1) % floatingCharacters.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.5, delayChildren: 0.3 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, ease: 'easeOut' },
    },
  } as Variants

  const scrollSections = translations[language].scrollSections
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  return (
    <main className='min-h-screen bg-[#EFE0BD] text-[#8B4513] relative'>
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

        {/* Center Navigation - Library Button */}
        <div className='flex items-center'>
          <Link
            href='/library'
            className='flex items-center space-x-2 text-[#8B4513]/80 hover:text-[#8B4513] transition-all duration-300 bg-[#D4AF8C]/30 backdrop-blur-sm px-4 py-2 rounded-full hover:bg-[#D4AF8C]/50 hover:scale-105 border border-[#8B4513]/20 hover:border-[#8B4513]/40'
          >
            <span className='text-lg'>📚</span>
            <span className='font-serif text-sm hidden sm:inline'>Library</span>
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
          href='/ai'
          className='group relative flex items-center justify-center w-16 h-16 bg-[#EFE0BD] rounded-full shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-110 hover:rotate-12 overflow-hidden'
          style={{
            WebkitTapHighlightColor: 'transparent',
            cursor: 'pointer',
          }}
        >
          {/* Thêm lớp phủ mở rộng khu vực click trên mobile */}
          <div className='absolute -inset-4 md:inset-0 z-20'></div>

          {/* Golden Light Effect */}
          <div className='absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent animate-golden-sweep'></div>
          <div className='absolute inset-0 rounded-full bg-gradient-conic from-yellow-400/20 via-amber-300/30 via-yellow-200/25 to-yellow-400/20 animate-golden-rotate opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>

          {/* Radial Golden Glow */}
          <div className='absolute inset-0 rounded-full bg-gradient-radial from-yellow-200/40 via-amber-300/20 to-transparent animate-pulse-golden'></div>

          {/* AI Logo giữ nguyên ảnh gốc */}
          <div className='relative z-10 w-8 h-8'>
            <img
              src='/images/logo.png'
              alt='Vô Tư AI'
              className='w-full h-full object-contain'
            />
          </div>

          {/* Animated Rings */}
          <div className='absolute inset-0 rounded-full border-2 border-yellow-400/50 animate-ping'></div>
          <div className='absolute inset-0 rounded-full bg-gradient-to-r from-[#991b1b]/10 to-[#991b1b]/15 group-hover:from-[#991b1b]/20 group-hover:to-[#991b1b]/25 transition-all duration-300'></div>

          {/* Tooltip */}
          <div className='absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm font-serif rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap'>
            Vô Tư AI
            <div className='absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80'></div>
          </div>

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
      {/* Section 2: Tâm Thanh Tịnh */}
      <section
        id='tam-thanh-tinh'
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
            &quot;{translations[language].sections.tamThanhTinh.quote}&quot;
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
            &quot;{translations[language].sections.chungSanh.quote}&quot;
          </motion.blockquote>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 4: Tánh Chơn */}
      <section
        id='tanh-chon'
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
            {translations[language].sections.tanhChon.title}
          </motion.h2>
          <motion.p
            className='text-lg md:text-2xl font-serif leading-relaxed mb-12 text-[#991b1b]/80'
            variants={itemVariants}
          >
            {translations[language].sections.tanhChon.description}
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
            &quot;{translations[language].sections.tanhChon.quote}&quot;
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
            &quot;{translations[language].sections.phatDaHanh.quote}&quot;
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
            className='flex justify-center items-center space-x-4 md:space-x-8 mb-12'
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
            &quot;{translations[language].sections.phapMon.quote}&quot;
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

      {/* Section 8: Hành Trong Đời Sống */}
      <section
        id='doi-song'
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
            {translations[language].sections.doiSong.title}
          </motion.h2>
          <motion.div
            className='space-y-6 mb-12 md:mb-16 text-lg md:text-2xl font-serif'
            variants={itemVariants}
          >
            {translations[language].sections.doiSong.practices.map(
              (practice, index) => (
                <p
                  key={index}
                  className='text-[#991b1b]/80'
                >
                  {practice}
                </p>
              )
            )}
          </motion.div>
          <motion.blockquote
            className='text-lg md:text-2xl font-serif italic leading-relaxed text-[#991b1b]/90'
            variants={itemVariants}
          >
            &quot;{translations[language].sections.doiSong.quote}&quot;
          </motion.blockquote>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Section 9: Huynh Đệ Đồng Hành */}
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
            className='text-lg md:text-2xl font-serif leading-relaxed mb-12 md:mb-16 text-[#991b1b]/80'
            variants={itemVariants}
          >
            {translations[language].sections.huynhDe.description}
          </motion.p>
          <motion.div
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className='w-40 h-16 mx-auto mb-12'
          >
            <a
              href='/community'
              className='relative w-full h-full rounded-full border-2 border-[#991b1b]/60 flex items-center justify-center bg-[#991b1b]/10 hover:bg-[#991b1b]/20 hover:border-[#991b1b] transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-xl'
            >
              <div className='flex items-center space-x-3'>
                <span className='text-2xl font-serif text-[#991b1b] group-hover:text-[#991b1b] transition-colors'>
                  法
                </span>
                <div className='flex flex-col items-start'>
                  <span className='text-sm font-serif text-[#991b1b] font-semibold'>
                    {translations[language].sections.huynhDe.joinText}
                  </span>
                  <span className='text-xs font-serif text-[#991b1b]/80'>
                    {translations[language].sections.huynhDe.communityText}
                  </span>
                </div>
              </div>
              <div className='absolute inset-0 rounded-full bg-gradient-to-r from-[#991b1b]/5 to-[#991b1b]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            </a>
          </motion.div>
          <motion.blockquote
            className='text-lg md:text-2xl font-serif italic leading-relaxed text-[#991b1b]/90 mb-16'
            variants={itemVariants}
          >
            &quot;{translations[language].sections.huynhDe.quote}&quot;
          </motion.blockquote>
          <motion.div
            className='pt-16 border-t border-[#991b1b]/20'
            variants={itemVariants}
          ></motion.div>
        </motion.div>
      </section>

      {/* Final breathing space */}
      <div className='h-32' />
      <SiteFooter />
    </main>
  )
}
