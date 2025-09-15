"use client";

import React, { useState, useEffect } from "react";
import { Upload, X, Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Agent } from "@/interfaces/agent";
import { useTranslation } from "react-i18next";
import { useAgentStore } from "@/store/agent";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStateStore } from "@/store/app";

interface GPTFormProps {
  agent?: Agent;
  onFormChange?: (formData: any) => void;
}

export function GPTForm({ agent, onFormChange }: GPTFormProps) {
  const { t } = useTranslation();
  const {
    formData,
    isFormDirty,
    isUpdating,
    loadAgentIntoForm,
    updateFormField,
    addConversationStarter,
    updateConversationStarter,
    removeConversationStarter,
    addTag,
    removeTag,
    saveFormData,
  } = useAgentStore();

  const [newTag, setNewTag] = useState("");
  const { models } = useAppStateStore();
  // Load agent data into form when agent changes
  useEffect(() => {
    if (agent) {
      loadAgentIntoForm(agent);
    }
  }, [agent, loadAgentIntoForm]);

  // Notify parent component of form changes
  useEffect(() => {
    if (onFormChange) {
      onFormChange(formData);
    }
  }, [formData, onFormChange]);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      addTag(newTag.trim());
      setNewTag("");
    }
  };

  // const handleSaveForm = async () => {
  //   if (agent?.uuid) {
  //     await saveFormData(agent.uuid, language);
  //   }
  // };

  return (
    <div className="space-y-6">
      {/* GPT Name */}
      <div>
        <Label htmlFor="name" className="text-base font-medium">
          {t("gptEditor.form.name")}
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateFormField("name", e.target.value)}
          className="mt-1"
          placeholder={t("gptEditor.form.namePlaceholder")}
        />
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description" className="text-base font-medium">
          {t("gptEditor.form.description")}
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => updateFormField("description", e.target.value)}
          className="mt-1"
          placeholder={t("gptEditor.form.descriptionPlaceholder")}
          rows={2}
        />
      </div>

      {/* Icon Upload */}
      <div>
        <Label className="text-base font-medium">{t("gptEditor.form.icon")}</Label>
        <div className="mt-2 flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center">
            <span className="text-3xl">🙏</span>
          </div>
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            {t("gptEditor.form.uploadIcon")}
          </Button>
        </div>
      </div>

      {/* System Prompt / Instructions */}
      <div>
        <Label htmlFor="instructions" className="text-base font-medium">
          {t("gptEditor.form.instructions")}
        </Label>
        <Textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => updateFormField("instructions", e.target.value)}
          className="mt-1 font-mono text-sm"
          placeholder={t("gptEditor.form.instructionsPlaceholder")}
          rows={12}
        />
      </div>

      {/* Model */}
      <div>
        <Label className="text-base font-medium">{t("gptEditor.form.model")}</Label>
        <Select
          value={formData.model}
          onValueChange={(value) => updateFormField("model", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("gptEditor.form.modelPlaceholder")} />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.name} value={model.name}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Conversation Starters */}
      <div>
        <Label className="text-base font-medium">{t("gptEditor.form.conversationStarters")}</Label>
        <div className="mt-2 space-y-2">
          {formData.conversationStarters.map((starter, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={starter}
                onChange={(e) =>
                  updateConversationStarter(index, e.target.value)
                }
                placeholder={t("gptEditor.form.conversationStarterPlaceholder")}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeConversationStarter(index)}
                className="shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={addConversationStarter}
            disabled={formData.conversationStarters.length >= 4}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t("gptEditor.form.addConversationStarter")}
          </Button>
        </div>
      </div>

      {/* Tags */}
      <div>
        <Label className="text-base font-medium">{t("gptEditor.form.tags")}</Label>
        <div className="mt-2">
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="px-2 py-1 text-sm"
              >
                {tag}
                <X
                  className="w-3 h-3 ml-1 cursor-pointer"
                  onClick={() => removeTag(tag)}
                />
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder={t("gptEditor.form.addTagPlaceholder")}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (newTag.trim()) {
                  addTag(newTag.trim());
                  setNewTag("");
                }
              }}
              className="shrink-0"
            >
              <Tag className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
