import { getAuthToken } from '@/lib/axios'
import { Language, MessageRole } from '@/interfaces/chat'
import { AgentActions, ApprovalRequest } from '@/interfaces/agent'
import { toolCalls, logging } from '@/lib/utils'

const THINKING_START_MARKER = '___'
const THINKING_END_MARKER = '__Final Answer__'
type StreamEvent = {
  type: 'text' | 'end_of_stream' | 'thought'
  data: string
  metadata?: Record<string, any>
}

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
  try {
    const url = payload.isPreview
      ? `/api/v1/agents/${payload.agentId}/chat`
      : getAuthToken()
      ? `/api/v1/chat/${payload.chatId}/ask`
      : `/api/v1/guess/${payload.chatId}/ask`
    const context = payload.isConversationMode
      ? 'Make sure the answer is short and concise'
      : ''
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getAuthToken() ? `Bearer ${getAuthToken()}` : ''
      },
      body: JSON.stringify({
        context: context,
        session_id: payload.sessionId,
        messages: payload.messages,
        language: payload.language,
        model: payload.model,
        options: {
          stream: true
        },
        agent_id: payload.agentId
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate response')
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder('utf-8')

    let result = ''

    if (!reader) {
      throw new Error('Failed to get response reader')
    }

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      const jsonChunks = chunk.split('data: ')
      let breakFlag = false
      jsonChunks.forEach((jsonChunk) => {
        if (breakFlag) return
        try {
          const parsed: StreamEvent = JSON.parse(jsonChunk)
          if (parsed.type === 'text') {
            result += parsed.data
            callbackFunction.updateCallback(parsed.data)
          } else if (parsed.type === 'thought') {
            callbackFunction.updateThought(parsed.data)
          } else if (parsed.type === 'end_of_stream') {
            breakFlag = true
            if (parsed.metadata?.response_answer_id) {
              callbackFunction.updateLastMessageId(
                parsed.metadata?.response_answer_id
              )
            }
          }
        } catch {
          logging('error: ', jsonChunk)
          jsonChunk.split('\n').forEach((line: string) => {
            if (line.trim()) {
              const parsed: StreamEvent = JSON.parse(line)
              if (parsed.type === 'text') {
                result += parsed.data
                callbackFunction.updateCallback(parsed.data)
              }
            }
          })
        }
      })
      if (breakFlag) break
    }

    return result
  } catch (error) {
    console.error('Error generating Buddhist response:', error)
    throw new Error('Failed to generate response')
  }
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
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1/buddha-agent-builder/chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getAuthToken()}`
      },
      body: JSON.stringify({
        userId: payload.userId,
        messages: [],
        language: payload.language,
        modelId: payload.modelId,
        approval_response: payload.approvalRequest
      })
    }
  )
  if (!response.ok) {
    throw new Error('Failed to approve approval request')
  }
  const reader = response.body?.getReader()
  const decoder = new TextDecoder('utf-8')

  if (!reader) {
    throw new Error('Failed to get response reader')
  }
  return handleStreamResponse({
    reader,
    payload,
    callbackFunction
  })
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
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/buddha-agent-builder/chat`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify({
          userId: payload.userId,
          messages: payload.messages,
          language: payload.language,
          modelId: payload.modelId
        })
      }
    )

    if (!response.ok) {
      throw new Error('Failed to generate response')
    }
    const reader = response.body?.getReader()

    if (!reader) {
      throw new Error('Failed to get response reader')
    }
    return handleStreamResponse({
      reader,
      payload,
      callbackFunction
    })
  } catch (error) {
    console.error('Error generating Buddhist response:', error)
    throw new Error('Failed to generate response')
  }
}

