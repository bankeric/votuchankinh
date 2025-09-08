import { useState, useEffect } from "react";
import { ChevronDown, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Agent } from "../interfaces/agent";
import { useAgentStore } from "@/store/agent";

interface AgentSelectorProps {
  value: Agent | null;
  onSelectAgent: (agentId: string) => void;
}

const AgentSelector = ({ value, onSelectAgent }: AgentSelectorProps) => {
  const { agents, isLoading } = useAgentStore();
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 min-w-[240px] justify-between border-orange-200 hover:bg-orange-50 outline-orange-200"
        disabled={isLoading}
      >
        <div className="flex items-center gap-2">
          <User className="w-3 h-3" />
          <span className="text-xs">
            {isLoading ? "Loading..." : value?.name || "Select Agent"}
          </span>
        </div>
        <ChevronDown className="w-3 h-3" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {agents.length === 0 ? (
            <div className="p-3 text-xs text-gray-500 text-center">
              {isLoading ? "Loading agents..." : "No agents available"}
            </div>
          ) : (
            agents.map((agent) => (
              <button
                key={agent.uuid}
                onClick={() => {
                  onSelectAgent(agent.uuid);
                  setIsOpen(false);
                }}
                className="w-full p-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 last:border-b-0"
              >
                <User className="w-3 h-3 text-gray-400" />
                <div>
                  <div className="font-medium">{agent.name}</div>
                  {agent.description && (
                    <div className="text-gray-500 truncate">{agent.description}</div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AgentSelector;