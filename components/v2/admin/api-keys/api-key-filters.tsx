"use client";

import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ApiKeyFilters } from "@/interfaces/api-key";

interface ApiKeyFiltersProps {
  filters: ApiKeyFilters;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onFiltersChange: (filters: Partial<ApiKeyFilters>) => void;
}

export function ApiKeyFiltersComponent({ 
  filters, 
  searchTerm, 
  onSearchChange, 
  onFiltersChange 
}: ApiKeyFiltersProps) {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t("admin.apiKey.filters.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {/* <Select 
            value={filters.status || ""} 
            onValueChange={(value) => onFiltersChange({ status: (value || undefined) as 'active' | 'inactive' | 'expired' | undefined })}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t("admin.apiKey.filters.statusFilter")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{t("admin.apiKey.filters.allStatuses")}</SelectItem>
              <SelectItem value="active">{t("admin.apiKey.form.statuses.active")}</SelectItem>
              <SelectItem value="inactive">{t("admin.apiKey.form.statuses.inactive")}</SelectItem>
              <SelectItem value="expired">{t("admin.apiKey.form.statuses.expired")}</SelectItem>
            </SelectContent>
          </Select> */}
          {/* <Select 
            value={filters.sortBy || ""} 
            onValueChange={(value) => onFiltersChange({ sortBy: (value || undefined) as 'name' | 'created_at' | 'last_used_at' | undefined })}
          >
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t("admin.apiKey.filters.sortBy")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">{t("admin.apiKey.filters.name")}</SelectItem>
              <SelectItem value="created_at">{t("admin.apiKey.filters.createdAt")}</SelectItem>
              <SelectItem value="last_used_at">{t("admin.apiKey.filters.lastUsed")}</SelectItem>
            </SelectContent>
          </Select> */}
        </div>
      </CardContent>
    </Card>
  );
} 