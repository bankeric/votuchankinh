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
  status?: 'active' | 'inactive'
}

class AgentService {
  // Get all agents
  async getAll({
    limit = 100,
    offset = 0,
    language
  }: {
    limit?: number
    offset?: number
    language?: string
  }): Promise<Agent[]> {
    return []
  }

  // Get public agents
  async getPublicAgents({
    limit = 100,
    offset = 0,
    language
  }: {
    limit?: number
    offset?: number
    language?: string
  }): Promise<Agent[]> {
    return []
  }

  // Get a single agent by ID
  async getById(uuid: string): Promise<Agent> {
    return {} as Agent
  }

  // Create a new agent
  async create(agentData: CreateAgentDto): Promise<Agent> {
    return {} as Agent
  }

  // Update an agent
  async update(
    uuid: string,
    agentData: Partial<UpdateAgentDto>
  ): Promise<Agent> {
    return {} as Agent
  }

  // Delete an agent
  async delete(uuid: string): Promise<void> {
    return
  }

  // Test an agent
  async test(uuid: string, message: string): Promise<string> {
    return 'Mock response'
  }

  // Search agents
  async search(query: string): Promise<Agent[]> {
    return []
  }

  // Upload files to an agent with streaming progress
  async uploadFiles(
    agentId: string,
    files: File[],
    onProgress?: (update: any) => void
  ): Promise<any> {
    return { status: 'completed' }
  }
}

export const agentService = new AgentService()
