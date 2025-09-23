// hooks/useSpeechToText.tsx
import { useEffect, useRef, useState, useCallback } from 'react'

// Enhanced type declarations for better browser compatibility
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  serviceURI: string
  start: () => void
  stop: () => void
  abort: () => void
  onstart: ((event: Event) => void) | null
  onend: ((event: Event) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onspeechstart: ((event: Event) => void) | null
  onspeechend: ((event: Event) => void) | null
  onsoundstart: ((event: Event) => void) | null
  onsoundend: ((event: Event) => void) | null
  onaudiostart: ((event: Event) => void) | null
  onaudioend: ((event: Event) => void) | null
  onnomatch: ((event: SpeechRecognitionEvent) => void) | null
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string
  message: string
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionResultList {
  readonly length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean
  readonly length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
}

interface SpeechRecognitionAlternative {
  readonly transcript: string
  readonly confidence: number
}

interface UseSpeechToTextProps {
  lang?: string
  onResult?: (text: string, isFinal: boolean) => void
  onError?: (error: string) => void
  continuous?: boolean
  interimResults?: boolean
}

// Browser detection utilities
const getBrowserInfo = () => {
  const userAgent = navigator.userAgent
  const isChrome =
    /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor)
  const isFirefox = /Firefox/.test(userAgent)
  const isSafari = /Safari/.test(userAgent) && !/Chrome/.test(userAgent)
  const isEdge = /Edg/.test(userAgent)

  return { isChrome, isFirefox, isSafari, isEdge }
}

