"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "@/hooks/use-translations";
import { useVoiceStore, type VoiceSettings } from "@/store/voice";
import { textToSpeechService } from "@/service/text-to-speech";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Volume2, RotateCcw, Save, Play } from "lucide-react";
import { toast } from "react-toastify";

const SUPPORTED_LANGUAGES = [
  { code: "en-US", name: "English (US)" },
  { code: "vi-VN", name: "Vietnamese" },
  { code: "es-ES", name: "Spanish" },
  { code: "fr-FR", name: "French" },
  { code: "de-DE", name: "German" },
  { code: "ja-JP", name: "Japanese" },
  { code: "ko-KR", name: "Korean" },
  { code: "zh-CN", name: "Chinese" },
];

// Helper function to convert app language to voice language code
const getVoiceLanguageCode = (appLanguage: string): string => {
  switch (appLanguage) {
    case "vi":
      return "vi-VN";
    case "en":
      return "en-US";
    default:
      return "en-US";
  }
};

export const SelectVoice = ({ simple }: { simple?: boolean }) => {
  const { language, t } = useTranslations();
  const {
    voiceSettings,
    setVoiceSettings,
    getVoiceSettings,
    resetVoiceSettings,
  } = useVoiceStore();

  const [availableVoices, setAvailableVoices] = useState<string[]>([]);
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSettings, setCurrentSettings] = useState<
    VoiceSettings | undefined
  >();

  // Load available voices for the selected language
  useEffect(() => {
    const loadVoices = async () => {
      setIsLoadingVoices(true);
      try {
        const voicesData = await textToSpeechService.getAvailableVoices(
          getVoiceLanguageCode(language)
        );
        setAvailableVoices(voicesData.voices);
      } catch (error) {
        console.error("Failed to load voices:", error);
        toast.error(t("voice.failedToLoadVoices"));
        setAvailableVoices([]);
      } finally {
        setIsLoadingVoices(false);
      }
    };

    loadVoices();
  }, [language, t]);

  // Update current settings when language changes
  useEffect(() => {
    const voiceLanguageCode = getVoiceLanguageCode(language);
    setCurrentSettings(getVoiceSettings(voiceLanguageCode));
  }, [language, getVoiceSettings]);

  const handleVoiceChange = (voice: string) => {
    if (currentSettings) {
      setCurrentSettings({ ...currentSettings, selectedVoice: voice });
    }
  };

  const handleSpeakingRateChange = (rate: number) => {
    if (currentSettings) {
      setCurrentSettings({ ...currentSettings, speakingRate: rate });
    }
  };

  const handlePitchChange = (pitch: number) => {
    if (currentSettings) {
      setCurrentSettings({ ...currentSettings, pitch: pitch });
    }
  };

  const handleVolumeGainChange = (volume: number) => {
    if (currentSettings) {
      setCurrentSettings({ ...currentSettings, volumeGain: volume });
    }
  };

  const handleSaveSettings = () => {
    if (currentSettings) {
      const voiceLanguageCode = getVoiceLanguageCode(language);
      setVoiceSettings(voiceLanguageCode, currentSettings);
      toast.success(t("voice.settingsSaved"));
    }
  };

  const handleResetSettings = () => {
    const voiceLanguageCode = getVoiceLanguageCode(language);
    resetVoiceSettings(voiceLanguageCode);
    setCurrentSettings(getVoiceSettings(voiceLanguageCode));
    toast.info(t("voice.settingsReset"));
  };

  const handleTestVoice = () => {
    if (!currentSettings) return;

    const voiceLanguageCode = getVoiceLanguageCode(language);
    const testText =
      voiceLanguageCode === "vi-VN"
        ? t("voice.testText.vietnamese")
        : t("voice.testText.english");

    setIsPlaying(true);

    textToSpeechService.playAudioStream(
      testText,
      {
        voice_name: currentSettings.selectedVoice,
        language_code: voiceLanguageCode,
        audio_encoding: "MP3",
        speaking_rate: currentSettings.speakingRate,
        pitch: currentSettings.pitch,
        volume_gain_db: currentSettings.volumeGain,
        chunked: true,
      },
      () => {
        console.log("Started playing test audio");
      },
      (progress) => {
        console.log(`Test audio progress: ${progress}%`);
      },
      () => {
        setIsPlaying(false);
        console.log("Finished playing test audio");
      },
      (error) => {
        setIsPlaying(false);
        console.error("Test audio error:", error);
        toast.error(t("voice.failedToPlayTest", { error }));
      }
    );
  };

  if (!currentSettings) {
    return (
      <div className="space-y-4 px-4 sm:px-0">
        <Card>
          <CardContent className="p-4 sm:p-6">
            <p className="text-center">{t("voice.loading")}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-0">
      <Card>
        <CardHeader className="pb-4 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
            {t("voice.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
          <Separator />

          {/* Voice Selection */}
          <div className="space-y-2">
            <Label htmlFor="voice-select" className="text-sm font-medium block">
              {t("voice.voice")}
            </Label>
            <Select
              value={currentSettings.selectedVoice}
              onValueChange={handleVoiceChange}
              disabled={isLoadingVoices}
            >
              <SelectTrigger className="h-12 sm:h-10">
                <SelectValue
                  placeholder={
                    isLoadingVoices
                      ? t("voice.loadingVoices")
                      : t("voice.selectVoice")
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableVoices.map((voice) => (
                  <SelectItem key={voice} value={voice} className="py-3 sm:py-2">
                    {voice}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isLoadingVoices && (
              <p className="text-sm text-gray-500">
                {t("voice.loadingVoicesText")}
              </p>
            )}
          </div>
          {!simple && (
            <>
              <Separator />

              {/* Audio Settings */}
              <div className="space-y-6">
                <h3 className="text-base sm:text-sm font-medium">
                  {t("voice.audioSettings")}
                </h3>

                {/* Speaking Rate */}
                <div className="space-y-3">
                  <Label
                    htmlFor="speaking-rate"
                    className="text-sm font-medium block"
                  >
                    {t("voice.speakingRate")}: {currentSettings.speakingRate}
                  </Label>
                  <div className="space-y-2">
                    <input
                      id="speaking-rate"
                      type="range"
                      min="0.25"
                      max="4.0"
                      step="0.25"
                      value={currentSettings.speakingRate}
                      onChange={(e) =>
                        handleSpeakingRateChange(parseFloat(e.target.value))
                      }
                      className="w-full h-8 sm:h-6 appearance-none bg-gray-200 rounded-lg outline-none slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #f97316 0%, #f97316 ${
                          ((currentSettings.speakingRate - 0.25) / (4.0 - 0.25)) * 100
                        }%, #e5e7eb ${
                          ((currentSettings.speakingRate - 0.25) / (4.0 - 0.25)) * 100
                        }%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0.25</span>
                      <span>4.0</span>
                    </div>
                  </div>
                </div>

                {/* Pitch */}
                <div className="space-y-3">
                  <Label htmlFor="pitch" className="text-sm font-medium block">
                    {t("voice.pitch")}: {currentSettings.pitch}
                  </Label>
                  <div className="space-y-2">
                    <input
                      id="pitch"
                      type="range"
                      min="-20.0"
                      max="20.0"
                      step="0.1"
                      value={currentSettings.pitch}
                      onChange={(e) =>
                        handlePitchChange(parseFloat(e.target.value))
                      }
                      className="w-full h-8 sm:h-6 appearance-none bg-gray-200 rounded-lg outline-none slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #f97316 0%, #f97316 ${
                          ((currentSettings.pitch - (-20.0)) / (20.0 - (-20.0))) * 100
                        }%, #e5e7eb ${
                          ((currentSettings.pitch - (-20.0)) / (20.0 - (-20.0))) * 100
                        }%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>-20.0</span>
                      <span>20.0</span>
                    </div>
                  </div>
                </div>

                {/* Volume Gain */}
                <div className="space-y-3">
                  <Label htmlFor="volume-gain" className="text-sm font-medium block">
                    {t("voice.volumeGain")}: {currentSettings.volumeGain}dB
                  </Label>
                  <div className="space-y-2">
                    <input
                      id="volume-gain"
                      type="range"
                      min="-96.0"
                      max="16.0"
                      step="0.1"
                      value={currentSettings.volumeGain}
                      onChange={(e) =>
                        handleVolumeGainChange(parseFloat(e.target.value))
                      }
                      className="w-full h-8 sm:h-6 appearance-none bg-gray-200 rounded-lg outline-none slider-thumb"
                      style={{
                        background: `linear-gradient(to right, #f97316 0%, #f97316 ${
                          ((currentSettings.volumeGain - (-96.0)) / (16.0 - (-96.0))) * 100
                        }%, #e5e7eb ${
                          ((currentSettings.volumeGain - (-96.0)) / (16.0 - (-96.0))) * 100
                        }%, #e5e7eb 100%)`
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>-96.0</span>
                      <span>16.0</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Button
                  onClick={handleTestVoice}
                  disabled={isPlaying || isLoadingVoices}
                  variant="outline"
                  size="default"
                  className="h-12 sm:h-9 flex-1 sm:flex-none"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isPlaying ? t("voice.playing") : t("voice.testVoice")}
                </Button>

                <Button
                  onClick={handleSaveSettings}
                  size="default"
                  className="h-12 sm:h-9 bg-orange-600 hover:bg-orange-700 flex-1 sm:flex-none"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {t("voice.saveSettings")}
                </Button>

                <Button
                  onClick={handleResetSettings}
                  variant="outline"
                  size="default"
                  className="h-12 sm:h-9 flex-1 sm:flex-none"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t("voice.reset")}
                </Button>
              </div>

              {/* Current Settings Display */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium mb-3">
                  {t("voice.currentSettings", {
                    language: SUPPORTED_LANGUAGES.find(
                      (l) => l.code === getVoiceLanguageCode(language)
                    )?.name,
                  })}
                </h4>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <strong className="min-w-0 sm:min-w-[120px]">{t("voice.voiceLabel")}</strong>
                    <span className="break-all">{currentSettings.selectedVoice}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <strong className="min-w-0 sm:min-w-[120px]">{t("voice.speakingRateLabel")}</strong>
                    <span>{currentSettings.speakingRate}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <strong className="min-w-0 sm:min-w-[120px]">{t("voice.pitchLabel")}</strong>
                    <span>{currentSettings.pitch}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                    <strong className="min-w-0 sm:min-w-[120px]">{t("voice.volumeGainLabel")}</strong>
                    <span>{currentSettings.volumeGain}dB</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
