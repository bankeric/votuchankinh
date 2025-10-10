import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  appToast,
  appToastLoading,
  appToastUpload,
  handleUploadEvent
} from '@/lib/toastify'
import { agentService, CreateAgentDto, UpdateAgentDto } from '@/service/agent'
import { Agent } from '@/interfaces/agent'
import { PreviewMessage } from '@/interfaces/chat'
import { ragFileService } from '@/service/rag-file'
import { RagFile } from '@/interfaces/rag-file'
import { v4 as uuidv4 } from 'uuid'
import { getAuthToken } from '@/lib/axios'

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
  const setSelectedAgentId = (
    agentId: string | null,
    isGetFiles: boolean = true
  ) => {
    if (!agentId) {
      set({
        selectedAgentId: null,
        previewMessages: [],
        currentSessionId: null
      })
      return
    }
    set({
      selectedAgentId: agentId,
      previewMessages: [],
      currentSessionId: uuidv4()
    })
    const { agentsMap } = get()
    const selectedAgent = agentsMap[agentId]
    if (selectedAgent && isGetFiles) {
      getFiles(agentId, selectedAgent?.corpus_id)
    }
  }
  const fetchAgents = async (
    language: string,
    selectFirst: boolean = false
  ) => {
    set({ isLoading: true })
    console.log('Fetching agents for language:', language)

    try {
      const agents = getAuthToken()
        ? await agentService.getAll({
            language: language
          })
        : await agentService.getPublicAgents({
            language
          })

      const agentsMap = agents.reduce((acc, agent) => {
        acc[agent.uuid] = agent
        return acc
      }, {} as Record<string, Agent>)

      set({ agents, filteredAgents: agents, agentsMap })
      if (selectFirst && agents.length > 0) {
        setSelectedAgentId(agents[0].uuid)
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
      appToast('Failed to load agents. Please try again.', {
        type: 'error'
      })
    } finally {
      set({ isLoading: false })
    }
  }

  const getFiles = async (
    agentId: string,
    corpusId?: string
  ): Promise<RagFile[]> => {
    set({ isLoading: true })
    const response = await ragFileService.list({
      agent_id: agentId,
      corpus_id: corpusId
    })
    set({ files: response })
    set({ isLoading: false })
    return response
  }

  const uploadFiles = async (agentId: string, files: File[]) => {
    const uploadId = appToastLoading('Uploading files...')
    const response = await agentService.uploadFiles(
      agentId,
      files,
      (update) => {
        // Handle streaming progress updates using the new toast function
        console.log('----update-----', update)
        handleUploadEvent(update, uploadId)
      }
    )
    return response
  }

  const removeFile = async (
    fileId: string,
    agentId: string,
    corpusId?: string
  ) => {
    const response = await ragFileService.remove(fileId, agentId, corpusId)
    appToast('File removed successfully', {
      type: 'success'
    })
    return response
  }
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
    setSelectedAgentId: setSelectedAgentId,
    setSearchTerm: (term) => {
      set({ searchTerm: term })
      // Filter agents locally if we have them
      const { agents } = get()
      if (agents.length > 0) {
        const filtered = agents.filter(
          (agent) =>
            agent.name.toLowerCase().includes(term.toLowerCase()) ||
            agent.description.toLowerCase().includes(term.toLowerCase())
        )
        set({ filteredAgents: filtered })
      }
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
      const formData: GPTFormData = {
        name: agent.name || '',
        description: agent.description || '',
        instructions: agent.system_prompt || '',
        conversationStarters: agent.conversation_starters || [],
        tags: agent.tags || [],
        model: agent.model || 'ft:gpt-4.1-mini-2025-04-14:buddhaai::BjEpOBye'
      }
      set({ formData, isFormDirty: false })
    },

    updateFormField: (field, value) => {
      set((state) => ({
        formData: { ...state.formData, [field]: value },
        isFormDirty: true
      }))
    },

    addConversationStarter: () => {
      set((state) => {
        // Only add if less than 4 conversation starters
        if (state.formData.conversationStarters.length < 4) {
          return {
            formData: {
              ...state.formData,
              conversationStarters: [...state.formData.conversationStarters, '']
            },
            isFormDirty: true
          }
        }
        return state
      })
    },

    updateConversationStarter: (index, value) => {
      set((state) => {
        const updated = [...state.formData.conversationStarters]
        updated[index] = value
        return {
          formData: { ...state.formData, conversationStarters: updated },
          isFormDirty: true
        }
      })
    },

    removeConversationStarter: (index) => {
      set((state) => ({
        formData: {
          ...state.formData,
          conversationStarters: state.formData.conversationStarters.filter(
            (_, i) => i !== index
          )
        },
        isFormDirty: true
      }))
    },

    addTag: (tag) => {
      set((state) => {
        if (!state.formData.tags.includes(tag)) {
          return {
            formData: {
              ...state.formData,
              tags: [...state.formData.tags, tag]
            },
            isFormDirty: true
          }
        }
        return state
      })
    },

    removeTag: (tag) => {
      set((state) => ({
        formData: {
          ...state.formData,
          tags: state.formData.tags.filter((t) => t !== tag)
        },
        isFormDirty: true
      }))
    },

    // Async actions
    fetchAgents,

    createAgent: async (
      agentData: Partial<CreateAgentDto>,
      language: string
    ) => {
      set({ isCreating: true })
      try {
        const createData: CreateAgentDto = {
          name: agentData.name || '',
          description: agentData.description || '',
          system_prompt: agentData.system_prompt || '',
          conversation_starters: agentData.conversation_starters || [],
          tags: agentData.tags || [],
          agent_type: 'buddhist',
          buddhist_focus: 'all',
          language: language,
          model: agentData.model || 'gemini-2.5-flash',
          temperature: 0.7,
          tools: ''
        }
        const newAgent = await agentService.create(createData)
        await fetchAgents(language, false)
        appToast('Agent created successfully', {
          type: 'success'
        })
        return newAgent
      } catch (error) {
        console.error('Error creating agent:', error)
        appToast('Failed to create agent. Please try again.', {
          type: 'error'
        })
        return null
      } finally {
        set({ isCreating: false })
      }
    },

    updateAgent: async (
      uuid: string,
      agentData: Partial<UpdateAgentDto>,
      language: string
    ) => {
      set({ isUpdating: true })
      try {
        const updatedAgent = await agentService.update(uuid, agentData)
        await fetchAgents(language, false)
        appToast('Agent updated successfully', {
          type: 'success'
        })
        return updatedAgent
      } catch (error) {
        console.error('Error updating agent:', error)
        appToast('Failed to update agent. Please try again.', {
          type: 'error'
        })
        return null
      } finally {
        set({ isUpdating: false })
      }
    },

    deleteAgent: async (uuid: string) => {
      set({ isDeleting: true })
      try {
        await agentService.delete(uuid)
        set((state) => {
          const newAgentsMap = { ...state.agentsMap }
          delete newAgentsMap[uuid]

          return {
            agents: state.agents.filter((agent) => agent.uuid !== uuid),
            filteredAgents: state.filteredAgents.filter(
              (agent) => agent.uuid !== uuid
            ),
            agentsMap: newAgentsMap,
            selectedAgentId:
              state.selectedAgentId === uuid ? null : state.selectedAgentId,
            previewMessages: []
          }
        })

        appToast('Agent deleted successfully', {
          type: 'success'
        })
        return true
      } catch (error) {
        console.error('Error deleting agent:', error)
        appToast('Failed to delete agent. Please try again.', {
          type: 'error'
        })
        return false
      } finally {
        set({ isDeleting: false })
      }
    },

    searchAgents: async (query: string) => {
      if (!query.trim()) {
        set({ filteredAgents: get().agents })
        return
      }

      set({ isLoading: true })
      try {
        const results = await agentService.search(query)
        set({ filteredAgents: results })
      } catch (error) {
        console.error('Error searching agents:', error)
        appToast('Failed to search agents. Please try again.', {
          type: 'error'
        })
      } finally {
        set({ isLoading: false })
      }
    },

    getAgentById: async (uuid: string) => {
      try {
        const agent = await agentService.getById(uuid)
        return agent
      } catch (error) {
        console.error('Error fetching agent by ID:', error)
        appToast('Failed to load agent details. Please try again.', {
          type: 'error'
        })
        return null
      }
    },

    saveFormData: async (uuid: string, language: string) => {
      const { formData } = get()
      set({ isUpdating: true })
      try {
        const updateData: Partial<CreateAgentDto> = {
          name: formData.name,
          description: formData.description,
          system_prompt: formData.instructions,
          conversation_starters: formData.conversationStarters.filter(
            (starter) => starter.trim() !== ''
          ),
          tags: formData.tags,
          model: formData.model
        }

        const updatedAgent = await agentService.update(uuid, updateData)
        await fetchAgents(language, false)

        appToast('Agent updated successfully', {
          type: 'success'
        })
        return updatedAgent
      } catch (error) {
        console.error('Error updating agent:', error)
        appToast('Failed to update agent. Please try again.', {
          type: 'error'
        })
        return null
      } finally {
        set({ isUpdating: false })
      }
    },

    // Upload files to an agent
    uploadFiles,
    getFiles,
    removeFile
  }
})
