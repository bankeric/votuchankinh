'use client'

import { useIsMobile } from '@/hooks/use-mobile'
import { useChatStore } from '@/store/chat'
import { useTranslation } from 'react-i18next'
import useAgents from '@/hooks/use-agents'
import AgentSelector from '@/components/v2/agent-selector'
import useCreateChat from '@/hooks/use-create-chat'
import Image from 'next/image'
import { Button } from '../ui/button'
import { useState } from 'react'
import { Crown } from 'lucide-react'
import { SubscriptionModal } from './subscription-modal'
import { useTranslations } from '@/hooks/use-translations'

interface TitleHeaderProps {}

export function TitleHeader({}: TitleHeaderProps) {
  const isMobile = useIsMobile()
  const { t, language } = useTranslations()
  const { currentAgent, onSelectAgent } = useAgents()
  const { handleCreateChat } = useCreateChat()
  const [showMembership, setShowMembership] = useState<boolean>(false)

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
    <>
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

            {/* Subscription Plan - Mobile */}
            <button
              onClick={() => setShowMembership(true)}
            className='md:hidden flex items-center space-x-1 px-2 py-1 bg-[#991b1b] text-[#f6efe0] font-serif text-[11px] leading-none rounded-lg whitespace-nowrap overflow-hidden
                 border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                 hover:bg-[#7a1515] transition-colors'
            aria-label={language === 'en' ? 'Upgrade' : 'Nâng cấp'}
            >
              <Crown className='w-3 h-3' />
            </button>

            {/* Subscription Plan - Desktop */}
            <button
              onClick={() => setShowMembership(true)}
            className='hidden md:flex items-center space-x-2 px-3 py-2 bg-[#991b1b] text-[#f6efe0] font-serif text-sm rounded-xl whitespace-nowrap
                 border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                 hover:bg-[#7a1515] transition-colors w-full'
            >
              {/* <Crown className='w-4 h-4' /> */}
              <span>{language === 'en' ? 'Upgrade' : 'Nâng cấp'}</span>
            </button>
          </div>
        </div>

        <SubscriptionModal
          showMembership={showMembership}
          setShowMembership={() => setShowMembership(false)}
        />
      </div>

      {/* Mobile Selected Agent Display - Hidden by default */}
      {isMobile && currentAgent && (
        <div className='hidden bg-[#f4eacf] px-4 py-2 border-b border-[#2c2c2c]/30'>
          <div className='flex items-center justify-center'>
            <div className='px-3 py-1 bg-[#991b1b] text-[#f6efe0] font-serif text-sm rounded-lg
                           border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]'>
              {currentAgent.name}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
