import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";
import { MessageRole } from "@/interfaces/chat";
import { AgentActions, type ApprovalRequest } from "@/interfaces/agent";
import { useTrainingStore } from "@/store/training";
import { useAgentStore } from "@/store/agent";
import {
  approveApprovalRequest,
  generateBuddhistBuilderResponse,
} from "@/lib/buddha-ai";
import { getToolCallResoning, listOutApprovalObjects } from "@/lib/utils";
import { logging } from "@/lib/utils";
import { useTranslations } from "./use-translations";

export const useTraining = (
  onAddToSystemPrompt: (content: string) => void,
  onAddToKnowledge: (content: string, fileName: string) => void
) => {
  const { language } = useTranslations();
  const {
    selectedAgentId,
    agentsMap,
    setSelectedAgentId,
    fetchAgents,
    previewMessages,
  } = useAgentStore();

  const {
    messages,
    setMessages,
    addMessage,
    addMessageBeforeLast,
    updateMessage,
    updateLastMessage,
    input,
    setInput,
    isRecording,
    setIsRecording,
    editingMessage,
    setEditingMessage,
    editContent,
    setEditContent,
    fileName,
    setFileName,
    showFileNameInput,
    setShowFileNameInput,
    showActionMenu,
    setShowActionMenu,
    showFileMenu,
    setShowFileMenu,
    loadingMessageId,
    setLoadingMessageId,
    resetChat,
    toggleActionMenu,
  } = useTrainingStore();
  const checkAgentAndSetSelectedAgentId = async (agentId: string) => {
    const agent = agentsMap[agentId];
    if (agent) {
      setSelectedAgentId(agentId);
    } else {
      await fetchAgents(language, false);
      const agent = agentsMap[agentId];
      if (agent) {
        setSelectedAgentId(agentId);
      }
    }
  };
  const currentAgent = useMemo(() => {
    if (selectedAgentId && agentsMap[selectedAgentId]) {
      return agentsMap[selectedAgentId];
    }
    if (Object.keys(agentsMap).length > 0) {
      return Object.values(agentsMap)[0];
    }
    return null;
  }, [agentsMap, selectedAgentId]);

  const handleResetChat = (welcomeMessage: any) => {
    resetChat(welcomeMessage);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newUserMessage = {
      id: Date.now().toString(),
      role: MessageRole.USER,
      content: input,
      timestamp: new Date(),
      uuid: uuidv4(),
      parts: [{ type: "text", text: input }],
    };
    const aiMessage = {
      id: uuidv4(),
      uuid: crypto.randomUUID(),
      role: MessageRole.ASSISTANT,
      content: "",
      timestamp: new Date(),
    };

    setLoadingMessageId(aiMessage.id);
    addMessage(newUserMessage);
    addMessage(aiMessage);
    setInput("");

    const last_five_messages = messages.slice(-7);

    const last_four_preview_messages = previewMessages.slice(-4);
    const previewMessagesString = `
    Preview messages (last 4):
    ${
      last_four_preview_messages
      .map(
        (message) => `
      ${message.role}: ${message.content}
    `
      )
      .join("\n")
    
    }
    `;

    const payload = {
      userId: "1",
      messages: [
        ...last_five_messages.map((message) => ({
          role: message.role as MessageRole,
          content: message.content,
        })),
        {
          role: MessageRole.ASSISTANT,
          content: `
          User is working on agent "${currentAgent?.name}" with agent id: ${
            currentAgent?.uuid
          }

          ${last_four_preview_messages.length > 0 && previewMessagesString}
          `,
        },
        {
          role: MessageRole.USER,
          content: input,
        },
      ],
      language: language,
      modelId: "gpt-4.1-mini",
    };
    let stopStream = false;
    generateBuddhistBuilderResponse(payload, {
      updateCallback: (message: string) => {
        if (stopStream) return;
        updateLastMessage(aiMessage.id, message);
        setLoadingMessageId(null);
      },
      updateCurrentAgentId: async (agentId: string) => {
        await checkAgentAndSetSelectedAgentId(agentId);
      },
      stopStream: () => {
        stopStream = true;
        setLoadingMessageId(null);
      },
      createApprovalRequest: (request: ApprovalRequest) => {
        // create approval request message
        const approvalRequest = {
          id: uuidv4(),
          role: MessageRole.ASSISTANT,
          content: `
  ### ${getToolCallResoning(request.approval_request.tool_name, language)}:
  
  ${listOutApprovalObjects(request)}
  
    \n
  `,
          timestamp: new Date(),
          uuid: uuidv4(),
          approvalRequest: request,
        };
        addMessage(approvalRequest);
      },
      addMessage: (message: string) => {
        addMessageBeforeLast({
          id: uuidv4(),
          role: MessageRole.ASSISTANT,
          content: message,
          timestamp: new Date(),
          uuid: uuidv4(),
        });
      },
    });
  };

  const handleApproveOrReject = (message: any, approved: boolean) => {
    const approvalRequest = message.approvalRequest;
    if (!approvalRequest) return;
    const approvalResponse = {
      approval_id: approvalRequest.approval_id,
      approved: approved,
    };
    const aiMessage = {
      id: uuidv4(),
      uuid: crypto.randomUUID(),
      role: MessageRole.ASSISTANT,
      content: "",
      timestamp: new Date(),
    };
    setLoadingMessageId(aiMessage.id);
    addMessage(aiMessage);
    approveApprovalRequest(
      {
        userId: "1",
        messages: [],
        language: language,
        modelId: "gpt-4.1-mini",
        approvalRequest: approvalResponse,
      },
      {
        updateCallback: (message: string) => {
          updateLastMessage(aiMessage.id, message);
          setLoadingMessageId(null);
        },
        updateCurrentAgentId: async (agentId: string) => {
          await checkAgentAndSetSelectedAgentId(agentId);
        },
        createApprovalRequest: () => {},
        stopStream: () => {
          setLoadingMessageId(null);
        },
        addMessage: (message: string, action?: AgentActions) => {
          addMessageBeforeLast({
            id: uuidv4(),
            role: MessageRole.ASSISTANT,
            content: message,
            timestamp: new Date(),
            uuid: uuidv4(),
          });
          if (action === AgentActions.GET_LIST_OF_AGENTS) {
            fetchAgents(language, false);
          }
        },
      }
    );

    // remove approval request from message when user click approve or reject
    updateMessage(message.id, { approvalRequest: undefined });
  };

  const handleVoiceToggle = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      logging("Starting voice recording...");
    } else {
      logging("Stopping voice recording...");
      // Simulate voice input
      setInput(input + " [Nội dung ghi âm]");
    }
  };

  const handleSaveToPrompt = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      onAddToSystemPrompt(message.content);
      updateMessage(messageId, { saved: true });
      setShowActionMenu(null);
    }
  };

  const handleSaveToKnowledge = (messageId: string) => {
    setShowFileNameInput(messageId);
    setFileName(`training_${new Date().toISOString().slice(0, 10)}.txt`);
    setShowActionMenu(null);
  };

  const confirmSaveToKnowledge = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (message && fileName) {
      onAddToKnowledge(message.content, fileName);
      updateMessage(messageId, { saved: true });
      setShowFileNameInput(null);
      setFileName("");
    }
  };

  const handleEdit = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      setEditingMessage(messageId);
      setEditContent(message.content);
      setShowActionMenu(null);
    }
  };

  const saveEdit = (messageId: string) => {
    updateMessage(messageId, {
      content: editContent,
      parts: [{ type: "text", text: editContent }],
    });
    setEditingMessage(null);
    setEditContent("");
  };

  const cancelEdit = () => {
    setEditingMessage(null);
    setEditContent("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !loadingMessageId) {
        handleSubmit(e as any);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  // Helper function to convert TrainingMessage to Message for MessageBubble
  const convertToMessage = (trainingMessage: any) => {
    return {
      uuid: trainingMessage.uuid,
      role:
        trainingMessage.role === "system"
          ? MessageRole.ASSISTANT
          : trainingMessage.role,
      content: trainingMessage.content,
      agentId: trainingMessage.agentId,
    };
  };

  return {
    // State
    messages,
    setMessages,
    input,
    isRecording,
    editingMessage,
    editContent,
    fileName,
    showFileNameInput,
    showActionMenu,
    showFileMenu,
    loadingMessageId,
    currentAgent,

    // Actions
    handleResetChat,
    handleSubmit,
    handleApproveOrReject,
    handleVoiceToggle,
    handleSaveToPrompt,
    handleSaveToKnowledge,
    confirmSaveToKnowledge,
    handleEdit,
    saveEdit,
    cancelEdit,
    handleKeyDown,
    handleInputChange,
    convertToMessage,

    // Message operations
    addMessage,
    addMessageBeforeLast,

    // Setters
    setInput,
    setIsRecording,
    setEditingMessage,
    setEditContent,
    setFileName,
    setShowFileNameInput,
    setShowActionMenu,
    setShowFileMenu,
    setLoadingMessageId,
    toggleActionMenu,
  };
};
