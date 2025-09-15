export interface ApiKey {
  uuid: string;
  name: string;
  description?: string;
  status: 'active' | 'inactive' | 'expired';
  permissions: string[];
  created_at: string;
  updated_at: string;
  expires_at?: string;
  last_used_at?: string;
  api_key?: string;
}

export interface CreateApiKeyRequest {
  name: string;
  description?: string;
  permissions?: string[];
  expires_at?: string;
}

export interface UpdateApiKeyRequest {
  name?: string;
  description?: string;
  permissions?: string[];
  status?: 'active' | 'inactive';
  expires_at?: string;
}

export interface ApiKeyListResponse {
  api_keys: ApiKey[];
  total: number;
  limit: number;
  offset: number;
}

export type ApiKeyCreateResponse = ApiKey;

export interface ApiKeyFilters {
  status?: 'active' | 'inactive' | 'expired';
  search?: string;
  sortBy?: 'name' | 'created_at' | 'last_used_at';
  sortOrder?: 'asc' | 'desc';
} 