const handleStreamResponse = async ({
  reader,
  payload,
  callbackFunction: {
    updateCallback,
    stopStream,
    updateCurrentAgentId,
    createApprovalRequest,
    addMessage
  }
}: {
  reader: ReadableStreamDefaultReader<Uint8Array>
  payload: {
    userId: string
    messages: { role: 'user' | 'assistant'; content: string }[]
    language: string
    modelId: string
  }
  callbackFunction: {
    updateCallback: (message: string) => void
    stopStream: () => void
    updateCurrentAgentId: (agentId: string) => void
    createApprovalRequest: (message: ApprovalRequest) => void
    addMessage: (message: string, action?: AgentActions) => void
  }
}) => {
  const decoder = new TextDecoder('utf-8')

  let result = ''
  let buffer = ''
  let accumulatedContent = ''

  if (!reader) {
    throw new Error('Failed to get response reader')
  }
  let chunkParts = ''
  const handleProcessJSONBufferCallback = (message: StreamMessage) => {
    if (message?.content != '') {
      logging('<><><><  Parsed message:', message)
    }
    if (message.type === MessageType.AGENT_MESSAGE) {
      if (message.content && message.content !== '') {
        // Remove agent ID from content if present
        const content = message.content
          .replace(/\[\[[a-f0-9-]+\]\]/g, '')
          .trim()
        if (content) {
          updateCallback(content)
        }
      }
      if (message.agent_id) {
        updateCurrentAgentId(message.agent_id)
      }
    } else if (message.type === MessageType.AI_MESSAGE_CHUNK) {
      if (message.content != '') {
        logging('Agent message CHUNK:', message.content)
      }

      // Accumulate content from chunks
      if (message.content && message.content !== '') {
        if (message.content === '[[') {
          stopStream()
        } else {
          accumulatedContent += message.content
          updateCallback(message.content)
        }
      }
    } else if (message.type === MessageType.AI_MESSAGE_FINAL) {
      // Handle final AI message
      if (message.content && message.content !== '') {
        // Remove agent ID from content if present
        const content = message.content
          .replace(/\[\[[a-f0-9-]+\]\]/g, '')
          .trim()
        if (content) {
          // updateCallback(content);
        }
      }
      if (message.agent_id) {
        updateCurrentAgentId(message.agent_id)
      }
    } else if (message.type === MessageType.TOOL_MESSAGE) {
      const toolName = toolCalls[message.tool_name as keyof typeof toolCalls]
      if (toolName) {
        const text =
          payload.language === Language.VI ? 'Đang xử lý: ' : 'Processing: '
        const processingText =
          text + toolName[payload.language as keyof { vi: string; en: string }]
        addMessage(processingText)
        try {
          if (
            message.content &&
            typeof message.content === 'object' &&
            message.content?.content
          ) {
            const toolMessage = JSON.parse(
              message.content?.content
            ) as ApprovalRequest
            logging('Tool message:', toolMessage)
            createApprovalRequest(toolMessage)
          }
        } catch (e) {
          console.warn('Error parsing tool message:', e)
        }
      }
    } else if (message.type === MessageType.TOOL_EXECUTION) {
      const toolName = toolCalls[message.tool_name as keyof typeof toolCalls]
      if (toolName) {
        const text =
          payload.language === Language.VI
            ? 'Đã xử lý thành công: '
            : 'Successfully processed: '
        const processingText =
          text + toolName[payload.language as keyof { vi: string; en: string }]
        addMessage(processingText, AgentActions.GET_LIST_OF_AGENTS)
      }
      if (message.agent_id) {
        updateCurrentAgentId(message.agent_id)
      }
    } else if (message.type === 'end') {
      logging('Stream ended at:', message.timestamp)
      stopStream()
    }
  }
  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value, { stream: true })
    // parse data from chunk, data chunk start with "data: "
    const isStartWithData = chunk.startsWith('data: ')
    if (!isStartWithData) {
      chunkParts += chunk
      continue
    } else {
      // process the last chunk
      const previousDataChunk = chunkParts
      // Process complete JSON objects from buffer
      buffer += previousDataChunk
      buffer = processJSONBuffer(
        previousDataChunk,
        handleProcessJSONBufferCallback
      )
      // process the current chunk
      chunkParts = chunk
      buffer = processJSONBuffer(chunkParts, handleProcessJSONBufferCallback)
      // reset chunk parts
      chunkParts = ''
    }
  }

  // Process any remaining data in buffer
  if (buffer.trim()) {
    processJSONBuffer(buffer + '\n', (message: StreamMessage) => {
      // Handle any remaining messages
      if (message.type === MessageType.AI_MESSAGE_FINAL && message.content) {
        const content = message.content
          .replace(/\[\[[a-f0-9-]+\]\]/g, '')
          .trim()
        if (content) {
          // updateCallback(content);
        }
      }
    })
  }

  return result
}

