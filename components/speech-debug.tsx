'use client'

import { useState } from 'react'
import { useSpeechToText } from '@/hooks/useSpeechToText'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function SpeechDebugger() {
  const [logs, setLogs] = useState<string[]>([])
  const [transcript, setTranscript] = useState('')

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [`${timestamp}: ${message}`, ...prev].slice(0, 20))
  }

  const {
    isListening,
    isSupported,
    browserInfo,
    microphonePermission,
    startListening,
    stopListening
  } = useSpeechToText({
    lang: 'vi-VN',
    onResult: (text, isFinal) => {
      addLog(`📝 Result (${isFinal ? 'final' : 'interim'}): "${text}"`)
      setTranscript(text)
    },
    onError: (error) => {
      addLog(`❌ Error: ${error}`)
    },
    continuous: true,
    interimResults: true
  })

  const handleStart = () => {
    addLog('🚀 User clicked START')
    startListening()
  }

  const handleStop = () => {
    addLog('🛑 User clicked STOP')
    stopListening()
  }

  const clearLogs = () => {
    setLogs([])
    setTranscript('')
  }

  // Request microphone permission explicitly
  const requestMicPermission = async () => {
    try {
      addLog('🎤 Requesting microphone permission...')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      addLog('✅ Microphone permission granted')
      // Stop the stream immediately as we just needed permission
      stream.getTracks().forEach((track) => track.stop())
    } catch (error) {
      addLog(`❌ Microphone permission denied: ${error}`)
    }
  }

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-4'>
      <Card className='p-4'>
        <h2 className='text-xl font-bold mb-4'>
          🔍 Speech Recognition Debugger
        </h2>

        {/* Status Info */}
        <div className='grid grid-cols-2 gap-4 mb-4 text-sm'>
          <div>
            <strong>Support:</strong> {isSupported ? '✅ Yes' : '❌ No'}
          </div>
          <div>
            <strong>Listening:</strong>{' '}
            {isListening ? '🎤 Active' : '😴 Inactive'}
          </div>
          <div>
            <strong>Browser:</strong>{' '}
            {browserInfo.isChrome
              ? 'Chrome'
              : browserInfo.isFirefox
              ? 'Firefox'
              : browserInfo.isSafari
              ? 'Safari'
              : browserInfo.isEdge
              ? 'Edge'
              : 'Unknown'}
          </div>
          <div>
            <strong>Mic Permission:</strong>{' '}
            {microphonePermission === 'granted'
              ? '✅ Granted'
              : microphonePermission === 'denied'
              ? '❌ Denied'
              : microphonePermission === 'prompt'
              ? '⚠️ Prompt'
              : '❓ Unknown'}
          </div>
        </div>

        {/* Controls */}
        <div className='flex gap-2 mb-4'>
          <Button
            onClick={handleStart}
            disabled={!isSupported || isListening}
            variant={isListening ? 'secondary' : 'default'}
          >
            🚀 Start
          </Button>
          <Button
            onClick={handleStop}
            disabled={!isListening}
            variant='destructive'
          >
            🛑 Stop
          </Button>
          <Button
            onClick={requestMicPermission}
            variant='outline'
          >
            🎤 Request Mic Permission
          </Button>
          <Button
            onClick={clearLogs}
            variant='outline'
          >
            🧹 Clear Logs
          </Button>
        </div>

        {/* Current Transcript */}
        {transcript && (
          <div className='mb-4 p-3 bg-blue-50 border-l-4 border-blue-400'>
            <strong>Current Speech:</strong> {transcript}
          </div>
        )}

        {/* Debug Logs */}
        <div className='border rounded p-3 bg-gray-50 max-h-96 overflow-y-auto'>
          <strong className='block mb-2'>Debug Logs:</strong>
          {logs.length === 0 ? (
            <p className='text-gray-500 italic'>
              No logs yet. Click START to begin debugging.
            </p>
          ) : (
            <div className='space-y-1 font-mono text-sm'>
              {logs.map((log, index) => (
                <div
                  key={index}
                  className='text-gray-700'
                >
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Troubleshooting Tips */}
        <div className='mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded'>
          <strong>🔧 Troubleshooting Tips:</strong>
          <ul className='list-disc list-inside text-sm mt-2 space-y-1'>
            <li>Make sure microphone permission is granted</li>
            <li>Check if another app is using the microphone</li>
            <li>Try speaking immediately after clicking START</li>
            <li>On Firefox/Safari, recognition may stop after each phrase</li>
            <li>Check browser console for additional error messages</li>
            <li>Make sure you're on HTTPS (required for microphone access)</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}
