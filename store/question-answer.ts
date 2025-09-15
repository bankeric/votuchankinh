import { create } from "zustand";
import { messagesService } from "@/service/messages";
import { QuestionAnswerStore } from "@/interfaces/question-answer";
import { ChatMode, Message } from "@/interfaces/chat";

const questionAnswerStore = create<QuestionAnswerStore>((set, get) => ({
  // State
  messages: [],
  loading: false,
  error: null,
  // Actions for fetching messages
  fetchMessages: async (agent_id: string, limit: number = 10) => {
    set({ loading: true, error: null });
    try {
      const response = await messagesService.getMessagesByAgentId(agent_id, limit);
      const messages = response.data;

      set((state) => ({
        ...state,
        loading: false,
        messages,
      }));
    } catch (error) {
      set({
        loading: false,
        error:
          error instanceof Error ? error.message : "Failed to fetch messages",
      });
    }
  },
  getMessagesByAgentId: async (agent_id: string, limit: number = 10) => {
    await get().fetchMessages(agent_id, limit);
  },

  // Add method to append messages for pagination
  appendMessages: (newMessages: Message[]) => {
    set((state) => ({
      ...state,
      messages: [...state.messages, ...newMessages],
    }));
  },

  // fetchMessagesByMode: async (mode: ChatMode, limit: number = 10) => {
  //   await get().fetchMessages(mode, limit);
  // },

  // Actions for managing messages
  addMessage: (agent_id: string, message: Message) => {
    // set((state) => ({
    //   ...state,
    //   [getModeKey(mode)]: [message, ...state[getModeKey(mode)]],
    // }));
  },

  updateMessage: async (
    messageId: string,
    updatedMessage: Partial<Message>
  ) => {
    await messagesService.updateMessage(messageId, updatedMessage);
  },

  removeMessage: (agent_id: string, messageId: string) => {
    // set((state) => ({
    //   ...state,
    //   [getModeKey(mode)]: state[getModeKey(mode)].filter(
    //     (msg) => msg.uuid !== messageId
    //   ),
    // }));
  },

  // Actions for state management
  setLoading: (loading: boolean) => {
    set({ loading });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  // Actions for clearing data
  clearMessages: (agent_id?: string) => {
    if (agent_id) {
      set((state) => ({
        ...state,
        messages: [],
      }));
    } else {
      set({
        messages: [],
      });
    }
  },

  clearAllMessages: () => {
    set({
      messages: [],
    });
  },
}));

export default questionAnswerStore;
