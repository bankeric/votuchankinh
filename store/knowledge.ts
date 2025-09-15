import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface KnowledgeFile {
  id: number;
  name: string;
  size: string;
  status: string;
  content?: string;
}

interface KnowledgeState {
  // States
  knowledge: KnowledgeFile[];
  isLoading: boolean;
  isUploading: boolean;

  // Actions
  addKnowledge: (content: string, fileName: string) => void;
  removeKnowledge: (id: number) => void;
  setKnowledge: (knowledge: KnowledgeFile[]) => void;
  clearKnowledge: () => void;
}

// Default knowledge files
const defaultKnowledge: KnowledgeFile[] = [
  {
    id: 1,
    name: "Kinh Kim Cương.txt",
    size: "2.3 MB",
    status: "uploaded",
  },
  {
    id: 2,
    name: "Bài giảng Tứ Diệu Đế.txt",
    size: "1.8 MB",
    status: "uploaded",
  },
  {
    id: 3,
    name: "Tuyển tập thơ kệ Phật giáo.txt",
    size: "1.5 MB",
    status: "uploaded",
  },
];

export const useKnowledgeStore = create<KnowledgeState>()(
  persist(
    (set, get) => ({
      // Initial states
      knowledge: defaultKnowledge,
      isLoading: false,
      isUploading: false,

      // Actions
      addKnowledge: (content: string, fileName: string) => {
        const { knowledge } = get();
        const newId = Math.max(...knowledge.map((item) => item.id), 0) + 1;
        const newFile: KnowledgeFile = {
          id: newId,
          name: fileName,
          size: `${(content.length / 1024).toFixed(1)} KB`,
          status: "uploaded",
          content,
        };
        set({ knowledge: [...knowledge, newFile] });
      },

      removeKnowledge: (id: number) => {
        const { knowledge } = get();
        set({ knowledge: knowledge.filter((item) => item.id !== id) });
      },

      setKnowledge: (knowledge: KnowledgeFile[]) => {
        set({ knowledge });
      },

      clearKnowledge: () => {
        set({ knowledge: [] });
      },
    }),
    {
      name: "knowledge-storage",
    }
  )
); 