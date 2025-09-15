"use client";

import { useTranslation } from "react-i18next";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  Calendar,
  Clock,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ApiKey } from "@/interfaces/api-key";

interface ApiKeyItemProps {
  apiKey: ApiKey;
  onEdit: (apiKey: ApiKey) => void;
  onDelete: (apiKey: ApiKey) => void;
  onStatusChange: (apiKey: ApiKey, newStatus: 'active' | 'inactive') => void;
  formatDate: (dateString: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
}

export function ApiKeyItem({ 
  apiKey, 
  onEdit, 
  onDelete, 
  onStatusChange, 
  formatDate, 
  getStatusBadge 
}: ApiKeyItemProps) {
  const { t } = useTranslation();

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-medium text-gray-900">{apiKey.name}</h3>
            {getStatusBadge(apiKey.status)}
          </div>
          {apiKey.description && (
            <p className="text-sm text-gray-600 mb-2">{apiKey.description}</p>
          )}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(apiKey.created_at)}
            </div>
            {apiKey.last_used_at && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(apiKey.last_used_at)}
              </div>
            )}
            {apiKey.expires_at && (
              <div className="flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {new Date(apiKey.expires_at) < new Date() ? "Expired" : `Expires ${formatDate(apiKey.expires_at)}`}
              </div>
            )}
          </div>
          {apiKey.permissions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {apiKey.permissions.map((permission) => (
                <Badge key={permission} variant="outline" className="text-xs">
                  {permission}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(apiKey)}>
              <Edit className="w-4 h-4 mr-2" />
              {t("common.edit")}
            </DropdownMenuItem>
            {apiKey.status === 'active' ? (
              <DropdownMenuItem onClick={() => onStatusChange(apiKey, 'inactive')}>
                <EyeOff className="w-4 h-4 mr-2" />
                {t("admin.apiKey.actions.deactivate")}
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => onStatusChange(apiKey, 'active')}>
                <Eye className="w-4 h-4 mr-2" />
                {t("admin.apiKey.actions.activate")}
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDelete(apiKey)} className="text-red-600">
              <Trash2 className="w-4 h-4 mr-2" />
              {t("common.delete")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
} 