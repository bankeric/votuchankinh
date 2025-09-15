import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface VoiceSettings {
  selectedVoice: string;
  speakingRate: number;
  pitch: number;
  volumeGain: number;
}

interface VoiceStore {
  // Voice settings for different languages
  voiceSettings: Record<string, VoiceSettings>;
  
  // Actions
  setVoiceSettings: (languageCode: string, settings: Partial<VoiceSettings>) => void;
  getVoiceSettings: (languageCode: string) => VoiceSettings;
  resetVoiceSettings: (languageCode: string) => void;
  resetAllVoiceSettings: () => void;
}

// Default voice settings for different languages
const defaultVoiceSettings: Record<string, VoiceSettings> = {
  'en-US': {
    selectedVoice: 'en-US-Chirp3-HD-Aoede',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0,
  },
  'vi-VN': {
    selectedVoice: 'vi-VN-Chirp3-HD-Pulcherrima',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0,
  },
  'es-ES': {
    selectedVoice: 'es-ES-Standard-A',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0,
  },
  'fr-FR': {
    selectedVoice: 'fr-FR-Standard-A',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0,
  },
  'de-DE': {
    selectedVoice: 'de-DE-Standard-A',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0,
  },
  'ja-JP': {
    selectedVoice: 'ja-JP-Standard-A',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0,
  },
  'ko-KR': {
    selectedVoice: 'ko-KR-Standard-A',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0,
  },
  'zh-CN': {
    selectedVoice: 'zh-CN-Standard-A',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0,
  },
};

export const useVoiceStore = create<VoiceStore>()(
  persist(
    (set, get) => ({
      voiceSettings: defaultVoiceSettings,

      setVoiceSettings: (languageCode: string, settings: Partial<VoiceSettings>) => {
        set((state) => ({
          voiceSettings: {
            ...state.voiceSettings,
            [languageCode]: {
              ...state.voiceSettings[languageCode],
              ...settings,
            },
          },
        }));
      },

      getVoiceSettings: (languageCode: string): VoiceSettings => {
        const state = get();
        return state.voiceSettings[languageCode] || defaultVoiceSettings[languageCode] || defaultVoiceSettings['en-US'];
      },

      resetVoiceSettings: (languageCode: string) => {
        set((state) => ({
          voiceSettings: {
            ...state.voiceSettings,
            [languageCode]: defaultVoiceSettings[languageCode] || defaultVoiceSettings['en-US'],
          },
        }));
      },

      resetAllVoiceSettings: () => {
        set({ voiceSettings: defaultVoiceSettings });
      },
    }),
    {
      name: 'buddha-voice-settings',
      version: 1,
    }
  )
); 