enum MessageType {
  AI_MESSAGE_CHUNK = 'ai_message_chunk',
  AI_MESSAGE_FINAL = 'ai_message_final',
  TOOL_MESSAGE = 'tool_message',
  AGENT_MESSAGE = 'agent_message',
  APPROVAL_REQUEST = 'approval_request',
  TOOL_EXECUTION = 'tool_execution',
  ERROR = 'error',
  SYSTEM = 'system'
}

enum AgentRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  TOOL = 'tool'
}

interface BaseMessage {
  type: MessageType
  role: AgentRole
  id?: string
  agent_id?: string
}

interface AgentMessage extends BaseMessage {
  type: MessageType.AGENT_MESSAGE
  role: AgentRole.ASSISTANT
  content: string
}

interface AIMessageChunk extends BaseMessage {
  type: MessageType.AI_MESSAGE_CHUNK
  role: AgentRole.ASSISTANT
  content: string
}

interface AIMessageFinal extends BaseMessage {
  type: MessageType.AI_MESSAGE_FINAL
  role: AgentRole.ASSISTANT
  content: string
}

interface ToolMessage extends BaseMessage {
  type: MessageType.TOOL_MESSAGE
  content: {
    content: string
    additional_kwargs: Record<string, any>
    response_metadata: Record<string, any>
    type: string
    name: string
    id: string
    tool_call_id: string
  }
  role: AgentRole.TOOL
  tool_name?: string
  tool_call_id?: string
}

interface ApprovalRequestMessage extends BaseMessage {
  type: MessageType.APPROVAL_REQUEST
  role: AgentRole.ASSISTANT
  approval_id: string
  tool_name: string
  tool_description: string
  arguments: Record<string, any>
  reasoning?: string
  requires_user_action: boolean
  content: string
}

interface ToolExecutionMessage extends BaseMessage {
  type: MessageType.TOOL_EXECUTION
  role: AgentRole.TOOL
  tool_name: string
  arguments: Record<string, any>
  content: string
}

interface ErrorMessage extends BaseMessage {
  type: MessageType.ERROR
  role: AgentRole.SYSTEM
  content: string
}

interface SystemMessage extends BaseMessage {
  type: MessageType.SYSTEM
  role: AgentRole.SYSTEM
  content: string
}

interface EndMessage {
  type: 'end'
  timestamp: string
}

type StreamMessage =
  | AgentMessage
  | AIMessageChunk
  | AIMessageFinal
  | ToolMessage
  | ApprovalRequestMessage
  | ToolExecutionMessage
  | ErrorMessage
  | SystemMessage
  | EndMessage

type UpdateCallback = (message: StreamMessage) => void
function processJSONBuffer(
  chunk: string,
  updateCallback: UpdateCallback
): string {
  const dataChunks = chunk.split('data: ')
  logging('<><><>< [dataChunks]:', dataChunks)
  const lines = dataChunks
  // Process all complete lines except the last one (which might be incomplete)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (line) {
      // Try to extract multiple JSON objects from a single line
      logging('<<><><><><>>< line:', line)
      const objects = extractMultipleJSONObjects(line)
      objects.forEach((obj) => {
        const result = handleParsedMessage(obj, updateCallback)
        return result
      })
    }
  }

  // Return the last line as remaining buffer (might be incomplete)
  return lines[lines.length - 1]
}

function extractMultipleJSONObjects(text: string): StreamMessage[] {
  const objects: StreamMessage[] = []
  let braceCount = 0
  let start = 0

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') {
      if (braceCount === 0) {
        start = i
      }
      braceCount++
    } else if (text[i] === '}') {
      braceCount--
      if (braceCount === 0) {
        try {
          const jsonStr = text.substring(start, i + 1)
          const obj = JSON.parse(jsonStr) as StreamMessage
          objects.push(obj)
        } catch (e) {
          console.warn(
            'Failed to parse extracted JSON:',
            text.substring(start, i + 1)
          )
        }
      }
    }
  }

  return objects
}

