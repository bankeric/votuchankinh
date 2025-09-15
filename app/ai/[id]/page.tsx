'use client'

import { useParams, useRouter } from 'next/navigation'
import { useChatStore } from '@/store/chat'
import { Button } from '@/components/ui/button'
import { useOnce } from '@/hooks/use-once'
import { Chat as ChatType } from '@/interfaces/chat'
import { MainLayout } from '@/components/layout/main-layout'
import useCreateChat from '@/hooks/use-create-chat'
import useAgents from '@/hooks/use-agents'

function ChatPage() {
  const { id } = useParams()
  const router = useRouter()
  const {
    chats,
    activeChatId,
    setActiveChatId,
    getMessages,
    isChatExists,
    getChats
  } = useChatStore()
  const { handleCreateChat } = useCreateChat()
  const { setSelectedAgentId } = useAgents()
  // Set active chat on mount and handle navigation
  useOnce(() => {
    const initChat = async () => {
      // If no chats, should fetch chats
      let chats: ChatType[] = []
      if (chats.length === 0) {
        chats = await getChats()
      }

      if (id && typeof id === 'string') {
        console.log('id', id)
        console.log('isChatExists', isChatExists(id))
        if (!isChatExists(id)) {
          const uuid = handleCreateChat()
          setActiveChatId(uuid)
        } else {
          setActiveChatAndGetMessages(id)
        }
      }
    }
    initChat()
  }, [id])

  // const activeChat = chats.find((chat) => chat.uuid === activeChatId);
  const setActiveChatAndGetMessages = async (chatId: string) => {
    setActiveChatId(chatId)
    const messages = await getMessages(chatId)
    // usually the messages contains the agent_id, based on that we can update the agent_id
    if (messages && messages.length > 0) {
      const agentId = messages[0].agent_id
      // update the agent_id
      setSelectedAgentId(agentId, false)
    }
  }
  // if (!activeChat) {
  //   return (
  //     <div className="flex items-center justify-center h-screen">
  //       <div className="text-center">
  //         <h2 className="text-2xl font-bold text-orange-900 mb-4">
  //           <div className="flex items-center justify-center space-x-2">
  //             <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
  //             <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-150" />
  //             <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse delay-300" />
  //           </div>
  //         </h2>
  //         <Button
  //           onClick={() => router.push("/")}
  //           className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white"
  //         >
  //           Return Home
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  return <MainLayout />
}

export default ChatPage
