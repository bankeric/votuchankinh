"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { textToSpeechService, type TTSRequest } from "@/service/text-to-speech";
import { useVoiceStore } from "@/store/voice";
import { toast } from "react-toastify";

export default function TestTTSPage() {
  const { getVoiceSettings, setVoiceSettings } = useVoiceStore();
  const [text, setText] = useState("The real danger is not that computers start thinking like people, but that people start thinking like computers. Computers can only help us with simple tasks.");
  const [isReading, setIsReading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [voices, setVoices] = useState<string[]>([]);
  const [selectedVoice, setSelectedVoice] = useState('en-US-Standard-A');
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');
  const [speakingRate, setSpeakingRate] = useState(1.0);
  const [pitch, setPitch] = useState(0.0);
  const [volumeGain, setVolumeGain] = useState(0.0);
  const [useStreaming, setUseStreaming] = useState(true);
  const [healthStatus, setHealthStatus] = useState<boolean | null>(null);

  // Load available voices on component mount
  useEffect(() => {
    const loadVoices = async () => {
      try {
        const voicesData = await textToSpeechService.getAvailableVoices(selectedLanguage);
        setVoices(voicesData.voices);
      } catch (error) {
        console.error('Failed to load voices:', error);
        toast.error('Failed to load available voices');
      }
    };

    const checkHealth = async () => {
      try {
        const isHealthy = await textToSpeechService.checkHealth();
        setHealthStatus(isHealthy);
      } catch (error) {
        console.error('Health check failed:', error);
        setHealthStatus(false);
      }
    };

    loadVoices();
    checkHealth();
  }, [selectedLanguage]);

  const handleLanguageChange = async (language: string) => {
    setSelectedLanguage(language);
    try {
      const voicesData = await textToSpeechService.getAvailableVoices(language);
      setVoices(voicesData.voices);
      if (voicesData.voices.length > 0) {
        setSelectedVoice(voicesData.voices[0]);
      }
      
      // Load saved settings for this language
      const savedSettings = getVoiceSettings(language);
      setSpeakingRate(savedSettings.speakingRate);
      setPitch(savedSettings.pitch);
      setVolumeGain(savedSettings.volumeGain);
      setSelectedVoice(savedSettings.selectedVoice);
    } catch (error) {
      console.error('Failed to load voices for language:', error);
      toast.error('Failed to load voices for selected language');
    }
  };

  const handleSaveToVoiceStore = () => {
    setVoiceSettings(selectedLanguage, {
      selectedVoice,
      speakingRate,
      pitch,
      volumeGain,
    });
    toast.success('Settings saved to voice store!');
  };

  const handleReadText = () => {
    if (isReading) {
      setIsReading(false);
      return;
    }

    if (!text.trim()) {
      toast.error("Please enter some text to read");
      return;
    }

    setIsReading(true);
    setProgress(0);

    const options: Partial<TTSRequest> = {
      voice_name: selectedVoice,
      language_code: selectedLanguage,
      audio_encoding: 'MP3',
      speaking_rate: speakingRate,
      pitch: pitch,
      volume_gain_db: volumeGain,
      chunked: useStreaming,
    };

    if (useStreaming) {
      textToSpeechService.playAudioStream(
        text,
        options,
        () => {
          console.log("Started reading text");
          toast.info("Started reading text");
        },
        (progress: number) => {
          setProgress(progress);
          console.log(`Reading progress: ${progress}%`);
        },
        () => {
          setIsReading(false);
          setProgress(0);
          console.log("Finished reading text");
          toast.success("Finished reading text");
        },
        (error: string) => {
          setIsReading(false);
          setProgress(0);
          console.error("Text-to-speech error:", error);
          toast.error(`Failed to read text: ${error}`);
        }
      );
    } else {
      textToSpeechService.playBase64Audio(
        text,
        options,
        () => {
          console.log("Started reading text");
          toast.info("Started reading text");
        },
        () => {
          setIsReading(false);
          setProgress(0);
          console.log("Finished reading text");
          toast.success("Finished reading text");
        },
        (error: string) => {
          setIsReading(false);
          setProgress(0);
          console.error("Text-to-speech error:", error);
          toast.error(`Failed to read text: ${error}`);
        }
      );
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Text-to-Speech Test</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Status:</span>
              <div className={`w-3 h-3 rounded-full ${healthStatus === true ? 'bg-green-500' : healthStatus === false ? 'bg-red-500' : 'bg-yellow-500'}`} />
              <span className="text-sm">
                {healthStatus === true ? 'Healthy' : healthStatus === false ? 'Unhealthy' : 'Checking...'}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Text Input */}
          <div>
            <Label htmlFor="text-input" className="block text-sm font-medium mb-2">
              Text to Read
            </Label>
            <Textarea
              id="text-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to read..."
              className="min-h-[120px]"
            />
          </div>

          {/* Voice Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="language-select" className="block text-sm font-medium mb-2">
                Language
              </Label>
              <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en-US">English (US)</SelectItem>
                  <SelectItem value="vi-VN">Vietnamese</SelectItem>
                  <SelectItem value="es-ES">Spanish</SelectItem>
                  <SelectItem value="fr-FR">French</SelectItem>
                  <SelectItem value="de-DE">German</SelectItem>
                  <SelectItem value="ja-JP">Japanese</SelectItem>
                  <SelectItem value="ko-KR">Korean</SelectItem>
                  <SelectItem value="zh-CN">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="voice-select" className="block text-sm font-medium mb-2">
                Voice
              </Label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice} value={voice}>
                      {voice}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="method-select" className="block text-sm font-medium mb-2">
                Method
              </Label>
              <Select value={useStreaming ? 'streaming' : 'base64'} onValueChange={(value) => setUseStreaming(value === 'streaming')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="streaming">Streaming</SelectItem>
                  <SelectItem value="base64">Base64</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Audio Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="speaking-rate" className="block text-sm font-medium mb-2">
                Speaking Rate: {speakingRate}
              </Label>
              <input
                id="speaking-rate"
                type="range"
                min="0.25"
                max="4.0"
                step="0.25"
                value={speakingRate}
                onChange={(e) => setSpeakingRate(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="pitch" className="block text-sm font-medium mb-2">
                Pitch: {pitch}
              </Label>
              <input
                id="pitch"
                type="range"
                min="-20.0"
                max="20.0"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <Label htmlFor="volume" className="block text-sm font-medium mb-2">
                Volume Gain: {volumeGain}dB
              </Label>
              <input
                id="volume"
                type="range"
                min="-96.0"
                max="16.0"
                step="0.1"
                value={volumeGain}
                onChange={(e) => setVolumeGain(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
          
          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              onClick={handleReadText}
              disabled={isReading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isReading ? "Stop Reading" : "Read Text"}
            </Button>

            <Button
              onClick={handleSaveToVoiceStore}
              variant="outline"
              size="sm"
            >
              Save to Voice Store
            </Button>
            
            {isReading && (
              <div className="flex items-center gap-2">
                <div className="text-sm text-gray-600">Progress:</div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-sm font-medium">{Math.round(progress)}%</div>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            <p className="font-medium mb-2">API Information:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>This test uses Google Cloud Text-to-Speech API</li>
              <li>Streaming method provides real-time audio playback</li>
              <li>Base64 method returns complete audio data</li>
              <li>Make sure your backend API is running and configured</li>
              <li>Authentication is handled via JWT tokens</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 