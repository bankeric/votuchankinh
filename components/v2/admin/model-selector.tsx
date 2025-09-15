import { useState, useEffect } from "react";
import { ChevronDown, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Model } from "@/interfaces/chat";
import { useAppStateStore } from "@/store/app";

interface ModelSelectorProps {
  value: Model | null;
  onSelectModel: (model: Model) => void;
  placeholder?: string;
}

const ModelSelector = ({ value, onSelectModel, placeholder = "Select Base Model" }: ModelSelectorProps) => {
  const { models, getModels, isLoading } = useAppStateStore();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    getModels();
  }, [getModels]);

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 min-w-[240px] justify-between"
        disabled={isLoading}
      >
        <div className="flex items-center gap-2">
          <Brain className="w-3 h-3" />
          <span className="text-xs">
            {isLoading ? "Loading..." : value?.name || placeholder}
          </span>
        </div>
        <ChevronDown className="w-3 h-3" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {models.length === 0 ? (
            <div className="p-3 text-xs text-gray-500 text-center">
              {isLoading ? "Loading models..." : "No models available"}
            </div>
          ) : (
            models.map((model) => (
              <button
                key={model.name}
                onClick={() => {
                  onSelectModel(model);
                  setIsOpen(false);
                }}
                className="w-full p-2 text-left text-xs hover:bg-gray-50 flex items-center gap-2 border-b border-gray-100 last:border-b-0"
              >
                {/* <Brain className="w-3 h-3 text-gray-400" /> */}
                <div>
                  <div className="font-medium">{model.name}</div>
                  {model.description && (
                    <div className="text-gray-500 truncate">{model.description}</div>
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

export default ModelSelector; 