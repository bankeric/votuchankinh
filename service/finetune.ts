import axiosInstance from '@/lib/axios'
import { ChatMode } from '@/interfaces/chat'

export interface FineTuningJob {
  job_name: string
  display_name: string
  status: string
  created_at: string
  updated_at?: string
  base_model: string
  tuned_model?: string
}

export interface FineTuningJobsResponse {
  jobs: FineTuningJob[]
  count: number
}

export interface StartFineTuningRequest {
  base_model?: string
  mode?: ChatMode
}

export interface StartFineTuningResponse {
  job_id: string
  status: string
  message: string
}

export interface FineTuningModel {
  author: string
  base_model: string
  created_at: string // format => Thu, 16 Oct 2025 17:21:04 GMT
  description: string
  hyperparameters: null
  language: string
  model_path: null
  name: string
  status: string
  training_data_path: null
  training_metrics: null
  updated_at: string
  uuid: string
  validation_data_path: null
  version: string
}

export interface GetFineTuningModelResponse {
  count: number
  limit: number
  models: FineTuningModel[]
  offset: number
}

export interface CreateFineTuningModelRequest {
  name: string
  description: string
  base_model: string
  status: string
  language: string
  version: string
}

class FineTuneService {
  private readonly BASE_URL = '/api/v1/fine-tuning'

  // List all fine-tuning jobs
  async listFineTuningJobs(): Promise<FineTuningJobsResponse> {
    try {
      const { data } = await axiosInstance.get<FineTuningJobsResponse>(
        `${this.BASE_URL}/jobs`
      )
      return data
    } catch (error) {
      console.error('Error fetching fine-tuning jobs:', error)
      throw error
    }
  }

  // Start a fine-tuning job
  async startFineTuning(
    requestData: StartFineTuningRequest
  ): Promise<StartFineTuningResponse> {
    try {
      const { data } = await axiosInstance.post<StartFineTuningResponse>(
        `${this.BASE_URL}/start`,
        requestData
      )
      return data
    } catch (error) {
      console.error('Error starting fine-tuning job:', error)
      throw error
    }
  }

  // Get a specific fine-tuning job by ID
  async getFineTuningJob(jobId: string): Promise<FineTuningJob> {
    try {
      const { data } = await axiosInstance.get<FineTuningJob>(
        `${this.BASE_URL}/jobs/${jobId}`
      )
      return data
    } catch (error) {
      console.error(`Error fetching fine-tuning job ${jobId}:`, error)
      throw error
    }
  }

  // Cancel a fine-tuning job
  async cancelFineTuningJob(jobId: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.BASE_URL}/jobs/${jobId}`)
    } catch (error) {
      console.error(`Error canceling fine-tuning job ${jobId}:`, error)
      throw error
    }
  }

  // Get fine-tuning models
  async getFineTuningModels(
    limit?: number,
    offset?: number
  ): Promise<GetFineTuningModelResponse> {
    try {
      const { data } = await axiosInstance.get<GetFineTuningModelResponse>(
        `/api/v1/fine-tuning-models`,
        {
          params: { limit, offset }
        }
      )
      return data
    } catch (error) {
      console.error('Error fetching fine-tuning models:', error)
      throw error
    }
  }

  // Create a new fine-tuning model entry
  async createFineTuningModel(
    requestData: CreateFineTuningModelRequest
  ): Promise<FineTuningModel> {
    try {
      const { data } = await axiosInstance.post<FineTuningModel>(
        `/api/v1/fine-tuning-models`,
        requestData
      )
      return data
    } catch (error) {
      console.error('Error creating fine-tuning model:', error)
      throw error
    }
  }

  // Delete a fine-tuning model by UUID
  async deleteFineTuningModel(uuid: string): Promise<void> {
    try {
      await axiosInstance.delete(`/api/v1/fine-tuning-models/${uuid}`)
    } catch (error) {
      console.error(`Error deleting fine-tuning model ${uuid}:`, error)
      throw error
    }
  }

  // Update a fine-tuning model by UUID
  async updateFineTuningModel(
    uuid: string,
    requestData: Partial<CreateFineTuningModelRequest>
  ): Promise<FineTuningModel> {
    try {
      const { data } = await axiosInstance.put<FineTuningModel>(
        `/api/v1/fine-tuning-models/${uuid}`,
        requestData
      )
      return data
    } catch (error) {
      console.error(`Error updating fine-tuning model ${uuid}:`, error)
      throw error
    }
  }
}

// Export a singleton instance
export const fineTuneService = new FineTuneService()
