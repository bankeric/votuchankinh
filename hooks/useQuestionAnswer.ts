import { useCallback } from 'react';
import questionAnswerStore from '@/store/question-answer';
import { ChatMode, Message } from '@/interfaces/chat';
import useAgents from './use-agents';
import { appToast } from '@/lib/toastify';

export const useQuestionAnswer = () => {
  const {
    messages,
    loading,
    error,
    fetchMessages,
    getMessagesByAgentId,
    addMessage,
    updateMessage,
    removeMessage,
    appendMessages,
    setLoading,
    setError,
    clearError,
    clearMessages,
    clearAllMessages,
  } = questionAnswerStore();

  const { agents, onSelectAgent, currentAgent } = useAgents();
  // Helper function to get messages by mode
  const getMessagesByMode = useCallback((agent_id: string): Message[] => {
    return messages.filter((message) => message.agent_id === agent_id);
  }, [messages]);

  // Helper function to get all messages
  const getAllMessages = useCallback((): Message[] => {
    return [
      ...messages,
    ];
  }, [messages]);

  const handleUpdateMessage = useCallback(async (messageId: string, updatedMessage: Partial<Message>) => {
    
    await updateMessage(messageId, updatedMessage);
    appToast("Message updated", {
      type: "success",
    });
    if (currentAgent?.uuid) {
      await getMessagesByAgentId(currentAgent.uuid, 10);
    }
  }, [currentAgent?.uuid]);

  return {
    // State
    currentAgent,
    agents,
    messages,
    loading,
    error,
    
    // Helper functions
    getMessagesByMode,
    getAllMessages,
    
    // Actions
    fetchMessages,
    onSelectAgent,
    getMessagesByAgentId,
    addMessage,
    handleUpdateMessage,
    removeMessage,
    appendMessages,
    setLoading,
    setError,
    clearError,
    clearMessages,
    clearAllMessages,
  };
}; 