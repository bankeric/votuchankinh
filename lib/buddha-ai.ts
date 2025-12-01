import { MessageRole } from '@/interfaces/chat'
import { AgentActions, ApprovalRequest } from '@/interfaces/agent'

export async function generateBuddhistResponse(
  payload: {
    chatId?: string
    sessionId: string
    messages: { role: MessageRole; content: string }[]
    language?: string
    model?: string
    agentId?: string
    isPreview?: boolean
    isConversationMode?: boolean
  },
  callbackFunction: {
    updateCallback: (message: string) => void
    updateThought: (message: string) => void
    updateLastMessageId: (messageId: string) => void
  }
): Promise<string> {
  return ''
}

export async function approveApprovalRequest(
  payload: {
    approvalRequest: {
      approved: boolean
      approval_id: string
    }
    userId: string
    messages: { role: 'user' | 'assistant'; content: string }[]
    language: string
    modelId: string
  },
  callbackFunction: {
    updateCallback: (message: string) => void
    stopStream: () => void
    updateCurrentAgentId: (agentId: string) => void
    createApprovalRequest: (message: ApprovalRequest) => void
    addMessage: (message: any, action?: AgentActions) => void
  }
) {
  return
}

export async function generateBuddhistBuilderResponse(
  payload: {
    userId: string
    messages: { role: 'user' | 'assistant'; content: string }[]
    language: string
    modelId: string
  },
  callbackFunction: {
    updateCallback: (message: string) => void
    updateCurrentAgentId: (agentId: string) => void
    createApprovalRequest: (message: ApprovalRequest) => void
    stopStream: () => void
    addMessage: (message: any, action?: AgentActions) => void
  }
): Promise<string> {
  return ''
}
