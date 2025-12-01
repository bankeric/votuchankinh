import { create } from 'zustand'
import { agentService, CreateAgentDto, UpdateAgentDto } from '@/service/agent'
import { Agent } from '@/interfaces/agent'
import { PreviewMessage } from '@/interfaces/chat'
import { RagFile } from '@/interfaces/rag-file'
import { v4 as uuidv4 } from 'uuid'

export interface GPTFormData {
  name: string
  description: string
  instructions: string
  conversationStarters: string[]
  tags: string[]
  model: string
}

interface AgentState {
  // States
  agents: Agent[]
  agentsMap: Record<string, Agent>
  currentSessionId: string | null
  selectedAgentId: string | null
  isLoading: boolean
  isCreating: boolean
  isUpdating: boolean
  isDeleting: boolean
  searchTerm: string
  filteredAgents: Agent[]

  // Knowledge states
  files: RagFile[]
  setFiles: (files: RagFile[]) => void

  // Form states
  formData: GPTFormData
  isFormDirty: boolean

  // Preview states
  previewMessages: PreviewMessage[]
  setPreviewMessages: (
    callback: (messages: PreviewMessage[]) => PreviewMessage[]
  ) => void

  // Actions
  setSelectedAgentId: (agentId: string | null, isGetFiles?: boolean) => void
  setSearchTerm: (term: string) => void
  clearSearch: () => void

  // Form actions
  setFormData: (data: Partial<GPTFormData>) => void
  resetFormData: () => void
  loadAgentIntoForm: (agent: Agent) => void
  updateFormField: (field: keyof GPTFormData, value: any) => void
  addConversationStarter: () => void
  updateConversationStarter: (index: number, value: string) => void
  removeConversationStarter: (index: number) => void
  addTag: (tag: string) => void
  removeTag: (tag: string) => void

  // Preview actions
  setCurrentSessionId: (sessionId: string | null) => void
  // Async Actions
  fetchAgents: (language: string, selectFirst: boolean) => Promise<void>
  createAgent: (
    agentData: Partial<CreateAgentDto>,
    language: string
  ) => Promise<Agent | null>
  updateAgent: (
    uuid: string,
    agentData: Partial<UpdateAgentDto>,
    language: string
  ) => Promise<Agent | null>
  deleteAgent: (uuid: string) => Promise<boolean>
  searchAgents: (query: string) => Promise<void>
  getAgentById: (uuid: string) => Promise<Agent | null>
  saveFormData: (uuid: string, language: string) => Promise<Agent | null>

  // Upload files to an agent
  uploadFiles: (agentId: string, files: File[]) => Promise<any>
  getFiles: (agentId: string, corpusId?: string) => Promise<RagFile[]>
  removeFile: (
    fileId: string,
    agentId: string,
    corpusId?: string
  ) => Promise<void>
}

const initialFormData: GPTFormData = {
  name: '',
  description: '',
  instructions: '',
  conversationStarters: [],
  tags: [],
  model: 'ft:gpt-4.1-mini-2025-04-14:buddhaai::BjEpOBye'
}

export const useAgentStore = create<AgentState>()((set, get) => {
  return {
    // Initial states
    agents: [],
    agentsMap: {},
    selectedAgentId: null,
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    searchTerm: '',
    filteredAgents: [],

    currentSessionId: null,
    setCurrentSessionId: (sessionId: string | null) =>
      set({ currentSessionId: sessionId }),

    // Knowledge states
    files: [],
    setFiles: (files: RagFile[]) => set({ files }),

    // Form states
    formData: initialFormData,
    isFormDirty: false,

    // Preview states
    previewMessages: [],
    setPreviewMessages: (
      callback: (messages: PreviewMessage[]) => PreviewMessage[]
    ) => {
      set((state) => ({
        previewMessages: callback(state.previewMessages)
      }))
    },

    // State setters
    setSelectedAgentId: (agentId: string | null, isGetFiles: boolean = true) => {
      set({ selectedAgentId: agentId })
    },
    setSearchTerm: (term) => {
      set({ searchTerm: term })
    },
    clearSearch: () => {
      set({ searchTerm: '', filteredAgents: [] })
    },
    // Form actions
    setFormData: (data) => {
      set((state) => ({
        formData: { ...state.formData, ...data },
        isFormDirty: true
      }))
    },

    resetFormData: () => {
      set({ formData: initialFormData, isFormDirty: false })
    },

    loadAgentIntoForm: (agent) => {
      set({ isFormDirty: false })
    },

    updateFormField: (field, value) => {
      set((state) => ({
        formData: { ...state.formData, [field]: value },
        isFormDirty: true
      }))
    },

    addConversationStarter: () => { },

    updateConversationStarter: (index, value) => { },

    removeConversationStarter: (index) => { },

    addTag: (tag) => { },

    removeTag: (tag) => { },

    // Async actions
    fetchAgents: async (language: string, selectFirst: boolean = false) => { },

    createAgent: async (
      agentData: Partial<CreateAgentDto>,
      language: string
    ) => {
      return null
    },

    updateAgent: async (
      uuid: string,
      agentData: Partial<UpdateAgentDto>,
      language: string
    ) => {
      return null
    },

    deleteAgent: async (uuid: string) => {
      return true
    },

    searchAgents: async (query: string) => { },

    getAgentById: async (uuid: string) => {
      return null
    },

    saveFormData: async (uuid: string, language: string) => {
      return null
    },

    // Upload files to an agent
    uploadFiles: async (agentId: string, files: File[]) => {
      return { status: 'completed' }
    },
    getFiles: async (agentId: string, corpusId?: string) => {
      return []
    },
    removeFile: async (
      fileId: string,
      agentId: string,
      corpusId?: string
    ) => {
      return
    }
  }
})
