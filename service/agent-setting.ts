import axiosInstance, { getAuthToken } from '@/lib/axios'
import {
  AgentSetting,
  CreateAgentSettingDto,
  UpdateAgentSettingDto,
  AgentSettingQueryParams
} from '@/interfaces/agent-setting'

class AgentSettingService {
  private readonly BASE_URL = '/api/v1/agent-settings'

  // Get all agent settings with optional query parameters
  async getAll(params?: AgentSettingQueryParams): Promise<AgentSetting[]> {
    if (!getAuthToken()) {
      return []
    }
    try {
      const queryParams = new URLSearchParams()
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.offset) queryParams.append('offset', params.offset.toString())
      if (params?.agent_id) queryParams.append('agent_id', params.agent_id)

      const url = queryParams.toString()
        ? `${this.BASE_URL}?${queryParams.toString()}`
        : this.BASE_URL
      const { data } = await axiosInstance.get<AgentSetting[]>(url)
      return data
    } catch (error) {
      console.error('Error fetching agent settings:', error)
      throw error
    }
  }

  // Get a single agent setting by UUID
  async getById(uuid: string): Promise<AgentSetting> {
    try {
      const { data } = await axiosInstance.get<AgentSetting>(
        `${this.BASE_URL}/${uuid}`
      )
      return data
    } catch (error) {
      console.error(`Error fetching agent setting ${uuid}:`, error)
      throw error
    }
  }

  // Create a new agent setting
  async create(settingData: CreateAgentSettingDto): Promise<AgentSetting> {
    try {
      const { data } = await axiosInstance.post<AgentSetting>(
        this.BASE_URL,
        settingData
      )
      return data
    } catch (error) {
      console.error('Error creating agent setting:', error)
      throw error
    }
  }

  // Update an agent setting
  async update(
    uuid: string,
    settingData: UpdateAgentSettingDto
  ): Promise<AgentSetting> {
    try {
      const { data } = await axiosInstance.put<AgentSetting>(
        `${this.BASE_URL}/${uuid}`,
        settingData
      )
      return data
    } catch (error) {
      console.error(`Error updating agent setting ${uuid}:`, error)
      throw error
    }
  }

  // Delete an agent setting
  async delete(uuid: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.BASE_URL}/${uuid}`)
    } catch (error) {
      console.error(`Error deleting agent setting ${uuid}:`, error)
      throw error
    }
  }

  // Get settings for a specific agent
  async getByAgentId(
    agentId: string,
    params?: { limit?: number; offset?: number }
  ): Promise<AgentSetting[]> {
    try {
      const queryParams = new URLSearchParams()
      queryParams.append('agent_id', agentId)
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.offset) queryParams.append('offset', params.offset.toString())

      const { data } = await axiosInstance.get<AgentSetting[]>(
        `${this.BASE_URL}?${queryParams.toString()}`
      )
      return data
    } catch (error) {
      console.error(
        `Error fetching agent settings for agent ${agentId}:`,
        error
      )
      throw error
    }
  }
}

export const agentSettingService = new AgentSettingService()
