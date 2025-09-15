import { Model } from '@/interfaces/chat'
import axiosInstance, { getAuthToken } from '@/lib/axios'

const modelService = {
  getModels: async ({
    limit,
    offset,
    search,
    status,
    language
  }: {
    limit: number
    offset: number
    search: string
    status: string
    language: string
  }) => {
    if (!getAuthToken()) {
      return []
    }

    let params: Record<string, string | number> = {}
    if (limit) params.limit = limit
    if (offset) params.offset = offset
    if (search) params.search = search
    if (status) params.status = status
    if (language) params.language = language

    const response = await axiosInstance.get<{ models: Model[] }>(
      '/api/v1/fine-tuning-models',
      { params }
    )
    return response.data.models
  }
}

export default modelService
