import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format } from 'date-fns'
import { Language } from '@/interfaces/chat'
import { ApprovalRequest } from '@/interfaces/agent'
import markdownToTxt from 'markdown-to-txt'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const now = () => format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'")

export const DEFAULT_TITLE_EN = 'New Chat'
export const DEFAULT_TITLE_VI = 'Cuộc trò chuyện mới'
export const getDefaultTitle = (language: Language) => {
  return language === Language.VI ? DEFAULT_TITLE_VI : DEFAULT_TITLE_EN
}

export const toolCalls = {
  create_buddhist_agent: {
    vi: 'Tạo một tác nhân AI',
    en: 'Create a new AI agent'
  },
  update_buddhist_agent: {
    vi: 'Cập nhật thông tin của tác nhân AI',
    en: 'Update information of AI agent'
  },
  delete_buddhist_agent: {
    vi: 'Xóa tác nhân AI',
    en: 'Delete AI agent'
  },
  generate_buddhist_system_prompt: {
    vi: 'Tạo một hệ thống prompt cho tác nhân AI',
    en: 'Create a new system prompt for AI agent'
  },
  list_buddhist_agents: {
    vi: 'Lấy danh sách tất cả tác nhân AI',
    en: 'List all AI agents'
  },
  get_buddhist_agent_by_id: {
    vi: 'Lấy thông tin chi tiết của tác nhân AI',
    en: 'Get detailed information of AI agent'
  },
  get_buddhist_teachings: {
    vi: 'Lấy thông tin chi tiết của tác nhân AI',
    en: 'Get detailed information of AI agent'
  },
  create_meditation_guide: {
    vi: 'Tạo một hướng dẫn thiền',
    en: 'Create a new meditation guide'
  },
  generate_mindfulness_exercise: {
    vi: 'Tạo bài tập tỉnh thức',
    en: 'Create a new mindfulness exercise'
  },
  create_compassion_practice: {
    vi: 'Tạo bài tập tỉnh thức',
    en: 'Create a new compassion practice'
  },
  search_buddhist_agents: {
    vi: 'Tìm kiếm tác nhân AI',
    en: 'Search for AI agents'
  },
  test_buddhist_agent: {
    vi: 'Kiểm tra tác nhân AI',
    en: 'Test AI agent'
  },
  add_buddhist_knowledge_to_context: {
    vi: 'Thêm kiến thức vào ngữ cảnh',
    en: 'Add knowledge to context'
  },
  search_buddhist_knowledge: {
    vi: 'Tìm kiến thức về tác nhân AI',
    en: 'Search knowledge about AI agent'
  },
  add_buddhist_teaching_example: {
    vi: 'Thêm ví dụ vào hệ thống',
    en: 'Add example to system'
  },
  add_user_insight_to_knowledge_base: {
    vi: 'Thêm ý kiến của người dùng vào cơ sở kiến thức',
    en: 'Add user insight to knowledge base'
  }
}

export const getToolCallResoning = (toolCall: string, language: Language) => {
  const text =
    language === Language.VI
      ? 'AI muốn thực hiện hành động sau:'
      : 'AI wants to perform the following action:'
  return `${text} "${toolCalls[toolCall as keyof typeof toolCalls][language]}"`
}

const listOutObjectsRecursively = (
  objects: Record<string, any> | string
): string => {
  if (typeof objects === 'string') {
    return objects
  }
  return Object.keys(objects)
    .map((key) => {
      if (typeof objects[key] === 'object' && objects[key] !== null) {
        return `- **${
          key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
        }**: ${listOutObjectsRecursively(objects[key])}`
      }
      return `- **${
        key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
      }**: ${objects[key]}`
    })
    .join('\n')
}
export const listOutApprovalObjects = (request: ApprovalRequest) => {
  return Object.keys(request.approval_request.arguments)
    .map(
      (key) =>
        `- **${
          key.charAt(0).toUpperCase() + key.slice(1).toLowerCase()
        }**: ${listOutObjectsRecursively(
          request.approval_request.arguments[key]
        )}`
    )
    .join('\n')
}

export const logging = (...message: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 :', ...message)
  }
}

