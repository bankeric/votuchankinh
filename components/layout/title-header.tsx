"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useChatStore } from "@/store/chat";
import { useTranslation } from "react-i18next";
import useAgents from "@/hooks/use-agents";
import AgentSelector from "@/components/agent-selector";
import useCreateChat from "@/hooks/use-create-chat";

interface TitleHeaderProps {
}

export function TitleHeader({  }: TitleHeaderProps) {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const {currentAgent, onSelectAgent} = useAgents();
  const { handleCreateChat } = useCreateChat();

  const { chats, activeChatId, setActiveChatId } = useChatStore();
  const activeChat = chats.find((chat) => chat.uuid === activeChatId);

  const handleSelectAgent = (agentId: string) => {
    onSelectAgent(agentId);
    const chat = chats.find((chat) => chat.agent_id === agentId && chat?.messages?.length === 0);

    if (activeChat?.agent_id !== agentId) {
      handleCreateChat();
    } else if (chat) {
      setActiveChatId(chat.uuid);
    }
  };

  return (
    <div className="bg-white border-b border-orange-200 p-3">
      <div className=" flex justify-center md:justify-between">
        {!isMobile && (
          <div className="flex gap-1 md:gap-2 overflow-x-auto">
            {/* title */}
            <div className="text-lg text-gray-800">{activeChat?.title}</div>
          </div>
        )}
        <div className="flex gap-1 md:gap-2">
          <AgentSelector onSelectAgent={handleSelectAgent} value={currentAgent} />
        </div>
      </div>
    </div>
  );
}
