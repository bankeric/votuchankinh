import { getBackEndUrl } from '@/configs/config'
import { createSafeAudioElement, base64ToBlob } from '@/lib/utils'

export interface TTSRequest {
  text: string
  voice_name?: string
  language_code?: string
  audio_encoding?: string
  speaking_rate?: number
  pitch?: number
  volume_gain_db?: number
  chunked?: boolean
}

export interface TTSResponse {
  audio_base64?: string
  content_type?: string
  text_length?: number
  error?: string
}

export interface VoicesResponse {
  voices: string[]
  language_code: string
  count: number
}

class TextToSpeechService {
  private readonly baseUrl: string

  constructor() {
    this.baseUrl = getBackEndUrl()
  }

  async streamTextToSpeech(
    text: string,
    options: Partial<TTSRequest> = {},
    onProgress?: (progress: number) => void,
    onComplete?: (audioBlob: Blob) => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      const requestBody: TTSRequest = {
        text,
        voice_name: options.voice_name || 'en-US-Standard-A',
        language_code: options.language_code || 'en-US',
        audio_encoding: options.audio_encoding || 'MP3',
        speaking_rate: options.speaking_rate || 1.0,
        pitch: options.pitch || 0.0,
        volume_gain_db: options.volume_gain_db || 0.0,
        chunked: options.chunked !== false // default to true
      }

      const response = await fetch(`${this.baseUrl}/api/v1/tts/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const chunks: Uint8Array[] = []
      let totalBytes = 0

      while (true) {
        const { done, value } = await reader.read()

        if (done) break

        chunks.push(value)
        totalBytes += value.length

        // Call the onProgress callback with progress percentage
        if (onProgress) {
          // Estimate progress based on received bytes (this is approximate)
          const estimatedProgress = Math.min(
            (totalBytes / (text.length * 100)) * 100,
            95
          )
          onProgress(estimatedProgress)
        }
      }

      // Combine all chunks into a single blob
      const audioBlob = new Blob(chunks as BlobPart[], { type: 'audio/mpeg' })

      if (onProgress) {
        onProgress(100)
      }

      if (onComplete) {
        onComplete(audioBlob)
      }
    } catch (error) {
      console.error('Text-to-speech streaming error:', error)
      onError?.(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
    }
  }

  async getBase64Audio(
    text: string,
    options: Partial<TTSRequest> = {}
  ): Promise<TTSResponse> {
    try {
      const requestBody: TTSRequest = {
        text,
        voice_name: options.voice_name || 'en-US-Standard-A',
        language_code: options.language_code || 'en-US',
        audio_encoding: options.audio_encoding || 'MP3',
        speaking_rate: options.speaking_rate || 1.0,
        pitch: options.pitch || 0.0,
        volume_gain_db: options.volume_gain_db || 0.0
      }

      const response = await fetch(`${this.baseUrl}/api/v1/tts/base64`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.getAuthToken()}`
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: TTSResponse = await response.json()
      return data
    } catch (error) {
      console.error('Text-to-speech base64 error:', error)
      throw error
    }
  }

  async getAvailableVoices(
    languageCode: string = 'en-US'
  ): Promise<VoicesResponse> {
    try {
      const response = await fetch(
        `${this.baseUrl}/api/v1/tts/voices?language_code=${languageCode}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${this.getAuthToken()}`
          }
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: VoicesResponse = await response.json()
      return data
    } catch (error) {
      console.error('Get voices error:', error)
      throw error
    }
  }

  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/tts/health`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.getAuthToken()}`
        }
      })

      return response.ok
    } catch (error) {
      console.error('Health check error:', error)
      return false
    }
  }

  async playAudioStream(
    text: string,
    options: Partial<TTSRequest> = {},
    onStart?: () => void,
    onProgress?: (progress: number) => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      if (onStart) {
        onStart()
      }

      // Use base64 method instead of blob URLs to avoid CORS issues
      const data = await this.getBase64Audio(text, options)

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.audio_base64) {
        throw new Error('No audio data received')
      }

      // Convert base64 to audio blob using utility function
      const audioBlob = base64ToBlob(
        data.audio_base64,
        data.content_type || 'audio/mpeg'
      )

      // Create safe audio element with proper cleanup
      const audio = createSafeAudioElement(audioBlob, onEnd, onError)

      audio.play().catch((error) => {
        console.error('Error playing audio:', error)
        onError?.('Failed to play audio')
      })
    } catch (error) {
      console.error('Error in playAudioStream:', error)
      onError?.(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
    }
  }

  async playBase64Audio(
    text: string,
    options: Partial<TTSRequest> = {},
    onStart?: () => void,
    onEnd?: () => void,
    onError?: (error: string) => void
  ): Promise<void> {
    try {
      if (onStart) {
        onStart()
      }

      const data = await this.getBase64Audio(text, options)

      if (data.error) {
        throw new Error(data.error)
      }

      if (!data.audio_base64) {
        throw new Error('No audio data received')
      }

      // Convert base64 to audio blob using utility function
      const audioBlob = base64ToBlob(
        data.audio_base64,
        data.content_type || 'audio/mpeg'
      )

      // Create safe audio element with proper cleanup
      const audio = createSafeAudioElement(audioBlob, onEnd, onError)

      audio.play().catch((error) => {
        console.error('Error playing audio:', error)
        onError?.('Failed to play audio')
      })
    } catch (error) {
      console.error('Error in playBase64Audio:', error)
      onError?.(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
    }
  }

  private getAuthToken(): string {
    // Get token from cookies or localStorage
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken')
      return token || ''
    }
    return ''
  }
}

export const textToSpeechService = new TextToSpeechService()
export default textToSpeechService
