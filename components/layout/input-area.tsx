'use client'
import React, { useRef, useState } from 'react'
import { Button } from '../ui/button'
import { FileText, ImageIcon, Mic, MicOff, Paperclip, Send } from 'lucide-react'
import { Textarea } from '../ui/textarea'
import { useTranslations } from '@/hooks/use-translations'
import { useOnClickOutside } from 'usehooks-ts'

interface InputAreaProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  input: string
  setInput: (value: string) => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  isLoading?: string | null
  isRecording: boolean
  handleVoiceToggle: () => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleFileUpload: (type: 'image' | 'document') => void
}

export const InputArea = ({
  handleSubmit,
  input,
  setInput,
  handleKeyDown,
  isLoading,
  isRecording,
  handleVoiceToggle,
  fileInputRef,
  handleFileChange,
  handleFileUpload
}: InputAreaProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { t } = useTranslations()
  const [showFileSubmenu, setShowFileSubmenu] = useState(false)

  const placeholder = t('chat.placeholders.guidance')

  const onUploadButtonClick = (type: 'image' | 'document') => {
    handleFileUpload(type)
    setShowFileSubmenu(false)
  }

  useOnClickOutside(ref as any, () => setShowFileSubmenu(false))
  return (
    <div className='bg-[#f4eacf] border-t border-[#2c2c2c]/30 p-3 md:p-4'>
      <div className='max-w-4xl mx-auto'>
        <form onSubmit={handleSubmit} className='relative'>
          <div className='flex items-center gap-2'>
            {/* File Upload Button */}
            <div className='relative dropdown-container' ref={ref}>
              <Button
                type='button'
                variant='outline'
                size='sm'
                onClick={() => setShowFileSubmenu(!showFileSubmenu)}
                className='h-10 md:h-12 px-2 md:px-4 border-2 border-black hover:bg-orange-50 text-black rounded-2xl'
              >
                <Paperclip className='w-3 h-3 md:w-4 md:h-4' />
              </Button>

              {/* File Submenu */}
              {showFileSubmenu && (
                <div className='absolute text-black bottom-12 md:bottom-14 left-0 bg-white border border-orange-200 rounded-lg shadow-lg p-2 min-w-32 md:min-w-56 z-10'>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => onUploadButtonClick('image')}
                    className='w-full justify-start gap-2 text-xs md:text-sm'
                  >
                    <ImageIcon className='w-4 h-4' />
                    {t('chat.fileTypes.image')}
                  </Button>
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={() => onUploadButtonClick('document')}
                    className='w-full justify-start gap-2 text-xs md:text-sm'
                  >
                    <FileText className='w-4 h-4' />
                    {t('chat.fileTypes.document')}
                  </Button>
                </div>
              )}
            </div>

            {/* Text Input */}
            <div className='flex-1 relative'>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                rows={1}
                className='text-black rounded-2xl min-h-12 border-2 border-black focus-visible:ring-0 focus-visible:border-black focus:outline-none placeholder:text-xs md:placeholder:text-sm'
              />
            </div>

            {/* Voice Recording Button */}
            <Button
              type='button'
              variant={'outline'}
              onClick={handleVoiceToggle}
              className={`h-10 md:h-12 px-3 md:px-4 rounded-2xl text-black border-2 border-black ${
                isRecording ? 'animate-pulse' : ''
              }`}
            >
              {isRecording ? (
                <MicOff className='w-4 h-4' />
              ) : (
                <Mic className='w-4 h-4' />
              )}
            </Button>

            {/* Send Button */}
            <Button
              type='submit'
              variant={'outline'}
              disabled={!input.trim() || !!isLoading}
              className='h-10 md:h-12 px-3 md:px-4 rounded-2xl text-black border-2 border-black'
            >
              <Send className='w-4 h-4' />
            </Button>
          </div>

          {/* Recording Indicator */}
          {isRecording && (
            <div className='absolute -top-10 md:-top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs md:text-sm flex items-center gap-2'>
              <div className='w-2 h-2 bg-white rounded-full animate-pulse'></div>
              {t('chat.recording')}
            </div>
          )}
        </form>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type='file'
          onChange={handleFileChange}
          className='hidden'
        />
      </div>
    </div>
  )
}
