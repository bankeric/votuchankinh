"use client";

import { useTranslation } from "react-i18next";
import { Key } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ApiKey } from "@/interfaces/api-key";
import { ApiKeyItem } from "./api-key-item";

interface ApiKeyListProps {
  apiKeys: ApiKey[];
  loading: boolean;
  onEdit: (apiKey: ApiKey) => void;
  onDelete: (apiKey: ApiKey) => void;
  onStatusChange: (apiKey: ApiKey, newStatus: 'active' | 'inactive') => void;
  onCreateNew: () => void;
  formatDate: (dateString: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
}

export function ApiKeyList({ 
  apiKeys, 
  loading, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  onCreateNew,
  formatDate, 
  getStatusBadge 
}: ApiKeyListProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("admin.apiKey.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">{t("admin.apiKey.table.loading")}</div>
          </div>
        ) : apiKeys.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Key className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">{t("admin.apiKey.table.noKeys")}</p>
            <Button onClick={onCreateNew}>
              {t("admin.apiKey.actions.createKey")}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <ApiKeyItem
                key={apiKey.uuid}
                apiKey={apiKey}
                onEdit={onEdit}
                onDelete={onDelete}
                onStatusChange={onStatusChange}
                formatDate={formatDate}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 