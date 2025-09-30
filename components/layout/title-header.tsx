'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { useChatStore } from '@/store/chat'
import { useTranslation } from 'react-i18next'
import useAgents from '@/hooks/use-agents'
import AgentSelector from '@/components/v2/agent-selector'
import useCreateChat from '@/hooks/use-create-chat'
import Image from 'next/image'

interface TitleHeaderProps {}

export function TitleHeader({}: TitleHeaderProps) {
  const isMobile = useIsMobile()
  const { t } = useTranslation()
  const { currentAgent, onSelectAgent } = useAgents()
  const { handleCreateChat } = useCreateChat()

  const { chats, activeChatId, setActiveChatId } = useChatStore()
  const activeChat = chats.find((chat) => chat.uuid === activeChatId)

  const handleSelectAgent = (agentId: string) => {
    onSelectAgent(agentId)
    const chat = chats.find(
      (chat) => chat.agent_id === agentId && chat?.messages?.length === 0
    )

    if (activeChat?.agent_id !== agentId) {
      handleCreateChat()
    } else if (chat) {
      setActiveChatId(chat.uuid)
    }
  }

  return (
    <div className='bg-[#f4eacf] border-b border-[#2c2c2c]/30 p-3 h-16'>
      <div className='h-full flex items-center justify-end md:justify-between'>
        {/* {!isMobile && (
          <div className='flex gap-1 md:gap-2 overflow-x-auto'>
            <div className='text-lg text-gray-800'>{activeChat?.title}</div>
          </div>
        )} */}
        {/* <Image
          src={'/images/logo.png'}
          alt='Logo'
          width={40}
          height={40}
          style={{ cursor: 'pointer' }}
        /> */}

        <h1 className='hidden md:flex text-lg font-medium text-gray-800'>
          {activeChat?.title}
        </h1>
        <div className='flex items-center gap-1 md:gap-2'>
          <span className='font-[serif-sc] text-lg md:text-xl font-medium tracking-wide whitespace-nowrap text-red-900'>
            Vô Tự AI
          </span>
          <AgentSelector
            value={currentAgent}
            onSelectAgent={handleSelectAgent}
          />
        </div>
      </div>

    </div>
  )
}
