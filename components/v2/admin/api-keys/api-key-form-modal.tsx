"use client";

import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateApiKeyRequest } from "@/interfaces/api-key";

interface ApiKeyFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  formData: CreateApiKeyRequest;
  onFormDataChange: (data: Partial<CreateApiKeyRequest>) => void;
  onSubmit: () => void;
  loading: boolean;
  permissions: Array<{ value: string; label: string }>;
}

export function ApiKeyFormModal({
  open,
  onOpenChange,
  mode,
  formData,
  onFormDataChange,
  onSubmit,
  loading,
  permissions
}: ApiKeyFormModalProps) {
  const { t } = useTranslation();

  const title = mode === 'create' 
    ? t("admin.apiKey.modals.create.title")
    : t("admin.apiKey.modals.edit.title");
  
  const description = mode === 'create'
    ? t("admin.apiKey.modals.create.description")
    : t("admin.apiKey.modals.edit.description");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">{t("admin.apiKey.form.name")}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => onFormDataChange({ name: e.target.value })}
              placeholder={t("admin.apiKey.form.namePlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="description">{t("admin.apiKey.form.description")}</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => onFormDataChange({ description: e.target.value })}
              placeholder={t("admin.apiKey.form.descriptionPlaceholder")}
            />
          </div>
          <div>
            <Label htmlFor="permissions">{t("admin.apiKey.form.permissions")}</Label>
            <Select
              value={formData.permissions?.join(",") || ""}
              onValueChange={(value) => onFormDataChange({ permissions: value ? value.split(",") : [] })}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("admin.apiKey.form.permissionsPlaceholder")} />
              </SelectTrigger>
              <SelectContent>
                {permissions.map((permission) => (
                  <SelectItem key={permission.value} value={permission.value}>
                    {permission.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="expires_at">{t("admin.apiKey.form.expiresAt")}</Label>
            <Input
              id="expires_at"
              type="datetime-local"
              value={formData.expires_at}
              onChange={(e) => onFormDataChange({ expires_at: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={onSubmit} disabled={loading}>
            {loading ? t("admin.apiKey.actions.loading") : t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 