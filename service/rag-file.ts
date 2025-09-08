import axiosInstance from "@/lib/axios";
import { RagFile, RagFilesResponse, RagFileListParams } from "@/interfaces/rag-file";

class RagFileService {
  private readonly BASE_URL = "/api/v1/rag/files";

  async list(params?: RagFileListParams): Promise<RagFile[]> {
    const queryParams = new URLSearchParams();
    if (params?.corpus_id) {
      queryParams.append('corpus_id', params.corpus_id);
    }
    if (params?.agent_id) {
      queryParams.append('agent_id', params.agent_id);
    }

    const url = queryParams.toString() 
      ? `${this.BASE_URL}?${queryParams.toString()}`
      : this.BASE_URL;

    const { data } = await axiosInstance.get<RagFilesResponse>(url);
    return data.files;
  }

  async remove(fileId: string, agentId: string, corpusId?: string): Promise<void> {
    const queryParams = new URLSearchParams();
    if (corpusId) {
      queryParams.append('corpus_id', corpusId);
    }
    if (agentId) {
      queryParams.append('agent_id', agentId);
    }
    const url = queryParams.toString() 
      ? `${this.BASE_URL}/${fileId}?${queryParams.toString()}`
      : `${this.BASE_URL}/${fileId}`;
    await axiosInstance.delete(url);
  }
}

export const ragFileService = new RagFileService();
