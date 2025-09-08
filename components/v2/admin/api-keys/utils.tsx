"use client";

import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

export function useApiKeyUtils() {
  const { t } = useTranslation();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1" />Inactive</Badge>;
      case 'expired':
        return <Badge variant="destructive" className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t("admin.apiKey.table.justNow");
    if (diffInMinutes < 60) return t("admin.apiKey.table.minutesAgo", { minutes: diffInMinutes });
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return t("admin.apiKey.table.hoursAgo", { hours: diffInHours });
    
    const diffInDays = Math.floor(diffInHours / 24);
    return t("admin.apiKey.table.daysAgo", { days: diffInDays });
  };

  const getPermissions = () => [
    { value: "admin", label: t("admin.apiKey.permissions.admin") },
    { value: "student", label: t("admin.apiKey.permissions.student") },
  ];

  return {
    getStatusBadge,
    formatDate,
    getPermissions,
  };
} 