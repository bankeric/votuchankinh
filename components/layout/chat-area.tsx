"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { WelcomeScreen } from "@/components/v2/chat/welcome-screen";
import { MainChatBubble } from "@/components/v2/chat/main-chat-bubble";
import { MessageRole, ChatMode } from "@/interfaces/chat";
import { generateBuddhistResponse } from "@/lib/buddha-ai";
import { now } from "@/lib/utils";
import { useChatStore } from "@/store/chat";
import { FileText, ImageIcon, Mic, MicOff, Send, Plus } from "lucide-react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useAppStateStore } from "@/store/app";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { useTranslation } from "react-i18next";
import { logging } from "@/lib/utils";
import useAgents from "@/hooks/use-agents";
import { appToast } from "@/lib/toastify";
import { useTranslations } from "@/hooks/use-translations";

const useChat = () => {
  const {
    chats,
    activeChatId,
    loadingChatId,
    setLoadingChatId,
    addMessage,
    updateLastMessage,
    updateActiveChatTitleAndCreateSection,
    setActiveChatId,
    setMessageId,
    isConversationMode,
    setIsConversationMode,
  } = useChatStore();

  const conversation = chats.find((chat) => chat.uuid === activeChatId);
  const messages = conversation?.messages || [];
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFileSubmenu, setShowFileSubmenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { language } = useTranslations();
  const { model } = useAppStateStore();
  const { currentAgent } = useAgents();
  const { t } = useTranslation();
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    value?: string
  ) => {
    e.preventDefault && e.preventDefault();
    logging("finalInput", value);
    const finalInput = value || input.trim();

    if (!finalInput || loadingChatId === conversation?.uuid) return;
    if (!currentAgent) {
      appToast(t("chat.noAgent"), {
        type: "error",
      });
      throw new Error(t("chat.noAgent"));
    }

    logging("finalInput", finalInput);
    if (!conversation) return;
    const userMessage = {
      uuid: crypto.randomUUID(),
      role: MessageRole.USER,
      content: finalInput,
      created_at: now(),
      agent_id: currentAgent.uuid,
    };
    // Add user message
    addMessage(conversation.uuid, userMessage);
    setInput("");

    // Add initial empty AI message
    const aiMessage = {
      uuid: crypto.randomUUID(),
      role: MessageRole.ASSISTANT,
      content: "",
      thought: "",
      created_at: now(),
      agent_id: currentAgent.uuid,
    };
    addMessage(conversation.uuid, aiMessage);

    try {
      setLoadingChatId(conversation.uuid);

      const messages = conversation.messages
        .filter((message) => message.content !== "default")
        .slice(0, 5)
        .map((message) => ({
          role: message.role,
          content: message.content,
        }));
      const uMess = {
        role: MessageRole.USER,
        content: userMessage.content,
        created_at: userMessage.created_at,
      };
      const payload = {
        sessionId: conversation.uuid,
        agentId: currentAgent.uuid,
        chatId: conversation.uuid,
        messages: [...messages, uMess],
        language: language,
        model: model,
        isConversationMode: isConversationMode,
      };
      logging(
        "updateActiveChatTitleAndCreateSection currentAgent.uuid",
        currentAgent.uuid
      );
      // Use the generator function to stream the response
      const response = await generateBuddhistResponse(payload, {
        updateCallback: (message: string) => {
          updateLastMessage(conversation.uuid, message, false);
        },
        updateThought: (message: string) => {
          updateLastMessage(conversation.uuid, message, true);
        },
        updateLastMessageId: (messageId: string) => {
          setMessageId(conversation.uuid, aiMessage.uuid, messageId);
        },
      });
      updateActiveChatTitleAndCreateSection(
        conversation.uuid,
        language,
        currentAgent.uuid
      );
      setActiveChatId(conversation.uuid);
      logging("updateActiveChatTitleAndCreateSection response", response);
    } catch (error) {
      console.error("Error in chat:", error);
      // Update the last message with an error message
      updateLastMessage(
        conversation.uuid,
        "I apologize, but I encountered an error while contemplating your question. Please try again, dear friend."
      );
    } finally {
      setLoadingChatId(null);
    }
  };

  return {
    conversation,
    messages,
    input,
    isRecording,
    handleSubmit,
    isLoading: loadingChatId,
    setInput,
  };
};

