import { Message, ChatMode } from './chat';

export interface QAndAPair {
  question: string;
  answer: string;
}
export interface QuestionAnswerState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}

export interface QuestionAnswerActions {
  // Actions for fetching messages
  fetchMessages: (agent_id: string, limit?: number) => Promise<void>;
  getMessagesByAgentId: (agent_id: string, limit?: number) => Promise<void>;
  // Actions for managing messages
  addMessage: (agent_id: string, message: Message) => void;
  updateMessage: (messageId: string, updatedMessage: Partial<Message>) => void;
  removeMessage: (agent_id: string, messageId: string) => void;
  appendMessages: (newMessages: Message[]) => void;
  
  // Actions for state management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Actions for clearing data
  clearMessages: (agent_id?: string) => void;
  clearAllMessages: () => void;
}

export type QuestionAnswerStore = QuestionAnswerState & QuestionAnswerActions;

// Helper type for getting messages by mode
export type MessagesByMode = {
  [K in ChatMode]: Message[];
}; 