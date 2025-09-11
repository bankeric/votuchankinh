import { useState, useEffect, useCallback } from 'react'

export interface VoiceSettings {
  selectedVoice: string
  speakingRate: number
  pitch: number
  volumeGain: number
}

// Default voice settings for different languages
const defaultVoiceSettings: Record<string, VoiceSettings> = {
  'en-US': {
    selectedVoice: 'en-US-Chirp3-HD-Aoede',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0
  },
  'vi-VN': {
    selectedVoice: 'vi-VN-Chirp3-HD-Pulcherrima',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0
  },
  'es-ES': {
    selectedVoice: 'es-ES-Standard-A',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0
  },
  'fr-FR': {
    selectedVoice: 'fr-FR-Standard-A',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0
  },
  'de-DE': {
    selectedVoice: 'de-DE-Standard-A',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0
  },
  'ja-JP': {
    selectedVoice: 'ja-JP-Standard-A',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0
  },
  'ko-KR': {
    selectedVoice: 'ko-KR-Standard-A',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0
  },
  'zh-CN': {
    selectedVoice: 'zh-CN-Standard-A',
    speakingRate: 1.0,
    pitch: 0.0,
    volumeGain: 0.0
  }
}

// Storage key for local storage
const STORAGE_KEY = 'buddha-voice-settings'

export function useVoice() {
  const [voiceSettings, setVoiceSettings] = useState<
    Record<string, VoiceSettings>
  >(() => {
    // Initialize from localStorage if available
    try {
      if (!localStorage) return defaultVoiceSettings
      const storedSettings = localStorage.getItem(STORAGE_KEY)
      return storedSettings
        ? JSON.parse(storedSettings).state.voiceSettings
        : defaultVoiceSettings
    } catch (error) {
      console.log('Error parsing voice settings from localStorage:', error)
      return defaultVoiceSettings
    }
  })

  // Save to localStorage whenever voiceSettings changes
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ state: { voiceSettings }, version: 1 })
    )
  }, [voiceSettings])

  const updateVoiceSettings = useCallback(
    (languageCode: string, settings: Partial<VoiceSettings>) => {
      setVoiceSettings((prev) => ({
        ...prev,
        [languageCode]: {
          ...(prev[languageCode] ||
            defaultVoiceSettings[languageCode] ||
            defaultVoiceSettings['en-US']),
          ...settings
        }
      }))
    },
    []
  )

  const getVoiceSettings = useCallback(
    (languageCode: string): VoiceSettings => {
      return (
        voiceSettings[languageCode] ||
        defaultVoiceSettings[languageCode] ||
        defaultVoiceSettings['en-US']
      )
    },
    [voiceSettings]
  )

  const resetVoiceSettings = useCallback((languageCode: string) => {
    setVoiceSettings((prev) => ({
      ...prev,
      [languageCode]:
        defaultVoiceSettings[languageCode] || defaultVoiceSettings['en-US']
    }))
  }, [])

  const resetAllVoiceSettings = useCallback(() => {
    setVoiceSettings(defaultVoiceSettings)
  }, [])

  return {
    voiceSettings,
    setVoiceSettings: updateVoiceSettings,
    getVoiceSettings,
    resetVoiceSettings,
    resetAllVoiceSettings
  }
}
