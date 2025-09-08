import { create } from "zustand";
import {
  ApiKey,
  CreateApiKeyRequest,
  UpdateApiKeyRequest,
  ApiKeyFilters,
} from "@/interfaces/api-key";
import { apiKeyService } from "@/service/api-key";
import { appToast } from "@/lib/toastify";

interface ApiKeyState {
  // State
  apiKeys: ApiKey[];
  loading: boolean;
  error: string | null;
  filters: ApiKeyFilters;
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
  selectedApiKey: ApiKey | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  newlyCreatedKey: string | null; // Store the full key temporarily
  newlyCreatedApiKey: ApiKey | null; // Store the created API key object

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<ApiKeyFilters>) => void;
  setPagination: (pagination: Partial<ApiKeyState["pagination"]>) => void;
  setSelectedApiKey: (apiKey: ApiKey | null) => void;
  clearNewlyCreatedKey: () => void;
  clearNewlyCreatedApiKey: () => void;

  // API Actions
  fetchApiKeys: (
    filters?: ApiKeyFilters,
    offset?: number,
    limit?: number
  ) => Promise<void>;
  createApiKey: (apiKeyData: CreateApiKeyRequest) => Promise<void>;
  updateApiKey: (id: string, apiKeyData: UpdateApiKeyRequest) => Promise<void>;
  deleteApiKey: (id: string) => Promise<void>;

  // Utility Actions
  getApiKeyById: (id: string) => ApiKey | undefined;
  getFilteredApiKeys: () => ApiKey[];
  getStatusCounts: () => {
    total: number;
    active: number;
    inactive: number;
    expired: number;
  };
}

export const useApiKeyStore = create<ApiKeyState>((set, get) => ({
  // Initial state
  apiKeys: [],
  loading: false,
  error: null,
  filters: {},
  pagination: {
    offset: 0,
    limit: 20,
    total: 0,
  },
  selectedApiKey: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  newlyCreatedKey: null,
  newlyCreatedApiKey: null,

  // State setters
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters },
      pagination: { ...state.pagination, offset: 0 }, // Reset to first page when filters change
    })),
  setPagination: (pagination) =>
    set((state) => ({
      pagination: { ...state.pagination, ...pagination },
    })),
  setSelectedApiKey: (apiKey) => set({ selectedApiKey: apiKey }),
  clearNewlyCreatedKey: () => set({ newlyCreatedKey: null }),
  clearNewlyCreatedApiKey: () => set({ newlyCreatedApiKey: null }),

  // API Actions
  fetchApiKeys: async (filters, offset, limit) => {
    const { setLoading, setError, pagination } = get();

    try {
      setLoading(true);
      setError(null);

      const response = await apiKeyService.list({
        limit: limit || pagination.limit,
        offset: offset || pagination.offset,
        filters: filters || get().filters,
      });

      set({
        apiKeys: response.api_keys,
        pagination: {
          offset: response.offset,
          limit: response.limit,
          total: response.total,
        },
      });
    } catch (error) {
      console.error("Error fetching API keys:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch API keys"
      );
      appToast("Failed to fetch API keys", { type: "error" });
    } finally {
      setLoading(false);
    }
  },

  createApiKey: async (apiKeyData) => {
    const { setLoading, setError, fetchApiKeys } = get();

    try {
      setLoading(true);
      setError(null);

      const response = await apiKeyService.create(apiKeyData);

      console.log("response", {
        response,
        newlyCreatedKey: response.api_key,
        newlyCreatedApiKey: response,
      });
      // Store the full key temporarily and the API key object
      set({
        newlyCreatedKey: response.api_key ,
        newlyCreatedApiKey: response,
      });

      appToast("API key created successfully", { type: "success" });

      // Refresh the list
      await fetchApiKeys();
    } catch (error) {
      console.error("Error creating API key:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create API key"
      );
      appToast("Failed to create API key", { type: "error" });
    } finally {
      setLoading(false);
    }
  },

  updateApiKey: async (id, apiKeyData) => {
    const { setLoading, setError, fetchApiKeys } = get();

    try {
      setLoading(true);
      setError(null);

      await apiKeyService.update(id, apiKeyData);

      appToast("API key updated successfully", { type: "success" });

      // Refresh the list
      await fetchApiKeys();
    } catch (error) {
      console.error("Error updating API key:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update API key"
      );
      appToast("Failed to update API key", { type: "error" });
    } finally {
      setLoading(false);
    }
  },

  deleteApiKey: async (id) => {
    const { setLoading, setError, fetchApiKeys } = get();

    try {
      setLoading(true);
      setError(null);

      await apiKeyService.delete(id);

      appToast("API key deleted successfully", { type: "success" });

      // Refresh the list
      await fetchApiKeys();
    } catch (error) {
      console.error("Error deleting API key:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete API key"
      );
      appToast("Failed to delete API key", { type: "error" });
    } finally {
      setLoading(false);
    }
  },

  // Utility Actions
  getApiKeyById: (id) => {
    const { apiKeys } = get();
    return apiKeys.find((apiKey) => apiKey.uuid === id);
  },

  getFilteredApiKeys: () => {
    const { apiKeys, filters } = get();
    return apiKeys.filter((apiKey) => {
      if (filters.status && apiKey.status !== filters.status) return false;
      if (filters.search) {
        const search = filters.search.toLowerCase();
        return (
          apiKey.name.toLowerCase().includes(search) ||
          (apiKey.description &&
            apiKey.description.toLowerCase().includes(search))
        );
      }
      return true;
    });
  },

  getStatusCounts: () => {
    const { apiKeys } = get();
    return {
      total: apiKeys.length,
      active: apiKeys.filter((key) => key.status === "active").length,
      inactive: apiKeys.filter((key) => key.status === "inactive").length,
      expired: apiKeys.filter((key) => key.status === "expired").length,
    };
  },
}));
