import {
  Chat,
  ChatMode,
  CreateChatDto,
  Language,
  Message,
  MessageRole
} from '@/interfaces/chat'
import { appToast } from '@/lib/toastify'
import {
  DEFAULT_TITLE_EN,
  DEFAULT_TITLE_VI,
  getDefaultTitle,
  now
} from '@/lib/utils'
import { chatService } from '@/service/chat'
import { create } from 'zustand'

interface ChatStore {
  chats: Chat[]
  totalChats: number
  activeChatId: string | null
  sidebarOpen: boolean
  loadingChatId: string | null
  loadingTitleChatId: string | null
  isConversationMode: boolean
  isMeditationMode: boolean
  // currentModel: string;
  // Chat actions
  setActiveChatId: (id: string | null) => void
  setSidebarOpen: (open: boolean) => void
  setLoadingChatId: (id: string | null) => void
  setLoadingTitleChatId: (id: string | null) => void
  setIsConversationMode: (isConversationMode: boolean) => void
  setIsMeditationMode: (isMeditationMode: boolean) => void
  createNewChat: ({
    agent_id,
    firstMessage,
    language
  }: {
    agent_id: string
    firstMessage?: string
    language?: Language
  }) => string
  getChats: (page?: number) => Promise<Chat[]>
  getMessages: (chatId: string) => Promise<Message[] | undefined>

  updateChat: (chatId: string, updates: Partial<Chat>) => void
  deleteChat: (chatId: string) => void
  addMessage: (chatId: string, message: Message) => void
  updateLastMessage: (
    chatId: string,
    content: string,
    isThinking?: boolean
  ) => void
  updateActiveChatTitleAndCreateSection: (
    chatId: string,
    language: Language,
    agent_id: string
  ) => void
  isChatExists: (id: string) => boolean
  updateMessage: (
    chatId: string,
    messageId: string,
    payload: Partial<Message>
  ) => void
  setMessageId: (
    chatId: string,
    previousMessageId: string,
    messageId: string
  ) => void
}

