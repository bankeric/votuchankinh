import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MessageRole } from "@/interfaces/chat";
import { type ApprovalRequest } from "@/interfaces/agent";

// Extended Message type for training purposes
interface TrainingMessage {
  id: string;
  uuid: string;
  role: MessageRole | "system";
  content: string;
  timestamp: Date;
  parts?: Array<{ type: string; text: string }>;
  saved?: boolean;
  approvalRequest?: ApprovalRequest;
}

interface TrainingState {
  // Messages state
  messages: TrainingMessage[];
  setMessages: (messages: TrainingMessage[]) => void;
  addMessage: (message: TrainingMessage) => void;
  addMessageBeforeLast: (message: TrainingMessage) => void;
  updateMessage: (messageId: string, updates: Partial<TrainingMessage>) => void;
  updateLastMessage: (messageId: string, content: string) => void;
  
  // Input state
  input: string;
  setInput: (input: string) => void;
  
  // UI state
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  editingMessage: string | null;
  setEditingMessage: (messageId: string | null) => void;
  editContent: string;
  setEditContent: (content: string) => void;
  fileName: string;
  setFileName: (fileName: string) => void;
  showFileNameInput: string | null;
  setShowFileNameInput: (messageId: string | null) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  showActionMenu: string | null;
  setShowActionMenu: (messageId: string | null) => void;
  showFileMenu: boolean;
  setShowFileMenu: (show: boolean) => void;
  loadingMessageId: string | null;
  setLoadingMessageId: (messageId: string | null) => void;
  
  // Actions
  resetChat: (welcomeMessage: TrainingMessage) => void;
  toggleActionMenu: (messageId: string | null) => void;
}

export const useTrainingStore = create<TrainingState>()(
    (set, get) => ({
        // Messages state
        messages: [],
        setMessages: (messages) => set({ messages }),
        addMessage: (message) => set((state) => ({ 
          messages: [...state.messages, message] 
        })),
        addMessageBeforeLast: (message) => set((state) => {
          const messages = [...state.messages];
          if (messages.length > 0) {
            const lastMessage = messages.pop()!;
            messages.push(message, lastMessage);
          } else {
            messages.push(message);
          }
          return { messages };
        }),
        updateMessage: (messageId, updates) => set((state) => ({
          messages: state.messages.map((m) =>
            m.id === messageId ? { ...m, ...updates } : m
          )
        })),
        updateLastMessage: (messageId, content) => set((state) => {
          const messages = [...state.messages];
          const message = messages.find((m) => m.id === messageId);
          if (message) {
            message.content = message.content + content;
          }
          return { messages };
        }),
        
        // Input state
        input: "",
        setInput: (input) => set({ input }),
        
        // UI state
        isRecording: false,
        setIsRecording: (isRecording) => set({ isRecording }),
        editingMessage: null,
        setEditingMessage: (editingMessage) => set({ editingMessage }),
        editContent: "",
        setEditContent: (editContent) => set({ editContent }),
        fileName: "",
        setFileName: (fileName) => set({ fileName }),
        showFileNameInput: null,
        setShowFileNameInput: (showFileNameInput) => set({ showFileNameInput }),
        isLoading: false,
        setIsLoading: (isLoading) => set({ isLoading }),
        showActionMenu: null,
        setShowActionMenu: (showActionMenu) => set({ showActionMenu }),
        showFileMenu: false,
        setShowFileMenu: (showFileMenu) => set({ showFileMenu }),
        loadingMessageId: null,
        setLoadingMessageId: (loadingMessageId) => set({ loadingMessageId }),
        
        // Actions
        resetChat: (welcomeMessage) => set({
          messages: [welcomeMessage],
          input: "",
          editingMessage: null,
          editContent: "",
          showFileNameInput: null,
          showActionMenu: null,
          showFileMenu: false,
          loadingMessageId: null,
        }),
        
        toggleActionMenu: (messageId) => set((state) => ({
          showActionMenu: state.showActionMenu === messageId ? null : messageId
        })),
      })
); 