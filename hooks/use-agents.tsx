import React from "react";
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
  
  // Find "Tâm An" agent or fallback to first agent
  const findDefaultAgent = () => {
    const tamAnAgent = agents.find(agent => agent.name === "Tâm An");
    return tamAnAgent || (agents.length > 0 ? agents[0] : null);
  };
  
  const currentAgent = selectedAgentId ? agentsMap[selectedAgentId] : findDefaultAgent();
  
  const onSelectAgent = (agentId: string) => {
    setSelectedAgentId(agentId, false);
  };
  
  const selectTheFirstAgent = () => {
    const defaultAgent = findDefaultAgent();
    if (defaultAgent) {
      setSelectedAgentId(defaultAgent.uuid, false);
    }
  };
  
  // Auto-select Tâm An when agents are loaded
  React.useEffect(() => {
    if (agents.length > 0 && !selectedAgentId) {
      const defaultAgent = findDefaultAgent();
      if (defaultAgent) {
        setSelectedAgentId(defaultAgent.uuid, false);
      }
    }
  }, [agents, selectedAgentId]);
  
  return { currentAgent, agents, onSelectAgent, selectedAgentId, selectTheFirstAgent, setSelectedAgentId, agentsMap };
};

export default useAgents;
