import { ChatMode } from "@/interfaces/chat";
import { useAgentStore } from "@/store/agent";
import { useAgentSettingStore } from "@/store/agent-setting";
import { useChatStore } from "@/store/chat";
import { BookOpen, Heart, Search, PenTool } from "lucide-react";

const iconMap = {
  guidance: <Heart className="w-4 h-4" />,
  search: <Search className="w-4 h-4" />,
  quiz: <BookOpen className="w-4 h-4" />,
  poetry: <PenTool className="w-4 h-4" />,
};

const useAgents = () => {
  const { agents, setSelectedAgentId, selectedAgentId, agentsMap } = useAgentStore();
  const currentAgent = selectedAgentId ? agentsMap[selectedAgentId] : (agents.length > 0 ? agents[0] : null);
  const onSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId, false);
  };
  const selectTheFirstAgent = () => {
    if (agents.length > 0) {
      setSelectedAgentId(agents[0].uuid, false);
    }
  };
  return { currentAgent, agents, onSelectAgent, selectedAgentId, selectTheFirstAgent, setSelectedAgentId, agentsMap };
};

export default useAgents;
