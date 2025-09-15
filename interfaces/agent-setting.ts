export interface AgentSetting {
  uuid: string;
  key: string;
  label: string;
  short_label: string;
  agent_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAgentSettingDto {
  key: string;
  label: string;
  short_label: string;
  agent_id: string;
}

export interface UpdateAgentSettingDto {
  label?: string;
  short_label?: string;
  agent_id?: string;
}

export interface AgentSettingQueryParams {
  limit?: number;
  offset?: number;
  agent_id?: string;
} 