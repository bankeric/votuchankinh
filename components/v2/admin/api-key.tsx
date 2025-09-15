"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApiKeyStore } from "@/store/api-key";
import type { ApiKey, CreateApiKeyRequest, UpdateApiKeyRequest } from "@/interfaces/api-key";
import { appToast } from "@/lib/toastify";
import {
  ApiKeyStats,
  ApiKeyFiltersComponent,
  ApiKeyList,
  ApiKeyFormModal,
  NewApiKeyModal,
  DeleteApiKeyDialog,
  useApiKeyUtils
} from "./api-keys";

export function ApiKey() {
  const { t } = useTranslation();
  const {
    apiKeys,
    loading,
    error,
    filters,
    pagination,
    selectedApiKey,
    isCreating,
    isUpdating,
    isDeleting,
    newlyCreatedKey,
    newlyCreatedApiKey,
    setFilters,
    setPagination,
    setSelectedApiKey,
    clearNewlyCreatedKey,
    clearNewlyCreatedApiKey,
    fetchApiKeys,
    createApiKey,
    updateApiKey,
    deleteApiKey,
    getStatusCounts,
  } = useApiKeyStore();

  const { getStatusBadge, formatDate, getPermissions } = useApiKeyUtils();

  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [showFullKey, setShowFullKey] = useState(false);
  const [formData, setFormData] = useState<CreateApiKeyRequest>({
    name: "",
    description: "",
    permissions: [],
    expires_at: "",
  });

  const statusCounts = getStatusCounts();
  const permissions = getPermissions();

  useEffect(() => {
    fetchApiKeys();
  }, []);

  useEffect(() => {
    if (newlyCreatedKey) {
      console.log('newlyCreatedKey 1', newlyCreatedKey);
      setShowNewKeyModal(true);
    }
  }, [newlyCreatedKey]);
  console.log('newlyCreatedKey 2', newlyCreatedKey);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ search: value });
  };

  const handleCreateKey = async () => {
    if (!formData.name.trim()) {
      appToast("Name is required", { type: "error" });
      return;
    }

    await createApiKey(formData);
    setShowCreateModal(false);
    setFormData({ name: "", description: "", permissions: [], expires_at: "" });
  };

  const handleEditKey = async () => {
    if (!selectedApiKey || !formData.name.trim()) {
      appToast("Name is required", { type: "error" });
      return;
    }

    const updateData: UpdateApiKeyRequest = {
      name: formData.name,
      description: formData.description,
      permissions: formData.permissions,
      expires_at: formData.expires_at,
    };

    await updateApiKey(selectedApiKey.uuid, updateData);
    setShowEditModal(false);
    setSelectedApiKey(null);
    setFormData({ name: "", description: "", permissions: [], expires_at: "" });
  };

  const handleDeleteKey = async () => {
    if (!selectedApiKey) return;

    await deleteApiKey(selectedApiKey.uuid);
    setShowDeleteDialog(false);
    setSelectedApiKey(null);
  };

  const handleCopyKey = async (key: string) => {
    try {
      await navigator.clipboard.writeText(key);
      appToast("API key copied to clipboard", { type: "success" });
    } catch (error) {
      appToast("Failed to copy API key", { type: "error" });
    }
  };

  const handleDownloadJson = (apiKey: ApiKey, fullKey: string) => {
    const keyData = {
      name: apiKey.name,
      description: apiKey.description,
      permissions: apiKey.permissions,
      key: fullKey,
      created_at: apiKey.created_at,
      expires_at: apiKey.expires_at,
      status: apiKey.status
    };

    const blob = new Blob([JSON.stringify(keyData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${apiKey.name.replace(/[^a-zA-Z0-9]/g, '_')}_api_key.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    appToast("API key downloaded as JSON", { type: "success" });
  };

  const handleEditClick = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey);
    setFormData({
      name: apiKey.name,
      description: apiKey.description || "",
      permissions: apiKey.permissions,
      expires_at: apiKey.expires_at || "",
    });
    setShowEditModal(true);
  };

  const handleDeleteClick = (apiKey: ApiKey) => {
    setSelectedApiKey(apiKey);
    setShowDeleteDialog(true);
  };

  const handleStatusChange = async (apiKey: ApiKey, newStatus: 'active' | 'inactive') => {
    await updateApiKey(apiKey.uuid, { status: newStatus });
  };

  const handleCloseNewKeyModal = () => {
    setShowNewKeyModal(false);
    clearNewlyCreatedKey();
    clearNewlyCreatedApiKey();
  };

  const handleFormDataChange = (data: Partial<CreateApiKeyRequest>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t("admin.apiKey.title")}</h2>
          <p className="text-gray-600">{t("admin.apiKey.description")}</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          {t("admin.apiKey.actions.createKey")}
        </Button>
      </div>

      {/* Stats */}
      <ApiKeyStats stats={statusCounts} />

      {/* Filters */}
      <ApiKeyFiltersComponent
        filters={filters}
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        onFiltersChange={setFilters}
      />

      {/* API Keys List */}
      <ApiKeyList
        apiKeys={apiKeys}
        loading={loading}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onStatusChange={handleStatusChange}
        onCreateNew={() => setShowCreateModal(true)}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
      />

      {/* Create API Key Modal */}
      <ApiKeyFormModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        mode="create"
        formData={formData}
        onFormDataChange={handleFormDataChange}
        onSubmit={handleCreateKey}
        loading={isCreating}
        permissions={permissions}
      />

      {/* Edit API Key Modal */}
      <ApiKeyFormModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        mode="edit"
        formData={formData}
        onFormDataChange={handleFormDataChange}
        onSubmit={handleEditKey}
        loading={isUpdating}
        permissions={permissions}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteApiKeyDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteKey}
        loading={isDeleting}
      />

      {/* New API Key Modal */}
      <NewApiKeyModal
        open={showNewKeyModal}
        onOpenChange={setShowNewKeyModal}
        apiKey={newlyCreatedApiKey}
        fullKey={newlyCreatedKey}
        showFullKey={showFullKey}
        onToggleKeyVisibility={() => setShowFullKey(!showFullKey)}
        onCopyKey={handleCopyKey}
        onDownloadJson={handleDownloadJson}
        onClose={handleCloseNewKeyModal}
        formatDate={formatDate}
        getStatusBadge={getStatusBadge}
      />
    </div>
  );
} 