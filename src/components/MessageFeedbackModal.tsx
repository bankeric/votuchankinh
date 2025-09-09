import React, { useState } from 'react'

interface MessageFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  messageId: string | null
  onConfirm: (messageId: string, feedback: string) => void
}

export const MessageFeedbackModal = ({
  isOpen,
  onClose,
  messageId,
  onConfirm
}: MessageFeedbackModalProps) => {
  const [feedback, setFeedback] = useState('')

  const handleSubmit = () => {
    if (!messageId) return
    if (feedback.trim()) {
      onConfirm(messageId, feedback)
      setFeedback('')
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 flex items-center justify-center z-50'>
      <div className='bg-[#e5d3a4] rounded-lg p-6 w-full max-w-md shadow-2xl'>
        <h2 className='text-xl font-semibold mb-4 text-text-primary'>
          Message Feedback
        </h2>
        <textarea
          className='w-full border border-border-primary rounded p-2 min-h-[100px] mb-4 text-black'
          placeholder='Please share your feedback...'
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <div className='flex justify-end gap-2'>
          <button
            className='px-4 py-2 border border-border-primary rounded-2xl cursor-pointer text-black'
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 bg-bg-btn-primary text-white rounded-2xl cursor-pointer'
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}
