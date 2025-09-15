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
          'Giác Ngộ không phải là một tổ chức, một tôn giáo hay một học thuyết. Nó là con đường để mỗi người tự "Rõ Mình" và "V Nhà Xưa"',
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
              <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                {/* Main Feature - smaller */}
                <div className='col-span-2'>
                  <div className='aspect-[4/3] bg-gradient-to-br from-[#991b1b]/10 to-[#991b1b]/20 rounded-lg border border-[#991b1b]/20 relative overflow-hidden group'>
                    <div className='absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300'></div>
                    <div className='absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent'>
                      <h3 className='text-sm font-serif text-white mb-1'>
                        {language === 'vi'
                          ? 'Chuyến Vi Hành Thiêng Liêng'
                          : 'Sacred Pilgrimage Journey'}
                      </h3>
                      <p className='text-xs text-white/80'>
                        {language === 'vi'
                          ? 'Hành trình tìm về cội nguồn tâm linh'
                          : 'Journey back to spiritual roots'}
                      </p>
                      <span className='text-xs text-white/60 mt-1 block'>
                        {language === 'vi' ? 'Tháng 10, 2024' : 'October 2024'}
                      </span>
                    </div>
                  </div>
                </div>

                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className='aspect-square bg-gradient-to-br from-[#991b1b]/15 to-[#991b1b]/25 rounded-lg border border-[#991b1b]/20 relative overflow-hidden group'
                  >
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
                {language === 'vi'
                  ? 'Khoảnh Khắc Đáng Nhớ'
                  : 'Memorable Moments'}
              </h3>

              <div className='grid grid-cols-3 md:grid-cols-6 gap-3 mb-6'>
                {Array.from({ length: 18 }, (_, index) => (
                  <div
                    key={index}
                    className={`
                      ${index === 0 || index === 5 ? 'md:col-span-2' : ''}
                      ${index === 8 || index === 13 ? 'md:col-span-3' : ''}
                      aspect-square bg-gradient-to-br from-[#991b1b]/8 to-[#991b1b]/18 
                      rounded-lg border border-[#991b1b]/15 relative overflow-hidden group
                      hover:shadow-lg hover:shadow-[#991b1b]/20 transition-all duration-300
                      transform hover:scale-[1.02]
                    `}
                  >
                    <div className='absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-all duration-300'></div>
                    <div className='absolute bottom-1 left-1 right-1'>
                      <div className='bg-white/95 backdrop-blur-sm rounded px-1 py-0.5'>
                        <p className='text-xs font-serif text-[#991b1b]'>
                          {index < 9
                            ? language === 'vi'
                              ? 'Cộng đồng'
                              : 'Community'
                            : language === 'vi'
                            ? 'Vi hành'
                            : 'Pilgrimage'}
                        </p>
                      </div>
                    </div>

                    {/* Photo placeholder icon */}
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='w-8 h-8 bg-[#991b1b]/20 rounded-full flex items-center justify-center group-hover:bg-[#991b1b]/30 transition-colors'>
                        <span className='text-sm opacity-60'>📷</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Section */}
            <div className='border-t border-[#991b1b]/20 pt-6'>
              <h3 className='text-xl font-serif text-[#991b1b] mb-6 text-center'>
                {language === 'vi' ? 'Dòng Thời Gian' : 'Timeline'}
              </h3>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                {[
                  {
                    date: '2024',
                    title:
                      language === 'vi'
                        ? 'Thành lập cộng đồng'
                        : 'Community established'
                  },
                  {
                    date: '2024',
                    title:
                      language === 'vi'
                        ? 'Chuyến vi hành đầu tiên'
                        : 'First pilgrimage'
                  },
                  {
                    date: '2024',
                    title:
                      language === 'vi'
                        ? 'Thiền tọa hàng tuần'
                        : 'Weekly meditation'
                  },
                  {
                    date: '2024',
                    title:
                      language === 'vi'
                        ? 'Chia sẻ pháp thoại'
                        : 'Dharma sharing sessions'
                  },
                  {
                    date: '2024',
                    title: language === 'vi' ? 'Lễ cầu an' : 'Prayer ceremonies'
                  },
                  {
                    date: '2024',
                    title:
                      language === 'vi'
                        ? 'Hoạt động từ thiện'
                        : 'Charity activities'
                  }
                ].map((item, index) => (
                  <div
                    key={index}
                    className='flex items-start space-x-3 group'
                  >
                    <div className='flex-shrink-0 w-12 h-12 bg-gradient-to-br from-[#991b1b]/10 to-[#991b1b]/20 rounded-lg border border-[#991b1b]/20 flex items-center justify-center group-hover:shadow-md transition-all duration-300'>
                      <span className='text-xs font-serif text-[#991b1b]/70'>
                        {item.date}
                      </span>
                    </div>
                    <div className='flex-1 pt-1'>
                      <h4 className='text-sm font-serif text-[#991b1b] mb-2'>
                        {item.title}
                      </h4>
                      <div className='w-full h-16 bg-gradient-to-r from-[#991b1b]/5 to-[#991b1b]/10 rounded border border-[#991b1b]/10 flex items-center justify-center group-hover:shadow-sm transition-all duration-300'>
                        <span className='text-xs text-[#991b1b]/50 italic'>
                          {language === 'vi'
                            ? 'Hình ảnh sẽ được cập nhật'
                            : 'Images coming soon'}
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
