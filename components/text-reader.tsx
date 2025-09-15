"use client";

import { Volume2 } from "lucide-react";
import { Button } from "./ui/button";
import { useTranslation } from "react-i18next";
import { useTranslations } from "@/hooks/use-translations";
import { useState } from "react";
import { textToSpeechService } from "@/service/text-to-speech";
import { useVoiceStore } from "@/store/voice";
import { toast } from "react-toastify";

interface TextReaderProps {
  text?: string;
}

export const TextReader = ({ text }: TextReaderProps) => {
  const [isReading, setIsReading] = useState(false);
  const { t } = useTranslation();
  const { language } = useTranslations();
  const { getVoiceSettings } = useVoiceStore();

  const handleReadText = () => {
    if (isReading) {
      // Stop reading if already in progress
      setIsReading(false);
      return;
    }

    const textToRead = text || "No text provided";

    if (!textToRead.trim()) {
      toast.error(t("chat.actions.noTextToRead") || "No text to read");
      return;
    }

    setIsReading(true);

    // Get voice settings based on current language
    const voiceSettings = getVoiceSettings(language === 'vi' ? 'vi-VN' : 'en-US');

    textToSpeechService.playAudioStream(
      textToRead,
      {
        voice_name: voiceSettings.selectedVoice,
        language_code: language === 'vi' ? 'vi-VN' : 'en-US',
        audio_encoding: 'MP3',
        speaking_rate: voiceSettings.speakingRate,
        pitch: voiceSettings.pitch,
        volume_gain_db: voiceSettings.volumeGain,
        chunked: true
      },
      () => {
        // onStart callback
        console.log("Started reading text");
      },
      (progress) => {
        // onProgress callback
        console.log(`Reading progress: ${progress}%`);
      },
      () => {
        // onEnd callback
        setIsReading(false);
        console.log("Finished reading text");
      },
      (error) => {
        // onError callback
        setIsReading(false);
        console.error("Text-to-speech error:", error);
        toast.error(t("chat.actions.readFailed") || "Failed to read text");
      }
    );
  };

  return (
    <Button
      variant="ghost"
      title={t("chat.actions.read")}
      size="sm"
      onClick={handleReadText}
      className="h-6 w-6 p-0 hover:bg-orange-100 text-orange-600 hover:text-orange-700"
      disabled={isReading}
    >
      <Volume2 className="h-3 w-3" />
    </Button>
  );
};
