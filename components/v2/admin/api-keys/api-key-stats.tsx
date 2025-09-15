"use client";

import { useTranslation } from "react-i18next";
import { Key, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ApiKeyStatsProps {
  stats: {
    total: number;
    active: number;
    inactive: number;
    expired: number;
  };
}

export function ApiKeyStats({ stats }: ApiKeyStatsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t("admin.apiKey.stats.total")}</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Key className="w-8 h-8 text-gray-400" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t("admin.apiKey.stats.active")}</p>
              <p className="text-2xl font-bold text-green-600">{stats.active}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t("admin.apiKey.stats.inactive")}</p>
              <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
            </div>
            <XCircle className="w-8 h-8 text-gray-400" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{t("admin.apiKey.stats.expired")}</p>
              <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 