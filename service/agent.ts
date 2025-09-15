import axiosInstance, { getAuthToken } from '@/lib/axios'
import { Agent } from '@/interfaces/agent'

export interface CreateAgentDto {
  name: string
  description: string
  system_prompt: string
  agent_type: string
  buddhist_focus: string
  language: string
  model: string
  temperature: number
  tools: string
  conversation_starters?: string[]
  tags?: string[]
}

export interface UpdateAgentDto extends Partial<CreateAgentDto> {
  uuid: string
}

class AgentService {
  private readonly BASE_URL = '/api/v1/agents'

  // Get all agents
  async getAll({
    limit = 10,
    offset = 0,
    language
  }: {
    limit?: number
    offset?: number
    language?: string
  }): Promise<Agent[]> {
    if (!getAuthToken()) {
      return []
    }
    try {
      const queryParams = new URLSearchParams()
      if (limit) queryParams.append('limit', limit.toString())
      if (offset) queryParams.append('offset', offset.toString())
      if (language) queryParams.append('language', language)

      const { data } = await axiosInstance.get<Agent[]>(
        `${this.BASE_URL}?${queryParams.toString()}`
      )
      return data
    } catch (error) {
      console.error('Error fetching agents:', error)
      throw error
    }
  }

  // Get a single agent by ID
  async getById(uuid: string): Promise<Agent> {
    try {
      const { data } = await axiosInstance.get<Agent>(
        `${this.BASE_URL}/${uuid}`
      )
      return data
    } catch (error) {
      console.error(`Error fetching agent ${uuid}:`, error)
      throw error
    }
  }

  // Create a new agent
  async create(agentData: CreateAgentDto): Promise<Agent> {
    try {
      const { data } = await axiosInstance.post<Agent>(this.BASE_URL, agentData)
      return data
    } catch (error) {
      console.error('Error creating agent:', error)
      throw error
    }
  }

  // Update an agent
  async update(
    uuid: string,
    agentData: Partial<CreateAgentDto>
  ): Promise<Agent> {
    try {
      const { data } = await axiosInstance.put<Agent>(
        `${this.BASE_URL}/${uuid}`,
        agentData
      )
      return data
    } catch (error) {
      console.error(`Error updating agent ${uuid}:`, error)
      throw error
    }
  }

  // Delete an agent
  async delete(uuid: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.BASE_URL}/${uuid}`)
    } catch (error) {
      console.error(`Error deleting agent ${uuid}:`, error)
      throw error
    }
  }

  // Test an agent
  async test(uuid: string, message: string): Promise<string> {
    try {
      const { data } = await axiosInstance.post<{ response: string }>(
        `${this.BASE_URL}/${uuid}/test`,
        { message }
      )
      return data.response
    } catch (error) {
      console.error(`Error testing agent ${uuid}:`, error)
      throw error
    }
  }

  // Search agents
  async search(query: string): Promise<Agent[]> {
    try {
      const { data } = await axiosInstance.get<Agent[]>(
        `${this.BASE_URL}/search?q=${encodeURIComponent(query)}`
      )
      return data
    } catch (error) {
      console.error('Error searching agents:', error)
      throw error
    }
  }

  // Upload files to an agent with streaming progress
  async uploadFiles(
    agentId: string,
    files: File[],
    onProgress?: (update: any) => void
  ): Promise<any> {
    try {
      const formData = new FormData()

      files.forEach((file) => {
        formData.append('files', file)
      })

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${this.BASE_URL}/${agentId}/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${getAuthToken()}`
          },
          body: formData
        }
      )

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('No response body reader available')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process complete JSON objects
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.trim()) {
            try {
              const update = JSON.parse(line)
              onProgress?.(update)
            } catch (e) {
              console.warn('Failed to parse update:', line)
            }
          }
        }
      }

      // Process any remaining data in buffer
      if (buffer.trim()) {
        try {
          const update = JSON.parse(buffer)
          onProgress?.(update)
        } catch (e) {
          console.warn('Failed to parse final update:', buffer)
        }
      }

      return { status: 'completed' }
    } catch (error) {
      console.error(`Error uploading files to agent ${agentId}:`, error)
      throw error
    }
  }
}

export const agentService = new AgentService()
