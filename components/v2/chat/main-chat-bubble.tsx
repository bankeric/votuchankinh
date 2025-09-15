"use client";

import { Card } from "@/components/ui/card";
import { cn, markdownToText } from "@/lib/utils";
import { MessageRole } from "@/interfaces/chat";
import { useTranslation } from "react-i18next";
import { useTranslations } from "@/hooks/use-translations";
import ReactMarkdown from "react-markdown";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Message } from "@/interfaces/chat";
import { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Copy,
  Volume2,
  Check,
  Send,
  ThumbsUpIcon,
} from "lucide-react";
import { toast } from "react-toastify";
import { messagesService } from "@/service/messages";
import { useAuthStore } from "@/store/auth";
import { useChatStore } from "@/store/chat";
import { textToSpeechService } from "@/service/text-to-speech";
import { useVoiceStore } from "@/store/voice";
import useAgents from "@/hooks/use-agents";
interface MainChatBubbleProps {
  message: Message;
  isLastMessage: boolean;
  isLoading: boolean;
  formatTime: (timestamp: number) => string;
}

export function MainChatBubble({
  message,
  isLastMessage,
  isLoading,
  formatTime,
}: MainChatBubbleProps) {
  const { user } = useAuthStore();
  const userId = user?.uuid;
  const { t } = useTranslation();
  const { updateMessage, activeChatId } = useChatStore();
  const { getVoiceSettings } = useVoiceStore();
  const { language } = useTranslations();
  const { agentsMap } = useAgents();

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [copied, setCopied] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [showProgressPopover, setShowProgressPopover] = useState(false);
  const handleThumbsUp = async () => {
    if (!activeChatId) return;
    try {
      // animate the thumbs up icon
      const thumbsUpIcon = document.querySelector(".thumbs-up-icon");
      if (thumbsUpIcon) {
        thumbsUpIcon.classList.add("animate-bounce");
      }
      setTimeout(() => {
        if (thumbsUpIcon) {
          thumbsUpIcon.classList.remove("animate-bounce");
        }
      }, 1000);
      const likedMessage = await messagesService.likeMessage(message.uuid);
      // update message state
      updateMessage(activeChatId, message.uuid, {
        like_user_ids: likedMessage.like_user_ids,
        dislike_user_ids: likedMessage.dislike_user_ids,
      });
    } catch (error) {
      console.error("Error liking message:", error);
    }
  };

  const handleThumbsDown = async () => {
    if (!activeChatId) return;
    try {
      // animate the thumbs down icon
      const thumbsDownIcon = document.querySelector(".thumbs-down-icon");
      if (thumbsDownIcon) {
        thumbsDownIcon.classList.add("animate-bounce");
      }
      setTimeout(() => {
        if (thumbsDownIcon) {
          thumbsDownIcon.classList.remove("animate-bounce");
        }
      }, 1000);
      const dislikedMessage = await messagesService.dislikeMessage(
        message.uuid
      );
      // update message state
      updateMessage(activeChatId, message.uuid, {
        like_user_ids: dislikedMessage.like_user_ids,
        dislike_user_ids: dislikedMessage.dislike_user_ids,
      });
    } catch (error) {
      console.error("Error disliking message:", error);
    }
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      toast.success(t("chat.actions.copied"));
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error(t("chat.actions.copyFailed"));
    }
  };

  const handleReadText = () => {
    const textToRead = markdownToText(message.content);
    console.log("textToRead", textToRead);
    if (isReading) {
      // Stop reading if already in progress
      setIsReading(false);
      return;
    }

    if (!textToRead.trim()) {
      toast.error(t("chat.actions.noTextToRead"));
      return;
    }

    setIsReading(true);

    // Get voice settings based on current language
    const voiceSettings = getVoiceSettings(
      language === "vi" ? "vi-VN" : "en-US"
    );

    textToSpeechService.playAudioStream(
      textToRead,
      {
        voice_name: voiceSettings.selectedVoice,
        language_code: language === "vi" ? "vi-VN" : "en-US",
        audio_encoding: "MP3",
        speaking_rate: voiceSettings.speakingRate,
        pitch: voiceSettings.pitch,
        volume_gain_db: voiceSettings.volumeGain,
        chunked: true,
      },
      () => {
        // onStart callback
        console.log("Started reading text");
        setReadingProgress(0);
      },
      (progress) => {
        // onProgress callback
        setReadingProgress(progress);
        setShowProgressPopover(true);
        console.log(`Reading progress: ${progress}%`);
      },
      () => {
        // onEnd callback
        setIsReading(false);
        setReadingProgress(0);
        setShowProgressPopover(false);
        console.log("Finished reading text");
      },
      (error) => {
        // onError callback
        setIsReading(false);
        setReadingProgress(0);
        setShowProgressPopover(false);
        console.error("Text-to-speech error:", error);
        toast.error(t("chat.actions.readFailed") || "Failed to read text");
      }
    );
  };

  const handleFeedbackSubmit = async () => {
    if (feedbackText.trim()) {
      try {
        await messagesService.updateMessage(message.uuid, {
          feedback: feedbackText.trim(),
        });
        toast.success(t("chat.feedback.submitted"));
        setFeedbackText("");
        setFeedbackModalOpen(false);
      } catch (error) {
        console.error("Error submitting feedback:", error);
        toast.error(t("chat.feedback.error"));
      }
    }
  };

  const handleFeedbackCancel = () => {
    setFeedbackText("");
    setFeedbackModalOpen(false);
  };

  const isMessageLiked = userId && message.like_user_ids?.includes(userId);
  const isMessageDisliked =
    userId && message.dislike_user_ids?.includes(userId);

  return (
    <>
      <div
        className={cn(
          "flex",
          message.role === MessageRole.USER ? "justify-end" : "justify-start"
        )}
      >
        <div
          className={cn(
            "max-w-[80%] space-y-2",
            message.role === MessageRole.USER ? "items-end" : "items-start"
          )}
        >
          <Card
            className={cn(
              "p-5 shadow-sm border-0",
              message.role === MessageRole.USER
                ? "bg-gradient-to-br from-orange-100 to-yellow-100 text-orange-900 ml-12"
                : "bg-white/90 backdrop-blur-sm border border-orange-200/50 mr-12"
            )}
          >
            {message.role === MessageRole.ASSISTANT && (
              <div className="flex items-center mb-4">
                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full mr-3 shadow-sm">
                  <span className="text-white text-lg">☸</span>
                </div>
                <span className="font-medium text-orange-800 font-serif">
                  {/* {t("app.title")} */}
                  {agentsMap[message.agent_id]?.name}
                </span>
              </div>
            )}
            <div className="prose prose-sm max-w-none">
              {message.thought && (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="thought" className="">
                    <AccordionTrigger className="w-1/3 text-sm text-orange-600 hover:text-orange-700 py-2 hover:no-underline">
                      {t("chat.messageBubble.showThoughtProcess")}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-4 rounded-lg text-sm md:text-base bg-orange-100 text-gray-800 leading-relaxed prose prose-sm max-w-none prose-headings:text-gray-800 prose-p:text-gray-800 prose-strong:text-gray-900 prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200">
                        <ReactMarkdown
                          components={{
                            pre: ({ node, ...props }) => (
                              <pre
                                style={{ whiteSpace: "pre-wrap" }}
                                {...props}
                              />
                            ),
                          }}
                        >
                          {message.thought}
                        </ReactMarkdown>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
              <div className="react-markdown-style m-0 leading-relaxed font-light text-base">
                <ReactMarkdown
                  components={{
                    pre: ({ node, ...props }) => (
                      <pre style={{ whiteSpace: "pre-wrap" }} {...props} />
                    ),
                    p: ({ node, ...props }) => (
                      <p className="whitespace-pre-wrap my-2" {...props} />
                    ),
                    li: ({ node, ...props }) => <li className="" {...props} />,
                    blockquote: ({ node, ...props }) => (
                      <blockquote
                        className="border-l-4 border-orange-500 pl-4 my-2 italic"
                        {...props}
                      />
                    ),
                    ol: ({ node, ...props }) => <ol className="" {...props} />,
                  }}
                >
                  {message.content === "default"
                    ? t("chat.defaultMessage")
                    : message.content}
                </ReactMarkdown>
              </div>
              {isLastMessage && isLoading && (
                <div className="flex space-x-1 mt-3">
                  <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse" />
                  <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse delay-150" />
                  <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse delay-300" />
                </div>
              )}
            </div>
          </Card>

          <div
            className={cn(
              "flex items-center gap-2 text-xs font-light",
              message.role === MessageRole.USER
                ? "justify-end"
                : "justify-start"
            )}
          >
            <span className="text-xs text-orange-500/70 px-2 font-light">
              {formatTime(new Date(message.created_at || "").getTime())}
            </span>

            {/* Action buttons - only show for assistant messages */}
            {message.role === MessageRole.ASSISTANT && (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  title={t("chat.actions.like")}
                  size="sm"
                  onClick={handleThumbsUp}
                  className={cn(
                    "h-6 w-6 p-0 hover:bg-orange-100 text-orange-600 hover:text-orange-700",
                    isMessageLiked &&
                      "bg-green-100 text-green-600 hover:text-green-700"
                  )}
                >
                  <ThumbsUp className={cn("h-3 w-3 thumbs-up-icon")} />
                </Button>
                <Button
                  variant="ghost"
                  title={t("chat.actions.dislike")}
                  size="sm"
                  onClick={handleThumbsDown}
                  className={cn(
                    "h-6 w-6 p-0 hover:bg-orange-100 text-orange-600 hover:text-orange-700",
                    isMessageDisliked &&
                      "bg-red-100 text-red-600 hover:text-red-700"
                  )}
                >
                  <ThumbsDown className={cn("h-3 w-3 thumbs-down-icon")} />
                </Button>
                <Button
                  variant="ghost"
                  title={t("chat.actions.feedback")}
                  size="sm"
                  onClick={() => setFeedbackModalOpen(true)}
                  className="h-6 px-1 text-xs hover:bg-orange-100 text-orange-600 hover:text-orange-700"
                >
                  <MessageSquare className="h-2 w-2 mr-1" />
                </Button>
                <Popover
                  open={showProgressPopover && isReading}
                  onOpenChange={setShowProgressPopover}
                >
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      title={t("chat.actions.read")}
                      size="sm"
                      onClick={handleReadText}
                      className={cn(
                        "h-6 w-6 p-0 hover:bg-orange-100 text-orange-600 hover:text-orange-700",
                        isReading && "bg-orange-100"
                      )}
                      disabled={isReading}
                    >
                      <Volume2
                        className={cn("h-3 w-3", isReading && "opacity-50")}
                      />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-2"
                    side="top"
                    align="center"
                  >
                    <div className="text-center">
                      <span className="text-xs text-gray-500">
                        {t("chat.actions.loading")}:
                      </span>
                      <span className="text-sm font-medium text-orange-700 ml-1">
                        {Math.round(readingProgress)}%
                      </span>
                    </div>
                  </PopoverContent>
                </Popover>
                <Button
                  variant="ghost"
                  title={t("chat.actions.copy")}
                  size="sm"
                  onClick={handleCopyText}
                  className="h-6 w-6 p-0 hover:bg-orange-100 text-orange-600 hover:text-orange-700"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feedback Modal */}
      <Dialog open={feedbackModalOpen} onOpenChange={setFeedbackModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-orange-900">
              {t("chat.feedback.modal.title")}
            </DialogTitle>
            <DialogDescription className="text-orange-700">
              {t("chat.feedback.modal.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder={t("chat.feedback.modal.placeholder")}
              className="min-h-[120px] border-orange-200 focus:border-orange-400"
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleFeedbackCancel}
              className="border-orange-300 text-orange-700 hover:bg-orange-50"
            >
              {t("common.cancel")}
            </Button>
            <Button
              onClick={handleFeedbackSubmit}
              disabled={!feedbackText.trim()}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Send className="h-4 w-4 mr-2" />
              {t("chat.feedback.modal.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* {message.uuid} <br />
      like_user_ids: {JSON.stringify(message.like_user_ids)} <br />
      dislike_user_ids: {JSON.stringify(message.dislike_user_ids)} <br />
      isMessageLiked: {isMessageLiked} <br />
      isMessageDisliked: {isMessageDisliked} <br /> */}
    </>
  );
}
