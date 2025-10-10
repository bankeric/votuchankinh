'use client'

import { motion, Variant, Variants } from 'framer-motion'
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
        { id: 'events', title: 'Sự Kiện & Vi Hành', label: 'Sự Kiện' }
      ],
      events: 'Sự Kiện',
      header: {
        title: 'CỘNG ĐỒNG',
        subtitle: 'Huynh đệ đồng hành trên con đường Giác Ngộ',
        description:
          'Giác Ngộ không phải là một tổ chức, một tôn giáo hay một học thuyết. Nó là con đường để mỗi người tự "Rõ Mình" và "Về Nhà Xưa"',
        awakening: 'Giác',
        enlightenment: 'Ngộ'
      },
      sections: {
        foundation: {
          title: 'NỀN TẢNG',
          mission: {
            title: 'SỨ MỆNH & TẦM NHÌN',
            content:
              'Không phải là một bản tuyên ngôn, mà là tâm nguyện của Sư Cha Tam Vô và các Thiền Sư đã Ngộ Đạo: Giúp cho chúng sanh đang lặn lội trong bể khổ nhận ra mình vốn là Phật, tự mình thoát khỏi mọi trói buộc để trở về với sự an lạc, tự do tự tại vốn có.\n\nTầm nhìn là thấy rõ tất cả chúng sanh đều có Phật Tánh, đều có khả năng tỉnh ngộ. Con đường không phải là đi đến một nơi nào xa xôi, mà là quay về "Nhà Xưa", về "Quê Cũ", nơi bản thể chân thật của chính mình.'
          },
          teachings: {
            title: 'GIÁO LÝ',
            content:
              'Giáo lý của Giác Ngộ không nằm trong kinh điển, dù là Kinh Kim Cang hay Bát Nhã. Chân kinh thật sự là "Vô Tự Chân Kinh", phải "liễu ý bỏ lời". Giáo lý ở đây là sự khai thị trực tiếp, là những câu hỏi xoáy thẳng vào tâm người học để phá tan kiến chấp.\n\nGiáo lý chính là nhận ra cái "Ai" đó, cái Tánh Thấy, Nghe, Nói, Biết rõ ràng đang hiện hữu nơi Quý Vị.'
          },
          practice: {
            title: 'THỰC HÀNH',
            content:
              'Pháp của Giác Ngộ là Vô Tu, Vô Chứng. Tu mà còn dụng công thì không thể giải thoát. Thiền chân chánh là sống tỉnh thức, thấy rõ thân tâm này đang vận hành mà không đồng hóa mình với nó.\n\n"Pháp hành đúng đắn chỉ có một: Sống tỉnh thức, tách biệt Bản Thể và Thân-Tâm. Làm việc gì biết rõ việc đó, không dính mắc vào kết quả. Đó chính là thiền, là niệm Phật, là giải thoát ngay tại đây."'
          },
          beliefs: {
            title: 'NIỀM TIN & TRUYỀN THỐNG',
            content:
              'Niềm tin cốt lõi duy nhất - Tự Tánh là Phật Tánh. Mỗi chúng sanh vốn đã là Phật, không cần tìm cầu bên ngoài. Giải thoát là trở về, không phải đi tới.\n\nTruyền thống: Phá Chấp • Đạo Nhân Vô Tu Vô Chứng • Dĩ Tâm Truyền Tâm\n\n"Giác Ngộ Phật dạy là chi\nNgười luôn hiểu biết hết đi lòng vòng\nGiải thoát thì phải làm sao\nHành không dính mắc thế nào cũng ra"'
          }
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
                'Daily meditation twice a day at 4:45am and 8:45pm Vietnam time - the transitional moments'
            },
            {
              frequency: 'Thứ 7 hàng tuần',
              title: 'Huynh Đệ chia sẻ',
              time: '7:30 tối',
              description: 'Weekly sharing on Saturday at 7:30pm'
            },
            {
              frequency: 'Hàng tháng',
              title: 'Về Nhà Như Lai - Sư Cha khai thị',
              time: 'Dành cho huynh đệ nào đã được Kiến Tánh và hành tinh tấn',
              description:
                'Monthly teaching of Sư Cha for those who have attained Kiến Tánh'
            }
          ]
        },
        events: {
          title: 'SỰ KIỆN',
          description:
            'Những khoảnh khắc đáng nhớ trong hành trình cộng đồng và các chuyến vi hành.',
          subtitle:
            'Hình ảnh từ các hoạt động cộng đồng và những chuyến vi hành'
        }
      }
    },
    en: {
      returnToSutra: 'Return to Sutra',
      scrollSections: [
        {
          id: 'foundation',
          title: 'Spiritual Foundation',
          label: 'Foundation'
        },
        { id: 'calendar', title: 'Activity Calendar', label: 'Calendar' },
        { id: 'events', title: 'Events', label: 'Events' }
      ],
      events: 'Events',
      header: {
        title: 'COMMUNITY',
        subtitle: 'Brothers walking together on the path of Awakening',
        description:
          'Awakening is not an organization, a religion, or a doctrine. It is the path for each person to "Know Themselves" and "Return Home"',
        awakening: 'Awakening',
        enlightenment: 'Enlightenment'
      },
      sections: {
        foundation: {
          title: 'FOUNDATION',
          mission: {
            title: 'MISSION & VISION',
            content:
              'Not a manifesto, but the heartfelt aspiration of Master Tam Vô and the enlightened Zen Masters: To help beings drowning in the ocean of suffering realize they are inherently Buddha, to free themselves from all bondage and return to the peace, freedom and ease that is their true nature.\n\nThe vision is to see clearly that all beings have Buddha Nature, all have the capacity for awakening. The path is not going to some distant place, but returning to the "Original Home", to the "Ancient Country", where one\'s true essence resides.'
          },
          teachings: {
            title: 'TEACHINGS',
            content:
              'The teachings of Awakening are not found in scriptures, whether the Diamond Sutra or Prajnaparamita. The true sutra is the "Wordless True Sutra", one must "understand the meaning and abandon the words". The teaching here is direct pointing, penetrating questions that go straight to the student\'s mind to shatter attachments.\n\nThe teaching is precisely recognizing that "Who" - the Nature that Sees, Hears, Speaks, and Knows clearly present in you.'
          },
          practice: {
            title: 'PRACTICE',
            content:
              'The Dharma of Awakening is No Practice, No Attainment. If practice still requires effort, liberation is impossible. True meditation is living awakely, seeing clearly how body and mind operate without identifying with them.\n\n"There is only one correct dharma practice: Living awakely, separating Essence from Body-Mind. Whatever you do, know it clearly, without attachment to results. That is meditation, that is reciting Buddha, that is liberation right here."'
          },
          beliefs: {
            title: 'BELIEFS & TRADITIONS',
            content:
              'The only core belief - Self-Nature is Buddha Nature. Every being is already Buddha, no need to seek outside. Liberation is returning, not going forward.\n\nTraditions: Breaking Attachments • The Realized Person Has No Practice, No Attainment • Mind-to-Mind Transmission\n\n"What is the Awakening Buddha taught\nPeople always understanding, stop going in circles\nHow must one achieve liberation\nAct without attachment, any way works"'
          }
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
                'Daily meditation twice a day at 4:45am and 8:45pm Vietnam time - the transitional moments'
            },
            {
              frequency: 'Weekly Saturday',
              title: 'Brotherhood sharing',
              time: '7:30pm',
              description: 'Weekly sharing on Saturday at 7:30pm'
            },
            {
              frequency: 'Monthly',
              title: "Returning to Tathagata Home - Master's teaching",
              time: 'For brothers who have attained Seeing Nature and practice diligently',
              description:
                'Monthly teaching of Master for those who have attained Seeing Nature'
            }
          ]
        },
        events: {
          title: 'EVENTS',
          description:
            'Memorable moments from our community journey and spiritual pilgrimages.',
          subtitle: 'Images from community activities and pilgrimage journeys'
        }
      }
    }
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
      transition: { staggerChildren: 0.5, delayChildren: 0.3 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1.5, ease: 'easeOut' }
    }
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
        <div className='rounded-full border-2 border-[#8B1E1E] p-1 bg-[#EFE0BD] shadow-[0_2px_0_rgba(139,30,30,0.25)]'>
          <div className='flex items-center h-8 gap-1 px-0.5'>
            <button
              onClick={() => setLanguage('vi')}
              className={`px-3 h-8 inline-flex items-center justify-center text-sm font-serif transition-colors rounded-full ${
                language === 'vi'
                  ? 'bg-[#8B1E1E] text-white hover:bg-[#A12222]'
                  : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/10'
              }`}
            >
              VIE
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-3 h-8 inline-flex items-center justify-center text-sm font-serif transition-colors rounded-full ${
                language === 'en'
                  ? 'bg-[#8B1E1E] text-white hover:bg-[#A12222]'
                  : 'text-[#8B1E1E] hover:bg-[#8B1E1E]/10'
              }`}
            >
              ENG
            </button>
          </div>
        </div>
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
                delay: 0
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
                delay: 1.5
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

      <SectionDivider />

      {/* Events Gallery Section */}
      <section
        id='events'
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
            className='text-3xl md:text-5xl font-serif mb-4 text-[#991b1b] text-center'
            variants={itemVariants}
          >
            {translations[language].sections.events.title}
          </motion.h2>
          <motion.p
            className='text-lg md:text-xl font-serif text-[#991b1b]/70 text-center mb-8'
            variants={itemVariants}
          >
            {translations[language].sections.events.description}
          </motion.p>
          <motion.p
            className='text-base md:text-lg font-serif text-[#991b1b]/60 text-center mb-12 italic'
            variants={itemVariants}
          >
            {translations[language].sections.events.subtitle}
          </motion.p>

          {/* Photo Gallery Grid */}
          <motion.div
            className='space-y-6'
            variants={itemVariants}
          >
            {/* Featured Story Section */}
            <div className='border-l-4 border-[#991b1b]/40 pl-4 mb-8'>
              <div className='grid grid-cols-3 md:grid-cols-3 gap-3'>
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className='aspect-square rounded-lg border border-[#991b1b]/20 relative overflow-hidden group'
                  >
                    <img
                      src={`/images/kk${index + 1}.png`}
                      alt={`Event ${index + 1}`}
                      className='w-full h-full object-cover'
                    />
                    <div className='absolute inset-0 p-2 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent'>
                      <h4 className='text-xs font-serif text-white mb-1'>
                        {index < 3
                          ? language === 'vi'
                            ? 'Thiền Tọa Cộng Đồng'
                            : 'Community Meditation'
                          : language === 'vi'
                          ? 'Chia Sẻ Pháp Thoại'
                          : 'Dharma Sharing'}
                      </h4>
                      <span className='text-xs text-white/80'>
                        {language === 'vi'
                          ? `Tháng ${9 + index}`
                          : `Month ${9 + index}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo Collage Section */}
            <div className='border-t border-[#991b1b]/20 pt-6'>
              <h3 className='text-xl font-serif text-[#991b1b] mb-4 text-center'>
                {language === 'vi' ? 'Câu Chuyện Ngộ Đạo' : 'Enlightenment Stories'}
              </h3>

              <div className='grid grid-cols-3 md:grid-cols-6 gap-3 mb-6'>
                {['c1','c2','c3','c4','c5','c6'].map((id, index) => (
                  <Link
                    href={`/library?story=${id}`}
                    key={id}
                    className='group block aspect-square rounded-lg border border-[#991b1b]/20 overflow-hidden bg-[#991b1b]/10 hover:border-[#991b1b]/40 hover:shadow-lg hover:shadow-[#991b1b]/20 transition-all'
                    title={language === 'vi' ? `Câu chuyện ${index + 1}` : `Story ${index + 1}`}
                  >
                    <img
                      src={`/images/${id}.png`}
                      alt={`Story ${index + 1}`}
                      className='w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300'
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Questions Section */}
            <div className='border-t border-[#991b1b]/20 pt-6'>
              <h3 className='text-xl font-serif text-[#991b1b] mb-6 text-center'>
                {language === 'vi' ? 'Câu Hỏi Vấn Tỉnh' : 'Questions for Awakening'}
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[
                  {
                    id: 1,
                    icon: '/images/t1.png',
                    question: {
                      vi: 'Khi thân xác này hoại diệt, con sẽ đi về đâu?',
                      en: 'When this body perishes, where will I go?'
                    },
                    answer: {
                      vi: 'Nếu con còn đồng hoá mình với thân tâm, còn dính mắc vào nghiệp và nhân quả, con sẽ tiếp tục bị cuốn hút trong sáu nẻo luân hồi: Trời, Người, Thần, Súc sanh, Ngạ quỷ, Địa ngục. Nếu con sống được với Tánh Phật, không còn dính mắc, thì khi thân này tan rã, con sẽ trở về Phật Giới - Quê Xưa chân thật của mình. Con đường do con lựa chọn ngay trong từng khoảnh khắc tỉnh thức.',
                      en: 'If you still identify with body and mind, still cling to karma and cause-effect, you will continue to be drawn into the six realms of samsara: Heaven, Human, Asura, Animal, Hungry Ghost, Hell. If you live with Buddha Nature, free from attachment, then when this body dissolves, you will return to Buddha Realm - your true original home. The path is what you choose in each moment of awakening.'
                    }
                  },
                  {
                    id: 2,
                    icon: '/images/t2.png',
                    question: {
                      vi: 'Con niệm danh hiệu "A Di Đà Phật" ngày đêm có phải là Niệm Phật không?',
                      en: 'Is reciting "Amitabha Buddha" day and night considered chanting Buddha\'s name?'
                    },
                    answer: {
                      vi: '"Niệm Phật không niệm gọi Tên làm gì." Nếu con chưa từng gặp Phật A Di Đà thì làm sao con nhớ (niệm) được? Con chỉ đang gọi Tên Ngài. Đó chỉ là vọng âm. "Niệm là hằng Nhớ không nghi / Phật là bản thể Như Lai của mình." Niệm Phật chân chánh là hằng nhớ mình có Tánh Phật, luôn quay về sống với Tánh Giác thanh tịnh đó.',
                      en: '"Chanting Buddha without remembrance, why call the Name?" If you have never met Amitabha Buddha, how can you remember (chant) Him? You are only calling His Name. That is just deluded sound. "Chanting is constantly remembering without doubt / Buddha is the Tathagata nature of yourself." True Buddha chanting is constantly remembering you have Buddha Nature, always returning to live with that pure awareness.'
                    }
                  },
                  {
                    id: 3,
                    icon: '/images/t3.png',
                    question: {
                      vi: 'Tại sao con luôn bị vọng tưởng quấy nhiễu? Làm sao để dừng chúng?',
                      en: 'Why am I always bothered by delusive thoughts? How can I stop them?'
                    },
                    answer: {
                      vi: '"Vì theo niệm khởi tất bật trần gian." Con không cần phải "dừng" vọng tưởng, vì càng cố dừng, nó càng khởi mạnh hơn. Ta tặng cho con chữ "THÔI". Khi một vọng tưởng khởi lên, con chỉ cần nhận biết nó và nhẹ nhàng nói thầm "Thôi". Thôi không theo nó, thôi không phân tích, thôi không đồng hoá. Chỉ cần "Thôi", con sẽ lập tức trở về với Tánh Phật thanh tịnh. "Thôi công quán tưởng luân hồi dừng ngay."',
                      en: '"Because following thoughts, everything becomes worldly." You don\'t need to "stop" delusive thoughts, because the more you try to stop them, the stronger they become. I give you the word "ENOUGH". When a delusive thought arises, you just need to recognize it and gently say silently "Enough". Enough not following it, enough not analyzing, enough not identifying. Just "Enough", you will immediately return to pure Buddha Nature. "Enough effort, contemplation stops right away."'
                    }
                  },
                  {
                    id: 4,
                    icon: '/images/t4.png',
                    question: {
                      vi: '"Vô Tu" có phải là buông thả, không cần nỗ lực gì không? "Vô Chứng" nghĩa là con sẽ không bao giờ đạt được gì sao?',
                      en: 'Is "No Practice" letting go, requiring no effort? Does "No Attainment" mean I will never achieve anything?'
                    },
                    answer: {
                      vi: '"Vô Tu" không phải là buông thả. Nó là sự nỗ lực cao nhất: nỗ lực không nỗ lực. Tức là con không dùng Tánh Ma (ý chí, bản ngã) để tu. Thay vì cố gắng đè nén phiền não, con chỉ đơn giản "Thấy" nó và "Thôi" không theo. Đó là sự tu tập tự nhiên, không tạo tác, thuận theo Tánh Phật thanh tịnh.\n\n"Vô Chứng" vì con vốn đã là Phật, đã viên mãn, tròn đầy, thì còn có cái gì để "đạt được" nữa? Sự chứng đắc là khái niệm của Tánh Ma, muốn có thêm, muốn trở thành một cái gì đó. Khi con nhận ra mình không cần phải trở thành gì cả, chỉ cần nhận lại cái mình vốn có, đó chính là "Vô Chứng".',
                      en: '"No Practice" is not letting go. It is the highest effort: effort without effort. That is, you don\'t use Mara Nature (will, ego) to practice. Instead of trying to suppress afflictions, you simply "See" them and "Enough" not following. That is natural practice, non-fabricated, in accord with pure Buddha Nature.\n\n"No Attainment" because you are already Buddha, already complete, perfect, so what is there to "achieve"? Attainment is a concept of Mara Nature, wanting to have more, wanting to become something. When you realize you don\'t need to become anything, just receive back what you originally have, that is "No Attainment".'
                    }
                  },
                  {
                    id: 5,
                    icon: '/images/t5.png',
                    question: {
                      vi: 'Con nghe nói về "khai mở luân xa", "khai thiên nhãn". Con có nên theo học không?',
                      en: 'I hear about "opening chakras", "opening the celestial eye". Should I learn these?'
                    },
                    answer: {
                      vi: 'Đó đều là những pháp hữu vi, thuộc về thân xác và năng lượng. Chúng có thể mang lại một số khả năng đặc biệt tạm thời, nhưng chúng không đưa đến giải thoát. Ngược lại, chúng còn khiến con dính mắc nhiều hơn vào thân này và những năng lực huyền diệu, nuôi lớn bản ngã. Con đường của con là con đường "Vô Tu Vô Chứng", quay về nhận lại Tánh Phật vốn thanh tịnh, không phải luyện tập để có được thần thông.',
                      en: 'Those are all conditioned methods, belonging to body and energy. They may bring some special temporary abilities, but they don\'t lead to liberation. On the contrary, they make you more attached to this body and miraculous powers, feeding the ego. Your path is the path of "No Practice, No Attainment", returning to recognize your originally pure Buddha Nature, not training to gain supernatural powers.'
                    }
                  },
                  {
                    id: 6,
                    icon: '/images/t6.png',
                    question: {
                      vi: 'Con có thể dùng tiền bạc để "mua" công đức, phước báu được không?',
                      en: 'Can I use money to "buy" merit and blessings?'
                    },
                    answer: {
                      vi: 'Con dùng tiền để cúng dường, bố thí, làm từ thiện là con đang tạo ra phước báu. Nhưng nếu con làm với tâm "trao đổi", cho rằng bỏ ra tiền sẽ được phước, thì phước đó rất hữu hạn và còn mang theo sự tính toán của Tánh Ma. Công đức chân thật đến từ cái tâm thanh tịnh, vô ngã khi con hành động. Một người nghèo chỉ có một đồng nhưng bố thí với tâm hoàn toàn trong sáng, công đức có thể còn lớn hơn người giàu bỏ ra vạn lượng vàng mà tâm còn kể công.',
                      en: 'Using money to make offerings, give alms, do charity is creating blessings. But if you do it with an "exchange" mind, thinking that spending money will get blessings, then those blessings are very limited and carry the calculation of Mara Nature. True merit comes from the pure, selfless mind when you act. A poor person with only one coin but giving with a completely pure mind may have greater merit than a rich person giving ten thousand gold pieces with a calculating mind.'
                    }
                  }
                ].map((item, index) => (
                  <div
                    key={item.id}
                    className='flex items-start space-x-3 group'
                  >
                    <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#991b1b]/10 to-[#991b1b]/20 rounded-lg border border-[#991b1b]/20 flex items-center justify-center group-hover:shadow-md transition-all duration-300'>
                      <img
                        src={item.icon}
                        alt={`Question ${item.id}`}
                        className='w-8 h-8 object-contain'
                      />
                    </div>
                    <div className='flex-1 pt-1'>
                      <h4 className='text-sm font-serif text-[#991b1b] mb-2'>
                        {item.question[language]}
                      </h4>
                      <div className='w-full bg-gradient-to-r from-[#991b1b]/5 to-[#991b1b]/10 rounded border border-[#991b1b]/10 group-hover:shadow-sm transition-all duration-300 p-3'>
                        <span className='text-xs text-[#991b1b]/80 text-justify leading-relaxed whitespace-pre-line block'>
                          {item.answer[language]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

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
          title='Wordless Sutra'
        >
          <div className='absolute -inset-4 md:inset-0 z-20'></div>
          <div className='absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-yellow-300/30 to-transparent animate-golden-sweep'></div>
          <div className='absolute inset-0 rounded-full bg-gradient-conic from-yellow-400/20 via-amber-300/30 via-yellow-200/25 to-yellow-400/20 animate-golden-rotate opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>
          <div className='absolute inset-0 rounded-full bg-gradient-radial from-yellow-200/40 via-amber-300/20 to-transparent animate-pulse-golden'></div>
          <div className='relative z-20 w-20 h-20'>
            <img
              src='/images/giac-ngo-logo-1.png'
              alt='Wordless Sutra'
              className='w-full h-full object-contain'
            />
          </div>
          <div className='absolute inset-0 rounded-full border-2 border-yellow-400/50 animate-ping'></div>
          <div className='absolute inset-0 pointer-events-none'>
            <div className='absolute top-1/2 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-yellow-300/60 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-45 animate-ray-1'></div>
            <div className='absolute top-1/2 left-1/2 w-20 h-0.5 bg-gradient-to-r from-transparent via-amber-300/50 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-135 animate-ray-2'></div>
            <div className='absolute top-1/2 left-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-200/70 to-transparent transform -translate-x-1/2 -translate-y-1/2 animate-ray-3'></div>
            <div className='absolute top-1/2 left-1/2 w-16 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent transform -translate-x-1/2 -translate-y-1/2 rotate-90 animate-ray-4'></div>
          </div>
        </Link>
      </div>

      <SiteFooter />

      {/* Golden Animation Styles */}
      <style jsx>{`
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
