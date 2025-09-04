'use client'

import { motion, Variants } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import SiteFooter from '@/components/site-footer'

export default function CommunityPage() {
  const [activeSection, setActiveSection] = useState('CỘNG ĐỒNG')
  const [language, setLanguage] = useState<'vi' | 'en'>('vi')

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'vi' ? 'en' : 'vi'))
  }

  const translations = {
    vi: {
      returnToSutra: 'Return to Sutra',
      scrollSections: [
        { id: 'foundation', title: 'Nền Tảng Tâm Linh', label: 'Nền Tảng' },
        { id: 'calendar', title: 'Lịch Sinh Hoạt', label: 'Lịch' },
      ],
      header: {
        title: 'CỘNG ĐỒNG',
        subtitle: 'Huynh đệ đồng hành trên con đường Giác Ngộ',
        description:
          'Giác Ngộ không phải là một tổ chức, một tôn giáo hay một học thuyết. Nó là con đường để mỗi người tự "Rõ Mình" và "Về Nhà Xưa"',
        awakening: 'Giác',
        enlightenment: 'Ngộ',
      },
      sections: {
        foundation: {
          title: 'NỀN TẢNG',
          mission: {
            title: 'SỨ MỆNH & TẦM NHÌN',
            content:
              'Không phải là một bản tuyên ngôn, mà là tâm nguyện của Sư Cha Tam Vô và các Thiền Sư đã Ngộ Đạo: Giúp cho chúng sanh đang lặn lội trong bể khổ nhận ra mình vốn là Phật, tự mình thoát khỏi mọi trói buộc để trở về với sự an lạc, tự do tự tại vốn có.\n\nTầm nhìn là thấy rõ tất cả chúng sanh đều có Phật Tánh, đều có khả năng tỉnh ngộ. Con đường không phải là đi đến một nơi nào xa xôi, mà là quay về "Nhà Xưa", về "Quê Cũ", nơi bản thể chân thật của chính mình.',
          },
          teachings: {
            title: 'GIÁO LÝ',
            content:
              'Giáo lý của Giác Ngộ không nằm trong kinh điển, dù là Kinh Kim Cang hay Bát Nhã. Chân kinh thật sự là "Vô Tự Chân Kinh", phải "liễu ý bỏ lời". Giáo lý ở đây là sự khai thị trực tiếp, là những câu hỏi xoáy thẳng vào tâm người học để phá tan kiến chấp.\n\nGiáo lý chính là nhận ra cái "Ai" đó, cái Tánh Thấy, Nghe, Nói, Biết rõ ràng đang hiện hữu nơi Quý Vị.',
          },
          practice: {
            title: 'THỰC HÀNH',
            content:
              'Pháp của Giác Ngộ là Vô Tu, Vô Chứng. Tu mà còn dụng công thì không thể giải thoát. Thiền chân chánh là sống tỉnh thức, thấy rõ thân tâm này đang vận hành mà không đồng hóa mình với nó.\n\n"Pháp hành đúng đắn chỉ có một: Sống tỉnh thức, tách biệt Bản Thể và Thân-Tâm. Làm việc gì biết rõ việc đó, không dính mắc vào kết quả. Đó chính là thiền, là niệm Phật, là giải thoát ngay tại đây."',
          },
          beliefs: {
            title: 'NIỀM TIN & TRUYỀN THỐNG',
            content:
              'Niềm tin cốt lõi duy nhất - Tự Tánh là Phật Tánh. Mỗi chúng sanh vốn đã là Phật, không cần tìm cầu bên ngoài. Giải thoát là trở về, không phải đi tới.\n\nTruyền thống: Phá Chấp • Đạo Nhân Vô Tu Vô Chứng • Dĩ Tâm Truyền Tâm\n\n"Giác Ngộ Phật dạy là chi\nNgười luôn hiểu biết hết đi lòng vòng\nGiải thoát thì phải làm sao\nHành không dính mắc thế nào cũng ra"',
          },
        },
        calendar: {
          title: 'LỊCH SINH HOẠT',
          description:
            'Lịch sinh hoạt cộng đồng, các buổi chia sẻ và thực hành chung.',
          activities: [
            {
              frequency: 'Hàng ngày',
              title: 'Thiền tọa hai lần',
              time: '4:45 sáng và 8:45 tối (giờ Việt Nam) - thời khắc giao thoa',
              description:
                'Daily meditation twice a day at 4:45am and 8:45pm Vietnam time - the transitional moments',
            },
            {
              frequency: 'Thứ 7 hàng tuần',
              title: 'Huynh Đệ chia sẻ',
              time: '7:30 tối',
              description: 'Weekly sharing on Saturday at 7:30pm',
            },
            {
              frequency: 'Hàng tháng',
              title: 'Về Nhà Như Lai - Sư Cha khai thị',
              time: 'Dành cho huynh đệ nào đã được Kiến Tánh và hành tinh tấn',
              description:
                'Monthly teaching of Sư Cha for those who have attained Kiến Tánh',
            },
          ],
        },
      },
    },
    en: {
      returnToSutra: 'Return to Sutra',
      scrollSections: [
        {
          id: 'foundation',
          title: 'Spiritual Foundation',
          label: 'Foundation',
        },
        { id: 'calendar', title: 'Activity Calendar', label: 'Calendar' },
      ],
      header: {
        title: 'COMMUNITY',
        subtitle: 'Brothers walking together on the path of Awakening',
        description:
          'Awakening is not an organization, a religion, or a doctrine. It is the path for each person to "Know Themselves" and "Return Home"',
        awakening: 'Awakening',
        enlightenment: 'Enlightenment',
      },
      sections: {
        foundation: {
          title: 'FOUNDATION',
          mission: {
            title: 'MISSION & VISION',
            content:
              'Not a manifesto, but the heartfelt aspiration of Master Tam Vô and the enlightened Zen Masters: To help beings drowning in the ocean of suffering realize they are inherently Buddha, to free themselves from all bondage and return to the peace, freedom and ease that is their true nature.\n\nThe vision is to see clearly that all beings have Buddha Nature, all have the capacity for awakening. The path is not going to some distant place, but returning to the "Original Home", to the "Ancient Country", where one\'s true essence resides.',
          },
          teachings: {
            title: 'TEACHINGS',
            content:
              'The teachings of Awakening are not found in scriptures, whether the Diamond Sutra or Prajnaparamita. The true sutra is the "Wordless True Sutra", one must "understand the meaning and abandon the words". The teaching here is direct pointing, penetrating questions that go straight to the student\'s mind to shatter attachments.\n\nThe teaching is precisely recognizing that "Who" - the Nature that Sees, Hears, Speaks, and Knows clearly present in you.',
          },
          practice: {
            title: 'PRACTICE',
            content:
              'The Dharma of Awakening is No Practice, No Attainment. If practice still requires effort, liberation is impossible. True meditation is living awakely, seeing clearly how body and mind operate without identifying with them.\n\n"There is only one correct dharma practice: Living awakely, separating Essence from Body-Mind. Whatever you do, know it clearly, without attachment to results. That is meditation, that is reciting Buddha, that is liberation right here."',
          },
          beliefs: {
            title: 'BELIEFS & TRADITIONS',
            content:
              'The only core belief - Self-Nature is Buddha Nature. Every being is already Buddha, no need to seek outside. Liberation is returning, not going forward.\n\nTraditions: Breaking Attachments • The Realized Person Has No Practice, No Attainment • Mind-to-Mind Transmission\n\n"What is the Awakening Buddha taught\nPeople always understanding, stop going in circles\nHow must one achieve liberation\nAct without attachment, any way works"',
          },
        },
        calendar: {
          title: 'ACTIVITY CALENDAR',
          description:
            'Community activity schedule, sharing sessions and group practice.',
          activities: [
            {
              frequency: 'Daily',
              title: 'Meditation twice daily',
              time: '4:45am and 8:45pm (Vietnam time) - transitional moments',
              description:
                'Daily meditation twice a day at 4:45am and 8:45pm Vietnam time - the transitional moments',
            },
            {
              frequency: 'Weekly Saturday',
              title: 'Brotherhood sharing',
              time: '7:30pm',
              description: 'Weekly sharing on Saturday at 7:30pm',
            },
            {
              frequency: 'Monthly',
              title: "Returning to Tathagata Home - Master's teaching",
              time: 'For brothers who have attained Seeing Nature and practice diligently',
              description:
                'Monthly teaching of Master for those who have attained Seeing Nature',
            },
          ],
        },
      },
    },
  }

  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (
      hash &&
      translations[language].scrollSections.find(
        (section) => section.id === hash
      )
    ) {
      setTimeout(() => {
        scrollToSection(hash)
      }, 100)
    }
  }, [language])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  const SectionDivider = () => (
    <div className='flex justify-center py-6 md:py-8'>
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

  return (
    <main className='min-h-screen text-white relative'>
      <header className='fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-background/30 backdrop-blur-sm'>
        {/* Return to Sutra Button */}
        <Link
          href='/sutra'
          className='flex items-center space-x-2 text-[#991b1b]/80 hover:text-[#991b1b] transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full'
        >
          <ArrowLeft className='w-4 h-4' />
          <span className='font-serif text-sm'>
            {translations[language].returnToSutra}
          </span>
        </Link>

        {/* Horizontal Scroll Navigation - Hidden on mobile */}
        <div className='hidden md:flex items-center space-x-2'>
          {scrollSections.map((section) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className={`px-3 py-1 rounded-full border transition-all duration-300 text-xs font-serif ${
                activeSection === section.id
                  ? 'bg-red-800/30 border-red-800/60 text-[#991b1b]'
                  : 'bg-transparent border-transparent text-[#991b1b]/60 hover:border-[#991b1b]/60 hover:text-[#991b1b]'
              }`}
              title={section.title}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Language Toggle Button */}
        <button
          onClick={toggleLanguage}
          className='flex items-center space-x-2 text-[#991b1b]/80 hover:text-[#991b1b] transition-colors bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full'
        >
          <span className='font-serif text-sm'>
            {language === 'vi' ? 'ENG | VIE' : 'VIE | ENG'}
          </span>
        </button>
      </header>

      <section
        id='community-top'
        className='pt-20 pb-8 md:pt-24 md:pb-12'
      >
        <motion.div
          className='max-w-4xl mx-auto px-4 sm:px-8 text-center'
          variants={containerVariants}
          initial='hidden'
          animate='visible'
        >
          <motion.h1
            className='text-4xl md:text-6xl font-serif mb-8 text-[#991b1b]'
            variants={itemVariants}
          >
            {translations[language].header.title}
          </motion.h1>
          <motion.p
            className='text-lg md:text-2xl font-serif italic text-[#991b1b]/60 mb-12'
            variants={itemVariants}
          >
            {translations[language].header.subtitle}
          </motion.p>
          <motion.div
            className='text-4xl md:text-5xl font-serif text-[#991b1b]/60 mb-8 h-16 flex items-center justify-center space-x-4 md:space-x-4'
            variants={itemVariants}
          >
            <motion.div
              className='flex flex-col items-center space-y-1'
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: 0,
              }}
            >
              <span className='text-4xl md:text-5xl'>覺</span>
              <span className='text-sm text-[#991b1b]/60'>Giác</span>
              <span className='text-xs text-[#991b1b]/50 italic'>
                {translations[language].header.awakening}
              </span>
            </motion.div>
            <motion.div
              className='flex flex-col items-center space-y-1'
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                delay: 1.5,
              }}
            >
              <span className='text-4xl md:text-5xl'>悟</span>
              <span className='text-sm text-[#991b1b]/60'>Ngộ</span>
              <span className='text-xs text-[#991b1b]/50 italic'>
                {translations[language].header.enlightenment}
              </span>
            </motion.div>
          </motion.div>
          <motion.p
            className='text-base md:text-lg font-serif text-[#991b1b]/70'
            variants={itemVariants}
          >
            {translations[language].header.description}
          </motion.p>
        </motion.div>
      </section>

      <SectionDivider />

      {/* Consolidated Foundation Section */}
      <section
        id='foundation'
        className='py-8 md:py-16'
      >
        <motion.div
          className='max-w-6xl mx-auto px-4 sm:px-8'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2
            className='text-3xl md:text-5xl font-serif mb-8 text-[#991b1b] text-center'
            variants={itemVariants}
          >
            {translations[language].sections.foundation.title}
          </motion.h2>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12'>
            {/* Left Column */}
            <motion.div
              className='space-y-8'
              variants={itemVariants}
            >
              <div>
                <h3 className='text-xl md:text-2xl font-serif mb-4 text-[#991b1b] font-semibold'>
                  {translations[language].sections.foundation.mission.title}
                </h3>
                <p className='text-base md:text-lg font-serif leading-relaxed text-[#991b1b]/90 whitespace-pre-wrap'>
                  {translations[language].sections.foundation.mission.content}
                </p>
              </div>

              <div>
                <h3 className='text-xl md:text-2xl font-serif mb-4 text-[#991b1b] font-semibold'>
                  {translations[language].sections.foundation.teachings.title}
                </h3>
                <p className='text-base md:text-lg font-serif leading-relaxed text-[#991b1b]/90 whitespace-pre-wrap'>
                  {translations[language].sections.foundation.teachings.content}
                </p>
              </div>
            </motion.div>

            {/* Right Column */}
            <motion.div
              className='space-y-8'
              variants={itemVariants}
            >
              <div>
                <h3 className='text-xl md:text-2xl font-serif mb-4 text-[#991b1b] font-semibold'>
                  {translations[language].sections.foundation.practice.title}
                </h3>
                <p className='text-base md:text-lg font-serif leading-relaxed text-[#991b1b]/90 whitespace-pre-wrap'>
                  {translations[language].sections.foundation.practice.content}
                </p>
              </div>

              <div>
                <h3 className='text-xl md:text-2xl font-serif mb-4 text-[#991b1b] font-semibold'>
                  {translations[language].sections.foundation.beliefs.title}
                </h3>
                <p className='text-base md:text-lg font-serif leading-relaxed text-[#991b1b]/90 whitespace-pre-wrap'>
                  {translations[language].sections.foundation.beliefs.content}
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <SectionDivider />

      <section
        id='calendar'
        className='py-8 md:py-16'
      >
        <motion.div
          className='max-w-4xl mx-auto px-4 sm:px-8 text-center'
          variants={containerVariants}
          initial='hidden'
          whileInView='visible'
          viewport={{ once: true }}
        >
          <motion.h2
            className='text-2xl md:text-4xl font-serif mb-4 md:mb-6 text-[#991b1b]'
            variants={itemVariants}
          >
            {translations[language].sections.calendar.title}
          </motion.h2>
          <motion.div
            className='space-y-4 text-base md:text-lg font-serif leading-relaxed'
            variants={itemVariants}
          >
            <p className='text-[#991b1b]/90 mb-8'>
              {translations[language].sections.calendar.description}
            </p>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4 max-w-5xl mx-auto'>
              {translations[language].sections.calendar.activities.map(
                (activity, index) => (
                  <div
                    key={index}
                    className='space-y-2'
                  >
                    <p className='text-[#991b1b]/60 text-sm md:text-base'>
                      {activity.frequency}
                    </p>
                    <p className='text-[#991b1b] text-base md:text-lg font-semibold'>
                      {activity.title}
                    </p>
                    <p className='text-[#991b1b]/80 text-xs md:text-sm'>
                      {activity.time}
                    </p>
                    <p className='text-[#991b1b]/60 text-xs md:text-sm italic'>
                      {activity.description}
                    </p>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      </section>
      <SiteFooter />
    </main>
  )
}
