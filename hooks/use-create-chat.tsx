import { Chat } from "@/interfaces/chat";
import { useChatStore } from "@/store/chat";
import { useTranslations } from "./use-translations";
import useAgents from "./use-agents";

const useCreateChat = (): { handleCreateChat: () => string } => {
  const { createNewChat, chats, setActiveChatId } = useChatStore();
  const { selectedAgentId } = useAgents();
  const { language } = useTranslations();
  const handleCreateChat = () => {
    const chat = chats.find((chat: Chat) => chat.agent_id === selectedAgentId && chat?.messages?.length === 0);
    if (chat) {
      return chat.uuid;
    }
    const uuid = createNewChat({ language: language, agent_id: selectedAgentId! });
    setActiveChatId(uuid);
    return uuid;
  };
  return { handleCreateChat };
};

export default useCreateChat;
