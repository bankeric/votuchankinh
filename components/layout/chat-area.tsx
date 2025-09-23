'use client'

import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { WelcomeScreen } from '@/components/v2/chat/welcome-screen'
import { MainChatBubble } from '@/components/v2/chat/main-chat-bubble'
import { MessageRole, ChatMode } from '@/interfaces/chat'
import { generateBuddhistResponse } from '@/lib/buddha-ai'
import { now } from '@/lib/utils'
import { useChatStore } from '@/store/chat'
import { FileText, ImageIcon, Mic, MicOff, Send, Plus } from 'lucide-react'
import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { useAppStateStore } from '@/store/app'
import { Textarea } from '../ui/textarea'
import { ScrollArea } from '../ui/scroll-area'
import { useTranslation } from 'react-i18next'
import { logging } from '@/lib/utils'
import useAgents from '@/hooks/use-agents'
import { appToast } from '@/lib/toastify'
import { useTranslations } from '@/hooks/use-translations'
import { WelcomeScreenV2 } from '../v2/chat/welcome-screen-v2'
import { InputArea } from './input-area'
import { getAuthToken } from '@/lib/axios'
import { LoginModal } from './login-modal'
import { useSpeechToText } from '@/hooks/useSpeechToText'

const useChat = () => {
  const {
    chats,
    activeChatId,
    loadingChatId,
    setLoadingChatId,
    addMessage,
    updateLastMessage,
    updateActiveChatTitleAndCreateSection,
    setActiveChatId,
    setMessageId,
    isConversationMode,
    setIsConversationMode
  } = useChatStore()

  const conversation = chats.find((chat) => chat.uuid === activeChatId)
  const messages = conversation?.messages || []
  const [input, setInput] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showFileSubmenu, setShowFileSubmenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLogin, setIsLogin] = useState(false)

  const { language } = useTranslations()
  const { model } = useAppStateStore()
  const { currentAgent } = useAgents()
  const { t } = useTranslation()

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    value?: string
  ) => {
    e.preventDefault && e.preventDefault()
    if (!getAuthToken()) {
      setIsLogin(true)
      return
    }
    logging('finalInput', value)
    const finalInput = value || input.trim()

    if (!finalInput || loadingChatId === conversation?.uuid) return
    if (!currentAgent) {
      appToast(t('chat.noAgent'), {
        type: 'error'
      })
      throw new Error(t('chat.noAgent'))
    }

    logging('finalInput', finalInput)
    if (!conversation) return
    const userMessage = {
      uuid: crypto.randomUUID(),
      role: MessageRole.USER,
      content: finalInput,
      created_at: now(),
      agent_id: currentAgent.uuid
    }
    // Add user message
    addMessage(conversation.uuid, userMessage)
    setInput('')

    // Add initial empty AI message
    const aiMessage = {
      uuid: crypto.randomUUID(),
      role: MessageRole.ASSISTANT,
      content: '',
      thought: '',
      created_at: now(),
      agent_id: currentAgent.uuid
    }
    addMessage(conversation.uuid, aiMessage)

    try {
      setLoadingChatId(conversation.uuid)

      const messages = conversation.messages
        .filter((message) => message.content !== 'default')
        .slice(0, 5)
        .map((message) => ({
          role: message.role,
          content: message.content
        }))
      const uMess = {
        role: MessageRole.USER,
        content: userMessage.content,
        created_at: userMessage.created_at
      }
      const payload = {
        sessionId: conversation.uuid,
        agentId: currentAgent.uuid,
        chatId: conversation.uuid,
        messages: [...messages, uMess],
        language: language,
        model: model,
        isConversationMode: isConversationMode
      }
      logging(
        'updateActiveChatTitleAndCreateSection currentAgent.uuid',
        currentAgent.uuid
      )
      // Use the generator function to stream the response
      const response = await generateBuddhistResponse(payload, {
        updateCallback: (message: string) => {
          updateLastMessage(conversation.uuid, message, false)
        },
        updateThought: (message: string) => {
          updateLastMessage(conversation.uuid, message, true)
        },
        updateLastMessageId: (messageId: string) => {
          setMessageId(conversation.uuid, aiMessage.uuid, messageId)
        }
      })
      updateActiveChatTitleAndCreateSection(
        conversation.uuid,
        language,
        currentAgent.uuid
      )
      setActiveChatId(conversation.uuid)
      logging('updateActiveChatTitleAndCreateSection response', response)
    } catch (error) {
      console.error('Error in chat:', error)
      // Update the last message with an error message
      updateLastMessage(
        conversation.uuid,
        'I apologize, but I encountered an error while contemplating your question. Please try again, dear friend.'
      )
    } finally {
      setLoadingChatId(null)
    }
  }

  return {
    conversation,
    messages,
    input,
    handleSubmit,
    isLoading: loadingChatId,
    setInput,
    isLogin,
    setIsLogin
  }
}

