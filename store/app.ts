import { Language, Model } from '@/interfaces/chat'
import modelService from '@/service/model'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  model: string
  setModel: (model: string) => void
  models: Model[]
  fineTuneModels: Model[]
  isLoading: boolean
  addModel: (model: Model) => void
  getModels: () => Promise<Model[]>
}

const models = [] as Model[]
const baseModels: Model[] = [
  {
    name: 'gemini-2.5-pro',
    description:
      'Enhanced thinking and reasoning, multimodal understanding, advanced coding, and more'
  },
  {
    name: 'gemini-2.5-flash',
    description: 'Adaptive thinking, cost efficiency'
  },
  {
    name: 'gemini-2.5-flash-lite-preview-06-17',
    description: 'Most cost-efficient model supporting high throughput'
  },
  // {
  //   id: "ft:gpt-4.1-mini-2025-04-14:buddhaai::BjEpOBye",
  //   name: "Buddha AI(trained on gpt-4.1-mini)",
  //   description: "Buddha AI gpt-4.1-mini v1",
  // },
  // {
  //   id: "ft:gpt-3.5-turbo-1106:buddhaai::Bj4xvr1U",
  //   name: "Buddha AI(trained on gpt-3.5-turbo)",
  //   description: "Buddha AI gpt-3.5-turbo v1",
  // },
  {
    name: 'gpt-4o',
    description:
      'GPT-4o is a powerful language model that can be used to generate text, images, and code.'
  },
  {
    name: 'gpt-4o-mini',
    description:
      'GPT-4o Mini is a smaller version of GPT-4o that can be used to generate text, images, and code.'
  },
  {
    name: 'gpt-4o-mini-2024-07-18:stillenvc:320-q-a:CPCyMfxW',
    description: 'Model optimized for Q&A tasks with 320 context'
  }
]

const BASE_FT_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-lite'
]

export const useAppStateStore = create<AppState>()(
  persist(
    (set, get) => {
      return {
        model: 'ft:gpt-4.1-mini-2025-04-14:buddhaai::BjEpOBye',
        fineTuneModels: [],
        isLoading: false,
        setModel: (model) => {
          set((state) => ({ ...state, model }))
        },
        models,
        addModel: (model) => {
          set((state) => ({ ...state, models: [...state.models, model] }))
        },
        getModels: async () => {
          set({ isLoading: true })
          try {
            const response = await modelService.getModels({
              limit: 10,
              offset: 0,
              search: '',
              status: '',
              language: ''
            })
            set((state) => ({
              ...state,
              models: [...baseModels, ...response],
              fineTuneModels: [...BASE_FT_MODELS, ...response],
              isLoading: false
            }))

            return response
          } catch (error) {
            set({ isLoading: false })
            throw error
          }
        }
      }
    },
    {
      name: 'buddha-ai-app-settings',
      version: 1
    }
  )
)
