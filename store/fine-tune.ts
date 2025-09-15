import { ApprovalStatus, ChatMode, Message } from "@/interfaces/chat";
import { QAndAPair } from "@/interfaces/question-answer";
import { appToast } from "@/lib/toastify";
import { fineTuneService, FineTuningJob } from "@/service/finetune";
import { messagesService } from "@/service/messages";
import { create } from "zustand";

interface FineTuneJSONPart {
  contents: {
    role: string;
    parts: { text: string }[];
  }[];
}

const prepareJSON = (messages: Message): FineTuneJSONPart => {
  if (!messages.related_message) {
    throw new Error("Message has no related message");
  }
  const json: FineTuneJSONPart = {
    contents: [
      {
        role: "user",
        parts: [{ text: messages.content }],
      },
      {
        role: "model",
        parts: [{ text: messages.related_message?.content }],
      },
    ],
  };
  return json;
};


interface FineTuneStore {
  messages: Message[];
  fineTuningJobs: FineTuningJob[];
  qAndAPairs: QAndAPair[];
  setAllMessages: (agentId?: string) => Promise<void>;
  prepareJSON: (messages: Message[]) => FineTuneJSONPart[];
  addQAndAPair: (qAndAPair: QAndAPair) => void;
  removeQAndAPair: (index: number) => void;
  rejectMessage: (messageId: string) => void;
  saveQAndAPairsToSystem: () => void;
  startTraining: (baseModel?: string) => void;
  getFineTuningJobs: () => Promise<void>;
}

const useFineTuneStore = create<FineTuneStore>((set, get) => {
  return {
    messages: [],
    fineTuningJobs: [],
    qAndAPairs: [],
    setAllMessages: async (agentId?: string) => {
      const response = await messagesService.getMessages({
        limit: 1000,
        include_related: true,
        approval_status: ApprovalStatus.APPROVED,
        agent_id: agentId,
      });
      const messages = response.data;
      set({ messages });
    },
    prepareJSON: (messages: Message[]) => {
      const json = messages.map(prepareJSON);
      console.log(json);
      return json;
    },
    addQAndAPair: (qAndAPair: QAndAPair) => {
      set((state) => ({ qAndAPairs: [...state.qAndAPairs, qAndAPair] }));
    },
    removeQAndAPair: (index: number) => {
      set((state) => ({
        qAndAPairs: state.qAndAPairs.filter((_, i) => i !== index),
      }));
    },
    rejectMessage: async (messageId: string) => {
      await messagesService.updateMessage(messageId, {
        approval_status: ApprovalStatus.REJECTED,
      });
      await get().setAllMessages();
      appToast("Message rejected", {
        type: "success",
      });
    },
    saveQAndAPairsToSystem: async () => {
      await messagesService.saveQAndAPairsToSystem(get().qAndAPairs);
      await get().setAllMessages();
      set({ qAndAPairs: [] });
      appToast("Q&A pairs saved to system", {
        type: "success",
      });
    },
    getFineTuningJobs: async () => {
      const response = await fineTuneService.listFineTuningJobs();
      set({ fineTuningJobs: response.jobs });
    },
    startTraining: (baseModel?: string) => {
      fineTuneService.startFineTuning({
        base_model: baseModel || "gemini-2.5-flash",
        mode: ChatMode.GUIDANCE,
      });
    },
  };
});

export default useFineTuneStore;
