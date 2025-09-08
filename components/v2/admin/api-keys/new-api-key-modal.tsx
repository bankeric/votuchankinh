"use client";

import { useTranslation } from "react-i18next";
import { 
  CheckCircle, 
  Eye, 
  EyeOff, 
  Copy, 
  Download, 
  AlertTriangle 
} from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { ApiKey } from "@/interfaces/api-key";

interface NewApiKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiKey: ApiKey | null;
  fullKey: string | null;
  showFullKey: boolean;
  onToggleKeyVisibility: () => void;
  onCopyKey: (key: string) => void;
  onDownloadJson: (apiKey: ApiKey, fullKey: string) => void;
  onClose: () => void;
  formatDate: (dateString: string) => string;
  getStatusBadge: (status: string) => React.ReactNode;
}

export function NewApiKeyModal({
  open,
  onOpenChange,
  apiKey,
  fullKey,
  showFullKey,
  onToggleKeyVisibility,
  onCopyKey,
  onDownloadJson,
  onClose,
  formatDate,
  getStatusBadge
}: NewApiKeyModalProps) {
  const { t } = useTranslation();
  console.log('open', open);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            {t("admin.apiKey.modals.newKey.title")}
          </DialogTitle>
          <DialogDescription>{t("admin.apiKey.modals.newKey.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          {/* API Key Information */}
          {apiKey && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-3">{t("admin.apiKey.modals.newKey.keyInformation")}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">{t("admin.apiKey.modals.newKey.name")}:</span>
                  <p className="text-gray-900">{apiKey.name}</p>
                </div>
                {apiKey.description && (
                  <div>
                    <span className="font-medium text-gray-700">{t("admin.apiKey.modals.newKey.description")}:</span>
                    <p className="text-gray-900">{apiKey.description}</p>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">{t("admin.apiKey.modals.newKey.status")}:</span>
                  <div className="mt-1">{getStatusBadge(apiKey.status)}</div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t("admin.apiKey.modals.newKey.permissions")}:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {apiKey.permissions && apiKey.permissions.map((permission: string) => (
                      <Badge key={permission} variant="outline" className="text-xs">
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">{t("admin.apiKey.modals.newKey.created")}:</span>
                  <p className="text-gray-900">{formatDate(apiKey.created_at)}</p>
                </div>
                {apiKey.expires_at && (
                  <div>
                    <span className="font-medium text-gray-700">{t("admin.apiKey.modals.newKey.expires")}:</span>
                    <p className="text-gray-900">{formatDate(apiKey.expires_at)}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* API Key Input */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium text-gray-700">
                {t("admin.apiKey.modals.newKey.copyInstructions")}
              </Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleKeyVisibility}
                className="text-gray-600 hover:text-gray-900"
              >
                {showFullKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <span className="ml-1 text-xs">
                  {showFullKey ? t("admin.apiKey.modals.newKey.hideKey") : t("admin.apiKey.modals.newKey.showKey")}
                </span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={showFullKey ? fullKey || "" : "pk_•••••••••••••••••••••••••••••"}
                readOnly
                className="font-mono text-sm bg-white"
                placeholder="API key will appear here..."
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => fullKey && onCopyKey(fullKey)}
                className="flex items-center gap-1"
              >
                <Copy className="w-4 h-4" />
                <span className="text-xs">{t("admin.apiKey.modals.newKey.copy")}</span>
              </Button>
              {apiKey && fullKey && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDownloadJson(apiKey, fullKey)}
                  className="flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  <span className="text-xs">{t("admin.apiKey.modals.newKey.downloadJson")}</span>
                </Button>
              )}
            </div>
          </div>

          {/* Security Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-900 mb-1">{t("admin.apiKey.modals.newKey.securityWarning")}</h4>
                <p className="text-sm text-yellow-800">
                  {t("admin.apiKey.modals.newKey.securityMessage")}
                </p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            {t("admin.apiKey.modals.newKey.close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 