export const useChatStore = create<ChatStore>()((set, get) => {
  const updateActiveChatTitleAndCreateSection = async (
    chatId: string,
    language: Language,
    agent_id: string
  ) => {
    const currentChat = get().chats.find((chat) => chat.uuid === chatId)
    if (!currentChat) return
    if (
      !(
        currentChat.title === DEFAULT_TITLE_EN ||
        currentChat.title === DEFAULT_TITLE_VI
      )
    )
      return
    set({ loadingTitleChatId: chatId })
    const messages = currentChat.messages
    const payload: CreateChatDto = {
      agent_id,
      language,
      messages: messages
        .filter((message) => message.content !== 'default')
        .map((message) => ({
          role: message.role,
          content: message.content,
          created_at: message.created_at
        })),
      uuid: currentChat.uuid
    }
    const response = await chatService.create(payload)
    const resTitle = response.title || ''
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.uuid === chatId ? { ...chat, title: resTitle } : chat
      ),
      loadingTitleChatId: null
    }))
  }
  const getChats = async (page: number = 1) => {
    const response = await chatService.getAll(page)

    if (page === 1) {
      // First page: replace all chats
      set({ chats: response.data, totalChats: response.totalCount })
    } else {
      // Subsequent pages: append to existing chats
      set((state) => ({
        chats: [...state.chats, ...response.data],
        totalChats: response.totalCount
      }))
    }

    return response.data
  }
  const getMessages = async (chatId: string, loadMore: boolean = false) => {
    const response = await chatService.getMessages(chatId)
    const activeChat = get().chats.find((chat) => chat.uuid === chatId)
    if (!activeChat) return
    const currentChatMessages = activeChat.messages || []
    const newMessages = loadMore
      ? [...currentChatMessages, ...(response || [])]
      : [...(response || [])]
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.uuid === chatId ? { ...chat, messages: newMessages } : chat
      ),
      activeChatId: chatId
    }))
    return newMessages
  }

  const updateMessage = (
    chatId: string,
    messageId: string,
    payload: Partial<Message>
  ) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.uuid === chatId
          ? {
              ...chat,
              messages: chat.messages.map((message) =>
                message.uuid === messageId
                  ? { ...message, ...payload }
                  : message
              )
            }
          : chat
      )
    }))
  }
  const setMessageId = (
    chatId: string,
    previousMessageId: string,
    messageId: string
  ) => {
    set((state) => ({
      chats: state.chats.map((chat) => {
        if (chat.uuid === chatId) {
          return {
            ...chat,
            messages: chat.messages.map((message) => {
              if (message.uuid === previousMessageId) {
                return { ...message, uuid: messageId }
              }
              return message
            })
          }
        }
        return chat
      })
    }))
  }
  return {
    chats: [],
    totalChats: 0,
    activeChatId: null,
    sidebarOpen: true,
    loadingChatId: null,
    loadingTitleChatId: null,
    isConversationMode: false,
    isMeditationMode: false,
    getMessages,
    setMessageId,
    setIsConversationMode: (isConversationMode) => set({ isConversationMode }),
    setIsMeditationMode: (isMeditationMode) => set({ isMeditationMode }),
    setActiveChatId: (id) => {
      set({ activeChatId: id })
      // chat/<chat_id> without reload
      if (typeof window !== 'undefined') {
        window.history.pushState({}, '', `/ai/${id}`)
      }
    },
    updateMessage,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    setLoadingChatId: (id) => set({ loadingChatId: id }),
    setLoadingTitleChatId: (id) => set({ loadingTitleChatId: id }),
    updateActiveChatTitleAndCreateSection,
    getChats,
    isChatExists: (id) => get().chats.some((chat) => chat.uuid === id),
    createNewChat: ({
      // mode = ChatMode.GUIDANCE,
      agent_id,
      firstMessage,
      language = Language.EN
    }: {
      // mode?: ChatMode;
      agent_id: string
      firstMessage?: string
      language?: Language
    }) => {
      const assistantMessage = {
        uuid: crypto.randomUUID(),
        content: 'default',
        role: MessageRole.ASSISTANT,
        created_at: now(),
        // mode: mode,
        agent_id
      }
      const messages: Message[] = firstMessage
        ? [
            assistantMessage,
            {
              uuid: crypto.randomUUID(),
              content: firstMessage,
              role: MessageRole.USER,
              created_at: now(),
              // mode: mode,
              agent_id
            }
          ]
        : []
      const newChat: Chat = {
        uuid: crypto.randomUUID(),
        title: getDefaultTitle(language),
        messages,
        created_at: now(),
        updated_at: now(),
        agent_id
      }

      set((state) => {
        const newChats = [newChat, ...state.chats]
        return {
          chats: newChats,
          activeChatId: newChat.uuid
        }
      })
      return newChat.uuid
    },

    updateChat: (chatId, updates) =>
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.uuid === chatId
            ? { ...chat, ...updates, updated_at: now() }
            : chat
        )
      })),

    deleteChat: async (chatId) => {
      await chatService.delete(chatId)
      await getChats()
      appToast('Chat deleted successfully')
    },

    addMessage: (chatId, message) =>
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.uuid === chatId
            ? {
                ...chat,
                messages: [...chat.messages, message],
                updated_at: now()
              }
            : chat
        )
      })),

    updateLastMessage: (chatId, content, isThinking) => {
      if (isThinking) {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.uuid === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg, index) =>
                    index === chat.messages.length - 1
                      ? { ...msg, thought: msg.thought + content }
                      : msg
                  ),
                  updated_at: now()
                }
              : chat
          )
        }))
      } else {
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.uuid === chatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg, index) =>
                    index === chat.messages.length - 1
                      ? { ...msg, content: msg.content + content }
                      : msg
                  ),
                  updated_at: now()
                }
              : chat
          )
        }))
      }
    }
  }
})
