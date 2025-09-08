import axiosInstance from '@/lib/axios';
import { ChatMode } from '@/interfaces/chat';

export interface FineTuningJob {
  job_name: string;
  display_name: string;
  status: string;
  created_at: string;
  updated_at?: string;
  base_model: string;
  tuned_model?: string;
}

export interface FineTuningJobsResponse {
  jobs: FineTuningJob[];
  count: number;
}

export interface StartFineTuningRequest {
  base_model?: string;
  mode?: ChatMode;
}

export interface StartFineTuningResponse {
  job_id: string;
  status: string;
  message: string;
}

class FineTuneService {
  private readonly BASE_URL = '/api/v1/fine-tuning';

  // List all fine-tuning jobs
  async listFineTuningJobs(): Promise<FineTuningJobsResponse> {
    try {
      const { data } = await axiosInstance.get<FineTuningJobsResponse>(
        `${this.BASE_URL}/jobs`
      );
      return data;
    } catch (error) {
      console.error('Error fetching fine-tuning jobs:', error);
      throw error;
    }
  }

  // Start a fine-tuning job
  async startFineTuning(requestData: StartFineTuningRequest): Promise<StartFineTuningResponse> {
    try {
      const { data } = await axiosInstance.post<StartFineTuningResponse>(
        `${this.BASE_URL}/start`,
        requestData
      );
      return data;
    } catch (error) {
      console.error('Error starting fine-tuning job:', error);
      throw error;
    }
  }

  // Get a specific fine-tuning job by ID
  async getFineTuningJob(jobId: string): Promise<FineTuningJob> {
    try {
      const { data } = await axiosInstance.get<FineTuningJob>(
        `${this.BASE_URL}/jobs/${jobId}`
      );
      return data;
    } catch (error) {
      console.error(`Error fetching fine-tuning job ${jobId}:`, error);
      throw error;
    }
  }

  // Cancel a fine-tuning job
  async cancelFineTuningJob(jobId: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.BASE_URL}/jobs/${jobId}`);
    } catch (error) {
      console.error(`Error canceling fine-tuning job ${jobId}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const fineTuneService = new FineTuneService();
