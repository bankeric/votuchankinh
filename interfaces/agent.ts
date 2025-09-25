export interface Agent {
  uuid: string
  agent_type: string
  author: string
  buddhist_focus: string
  created_at: string
  description: string
  language: string
  model: string
  name: string
  status: AgentStatus
  system_prompt: string
  temperature: number
  tools: string
  updated_at: string
  conversation_starters?: string[]
  tags?: string[]
  corpus_id?: string
}

export enum AgentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DELETED = 'deleted'
}

export enum AgentActions {
  GET_LIST_OF_AGENTS = 'get_list_of_agents'
}

export type ApprovalRequest = {
  type: 'approval_required'
  approval_request: {
    id: string
    tool_name: string
    tool_description: string
    arguments: Record<string, any>
    reasoning: string
    timestamp: string
  }
  approved?: boolean
  approval_id: string
}
