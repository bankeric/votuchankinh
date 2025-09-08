"use client";

import type React from "react";

import { useRef, useEffect } from "react";
import {
  Mic,
  MicOff,
  Send,
  Save,
  FileText,
  Plus,
  X,
  RefreshCw,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MessageBubble } from "../chat/message-bubble";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import { useTraining } from "@/hooks/useTraining";
import { useTranslation } from "react-i18next";
import { MessageRole, type Message } from "@/interfaces/chat";

interface TrainingModeProps {
  onAddToSystemPrompt: (content: string) => void;
  onAddToKnowledge: (content: string, fileName: string) => void;
  onSetMobileChatMode: (mode: "training" | "preview") => void;
  isMobile: boolean;
}

export function TrainingMode({
  onAddToSystemPrompt,
  onAddToKnowledge,
  onSetMobileChatMode,
  isMobile,
}: TrainingModeProps) {
  const { t, i18n } = useTranslation();
  const welcomeMessage = [
    {
      id: "welcome",
      role: MessageRole.ASSISTANT,
      content: t("training.welcome.message"),
      timestamp: new Date(),
      uuid: "welcome",
      parts: [
        {
          type: "text",
          text: t("training.welcome.message"),
        },
      ],
    },
  ];

  const {
    // State
    messages,
    setMessages,
    input,
    isRecording,
    editingMessage,
    editContent,
    fileName,
    showFileNameInput,
    showActionMenu,
    showFileMenu,
    loadingMessageId,
    
    // Actions
    handleResetChat,
    handleSubmit,
    handleApproveOrReject,
    handleVoiceToggle,
    handleSaveToPrompt,
    handleSaveToKnowledge,
    confirmSaveToKnowledge,
    handleEdit,
    saveEdit,
    cancelEdit,
    handleKeyDown,
    handleInputChange,
    convertToMessage,
    
    // Setters
   
    setEditContent,
    setFileName,
    setShowFileNameInput,
    setShowFileMenu,
    toggleActionMenu,
  } = useTraining(onAddToSystemPrompt, onAddToKnowledge);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    setMessages(welcomeMessage);
  }, [i18n.language, setMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleResetChatClick = () => {
    handleResetChat({
      id: "welcome",
      role: "system",
      content: t("training.welcome.message"),
      timestamp: new Date(),
      uuid: "welcome",
      parts: [
        {
          type: "text",
          text: t("training.welcome.message"),
        },
      ],
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2">
          <h2 className="font-medium">{t("training.header.title")}</h2>
          {isMobile && (
            <Button variant="default" size="sm" onClick={() => onSetMobileChatMode("preview")}>
              {t("training.header.preview")}
            </Button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleResetChatClick}
            className="text-xs gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            {t("training.header.reset")}
          </Button>
        </div>
      </div>

      {/* Messages Area - Fixed height with overflow */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          if (message.approvalRequest) {
            return (
              <div
                key={message.id}
                className="p-4 border rounded-lg bg-gray-50 flex flex-col gap-2"
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
                {/* buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApproveOrReject(message, true)}
                  >
                    {t("training.actions.approve")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApproveOrReject(message, false)}
                  >
                    {t("training.actions.reject")}
                  </Button>
                </div>
              </div>
            );
          }
          if (
            message.role === "system" &&
            message.id !== "welcome"
          ) {
            return null;
          }

          if (editingMessage === message.id) {
            return (
              <div
                key={message.id}
                className="p-4 border rounded-lg bg-gray-50"
              >
                <Textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full min-h-[100px]"
                />
                <div className="flex gap-2 mt-2 justify-end">
                  <Button variant="outline" size="sm" onClick={cancelEdit}>
                    {t("common.cancel")}
                  </Button>
                  <Button size="sm" onClick={() => saveEdit(message.id)}>
                    {t("common.save")}
                  </Button>
                </div>
              </div>
            );
          }

          // For regular messages, use MessageBubble with custom actions
          return (
            <div key={message.id} className="relative group">
              <MessageBubble
                message={convertToMessage(message)}
                isLoading={loadingMessageId === message.id}
              />

              {/* Only show actions for user messages or assistant messages */}
              {(message.role === "user" || message.role === "assistant") &&
                !message.saved && (
                  <div className="mt-1 flex justify-end">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleActionMenu(message.id)}
                        className="h-6 px-2 text-xs text-orange-600 hover:bg-orange-50"
                      >
                        {t("training.actions.options")}
                      </Button>
                      {showActionMenu === message.id && (
                        <div className="absolute right-0 mt-1 bg-white border rounded-md shadow-lg z-10 w-48">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveToPrompt(message.id)}
                            className="w-full justify-start text-xs px-3 py-2"
                          >
                            <Save className="w-3 h-3 mr-2" />
                            {t("training.actions.saveToPrompt")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSaveToKnowledge(message.id)}
                            className="w-full justify-start text-xs px-3 py-2"
                          >
                            <FileText className="w-3 h-3 mr-2" />
                            {t("training.actions.addToKnowledge")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(message.id)}
                            className="w-full justify-start text-xs px-3 py-2"
                          >
                            <Plus className="w-3 h-3 mr-2" />
                            {t("training.actions.edit")}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {message.saved && (
                <div className="mt-1 flex justify-end">
                  <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    {t("training.status.saved")}
                  </span>
                </div>
              )}

              {showFileNameInput === message.id && (
                <div className="mt-2 p-3 bg-white rounded border shadow-sm">
                  <Label htmlFor="fileName" className="text-xs font-medium">
                    {t("training.fileName.label")}
                  </Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="fileName"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      placeholder={t("training.fileName.placeholder")}
                      className="text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => confirmSaveToKnowledge(message.id)}
                    >
                      {t("common.save")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFileNameInput(null)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area - Fixed height container */}
      <div className="bg-white border-t border-orange-200 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-2">
              {/* File Upload Button */}
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFileMenu(!showFileMenu)}
                  className="h-12 px-3 border-orange-200 hover:bg-orange-50"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>

                {/* File Menu Dropdown */}
                {showFileMenu && (
                  <div className="absolute bottom-14 left-0 bg-white border border-orange-200 rounded-lg shadow-lg p-2 min-w-40 z-10">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFileMenu(false)}
                      className="w-full justify-start gap-2 text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      {t("training.fileTypes.document")}
                    </Button>
                  </div>
                )}
              </div>

              {/* Text Input - Fixed height container */}
              <div className="flex-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={t("training.placeholders.direct")}
                  className="w-full resize-none rounded-2xl border border-orange-200 px-4 py-3 pr-4 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  style={{
                    height: "48px",
                    overflow: "auto",
                  }}
                />
              </div>

              {/* Voice Recording Button */}
              <Button
                type="button"
                onClick={handleVoiceToggle}
                className={`h-12 px-4 rounded-2xl ${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {isRecording ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>

              {/* Send Button */}
              <Button
                type="submit"
                disabled={!input.trim() || !!loadingMessageId}
                className="h-12 px-4 bg-orange-500 hover:bg-orange-600 rounded-2xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                {t("training.status.recording")}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