export function ChatArea() {
  const chat = useChat()
  const { language } = useTranslations()
  const { t } = useTranslation()

  if (!chat) return null
  const { conversation, messages, input, handleSubmit, isLoading, setInput } =
    chat

  const { isConversationMode, setIsConversationMode } = useChatStore()
  const { isListening, toggleListening } = useSpeechToText({
    lang: language,
    onResult: (text, isFinal) => {
      console.log('🗣️ Speech result:', text)
      if (isFinal) {
        // If final, append to input with a space
        setInput((prev) => (prev ? prev + ' ' + text : text))
      } else {
        // If interim, just set the input to the current text
        setInput(text)
      }
    },
    onError: (error) => {
      console.error('❌ Speech error in chat:', error)
      // Optionally show toast notification
    },
    continuous: true,
    interimResults: true
  })

  const handleConversationMode = (checked: boolean) => {
    setIsConversationMode(checked)
    // TODO: Implement conversation mode functionality
    console.log('Conversation mode toggled:', checked)
  }

  const [showDropdown, setShowDropdown] = useState(false)
  const [showFileSubmenu, setShowFileSubmenu] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container')) {
        setShowDropdown(false)
        setShowFileSubmenu(false)
      }
    }

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDropdown])

  const handleVoiceToggle = () => {
    console.log('🎙️ Voice toggle clicked, current state:', isListening)
    toggleListening()
  }

  const handleFileUpload = (type: string) => {
    setShowDropdown(false)
    setShowFileSubmenu(false)
    if (fileInputRef.current) {
      fileInputRef.current.accept =
        type === 'image'
          ? 'image/*'
          : type === 'document'
          ? '.pdf,.doc,.docx,.txt'
          : '*/*'
      fileInputRef.current.click()
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      logging('File selected:', file.name)
      // Here you would implement file upload logic
      setInput(input + ` [${t('chat.fileAttached')}: ${file.name}]`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        handleSubmit(e as any)
      }
    }
  }

  const handleSaveToSystemPrompt = (content: string) => {
    logging('Lưu vào system prompt:', content)
    // Hiển thị thông báo thành công
    alert(t('chat.systemPromptSaved'))
    // Trong thực tế, bạn sẽ gọi API để cập nhật system prompt
  }

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  // if (!conversation) return <></>
  return (
    <div className='flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-64px)]'>
      {/* Messages */}
      {!conversation || messages.length === 0 ? (
        <WelcomeScreenV2 />
      ) : (
        <ScrollArea className='flex-1 p-4'>
          <div className='max-w-4xl mx-auto space-y-6'>
            {conversation.messages && conversation.messages.length === 0 && (
              <div className='flex items-center justify-center h-full'>
                <p className='text-orange-600/70 font-light text-center p-10'>
                  {t('chat.readyToHelp')}
                </p>
              </div>
            )}
            {conversation.messages &&
              conversation.messages.length > 0 &&
              conversation.messages.map((message, index) => (
                <MainChatBubble
                  key={message.uuid}
                  message={message}
                  isLastMessage={index === conversation.messages.length - 1}
                  isLoading={!!isLoading}
                  formatTime={formatTime}
                />
              ))}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      )}

      {/* Input */}
      <InputArea
        handleSubmit={handleSubmit}
        input={input}
        setInput={setInput}
        handleKeyDown={handleKeyDown}
        isLoading={isLoading}
        isRecording={isListening}
        handleVoiceToggle={handleVoiceToggle}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        handleFileUpload={handleFileUpload}
      />

      <LoginModal
        open={chat.isLogin}
        onClose={() => chat.setIsLogin(false)}
      />
    </div>
  )
}
