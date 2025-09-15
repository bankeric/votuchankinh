'use client'

import { Copy, Check, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion'
import { useState } from 'react'
import { Message } from '@/interfaces/chat'
import ReactMarkdown from 'react-markdown'
import { useTranslation } from 'react-i18next'

interface MessageBubbleProps {
  message: Message
  onSaveToSystemPrompt?: (content: string) => void
  isLoading?: boolean
}

export function MessageBubble({
  message,
  onSaveToSystemPrompt,
  isLoading = false
}: MessageBubbleProps) {
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const { t } = useTranslation()

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveToSystemPrompt = () => {
    if (onSaveToSystemPrompt) {
      onSaveToSystemPrompt(message.content)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
  }

  if (message.role === 'user') {
    return (
      <div className='flex justify-end'>
        <div className='bg-orange-500 text-white rounded-2xl px-3 md:px-4 py-2 md:py-3 max-w-[85%] md:max-w-xs lg:max-w-md'>
          <p className='text-sm md:text-base'>{message.content}</p>
        </div>
      </div>
    )
  }

  return (
    <div className='flex justify-start'>
      <div className='bg-white border border-orange-200 rounded-2xl px-3 md:px-4 py-2 md:py-3 max-w-[85%] md:max-w-xs lg:max-w-2xl shadow-sm'>
        <div className='flex items-start gap-2 md:gap-3 mb-2'>
          <div className='w-5 h-5 md:w-6 md:h-6 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center flex-shrink-0'>
            <span className='text-xs'>🙏</span>
          </div>
          <div className='flex-1'>
            {message.thought && (
              <Accordion
                type='single'
                collapsible
                className='w-full'
              >
                <AccordionItem
                  value='thought'
                  className=''
                >
                  <AccordionTrigger className='w-1/3 text-sm text-orange-600 hover:text-orange-700 py-2 hover:no-underline'>
                    {t('chat.messageBubble.showThoughtProcess')}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className='p-4 rounded-lg text-sm md:text-base bg-orange-100 text-gray-800 '>
                      <ReactMarkdown
                        components={{
                          pre: ({ node, ...props }) => (
                            <pre
                              style={{ whiteSpace: 'pre-wrap' }}
                              {...props}
                            />
                          )
                        }}
                      >
                        {message.thought}
                      </ReactMarkdown>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
            <div className='text-sm md:text-base text-gray-800 '>
              <ReactMarkdown
                components={{
                  pre: ({ node, ...props }) => (
                    <pre
                      style={{ whiteSpace: 'pre-wrap' }}
                      {...props}
                    />
                  )
                }}
              >
                {message.content}
              </ReactMarkdown>
              {isLoading && (
                <div className='flex justify-start'>
                  <div className='bg-orange-100 rounded-2xl px-4 py-3 max-w-xs'>
                    <div className='flex items-center gap-2'>
                      <div className='flex gap-1'>
                        <div className='w-2 h-2 bg-orange-400 rounded-full animate-bounce' />
                        <div className='w-2 h-2 bg-orange-400 rounded-full animate-bounce' />
                        <div className='w-2 h-2 bg-orange-400 rounded-full animate-bounce' />
                      </div>
                      <span className='text-sm text-orange-600'>
                        {t('training.status.processing')}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex items-center gap-1 md:gap-2 mt-2 md:mt-3 pt-2 border-t border-orange-100'>
          <Button
            variant='ghost'
            size='sm'
            onClick={saveToSystemPrompt}
            className='h-5 md:h-6 px-1 md:px-2 text-xs text-orange-600 hover:bg-orange-50'
          >
            <Save className='w-3 h-3 mr-1' />
            {saved
              ? t('chat.messageBubble.saved')
              : t('chat.messageBubble.save')}
          </Button>

          <Button
            variant='ghost'
            size='sm'
            onClick={copyToClipboard}
            className='h-5 md:h-6 px-1 md:px-2 text-xs text-orange-600 hover:bg-orange-50'
          >
            {copied ? (
              <>
                <Check className='w-3 h-3 mr-1' />
                {t('chat.messageBubble.copied')}
              </>
            ) : (
              <>
                <Copy className='w-3 h-3 mr-1' />
                {t('chat.messageBubble.copy')}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
