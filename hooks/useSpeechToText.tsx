// hooks/useSpeechToText.ts
import { useEffect, useRef, useState } from 'react'

// Add type declaration for SpeechRecognition
interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  stop: () => void
  onresult: (event: SpeechRecognitionEvent) => void
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string
      }
    }
    length: number
  }
}

interface UseSpeechToTextProps {
  lang?: string
  onResult?: (text: string) => void
}

export function useSpeechToText({
  lang = 'vi-VN',
  onResult
}: UseSpeechToTextProps) {
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const [isListening, setIsListening] = useState(false)

  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      console.error('Speech Recognition API is not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = lang
    recognition.interimResults = true
    recognition.continuous = true

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      onResult?.(transcript)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
    }
  }, [lang, onResult])

  const startListening = () => {
    if (!recognitionRef.current) return
    recognitionRef.current.start()
    setIsListening(true)
  }

  const stopListening = () => {
    if (!recognitionRef.current) return
    recognitionRef.current.stop()
    setIsListening(false)
  }

  return { isListening, startListening, stopListening }
}
