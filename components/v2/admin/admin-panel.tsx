"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Users,
  Sparkles,
  ArrowLeft,
  UserCog,
  Settings,
  Info,
  Key,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { GPTEditor } from "./gpt-editor";
import { UserFeedback } from "./user-feedback";
import { UserManagement } from "./user-management";
import { FileManagement } from "./file-management";
import { FinetuneSection } from "./finetune-section";
import { useAgentStore } from "@/store/agent";
import { useTranslation } from "react-i18next";
import { LanguageSwitcherButton } from "@/components/language-switcher";
import { logging } from "@/lib/utils";
import AgentSetting from "./agent-setting";
import { useTranslations } from "@/hooks/use-translations";
import { ApiKey } from "./api-key";
import AgentSelector from "@/components/agent-selector";
import { SelectVoice } from "./voice/select-voice";

export function AdminPanel() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("gpt-editor");
  const router = useRouter();
  const { language } = useTranslations();
  const { fetchAgents, selectedAgentId, agentsMap, setSelectedAgentId } =
    useAgentStore();
  const selectedAgent = agentsMap[selectedAgentId || ""];

  const handleAgentSelect = (agentId: string) => {
    setSelectedAgentId(agentId);
  };

  useEffect(() => {
    fetchAgents(language, true);
  }, [language]);

  const tabs = [
    {
      id: "gpt-editor",
      label: t("admin.tabs.gptEditor"),
      shortLabel: t("admin.tabs.gptEditorShort"),
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: "users",
      label: t("admin.tabs.qa"),
      shortLabel: t("admin.tabs.qaShort"),
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: "fine-tuning",
      label: t("admin.tabs.finetune"),
      shortLabel: t("admin.tabs.finetuneShort"),
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "user-management",
      label: t("admin.tabs.userManagement"),
      shortLabel: t("admin.tabs.userManagementShort"),
      icon: <UserCog className="w-4 h-4" />,
    },
    {
      id: "apiKey",
      label: t("admin.tabs.apiKey"),
      shortLabel: t("admin.tabs.apiKeyShort"),
      icon: <Key className="w-4 h-4" />,
    },
    {
      id: "setting",
      label: t("admin.tabs.setting"),
      shortLabel: t("admin.tabs.settingShort"),
      icon: <Settings className="w-4 h-4" />,
    },
  ];
  const tabsShowAgentButton = ["gpt-editor", "fine-tuning", "users"];
  
  const activeTabData = tabs.find(tab => tab.id === activeTab);
  
  const handleSaveGPT = () => {
    // Logic to save GPT configuration
    logging("Saving GPT configuration...");
  };

  return (
    <div className="size-full bg-gradient-to-br from-orange-50 to-yellow-50 p-3 md:p-6">
      <div className="max-w-7xl max-h-full mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-800 mb-2">
                {t("admin.header.title")}
              </h1>
              <p className="hidden sm:block text-sm md:text-base text-gray-600">
                {t("admin.header.subtitle")}
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="gap-2 border-orange-200 hover:bg-orange-50"
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 md:hidden" />
              <div className="w-4 h-4 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center">
                <span className="text-orange-700 text-xs">🙏</span>
              </div>
              <span className="hidden md:inline">
                {t("admin.header.backToChat")}
              </span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-3 sm:gap-0">
          {/* Mobile Dropdown */}
          <div className="block sm:hidden w-full">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {activeTabData?.icon}
                    <span>{activeTabData?.label}</span>
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {tabs.map((tab) => (
                  <SelectItem key={tab.id} value={tab.id}>
                    <div className="flex items-center gap-2">
                      {tab.icon}
                      <span>{tab.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:flex flex-row gap-1 md:gap-2 py-2">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className="gap-1 md:gap-2 whitespace-nowrap"
                size="sm"
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </Button>
            ))}
          </div>

          <div className="flex items-start gap-2 w-full sm:w-auto justify-between sm:justify-end">
            {tabsShowAgentButton.includes(activeTab) && (
              <AgentSelector
                value={selectedAgent}
                onSelectAgent={handleAgentSelect}
              />
            )}
            {/* Dropdown language selector */}
            <LanguageSwitcherButton />
          </div>
        </div>

        {/* GPT Editor */}
        {activeTab === "gpt-editor" && (
          <div className="bg-white rounded-lg border shadow-sm">
            <GPTEditor onSave={handleSaveGPT} />
          </div>
        )}

        {/* File Management & Finetune */}
        {activeTab === "fine-tuning" && (
          <div className="space-y-4 md:space-y-6">
            <FileManagement />
            <FinetuneSection />
          </div>
        )}

        {/* Q&A */}
        {activeTab === "users" && (
          <div className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader className="pb-0"></CardHeader>
              <CardContent>
                <UserFeedback />
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Management */}
        {activeTab === "user-management" && (
          <div className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <UserCog className="w-5 h-5" />
                  {t("admin.userManagement.title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UserManagement />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Setting */}
        {activeTab === "setting" && (
          <div className="space-y-4 md:space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
                  <Settings className="w-5 h-5" />
                  {t("admin.tabs.setting")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                  <SelectVoice />
              </CardContent>
            </Card>
          </div>
        )}

        {/* API Key */}
        {activeTab === "apiKey" && (
          <div className="space-y-4 md:space-y-6">
            <ApiKey />
          </div>
        )}
      </div>
    </div>
  );
}
