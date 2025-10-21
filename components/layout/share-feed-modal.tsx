import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import {
  Category,
  CategoryAuthorGroup,
  CategoryType,
  CreateCategoryRequest
} from '@/interfaces/category'
import { Language } from '@/interfaces/chat'
import { useFeedStore } from '@/store/feed'
import { useAgentStore } from '@/store/agent'
import useAgents from '@/hooks/use-agents'

interface CreateCategoryModalProps {
  open: boolean
  onClose: () => void
  question: string
  answer: string
  postId?: string
  isRetweet?: boolean
}

export const ShareFeedModal = ({
  open,
  onClose,
  question,
  answer,
  postId,
  isRetweet = false
}: CreateCategoryModalProps) => {
  const [caption, setCaption] = useState<string>('')

  const { createFeed, reshareFeed } = useFeedStore()
  const { currentAgent } = useAgents()

  const handleShare = async () => {
    if (isRetweet && postId) {
      await reshareFeed(postId, caption)
    } else {
      await createFeed({
        content: caption,
        user_question: question,
        agent_id: currentAgent ? currentAgent.uuid : '',
        agent_content: answer
      })
    }

    onClose()
  }
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm z-50'
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25 }}
            className='fixed inset-0 z-50 flex items-center justify-center p-4'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='w-full max-w-3xl max-h-[90vh] bg-[#f3ead7] border-2 border-[#2c2c2c] rounded-2xl shadow-[0_8px_0_#00000030] overflow-hidden flex flex-col'>
              {/* Header */}
              <div className='flex items-center justify-between p-6'>
                <h3 className='text-2xl font-serif font-bold text-[#991b1b]'>
                  Chia sẻ lên feed
                </h3>
                <button
                  onClick={onClose}
                  className='p-2 hover:bg-[#EFE0BD] rounded-lg transition-colors'
                >
                  <X className='w-5 h-5 text-[#2c2c2c]' />
                </button>
              </div>

              {/* Content - Scrollable */}
              <div className='flex-1 overflow-y-auto p-6'>
                <div className='space-y-6'>
                  {/* Caption */}
                  <div>
                    <textarea
                      className='w-full px-4 py-3 bg-[#EFE0BD] border-2 border-[#2c2c2c]/20 rounded-xl font-serif text-sm text-[#2c2c2c] focus:outline-none focus:border-[#991b1b]'
                      placeholder='Hãy nói gì đó về nội dung này...'
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                    />
                  </div>

                  {/* Question and Answer Card */}
                  <div className='bg-white border-2 border-[#2c2c2c]/20 rounded-xl p-4 shadow-sm'>
                    <p className='font-serif text-sm text-[#2c2c2c]'>
                      <i>{question}</i>
                    </p>
                    <p className='font-serif text-sm text-[#2c2c2c]'>
                      {answer}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}

              <div className='flex items-center justify-end gap-3 p-6'>
                <button
                  onClick={onClose}
                  className='px-6 py-2.5 bg-[#2c2c2c]/10 text-[#2c2c2c] rounded-xl font-serif text-sm hover:bg-[#2c2c2c]/20 transition-colors'
                >
                  Hủy
                </button>
                <button
                  className='px-6 py-2.5 bg-[#991b1b] text-[#f6efe0] rounded-xl font-serif text-sm border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030] hover:bg-[#7a1515] transition-colors'
                  onClick={handleShare}
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
