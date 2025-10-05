import { useState, useEffect } from 'react'
import { ChevronDown, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAgentStore } from '@/store/agent'
import { Agent, AgentStatus } from '@/interfaces/agent'
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem
} from './ui/select'

interface AgentSelectorProps {
  value: Agent | null
  onSelectAgent: (agentId: string) => void
}

const AgentSelector = ({ value, onSelectAgent }: AgentSelectorProps) => {
  const { agents, isLoading } = useAgentStore()

  const activeAgent = agents.filter(
    (agent) => agent.status === AgentStatus.ACTIVE
  )
  return (
    <Select
      value={value?.uuid}
      onValueChange={onSelectAgent}
    >
      <SelectTrigger
        className='min-w-[120px] md:min-w-[170px] bg-[#f3ead7] text-[#1f1f1f] font-serif text-xs md:text-sm rounded-xl md:rounded-2xl px-2 md:px-4 py-1 md:py-2
                 border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]
                 hover:bg-[#efe2c9] focus:outline-none focus:ring-0
                 data-[state=open]:bg-[#efe2c9] transition-colors'
        aria-label='Choose AI Agent'
      >
        <span className='mr-1 md:mr-2'>Agent</span>
        <SelectValue placeholder='Choose Agent' />
      </SelectTrigger>

      <SelectContent
        className='agent-select bg-[#f3ead7] border-2 border-[#2c2c2c] rounded-xl md:rounded-2xl p-2 shadow-[0_6px_0_#00000030]
                 data-[state=open]:animate-in'
        position='popper'
        align='end'
        sideOffset={8}
      >
        {activeAgent.map((agent) => (
          <SelectItem
            key={agent.uuid}
            value={agent.uuid}
            className='font-serif text-sm md:text-base px-2 md:px-3 py-1 md:py-2 rounded-md text-[#2c2c2c]
                   data-[state=checked]:bg-[#991b1b] data-[state=checked]:text-[#f6efe0]
                   data-[highlighted]:bg-[#991b1b]/85 data-[highlighted]:text-[#f6efe0]
                   focus:bg-[#991b1b]/85 focus:text-[#f6efe0]'
          >
            {agent.name}
          </SelectItem>
        ))}
      </SelectContent>
      <style jsx global>{`
        .agent-select [role="option"] { padding-right: 2rem; }
        .agent-select span.absolute.left-2 { left: auto !important; right: 0.5rem; }
      `}</style>
    </Select>
  )
}

export default AgentSelector