export const getJobState = (status: string, language: Language) => {
  switch (status) {
    case 'JOB_STATE_UNSPECIFIED':
      return language === Language.VI
        ? 'Trạng thái công việc không xác định'
        : 'The job state is unspecified.'
    case 'JOB_STATE_QUEUED':
      return language === Language.VI
        ? 'Công việc đã được tạo hoặc tiếp tục và chưa bắt đầu xử lý'
        : 'The job has been just created or resumed and processing has not yet begun.'
    case 'JOB_STATE_PENDING':
      return language === Language.VI
        ? 'Dịch vụ đang chuẩn bị chạy công việc'
        : 'The service is preparing to run the job.'
    case 'JOB_STATE_RUNNING':
      return language === Language.VI
        ? 'Công việc đang được thực hiện'
        : 'The job is in progress.'
    case 'JOB_STATE_SUCCEEDED':
      return language === Language.VI
        ? 'Công việc đã hoàn thành thành công'
        : 'The job completed successfully.'
    case 'JOB_STATE_FAILED':
      return language === Language.VI
        ? 'Công việc đã thất bại'
        : 'The job failed.'
    case 'JOB_STATE_CANCELLING':
      return language === Language.VI
        ? 'Công việc đang bị hủy'
        : 'The job is being cancelled.'
    case 'JOB_STATE_CANCELLED':
      return language === Language.VI
        ? 'Công việc đã bị hủy'
        : 'The job has been cancelled.'
    case 'JOB_STATE_PAUSED':
      return language === Language.VI
        ? 'Công việc đã bị tạm dừng'
        : 'The job has been paused.'
    case 'JOB_STATE_EXPIRED':
      return language === Language.VI
        ? 'Công việc đã hết hạn'
        : 'The job has expired.'
    case 'JOB_STATE_UPDATING':
      return language === Language.VI
        ? 'Công việc đang được cập nhật'
        : 'The job is being updated.'
    case 'JOB_STATE_PARTIALLY_SUCCEEDED':
      return language === Language.VI
        ? 'Công việc đã hoàn thành một phần'
        : 'The job is partially succeeded, some results may be missing due to errors.'
    default:
      return language === Language.VI
        ? 'Trạng thái công việc không xác định'
        : 'The job state is unspecified.'
  }
}

export const markdownToText = (markdown: string) => {
  return markdownToTxt(markdown)
}

/**
 * Safely creates a blob URL with proper cleanup to avoid CORS issues
 * @param blob - The blob to create URL for
 * @param onCleanup - Optional cleanup callback
 * @returns The blob URL
 */
export function createSafeBlobURL(blob: Blob, onCleanup?: () => void): string {
  const url = URL.createObjectURL(blob)

  // Store cleanup function for later use
  if (onCleanup) {
    // Use a weak map to store cleanup functions
    if (!(window as any).__blobCleanupMap) {
      ;(window as any).__blobCleanupMap = new Map()
    }
    ;(window as any).__blobCleanupMap.set(url, onCleanup)
  }

  return url
}

/**
 * Safely revokes a blob URL and calls cleanup function if exists
 * @param url - The blob URL to revoke
 */
export function revokeSafeBlobURL(url: string): void {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url)

    // Call cleanup function if exists
    if ((window as any).__blobCleanupMap?.has(url)) {
      const cleanup = (window as any).__blobCleanupMap.get(url)
      cleanup?.()
      ;(window as any).__blobCleanupMap.delete(url)
    }
  }
}

/**
 * Creates a safe audio element with proper cleanup and error handling
 * @param blob - The audio blob
 * @param onEnd - Callback when audio ends
 * @param onError - Callback when error occurs
 * @param onLoad - Callback when audio is loaded and ready to play
 * @returns The audio element
 */
export function createSafeAudioElement(
  blob: Blob,
  onEnd?: () => void,
  onError?: (error: string) => void,
  onLoad?: () => void
): HTMLAudioElement {
  const audioUrl = createSafeBlobURL(blob)
  const audio = new Audio(audioUrl)

  audio.onended = () => {
    revokeSafeBlobURL(audioUrl)
    onEnd?.()
  }

  audio.onerror = () => {
    revokeSafeBlobURL(audioUrl)
    onError?.('Failed to play audio')
  }

  audio.oncanplaythrough = () => {
    onLoad?.()
  }

  return audio
}

/**
 * Converts base64 string to blob
 * @param base64 - The base64 string
 * @param mimeType - The MIME type
 * @returns The blob
 */
export function base64ToBlob(
  base64: string,
  mimeType: string = 'audio/mpeg'
): Blob {
  const audioData = atob(base64)
  const audioArray = new Uint8Array(audioData.length)
  for (let i = 0; i < audioData.length; i++) {
    audioArray[i] = audioData.charCodeAt(i)
  }
  return new Blob([audioArray], { type: mimeType })
}
