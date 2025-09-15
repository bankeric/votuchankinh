import axiosInstance from "@/lib/axios";
import { 
  ApiKey, 
  CreateApiKeyRequest, 
  UpdateApiKeyRequest, 
  ApiKeyListResponse, 
  ApiKeyCreateResponse,
  ApiKeyFilters 
} from "@/interfaces/api-key";

class ApiKeyService {
  private readonly BASE_URL = '/api/v1/api-keys';

  // List all API keys for the current user
  async list(params?: {
    limit?: number;
    offset?: number;
    filters?: ApiKeyFilters;
  }): Promise<ApiKeyListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params?.limit) queryParams.append('limit', params.limit.toString());
      if (params?.offset) queryParams.append('offset', params.offset.toString());
      
      if (params?.filters) {
        if (params.filters.status) queryParams.append('status', params.filters.status);
        if (params.filters.search) queryParams.append('search', params.filters.search);
        if (params.filters.sortBy) queryParams.append('sortBy', params.filters.sortBy);
        if (params.filters.sortOrder) queryParams.append('sortOrder', params.filters.sortOrder);
      }

      const url = queryParams.toString() 
        ? `${this.BASE_URL}?${queryParams.toString()}`
        : this.BASE_URL;

      const { data } = await axiosInstance.get<ApiKeyListResponse>(url);
      return data;
    } catch (error) {
      console.error('Error fetching API keys:', error);
      throw error;
    }
  }

  // Create a new API key
  async create(requestData: CreateApiKeyRequest): Promise<ApiKeyCreateResponse> {
    try {
      const { data } = await axiosInstance.post<ApiKeyCreateResponse>(
        this.BASE_URL,
        requestData
      );
      return data;
    } catch (error) {
      console.error('Error creating API key:', error);
      throw error;
    }
  }

  // Get a specific API key by ID
  async getById(apiKeyId: string): Promise<ApiKey> {
    try {
      const { data } = await axiosInstance.get<ApiKey>(
        `${this.BASE_URL}/${apiKeyId}`
      );
      return data;
    } catch (error) {
      console.error(`Error fetching API key ${apiKeyId}:`, error);
      throw error;
    }
  }

  // Update an API key
  async update(apiKeyId: string, requestData: UpdateApiKeyRequest): Promise<ApiKey> {
    try {
      const { data } = await axiosInstance.put<ApiKey>(
        `${this.BASE_URL}/${apiKeyId}`,
        requestData
      );
      return data;
    } catch (error) {
      console.error(`Error updating API key ${apiKeyId}:`, error);
      throw error;
    }
  }

  // Delete an API key
  async delete(apiKeyId: string): Promise<void> {
    try {
      await axiosInstance.delete(`${this.BASE_URL}/${apiKeyId}`);
    } catch (error) {
      console.error(`Error deleting API key ${apiKeyId}:`, error);
      throw error;
    }
  }
}

export const apiKeyService = new ApiKeyService(); 