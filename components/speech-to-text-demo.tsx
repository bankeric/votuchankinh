'use client'

import { useState } from 'react'
import { useSpeechToText } from '@/hooks/useSpeechToText'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mic, MicOff, Volume2 } from 'lucide-react'

export function SpeechToTextDemo() {
  const [transcript, setTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [language, setLanguage] = useState('vi-VN')

  const {
    isListening,
    isSupported,
    browserInfo,
    startListening,
    stopListening,
    toggleListening
  } = useSpeechToText({
    lang: language,
    onResult: (text, isFinal) => {
      if (isFinal) {
        setFinalTranscript((prev) => prev + ' ' + text)
        setTranscript('')
      } else {
        setTranscript(text)
      }
    },
    onError: (error) => {
      console.error('Speech to text error:', error)
      alert(error)
    },
    continuous: true,
    interimResults: true
  })

  const clearTranscript = () => {
    setTranscript('')
    setFinalTranscript('')
  }

  const getBrowserSupport = () => {
    if (browserInfo.isChrome) return { name: 'Chrome', support: 'Excellent' }
    if (browserInfo.isEdge) return { name: 'Edge', support: 'Good' }
    if (browserInfo.isFirefox) return { name: 'Firefox', support: 'Limited' }
    if (browserInfo.isSafari) return { name: 'Safari', support: 'Limited' }
    return { name: 'Unknown', support: 'Unknown' }
  }

  const supportInfo = getBrowserSupport()

  return (
    <div className='max-w-2xl mx-auto p-6 space-y-4'>
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Volume2 className='h-5 w-5' />
            Speech to Text Demo
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Browser Support Info */}
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>Browser:</span>
            <Badge variant='outline'>{supportInfo.name}</Badge>
            <Badge
              variant={
                supportInfo.support === 'Excellent'
                  ? 'default'
                  : supportInfo.support === 'Good'
                  ? 'secondary'
                  : 'destructive'
              }
            >
              {supportInfo.support}
            </Badge>
            <Badge variant={isSupported ? 'default' : 'destructive'}>
              {isSupported ? 'Supported' : 'Not Supported'}
            </Badge>
          </div>

          {/* Language Selection */}
          <div className='flex items-center gap-2'>
            <span className='text-sm font-medium'>Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className='px-3 py-1 border rounded-md'
              disabled={isListening}
            >
              <option value='vi-VN'>Vietnamese</option>
              <option value='en-US'>English (US)</option>
              <option value='en-GB'>English (UK)</option>
              <option value='zh-CN'>Chinese (Simplified)</option>
              <option value='ja-JP'>Japanese</option>
              <option value='ko-KR'>Korean</option>
            </select>
          </div>

          {/* Controls */}
          <div className='flex gap-2'>
            <Button
              onClick={toggleListening}
              disabled={!isSupported}
              variant={isListening ? 'destructive' : 'default'}
              className='flex items-center gap-2'
            >
              {isListening ? (
                <>
                  <MicOff className='h-4 w-4' />
                  Stop Listening
                </>
              ) : (
                <>
                  <Mic className='h-4 w-4' />
                  Start Listening
                </>
              )}
            </Button>

            <Button
              onClick={clearTranscript}
              variant='outline'
              disabled={!finalTranscript && !transcript}
            >
              Clear
            </Button>
          </div>

          {/* Status */}
          {isListening && (
            <div className='flex items-center gap-2 text-green-600'>
              <div className='w-2 h-2 bg-green-500 rounded-full animate-pulse'></div>
              <span className='text-sm'>Listening...</span>
            </div>
          )}

          {/* Transcripts */}
          <div className='space-y-2'>
            {/* Final Transcript */}
            {finalTranscript && (
              <div className='p-3 bg-gray-50 rounded-md'>
                <div className='text-xs font-medium text-gray-500 mb-1'>
                  Final Text:
                </div>
                <div className='text-sm'>{finalTranscript}</div>
              </div>
            )}

            {/* Interim Transcript */}
            {transcript && (
              <div className='p-3 bg-blue-50 rounded-md border-l-4 border-blue-400'>
                <div className='text-xs font-medium text-blue-600 mb-1'>
                  Live Transcription:
                </div>
                <div className='text-sm italic text-gray-700'>{transcript}</div>
              </div>
            )}
          </div>

          {/* Browser Specific Notes */}
          <div className='text-xs text-gray-500 space-y-1'>
            <p>
              <strong>Browser Notes:</strong>
            </p>
            <ul className='list-disc list-inside space-y-1'>
              <li>
                <strong>Chrome/Edge:</strong> Full support with continuous
                listening and interim results
              </li>
              <li>
                <strong>Firefox:</strong> Limited support, no continuous mode,
                manual restart required
              </li>
              <li>
                <strong>Safari:</strong> Limited support, may require user
                interaction to restart
              </li>
              <li>
                <strong>Mobile:</strong> Support varies by device and browser
              </li>
            </ul>
          </div>

          {/* Tips */}
          {!isSupported && (
            <div className='p-3 bg-red-50 border border-red-200 rounded-md'>
              <p className='text-red-700 text-sm'>
                Speech recognition is not supported in this browser. Please try
                using Chrome, Edge, or another compatible browser.
              </p>
            </div>
          )}

          {(browserInfo.isFirefox || browserInfo.isSafari) && (
            <div className='p-3 bg-yellow-50 border border-yellow-200 rounded-md'>
              <p className='text-yellow-700 text-sm'>
                <strong>Note:</strong> {supportInfo.name} has limited speech
                recognition support. You may need to click the microphone button
                multiple times to continue listening.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