export function useSpeechToText({
  lang = 'vi-VN',
  onResult,
  onError,
  continuous = true,
  interimResults = true
}: UseSpeechToTextProps = {}) {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [browserInfo, setBrowserInfo] = useState(getBrowserInfo())
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [microphonePermission, setMicrophonePermission] = useState<
    PermissionState | 'unknown'
  >('unknown')

  // Check microphone permissions
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({
            name: 'microphone' as PermissionName
          })
          setMicrophonePermission(permission.state)

          permission.onchange = () => {
            setMicrophonePermission(permission.state)
            console.log('🎤 Microphone permission changed:', permission.state)
          }
        }
      } catch (error) {
        console.log('⚠️ Cannot check microphone permissions:', error)
        setMicrophonePermission('unknown')
      }
    }

    checkMicrophonePermission()
  }, [])

  // Check browser support and initialize
  useEffect(() => {
    const checkSupport = () => {
      // Primary support check
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition ||
        (window as any).msSpeechRecognition

      if (!SpeechRecognition) {
        console.warn('Speech Recognition API is not supported in this browser.')
        setIsSupported(false)
        onError?.(
          'Speech Recognition is not supported in this browser. Please use Chrome, Edge, or a compatible browser.'
        )
        return false
      }

      setIsSupported(true)
      return SpeechRecognition
    }

    const SpeechRecognition = checkSupport()
    if (!SpeechRecognition) return

    try {
      const recognition = new SpeechRecognition()

      // Enhanced configuration for better cross-browser compatibility
      recognition.lang = lang
      recognition.continuous = continuous
      recognition.interimResults = interimResults
      recognition.maxAlternatives = 3

      // Firefox-specific optimizations
      if (browserInfo.isFirefox) {
        recognition.continuous = false // Firefox works better with non-continuous mode
        recognition.interimResults = false // Firefox has issues with interim results
      }

      // Safari-specific optimizations
      if (browserInfo.isSafari) {
        recognition.continuous = false // Safari doesn't support continuous well
        recognition.interimResults = false // Safari has limited interim support
      }

      // Enhanced event handlers
      recognition.onstart = () => {
        console.log('🎤 Speech recognition started')
        setIsListening(true)
        // Clear any existing timeouts
        if (timeoutRef.current) clearTimeout(timeoutRef.current)
        if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current)
      }

      recognition.onend = () => {
        console.log('🛑 Speech recognition ended')
        setIsListening(false)

        // Only auto-restart if we're supposed to be continuous and on Firefox/Safari
        if (
          continuous &&
          (browserInfo.isFirefox || browserInfo.isSafari) &&
          recognitionRef.current
        ) {
          console.log(
            '🔄 Auto-restarting for continuous mode on',
            browserInfo.isFirefox ? 'Firefox' : 'Safari'
          )
          restartTimeoutRef.current = setTimeout(() => {
            if (recognitionRef.current && !isListening) {
              try {
                recognitionRef.current.start()
              } catch (e) {
                console.warn('❌ Failed to restart recognition:', e)
              }
            }
          }, 500) // Increased delay for better stability
        }
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error(
          '❌ Speech recognition error:',
          event.error,
          event.message
        )
        setIsListening(false)

        // Handle different error types
        switch (event.error) {
          case 'network':
            onError?.('Network error. Please check your internet connection.')
            break
          case 'not-allowed':
            onError?.(
              'Microphone access denied. Please allow microphone permissions.'
            )
            break
          case 'no-speech':
            console.log('⚠️ No speech detected, will restart if continuous')
            // Don't treat no-speech as an error, just restart
            if (continuous && recognitionRef.current) {
              setTimeout(() => {
                if (recognitionRef.current && !isListening) {
                  try {
                    console.log('🔄 Restarting after no-speech')
                    recognitionRef.current.start()
                  } catch (e) {
                    console.warn('❌ Failed to restart after no-speech:', e)
                  }
                }
              }, 1000)
            }
            break
          case 'audio-capture':
            onError?.('No microphone found or microphone is not working.')
            break
          case 'aborted':
            console.log('⚠️ Speech recognition was aborted')
            // Don't treat abort as an error if we manually stopped
            break
          default:
            onError?.(`Speech recognition error: ${event.error}`)
        }
      }

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = ''
        let interimTranscript = ''

        // Process all results
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcript = result[0].transcript

          if (result.isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        // Send results based on what we have
        if (finalTranscript) {
          onResult?.(finalTranscript.trim(), true)

          // For Firefox/Safari, restart recognition after final result
          if (continuous && (browserInfo.isFirefox || browserInfo.isSafari)) {
            setTimeout(() => {
              if (recognitionRef.current && isListening) {
                try {
                  recognitionRef.current.start()
                } catch (e) {
                  console.warn('Failed to restart recognition:', e)
                }
              }
            }, 100)
          }
        } else if (interimTranscript && interimResults) {
          onResult?.(interimTranscript.trim(), false)
        }
      }

      // Additional handlers for better debugging
      recognition.onspeechstart = () => {
        console.log('🗣️ Speech detected')
      }

      recognition.onspeechend = () => {
        console.log('🤐 Speech ended')
      }

      recognition.onnomatch = () => {
        console.log('🤷 No speech match found')
      }

      recognition.onaudiostart = () => {
        console.log('🎵 Audio capture started')
      }

      recognition.onaudioend = () => {
        console.log('🔇 Audio capture ended')
      }

      recognition.onsoundstart = () => {
        console.log('🔊 Sound detected')
      }

      recognition.onsoundend = () => {
        console.log('🔇 Sound ended')
      }

      recognitionRef.current = recognition
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error)
      setIsSupported(false)
      onError?.(
        'Failed to initialize speech recognition. Your browser may not support this feature.'
      )
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current)
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
        } catch (e) {
          console.warn('Error stopping recognition on cleanup:', e)
        }
      }
    }
  }, [
    lang,
    onResult,
    onError,
    continuous,
    interimResults,
    browserInfo.isFirefox,
    browserInfo.isSafari
  ])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      console.error('❌ Cannot start: recognition not available')
      onError?.('Speech recognition is not available')
      return
    }

    if (isListening) {
      console.log('⚠️ Already listening, ignoring start request')
      return
    }

    // Clear any pending timeouts before starting
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current)

    try {
      console.log('🚀 Starting speech recognition...')
      console.log('📝 Config:', {
        lang: recognitionRef.current.lang,
        continuous: recognitionRef.current.continuous,
        interimResults: recognitionRef.current.interimResults,
        browser: browserInfo
      })

      recognitionRef.current.start()
    } catch (error) {
      console.error('❌ Failed to start speech recognition:', error)
      setIsListening(false)

      // Handle common start errors
      if (error instanceof Error) {
        if (error.message.includes('already started')) {
          console.log(
            '⚠️ Recognition already started, stopping and restarting...'
          )
          try {
            recognitionRef.current.stop()
            setTimeout(() => {
              if (recognitionRef.current) {
                recognitionRef.current.start()
              }
            }, 100)
          } catch (restartError) {
            console.error('❌ Failed to restart:', restartError)
            onError?.('Failed to restart speech recognition. Please try again.')
          }
        } else {
          onError?.('Failed to start speech recognition. Please try again.')
        }
      }
    }
  }, [isSupported, isListening, onError, browserInfo])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return

    try {
      console.log('🛑 Stopping speech recognition...')
      // Clear timeouts to prevent auto-restart
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current)

      recognitionRef.current.stop()
      setIsListening(false)
    } catch (error) {
      console.error('Failed to stop speech recognition:', error)
    }
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }, [isListening, startListening, stopListening])

  return {
    isListening,
    isSupported,
    browserInfo,
    microphonePermission,
    startListening,
    stopListening,
    toggleListening
  }
}
