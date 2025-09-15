import { useState, useRef, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { MessageRole, PreviewMessage } from "@/interfaces/chat";
import { useAgentStore } from "@/store/agent";
import { generateBuddhistResponse } from "@/lib/buddha-ai";
import { logging } from "@/lib/utils";
import { useTranslations } from "./use-translations";

export const useGptPreview = () => {
  const { language } = useTranslations();
  const {
    currentSessionId,
    selectedAgentId,
    setSelectedAgentId,
    agentsMap,
    previewMessages,
    setPreviewMessages,
    setCurrentSessionId,
  } = useAgentStore();
  const selectedAgent = selectedAgentId ? agentsMap[selectedAgentId] : null;
  // State
  const [loadingMessageId, setLoadingMessageId] = useState<string | null>(null);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [previewInput, setPreviewInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showPromptContext, setShowPromptContext] = useState(false);

  // Refs
  const previewTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Actions
  const resetChat = useCallback(() => {
    setCurrentSessionId(uuidv4());
    setPreviewMessages(() => []);
    setPreviewInput("");
    setLoadingMessageId(null);
    setShowFileMenu(false);
    setIsRecording(false);
  }, []);
  const updateLastMessage = (content: string, isThinking: boolean = false) => {
    if (isThinking) {
      setPreviewMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        const result = lastMessage.thought + content;
        return [...prev.slice(0, -1), { ...lastMessage, thought: result }];
      });
    } else {
      setPreviewMessages((prev) => {
        const lastMessage = prev[prev.length - 1];
        const result = lastMessage.content + content;
        return [...prev.slice(0, -1), { ...lastMessage, content: result }];
      });
    }
  };
  const handlePreviewSubmit = useCallback(
    async (e: React.FormEvent, starter?: string) => {
      const input = starter || previewInput;
      e.preventDefault();
      if (!input.trim() || !selectedAgent || !currentSessionId) {
        console.error("No input or agent or session id", input, selectedAgent, currentSessionId);
        return;
      };

      const newUserMessage: PreviewMessage = {
        uuid: Date.now().toString(),
        role: MessageRole.USER,
        content: input,
        agent_id: selectedAgent.uuid,
      };

      const aiMessage: PreviewMessage = {
        uuid: uuidv4(),
        role: MessageRole.ASSISTANT,
        content: "",
        thought: "",
        agent_id: selectedAgent.uuid,
      };

      setLoadingMessageId(aiMessage.uuid);
      setPreviewMessages((prev) => [...prev, newUserMessage, aiMessage]);
      setPreviewInput("");

      const last_five_messages = previewMessages.slice(-7);

      const payload = {
        sessionId: currentSessionId,
        messages: [
          ...last_five_messages.map((message) => ({
            role: message.role,
            content: message.content,
          })),
          {
            role: MessageRole.USER,
            content: input,
          },
        ],
        language: language,
        agentId: selectedAgent.uuid,
        isPreview: true,
      };

      await generateBuddhistResponse(payload, {
        updateCallback: (message: string) => {
          updateLastMessage(message, false);
        },
        updateThought: (message: string) => {
          updateLastMessage(message, true);
        },
        updateLastMessageId: (messageId: string) => {
        },
      });

      setLoadingMessageId(null);
    },
    [previewInput, selectedAgent, previewMessages, language]
  );

  const handlePreviewInputChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPreviewInput(e.target.value);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (previewInput.trim() && !loadingMessageId && selectedAgent) {
          handlePreviewSubmit(e as any);
        }
      }
    },
    [previewInput, loadingMessageId, selectedAgent]
  );

  const handleVoiceToggle = useCallback(() => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      logging("Starting voice recording...");
    } else {
      logging("Stopping voice recording...");
      // Simulate voice input
      setPreviewInput((prev) => prev + " [Nội dung ghi âm]");
    }
  }, [isRecording]);

  const toggleFileMenu = useCallback(() => {
    setShowFileMenu(!showFileMenu);
  }, [showFileMenu]);

  const togglePromptContext = useCallback(() => {
    setShowPromptContext(!showPromptContext);
  }, [showPromptContext]);

  const handleSelectAgent = useCallback(
    (agentId: string) => {
      setSelectedAgentId(agentId);
    },
    [setSelectedAgentId]
  );

  const handleSaveMessageToPrompt = useCallback(
    (messageId: string) => {
      const message = previewMessages.find((m) => m.uuid === messageId);
      if (message) {
        // Handle saving message to prompt
        logging("Saving message to prompt:", message.content);
      }
    },
    [previewMessages]
  );

  return {
    // State
    messages: previewMessages,
    loadingMessageId,
    showFileMenu,
    previewInput,
    isRecording,
    showPromptContext,
    previewTextareaRef,

    // Actions
    resetChat,
    handlePreviewSubmit,
    handlePreviewInputChange,
    handleKeyDown,
    handleVoiceToggle,
    toggleFileMenu,
    togglePromptContext,
    handleSelectAgent,
    handleSaveMessageToPrompt,
    setCurrentSessionId,
  };
};
