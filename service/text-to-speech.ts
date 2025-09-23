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
  private currentAudio: HTMLAudioElement | null = null
  private audioQueue: HTMLAudioElement[] = []
  private isPlaying: boolean = false
  private isPaused: boolean = false
  private currentText: string = ''
  private currentSentenceIndex: number = 0
  private sentences: string[] = []
  private pausedResolve: (() => void) | null = null

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
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

  async playLargeTextAudio(
    text: string,
    onProgress?: (progress: number) => void,
    onEnd?: () => void,
    onStart?: () => void,
    onError?: (error: string) => void,
    options: Partial<TTSRequest> = {}
  ): Promise<void> {
    // Set current text and reset state only if it's a new text
    if (this.currentText !== text) {
      this.currentText = text
      this.currentSentenceIndex = 0
      
      // Split the text into sentences
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
      this.sentences = sentences
    }

    // Initialize progress tracking
    let totalProcessed = 0
    const totalLength = text.length
    
    // Calculate how much text we've already processed
    for (let j = 0; j < this.currentSentenceIndex; j++) {
      totalProcessed += this.sentences[j]?.length || 0
    }

    // Process each sentence sequentially starting from currentSentenceIndex
    for (let i = this.currentSentenceIndex; i < this.sentences.length; i++) {
      this.currentSentenceIndex = i
      const sentence = this.sentences[i].trim()
      if (!sentence) continue

      // Check if we need to pause
      if (this.isPaused) {
        await new Promise<void>((resolve) => {
          this.pausedResolve = resolve
        })
      }

      // Check if stopped
      if (!this.isPlaying && !this.isPaused) {
        break
      }

      // Update progress based on how much text we've processed
      if (onProgress) {
        totalProcessed += sentence.length
        const progress = Math.round((totalProcessed / totalLength) * 100)
        onProgress(Math.min(progress, 95)) // Cap at 95% until fully complete
      }

      // Create a promise that resolves when the audio finishes playing
      await new Promise<void>((resolve, reject) => {
        // Process this sentence
        this.playBase64Audio(
          sentence,
          options,
          (i === 0 && this.currentSentenceIndex === 0) ? onStart : undefined, // Only call onStart for the very first chunk of new text
          () => {
            // When this chunk ends, resolve the promise to continue to the next chunk
            if (i === this.sentences.length - 1 && onEnd) onEnd() // Call onEnd for the last chunk
            resolve()
          },
          (error) => {
            if (onError) onError(error)
            reject(error)
          }
        )
      })
    }

    // All chunks processed
    if (onProgress) onProgress(100)
    this.currentText = ''
    this.currentSentenceIndex = 0
    this.sentences = []
    return
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
      // Only stop if this is a new text, not a resume
      if (this.currentText !== text) {
        this.stop()
        // Mark as playing
        this.isPlaying = true
        this.isPaused = false
      } else if (this.isPaused) {
        // This is a resume operation
        this.isPlaying = true
        this.isPaused = false
      } else {
        // Stop any existing audio first
        this.stop()
        // Mark as playing
        this.isPlaying = true
        this.isPaused = false
      }

      if (onStart) {
        onStart()
      }

      // Check if the text is too long and needs to be split
      if (text.length > 500) {
        // Adjust this threshold based on your needs
        console.log(
          'Long text detected, splitting into chunks for better performance'
        )

        return this.playLargeTextAudio(
          text,
          onProgress,
          onEnd,
          onStart,
          onError,
          options
        )
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
      const audio = createSafeAudioElement(
        audioBlob,
        () => {
          this.isPlaying = false
          this.isPaused = false
          this.currentAudio = null
          onEnd?.()
        },
        (error) => {
          this.isPlaying = false
          this.isPaused = false
          this.currentAudio = null
          onError?.(error)
        }
      )

      // Set current audio reference
      this.currentAudio = audio

      audio.play().catch((error) => {
        console.error('Error playing audio:', error)
        this.isPlaying = false
        this.isPaused = false
        this.currentAudio = null
        onError?.('Failed to play audio')
      })
    } catch (error) {
      console.error('Error in playAudioStream:', error)
      this.isPlaying = false
      this.isPaused = false
      this.currentAudio = null
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
      const audio = createSafeAudioElement(
        audioBlob,
        () => {
          // Only reset state if this is the current audio
          if (this.currentAudio === audio) {
            this.currentAudio = null
          }
          onEnd?.()
        },
        (error) => {
          // Only reset state if this is the current audio
          if (this.currentAudio === audio) {
            this.currentAudio = null
          }
          onError?.(error)
        }
      )

      // Set as current audio if we don't have one or for large text chunks
      if (!this.currentAudio) {
        this.currentAudio = audio
      }

      audio.play().catch((error) => {
        console.error('Error playing audio:', error)
        if (this.currentAudio === audio) {
          this.currentAudio = null
        }
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
      const token =
        localStorage.getItem('buddha-token') ||
        document.cookie
          .split('; ')
          .find((row) => row.startsWith('buddha-token='))
          ?.split('=')[1]
      return token || ''
    }
    return ''
  }

  // Audio Control Methods

  /**
   * Stop the currently playing audio
   */
  stop(): void {
    if (this.currentAudio) {
      this.currentAudio.pause()
      this.currentAudio.currentTime = 0
      this.currentAudio = null
    }

    // Stop all queued audio
    this.audioQueue.forEach((audio) => {
      audio.pause()
      audio.currentTime = 0
    })
    this.audioQueue = []

    this.isPlaying = false
    this.isPaused = false
    this.currentText = ''
    this.currentSentenceIndex = 0
    this.sentences = []

    // Resolve any pending pause promise
    if (this.pausedResolve) {
      this.pausedResolve()
      this.pausedResolve = null
    }
  }

  /**
   * Pause the currently playing audio
   */
  pause(): void {
    if (this.currentAudio && this.isPlaying) {
      this.currentAudio.pause()
      this.isPaused = true
      this.isPlaying = false
    }
  }

  /**
   * Resume the paused audio
   */
  resume(): void {
    if (this.currentAudio && this.isPaused) {
      this.currentAudio.play().catch((error) => {
        console.error('Error resuming audio:', error)
      })
      this.isPaused = false
      this.isPlaying = true

      // Resume any paused promise resolution
      if (this.pausedResolve) {
        this.pausedResolve()
        this.pausedResolve = null
      }
    } else if (this.isPaused && this.currentText && this.sentences.length > 0) {
      // If we're in a paused state with chunked text, continue from where we left off
      this.isPaused = false
      this.isPlaying = true
      
      if (this.pausedResolve) {
        this.pausedResolve()
        this.pausedResolve = null
      }
    }
  }

  /**
   * Get current playback time
   */
  getCurrentTime(): number {
    return this.currentAudio?.currentTime ?? 0
  }

  /**
   * Get total duration of current audio
   */
  getDuration(): number {
    return this.currentAudio?.duration ?? 0
  }

  /**
   * Check if audio is currently playing
   */
  getIsPlaying(): boolean {
    return this.isPlaying
  }

  /**
   * Check if audio is paused
   */
  getIsPaused(): boolean {
    return this.isPaused
  }

  /**
   * Get current text being played
   */
  getCurrentText(): string {
    return this.currentText
  }

  /**
   * Get current sentence index for large text playback
   */
  getCurrentSentenceIndex(): number {
    return this.currentSentenceIndex
  }
}

export const textToSpeechService = new TextToSpeechService()
export default textToSpeechService
