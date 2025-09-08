export interface RagFile {
  name: string;
  display_name: string;
  create_time: string | null;
  state: number | null; // 0: UNSPECIFIED, 1: ACTIVE, 2: ERROR
  id: string;
}

export interface RagFilesResponse {
  files: RagFile[];
}

export interface RagFileListParams {
  corpus_id?: string;
  agent_id?: string;
} 