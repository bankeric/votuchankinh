"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Settings,
  MessageSquare,
  Save,
  Headphones,
  Book,
  Edit,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { TrainingMode } from "./training-mode";
import { GPTForm } from "./gpt-form";
import { KnowledgeUpload } from "./knowledge-upload";
import { useAgentStore } from "@/store/agent";
import { useTranslation } from "react-i18next";
import { GptPreviewPanel } from "./gpt-editor/gpt-preview-panel";
import { useKnowledgeStore } from "@/store/knowledge";
import { useTranslations } from "@/hooks/use-translations";
import { GPTFormCreate } from "./gpt-form-create";
import { appToast } from "@/lib/toastify";

interface GPTEditorProps {
  onSave: () => void;
}

export function GPTEditor({ onSave }: GPTEditorProps) {
  const { t } = useTranslation();
  const {
    selectedAgentId,
    agentsMap,
    formData,
    updateFormField,
    saveFormData,
    isFormDirty,
    isUpdating,
    createAgent,
  } = useAgentStore();
  const selectedAgent = selectedAgentId ? agentsMap[selectedAgentId] : null;
  const { language } = useTranslations();
  const { addKnowledge } = useKnowledgeStore();
  const [activeSection, setActiveSection] = useState<
    "training" | "create" | "edit" | "configure"
  >("training");

  const navigationButtons = [
    {
      section: "training" as const,
      icon: Headphones,
      translationKey: "gptEditor.sections.training",
    },
    {
      section: "create" as const,
      icon: MessageSquare,
      translationKey: "gptEditor.sections.create",
    },
    {
      section: "edit" as const,
      icon: Edit,
      translationKey: "gptEditor.sections.edit",
    },
    {
      section: "configure" as const,
      icon: Book, // Desktop default
      mobileIcon: Settings,
      translationKey: "gptEditor.sections.knowledge",
    },
  ];

  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleAddToSystemPrompt = (content: string) => {
    updateFormField("instructions", formData.instructions + "\n\n" + content);
  };

  const handleAddToKnowledge = (content: string, fileName: string) => {
    addKnowledge(content, fileName);
  };

  const handleSave = async () => {
    const isCreate = activeSection === "create";
    if (isCreate) {
      await createAgent(formData, language);
    } else if (selectedAgent?.uuid) {
      await saveFormData(selectedAgent.uuid, language);
      onSave();
    } else {
      appToast(t("gptEditor.errors.selectAgent"), {
        type: "error",
      });
    }
  };
  const [mobileChatMode, setMobileChatMode] = useState<"training" | "preview">("training");

  // Mobile layout - stack vertically
  if (isMobile) {
    return (
      <div className="flex flex-col h-[calc(100vh-120px)] overflow-hidden">
        {/* Header */}
        <div className="p-3 border-b bg-white">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-3">
            <div className="flex gap-1 overflow-x-auto">
              {navigationButtons.map((button) => {
                const IconComponent = button.icon || button.mobileIcon;
                return (
                  <Button
                    key={button.section}
                    variant={
                      activeSection === button.section ? "default" : "outline"
                    }
                    onClick={() => setActiveSection(button.section)}
                    className="gap-1 whitespace-nowrap"
                    size="sm"
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-xs">{t(button.translationKey)}</span>
                  </Button>
                );
              })}
            </div>
            {/* Save Button */}
            {isFormDirty && (
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="gap-1 w-full sm:w-auto mt-2 sm:mt-0"
                size="sm"
              >
                <Save className="w-4 h-4" />
                <span className="text-xs">{t("common.save")}</span>
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {activeSection === "training" ? (
            <>
            {mobileChatMode === "training" && (
              <TrainingMode
                isMobile={isMobile}
                onAddToSystemPrompt={handleAddToSystemPrompt}
                onAddToKnowledge={handleAddToKnowledge}
                onSetMobileChatMode={setMobileChatMode}
              />
            )}
            {mobileChatMode === "preview" && (
              <GptPreviewPanel isMobile={isMobile} onSetMobileChatMode={setMobileChatMode} />
            )}
            </>
          ) : activeSection === "create" ? (
            <GPTFormCreate />
          ) : activeSection === "edit" ? (
            selectedAgent && <GPTForm agent={selectedAgent} />
          ) : (
            <KnowledgeUpload isMobile={true} />
          )}
        </div>
      </div>
    );
  }

  // Desktop layout - side by side
  return (
    <div className="flex h-[calc(100vh-120px)] overflow-hidden">
      {/* Left Panel - Configuration */}
      <div className="w-1/2 border-r overflow-y-auto">
        <div className="p-4 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {navigationButtons.map((button) => {
                const IconComponent = button.icon;
                return (
                  <Button
                    key={button.section}
                    variant={
                      activeSection === button.section ? "default" : "outline"
                    }
                    onClick={() => setActiveSection(button.section)}
                    className="gap-2"
                  >
                    <IconComponent className="w-4 h-4" />
                    {t(button.translationKey)}
                  </Button>
                );
              })}
            </div>

            {isFormDirty && (
              <Button
                onClick={handleSave}
                disabled={isUpdating}
                className="gap-1"
                size="sm"
              >
                <Save className="w-4 h-4" />
                <span className="text-xs">{t("common.save")}</span>
              </Button>
            )}
          </div>
        </div>

        <div className="p-4">
          {activeSection === "training" ? (
            <TrainingMode
              isMobile={false}
              onSetMobileChatMode={() => {}}
              onAddToSystemPrompt={handleAddToSystemPrompt}
              onAddToKnowledge={handleAddToKnowledge}
            />
          ) : activeSection === "create" ? (
            <GPTFormCreate />
          ) : activeSection === "edit" ? (
            selectedAgent && <GPTForm agent={selectedAgent} />
          ) : (
            <KnowledgeUpload isMobile={false} />
          )}
        </div>
      </div>

      {/* Right Panel - Preview */}
      <GptPreviewPanel isMobile={false} onSetMobileChatMode={() => {}} />
    </div>
  );
}