const parseIdFromMessage = (message: string) => {
  // Look for ID pattern at the end of the message: [[uuid]]
  const idPattern = /\[\[([a-f0-9-]+)\]\]\s*$/i
  const match = message.match(idPattern)

  if (match && match[1]) {
    return match[1] // Return the UUID without the brackets
  }

  // Also check for ID pattern anywhere in the message
  const idPatternAnywhere = /\[\[([a-f0-9-]+)\]\]/i
  const matchAnywhere = message.match(idPatternAnywhere)

  if (matchAnywhere && matchAnywhere[1]) {
    return matchAnywhere[1] // Return the UUID without the brackets
  }

  return undefined // Return undefined if no ID found
}

function handleParsedMessage(
  parsed: StreamMessage,
  updateCallback: UpdateCallback
): void {
  if (parsed.content != '') {
    logging('Parsed object:', parsed)
  }

  switch (parsed.type) {
    case MessageType.AGENT_MESSAGE:
      // The content is already properly decoded Vietnamese text
      const agent_id = parseIdFromMessage(parsed.content)
      const content = parsed.content.replace(`[[${agent_id}]]`, '')
      updateCallback({
        type: parsed.type,
        content: content,
        role: parsed.role,
        id: parsed.id,
        agent_id: agent_id
      })
      break

    case MessageType.AI_MESSAGE_CHUNK:
      if (parsed.content != '') {
        logging('AI message chunk:', parsed.content)
      }
      // Handle streaming AI message chunks
      updateCallback({
        type: parsed.type,
        content: parsed.content,
        role: parsed.role,
        id: parsed.id,
        agent_id: parsed.agent_id
      })
      break

    case MessageType.AI_MESSAGE_FINAL:
      // Handle final AI message
      const final_agent_id = parseIdFromMessage(parsed.content)
      const final_content = parsed.content.replace(`[[${final_agent_id}]]`, '')
      updateCallback({
        type: parsed.type,
        content: final_content,
        role: parsed.role,
        id: parsed.id,
        agent_id: final_agent_id
      })
      break

    case MessageType.TOOL_MESSAGE:
      logging('Tool message:', parsed.content)
      updateCallback({
        type: parsed.type,
        content: parsed.content,
        role: parsed.role,
        id: parsed.id,
        tool_name: parsed.tool_name,
        tool_call_id: parsed.tool_call_id
      })
      break

    case MessageType.TOOL_EXECUTION:
      logging('Tool execution message:', parsed.content)
      const tool_execution_agent_id = parseIdFromMessage(parsed.content)
      updateCallback({
        type: parsed.type,
        content: parsed.content,
        role: parsed.role,
        id: parsed.id,
        tool_name: parsed.tool_name,
        arguments: parsed.arguments,
        agent_id: tool_execution_agent_id
      })
      break

    case MessageType.APPROVAL_REQUEST:
      logging('Approval request:', parsed.content)
      updateCallback({
        type: parsed.type,
        content: parsed.content,
        role: parsed.role,
        id: parsed.id,
        approval_id: parsed.approval_id,
        tool_name: parsed.tool_name,
        tool_description: parsed.tool_description,
        arguments: parsed.arguments,
        reasoning: parsed.reasoning,
        requires_user_action: parsed.requires_user_action
      })
      break

    case MessageType.SYSTEM:
      updateCallback({
        type: parsed.type,
        content: parsed.content,
        role: parsed.role,
        id: parsed.id
      })
      break

    case 'end':
      logging('Stream ended at:', parsed.timestamp)
      updateCallback({ type: 'end', timestamp: parsed.timestamp })
      break

    case MessageType.ERROR:
      console.error('Error message:', parsed.content)
      updateCallback({
        type: parsed.type,
        content: parsed.content,
        role: parsed.role
      })
      break

    default:
      // Handle unknown message types
      logging('Unknown message type:', parsed)
      updateCallback(parsed)
  }

  logging('================================================================')
}
