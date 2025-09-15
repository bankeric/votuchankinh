import { useTranslations } from '@/hooks/use-translations'
import { motion, Variants } from 'framer-motion'

export const WelcomeScreenV2 = () => {
  const { t } = useTranslations()
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  } as Variants

  return (
    <motion.div
      className='h-full flex flex-col justify-center items-center text-center px-4'
      variants={itemVariants}
    >
      <div className='text-4xl md:text-8xl font-serif text-[#991b1b]/60 mb-8'>
        無
      </div>
      <h2 className='text-xl md:text-3xl font-serif text-[#991b1b] mb-4'>
        {t('chat.welcomeTitle')}
      </h2>
      <p className='text-base md:text-lg font-serif text-[#991b1b]/70 italic px-4'>
        {t('chat.welcomeSubtitle')}
      </p>
    </motion.div>
  )
}