export function ChatArea() {
  const chat = useChat();
  const { language } = useTranslations();
  const { t } = useTranslation();

  if (!chat) return null;
  const { conversation, messages, input, handleSubmit, isLoading, setInput } =
    chat;

  const { isConversationMode, setIsConversationMode } = useChatStore();

  const handleConversationMode = (checked: boolean) => {
    setIsConversationMode(checked);
    // TODO: Implement conversation mode functionality
    console.log("Conversation mode toggled:", checked);
  };

  const [isRecording, setIsRecording] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showFileSubmenu, setShowFileSubmenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(".dropdown-container")) {
        setShowDropdown(false);
        setShowFileSubmenu(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  const placeholder = t("chat.placeholders.guidance");

  const handleVoiceToggle = () => {
    if (isRecording) {
      // Stop recording logic
      setIsRecording(false);
      // Here you would implement actual speech-to-text
      logging("Stopping voice recording...");
    } else {
      // Start recording logic
      setIsRecording(true);
      // Here you would implement actual speech-to-text
      logging("Starting voice recording...");
    }
  };

  const handleFileUpload = (type: string) => {
    setShowDropdown(false);
    setShowFileSubmenu(false);
    if (fileInputRef.current) {
      fileInputRef.current.accept =
        type === "image"
          ? "image/*"
          : type === "document"
          ? ".pdf,.doc,.docx,.txt"
          : "*/*";
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      logging("File selected:", file.name);
      // Here you would implement file upload logic
      setInput(input + ` [${t("chat.fileAttached")}: ${file.name}]`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        handleSubmit(e as any);
      }
    }
  };

  const handleSaveToSystemPrompt = (content: string) => {
    logging("Lưu vào system prompt:", content);
    // Hiển thị thông báo thành công
    alert(t("chat.systemPromptSaved"));
    // Trong thực tế, bạn sẽ gọi API để cập nhật system prompt
  };
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        <WelcomeScreen handleSubmit={handleSubmit} />

        {/* Input Area - Always visible */}
        <div className="bg-white border-t border-orange-200 p-3 md:p-4">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={(e) => handleSubmit(e)} className="relative">
              <div className="flex items-center gap-2">
                {/* File Upload Button */}
                <div className="relative dropdown-container">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="h-10 md:h-12 px-2 md:px-3 border-orange-200 hover:bg-orange-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>

                  {/* Main Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute bottom-12 md:bottom-14 left-0 bg-white border border-orange-200 rounded-lg shadow-lg p-2 min-w-32 md:min-w-56 z-10">
                      <div className="flex items-center justify-between w-full px-2 py-1">
                        <div className="flex items-center gap-2">
                          <Mic className="w-4 h-4" />
                          <span className="text-xs md:text-sm">
                            {t("chat.dropdown.conversationMode")}
                          </span>
                        </div>
                        <Switch
                          checked={isConversationMode}
                          onCheckedChange={handleConversationMode}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowFileSubmenu(!showFileSubmenu)}
                        className="w-full justify-start gap-2 text-xs md:text-sm"
                      >
                        <FileText className="w-4 h-4" />
                        {t("chat.dropdown.files")}
                      </Button>

                      {/* File Submenu */}
                      {showFileSubmenu && (
                        <div className="ml-4 mt-2 border-t border-orange-100 pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFileUpload("image")}
                            className="w-full justify-start gap-2 text-xs md:text-sm"
                          >
                            <ImageIcon className="w-4 h-4" />
                            {t("chat.fileTypes.image")}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleFileUpload("document")}
                            className="w-full justify-start gap-2 text-xs md:text-sm"
                          >
                            <FileText className="w-4 h-4" />
                            {t("chat.fileTypes.document")}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Text Input */}
                <div className="flex-1 relative">
                  <Textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                  />
                </div>

                {/* Voice Recording Button */}
                <Button
                  type="button"
                  onClick={handleVoiceToggle}
                  className={`h-10 md:h-12 px-3 md:px-4 rounded-2xl ${
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
                  disabled={!input.trim() || !!isLoading}
                  className="h-10 md:h-12 px-3 md:px-4 bg-orange-500 hover:bg-orange-600 rounded-2xl"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute -top-10 md:-top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs md:text-sm flex items-center gap-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  {t("chat.recording")}
                </div>
              )}
            </form>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      </div>
    );
  }
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  if (!conversation) return <></>;
  return (
    <div className="flex flex-col h-[94%]">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {conversation.messages && conversation.messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <p className="text-orange-600/70 font-light text-center p-10">
                {t("chat.readyToHelp")}
              </p>
            </div>
          )}
          {conversation.messages &&
            conversation.messages.length > 0 &&
            conversation.messages.map((message, index) => (
              <MainChatBubble
                key={message.uuid}
                message={message}
                isLastMessage={index === conversation.messages.length - 1}
                isLoading={!!isLoading}
                formatTime={formatTime}
              />
            ))}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-orange-200/50 bg-white/80 backdrop-blur-sm p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <div className="flex items-center gap-2">
              {/* File Upload Button */}
              <div className="relative dropdown-container">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="h-10 md:h-12 px-2 md:px-3 border-orange-200 hover:bg-orange-50"
                >
                  <Plus className="w-4 h-4" />
                </Button>

                {/* Main Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute bottom-12 md:bottom-14 left-0 bg-white border border-orange-200 rounded-lg shadow-lg p-2 min-w-32 md:min-w-56 z-10">
                    <div className="flex items-center justify-between w-full px-2 py-1">
                      <div className="flex items-center gap-2">
                        <Mic className="w-4 h-4" />
                        <span className="text-xs md:text-sm">
                          {t("chat.dropdown.conversationMode")}
                        </span>
                      </div>
                      <Switch
                        checked={isConversationMode}
                        onCheckedChange={handleConversationMode}
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFileSubmenu(!showFileSubmenu)}
                      className="w-full justify-start gap-2 text-xs md:text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      {t("chat.dropdown.files")}
                    </Button>

                    {/* File Submenu */}
                    {showFileSubmenu && (
                      <div className="ml-4 mt-2 border-t border-orange-100 pt-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileUpload("image")}
                          className="w-full justify-start gap-2 text-xs md:text-sm"
                        >
                          <ImageIcon className="w-4 h-4" />
                          {t("chat.fileTypes.image")}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFileUpload("document")}
                          className="w-full justify-start gap-2 text-xs md:text-sm"
                        >
                          <FileText className="w-4 h-4" />
                          {t("chat.fileTypes.document")}
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Text Input */}
              <div className="flex-1 relative">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  className="w-full resize-none rounded-2xl border border-orange-200 px-3 md:px-4 py-2 md:py-3 pr-4 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-[40px] md:min-h-[48px] max-h-24 md:max-h-32 text-sm md:text-base"
                />
              </div>

              {/* Voice Recording Button */}
              <Button
                type="button"
                onClick={handleVoiceToggle}
                className={`h-10 md:h-12 px-3 md:px-4 rounded-2xl ${
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
                disabled={!input.trim() || !!isLoading}
                className="h-10 md:h-12 px-3 md:px-4 bg-orange-500 hover:bg-orange-600 rounded-2xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute -top-10 md:-top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-xs md:text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                {t("chat.recording")}
              </div>
            )}
          </form>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
