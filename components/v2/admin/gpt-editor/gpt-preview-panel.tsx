import { Button } from "@/components/ui/button";
import { MessageBubble } from "../../chat/message-bubble";
import {
  ChevronUp,
  ChevronDown,
  RefreshCw,
  MessageSquare,
  Paperclip,
  ImageIcon,
  FileText,
  Mic,
  MicOff,
  Send,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useGptPreview } from "@/hooks/use-gpt-preview";
import { useAgentStore } from "@/store/agent";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export function GptPreviewPanel({ isMobile = false, onSetMobileChatMode }: { isMobile: boolean | undefined, onSetMobileChatMode: (mode: "training" | "preview") => void }) {
  const { t } = useTranslation();
  const { selectedAgentId, agentsMap } = useAgentStore();
  const selectedAgent = selectedAgentId ? agentsMap[selectedAgentId] : null;
  const {
    // State
    messages,
    loadingMessageId,
    showFileMenu,
    previewInput,
    isRecording,
    showPromptContext,
    previewTextareaRef,

    // Actions
    resetChat,
    handlePreviewSubmit,
    handlePreviewInputChange,
    handleKeyDown,
    handleVoiceToggle,
    toggleFileMenu,
    togglePromptContext,
    handleSelectAgent,
    handleSaveMessageToPrompt,
    setCurrentSessionId,
  } = useGptPreview();

  useEffect(() => {
    if (!selectedAgentId) {
      setCurrentSessionId(uuidv4());
    }
  }, []);

  return (
    <div className="w-full sm:w-1/2 flex flex-col bg-gray-50 h-full">
      <div className="p-4 border-b bg-white flex items-center justify-between">
        <h2 className="font-medium">{t("gptEditor.preview.title")}</h2>
        <div className="flex items-center gap-2">
          {/* create a dropdown selecting agent */}
          { !isMobile && selectedAgent && (
              <span className="font-medium mr-4">
                {selectedAgent?.name}
              </span>
          )}

          {!isMobile && selectedAgent && (
            <Button
              variant="outline"
              size="sm"
              onClick={togglePromptContext}
              className="text-xs gap-1"
            >
              {showPromptContext ? (
                <ChevronUp className="w-3 h-3" />
              ) : (
                <ChevronDown className="w-3 h-3" />
              )}
              {showPromptContext
                ? t("gptEditor.preview.hideContext")
                : t("gptEditor.preview.showContext")}
            </Button>
          )}

          {isMobile && (
            <Button variant="default" size="sm" onClick={() => onSetMobileChatMode("training")}>
              {t("gptEditor.preview.switchToTraining")}
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={resetChat}
            className="text-xs gap-1"
          >
            <RefreshCw className="w-3 h-3" />
            {t("gptEditor.preview.reset")}
          </Button>
        </div>
      </div>

      {showPromptContext && (
        <div className="p-3 bg-gray-100 border-b text-xs font-mono overflow-y-auto max-h-40">
          <p className="font-medium mb-1">
            {t("gptEditor.preview.systemPrompt")}:
          </p>
          <pre className="whitespace-pre-wrap">
            {selectedAgent?.system_prompt}
          </pre>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>{t("gptEditor.preview.noMessages")}</p>
              <p className="text-sm">
                {t("gptEditor.preview.sendMessageToStart")}
              </p>
              {selectedAgent && (
                <div className="text-sm">
                  {selectedAgent.conversation_starters?.map(
                    (starter, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={(e) =>
                          handlePreviewSubmit(
                            e as React.MouseEvent<HTMLButtonElement>,
                            starter
                          )
                        }
                        className="text-sm m-2"
                      >
                        {starter}
                      </Button>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.uuid}
              message={message}
              onSaveToSystemPrompt={handleSaveMessageToPrompt}
              isLoading={loadingMessageId === message.uuid}
            />
          ))
        )}
      </div>

      <div className="bg-white border-t border-orange-200 p-4">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handlePreviewSubmit} className="relative">
            <div className="flex items-center gap-2">
              {/* File Upload Button */}
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleFileMenu}
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
                      onClick={toggleFileMenu}
                      className="w-full justify-start gap-2 text-sm"
                    >
                      <ImageIcon className="w-4 h-4" />
                      {t("gptEditor.fileTypes.image")}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleFileMenu}
                      className="w-full justify-start gap-2 text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      {t("gptEditor.fileTypes.document")}
                    </Button>
                  </div>
                )}
              </div>

              {/* Text Input - Fixed height */}
              <div className="flex-1">
                <textarea
                  ref={previewTextareaRef}
                  value={previewInput}
                  onChange={handlePreviewInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={t("gptEditor.preview.inputPlaceholder")}
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
                disabled={!previewInput.trim() || !!loadingMessageId}
                className="h-12 px-4 bg-orange-500 hover:bg-orange-600 rounded-2xl"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                {t("gptEditor.preview.recording")}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
