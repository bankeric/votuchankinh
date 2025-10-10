'use client'

import { useState, useEffect } from 'react'
import {
  Check,
  ChevronDown,
  ChevronUp,
  Edit,
  Info,
  MessageSquare,
  Save,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next'
import { useQuestionAnswer } from '@/hooks/useQuestionAnswer'
import { ApprovalStatus, ChatMode, Message } from '@/interfaces/chat'
import { appToast } from '@/lib/toastify'
import { cn, markdownToText } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import AgentSelector from '@/components/agent-selector'
import { useVoiceStore } from '@/store/voice'
import { useTranslations } from '@/hooks/use-translations'
import { textToSpeechService } from '@/service/text-to-speech'

export function UserFeedback() {
  const { t } = useTranslation()
  const {
    currentAgent,
    messages,
    loading,
    error,
    fetchMessages,
    handleUpdateMessage,
    getMessagesByAgentId,
    appendMessages
  } = useQuestionAnswer()
  const { getVoiceSettings } = useVoiceStore()
  const { language } = useTranslations()

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedResponse, setEditedResponse] = useState('')
  const [feedbackComment, setFeedbackComment] = useState('')
  const [expandedQuestions, setExpandedQuestions] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const ITEMS_PER_PAGE = 20

  useEffect(() => {
    if (currentAgent) {
      setPage(1)
      setHasMore(true)
      getMessagesByAgentId(currentAgent.uuid, ITEMS_PER_PAGE)
    }
  }, [getMessagesByAgentId, currentAgent])

  const handleLoadMore = async () => {
    if (!currentAgent || loadingMore || !hasMore) return

    setLoadingMore(true)
    try {
      const nextPage = page + 1
      const offset = (nextPage - 1) * ITEMS_PER_PAGE

      // Import the messages service to use pagination
      const { messagesService } = await import('@/service/messages')
      const response = await messagesService.getMessages({
        agent_id: currentAgent.uuid,
        limit: ITEMS_PER_PAGE,
        offset,
        include_related: true
      })

      if (response.data.length > 0) {
        // Add new messages to existing ones using the store method
        appendMessages(response.data)
        setPage(nextPage)
        setHasMore(response.data.length === ITEMS_PER_PAGE)
        setTotalCount(response.totalCount || 0)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more messages:', error)
      appToast(t('admin.feedback.loadMoreError'), {
        type: 'error'
      })
    } finally {
      setLoadingMore(false)
    }
  }

  const handleEdit = (message: Message) => {
    setEditingId(message.uuid)
    setEditedResponse(
      message.edited_content || message.related_message?.content || ''
    )
    setFeedbackComment(message.related_message?.feedback || '')
  }

  const handleSaveEdit = (id: string) => {
    handleUpdateMessage(id, {
      edited_content: editedResponse,
      feedback: feedbackComment,
      agent_id: currentAgent?.uuid || ''
    })
    setEditingId(null)
    setFeedbackComment('')
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setFeedbackComment('')
  }

  const handleApprove = async (id: string) => {
    try {
      await handleUpdateMessage(id, {
        approval_status: ApprovalStatus.APPROVED
      })
      appToast(t('admin.feedback.approved'), {
        type: 'success'
      })
    } catch (error) {
      console.error('Error approving message:', error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      await handleUpdateMessage(id, {
        approval_status: ApprovalStatus.REJECTED
      })
      appToast(t('admin.feedback.rejected'), {
        type: 'success'
      })
    } catch (error) {
      console.error('Error rejecting message:', error)
    }
  }

  const toggleExpand = (id: string) => {
    if (expandedQuestions.includes(id)) {
      setExpandedQuestions(expandedQuestions.filter((qId) => qId !== id))
    } else {
      setExpandedQuestions([...expandedQuestions, id])
    }
  }

  const handleDownload = async (message?: string) => {
    if (!message) return
    const textToRead = markdownToText(message)
    // Get voice settings based on current language
    const voiceSettings = getVoiceSettings(
      language === 'vi' ? 'vi-VN' : 'en-US'
    )

    await textToSpeechService.downloadAudioFile(textToRead, 'response.mp3', {
      voice_name: voiceSettings.selectedVoice,
      language_code: language === 'vi' ? 'vi-VN' : 'en-US',
      audio_encoding: 'MP3',
      speaking_rate: voiceSettings.speakingRate,
      pitch: voiceSettings.pitch,
      volume_gain_db: voiceSettings.volumeGain
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case ApprovalStatus.PENDING:
        return (
          <Badge className='bg-orange-100 text-orange-800 border-orange-200'>
            {t('admin.feedback.status.pending')}
          </Badge>
        )
      case ApprovalStatus.APPROVED:
        return (
          <Badge className='bg-green-100 text-green-800 border-green-200'>
            {t('admin.feedback.status.reviewed')}
          </Badge>
        )
      case ApprovalStatus.REJECTED:
        return (
          <Badge className='bg-red-100 text-red-800 border-red-200'>
            {t('admin.feedback.status.rejected')}
          </Badge>
        )
      default:
        return <Badge>{t('admin.feedback.status.unknown')}</Badge>
    }
  }

  if (error) {
    return (
      <div className='space-y-6'>
        <div className='text-center py-8'>
          <div className='text-red-600 mb-4'>Error: {error}</div>
          <Button onClick={() => fetchMessages(ChatMode.GUIDANCE, 20)}>
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2 mb-4'>
          <Info className='w-3 h-3 text-orange-500' />
          <span className='text-sm text-gray-600'>
            {t('admin.feedback.description')}
          </span>
        </div>
        <div className='flex items-center gap-4'>
          <span className='text-sm text-gray-500'>
            {t('admin.feedback.totalQuestions')}: {messages.length}
          </span>
          <span className='text-sm text-orange-500'>
            {t('admin.feedback.pendingQuestions')}:{' '}
            {
              messages.filter((q) => q.related_message?.feedback === null)
                .length
            }
          </span>
          {loading && <span className='text-sm text-blue-500'>Loading...</span>}
        </div>
      </div>

      <div className='flex items-center gap-2 mb-4'>
        <span className='text-lg text-gray-500'>
          {t('admin.feedback.agent')}: {currentAgent?.name}
        </span>
      </div>
      <div className='space-y-4'>
        {loading ? (
          <div className='text-center py-8 text-gray-500'>
            Loading messages...
          </div>
        ) : messages.length === 0 ? (
          <div className='text-center py-8 text-gray-500'>
            {t('admin.feedback.noQuestions')}
          </div>
        ) : (
          <>
            {messages.map((message) => {
              const feedback =
                message.related_message && message.related_message.feedback
                  ? message.related_message.feedback
                  : ''
              return (
                <div
                  key={message.uuid}
                  className={`border rounded-lg overflow-hidden ${
                    feedback === ''
                      ? 'border-orange-200 bg-orange-50'
                      : feedback !== ''
                      ? 'border-orange-200 bg-orange-50'
                      : 'border-orange-200 bg-orange-50'
                  }`}
                >
                  <div className='p-4 flex items-center justify-between'>
                    <div className='flex items-center gap-3'>
                      <div className='w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center'></div>
                      <div>
                        <div className='text-sm text-gray-500'>
                          {new Date(
                            message.created_at || ''
                          ).toLocaleDateString('vi-VN', {
                            day: 'numeric',
                            month: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      {getStatusBadge(message.approval_status || '')}
                      {feedback !== '' && (
                        <Badge className='bg-orange-100 text-orange-800 border-orange-200'>
                          {t('admin.feedback.hasFeedback')}
                        </Badge>
                      )}
                      <div className='flex items-center gap-2 '>
                        <ThumbsUp className='w-4 h-4 text-orange-600' />
                        <span className='text-md '>
                          {message.related_message?.like_user_ids?.length || 0}
                        </span>
                        <ThumbsDown className='w-4 h-4 text-orange-600' />
                        <span className='text-md '>
                          {message.related_message?.dislike_user_ids?.length ||
                            0}
                        </span>
                      </div>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => toggleExpand(message.uuid)}
                        className='h-8 w-8 p-0'
                      >
                        {expandedQuestions.includes(message.uuid) ? (
                          <ChevronUp className='w-4 h-4' />
                        ) : (
                          <ChevronDown className='w-4 h-4' />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className='px-4 py-2 border-t border-b bg-white'>
                    <div className='flex items-start gap-2'>
                      <MessageSquare className='w-4 h-4 text-gray-500 mt-1' />
                      <p className='font-medium'>{message.content}</p>
                    </div>
                  </div>

                  {expandedQuestions.includes(message.uuid) && (
                    <div className='p-4 space-y-4'>
                      <div>
                        <div className='flex items-center justify-between mb-2'>
                          <h4 className='text-sm font-medium text-gray-700'>
                            {t('admin.feedback.aiResponse')}:
                          </h4>
                        </div>
                        <div className='p-3 bg-gray-50 rounded-md whitespace-pre-wrap'>
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
                            {message.related_message?.edited_content ||
                              message.related_message?.content}
                          </ReactMarkdown>
                        </div>
                      </div>

                      {feedback !== '' && (
                        <div>
                          <h4 className='text-sm font-medium text-gray-700 mb-2'>
                            {t('admin.feedback.comments')}:
                          </h4>
                          <div className='p-3 bg-orange-50 border border-orange-100 rounded-md text-sm italic'>
                            "{feedback}"
                          </div>
                        </div>
                      )}

                      {editingId === message.uuid ? (
                        <div className='space-y-3 border p-4 rounded-md bg-white'>
                          <h4 className='font-medium'>
                            {t('admin.feedback.editResponse')}:
                          </h4>
                          <Textarea
                            value={editedResponse}
                            onChange={(e) => setEditedResponse(e.target.value)}
                            rows={8}
                            className='font-mono text-sm'
                          />
                          <div>
                            <h4 className='font-medium text-sm mb-2'>
                              {t('admin.feedback.feedbackOnOriginal')}:
                            </h4>
                            <Textarea
                              value={feedbackComment}
                              onChange={(e) =>
                                setFeedbackComment(e.target.value)
                              }
                              placeholder={t(
                                'admin.feedback.feedbackPlaceholder'
                              )}
                              rows={3}
                            />
                          </div>
                          <div className='flex justify-end gap-2'>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={handleCancelEdit}
                              className='border-orange-200 hover:bg-orange-50'
                            >
                              {t('common.cancel')}
                            </Button>
                            <Button
                              size='sm'
                              onClick={() =>
                                handleSaveEdit(
                                  message.related_message?.uuid || ''
                                )
                              }
                              className='bg-orange-500 hover:bg-orange-600'
                            >
                              <Save className='w-4 h-4 mr-1' />
                              {t('admin.feedback.saveEdit')}
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className='flex justify-end gap-2'>
                          {/* Download the response */}
                          <Button
                            size='sm'
                            onClick={() =>
                              handleDownload(
                                message.related_message?.edited_content ||
                                  message.related_message?.content
                              )
                            }
                            className='bg-orange-500 hover:bg-orange-600'
                          >
                            <Download className='w-4 h-4' />
                          </Button>

                          {feedback === '' &&
                            message.approval_status !==
                              ApprovalStatus.REJECTED && (
                              <>
                                <Button
                                  size='sm'
                                  onClick={() => handleEdit(message)}
                                  className='bg-orange-500 hover:bg-orange-600'
                                >
                                  <Edit className='w-4 h-4 mr-1' />
                                  {t('admin.feedback.editResponse')}
                                </Button>
                              </>
                            )}
                          {feedback !== '' &&
                            message.approval_status !==
                              ApprovalStatus.REJECTED && (
                              <Button
                                size='sm'
                                onClick={() => handleEdit(message)}
                                className='bg-orange-500 hover:bg-orange-600'
                              >
                                <Edit className='w-4 h-4 mr-1' />
                                {t('admin.feedback.editAgain')}
                              </Button>
                            )}
                          {message.approval_status !==
                            ApprovalStatus.REJECTED && (
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleApprove(message.uuid)}
                              disabled={
                                message.approval_status ===
                                ApprovalStatus.APPROVED
                              }
                              className={cn(
                                message.approval_status ===
                                  ApprovalStatus.APPROVED
                                  ? 'bg-green-500 hover:bg-green-600'
                                  : 'border-orange-200 hover:bg-orange-50'
                              )}
                            >
                              <Check className='w-4 h-4 mr-1' />
                              {message.approval_status ===
                              ApprovalStatus.APPROVED
                                ? t('admin.feedback.approved')
                                : t('admin.feedback.approveResponse')}
                            </Button>
                          )}

                          {message.approval_status !==
                            ApprovalStatus.APPROVED && (
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() => handleReject(message.uuid)}
                              disabled={
                                message.approval_status ===
                                ApprovalStatus.REJECTED
                              }
                              className={cn(
                                message.approval_status ===
                                  ApprovalStatus.REJECTED
                                  ? 'bg-red-500 hover:bg-red-600'
                                  : 'border-orange-200 hover:bg-orange-50'
                              )}
                            >
                              <Check className='w-4 h-4 mr-1' />
                              {message.approval_status ===
                              ApprovalStatus.REJECTED
                                ? t('admin.feedback.rejected')
                                : t('admin.feedback.rejectResponse')}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Load More Button */}
            {hasMore && messages.length > 0 && (
              <div className='flex justify-center pt-6'>
                <Button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  variant='outline'
                  className='border-orange-200 hover:bg-orange-50'
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                      {t('admin.feedback.loadingMore')}
                    </>
                  ) : (
                    t('admin.feedback.loadMore')
                  )}
                </Button>
              </div>
            )}

            {/* Show message when no more items */}
            {!hasMore && messages.length > 0 && (
              <div className='text-center py-6 text-gray-500'>
                {t('admin.feedback.noMoreQuestions')}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
