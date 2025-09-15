"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { useAuthStore } from "@/store/auth";
import { SelectVoice } from "../v2/admin/voice/select-voice";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { t } = useTranslations();
  const { user } = useAuthStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-orange-600" />
            {t('settings.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Profile Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-medium text-gray-900">
                {t('settings.profile')}
              </h3>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="email" className="text-sm text-gray-700">
                  {t('auth.email')}
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="mt-1 bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="role" className="text-sm text-gray-700">
                  {t('auth.role')}
                </Label>
                <Input
                  id="role"
                  value={user?.role || ''}
                  disabled
                  className="mt-1 bg-gray-50"
                />
              </div>
            </div>
          </div>

          <Separator />

          <SelectVoice/>
          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-orange-200 hover:bg-orange-50"
            >
              {t('common.close')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 