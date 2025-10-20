'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Play, Pause, RotateCcw, X } from 'lucide-react'
import { appToast } from '@/lib/toastify'
import { useTranslations } from '@/hooks/use-translations'
import CountdownTimer from './countdown-timer'
import { MeditationNotification } from './meditation-notification'

interface TimerState {
  isRunning: boolean
  timeLeft: number
  totalTime: number
}

interface MeditationSession {
  id: string
  date: string
  duration: number
  completed: boolean
}

interface InlineMeditationProps {
  onClose: () => void
}

export function InlineMeditation({ onClose }: InlineMeditationProps) {
  const { t } = useTranslations()
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    timeLeft: 30 * 60, // 30 minutes in seconds
    totalTime: 30 * 60
  })
  
  const [showNotification, setShowNotification] = useState(false)
  const [sessions, setSessions] = useState<MeditationSession[]>([])
  const [showCountdownTimer, setShowCountdownTimer] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')} : ${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Start/stop timer
  const toggleTimer = () => {
    if (!timer.isRunning) {
      // Starting timer - show countdown timer
      setShowCountdownTimer(true)
      setTimer(prev => ({ ...prev, isRunning: true }))
    } else {
      // Stopping timer - hide countdown timer
      setShowCountdownTimer(false)
      setTimer(prev => ({ ...prev, isRunning: false }))
    }
  }

  // Reset timer
  const resetTimer = () => {
    setTimer({
      isRunning: false,
      timeLeft: 30 * 60,
      totalTime: 30 * 60
    })
    setShowNotification(false)
    setShowCountdownTimer(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
  }

  // Handle countdown timer completion
  const handleCountdownComplete = () => {
    setShowCountdownTimer(false)
    setShowNotification(true)
    
    // Save completed session
    const newSession: MeditationSession = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      duration: 30 * 60,
      completed: true
    }
    setSessions(prev => [newSession, ...prev])
    
    appToast(t('meditate.completedToast'), {
      type: 'success',
      autoClose: 5000
    })
    
    // Play notification sound
    if (audioRef.current) {
      audioRef.current.play().catch(console.error)
    }
    
    setTimer(prev => ({ ...prev, isRunning: false, timeLeft: 0 }))
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  return (
    <div className="flex flex-col flex-1 bg-[#f4eacf] relative">
      {/* Close button */}
      <Button
        onClick={onClose}
        variant="ghost"
        size="sm"
        className="absolute top-4 right-4 z-10 hover:bg-orange-200"
      >
        <X className="w-5 h-5" />
      </Button>

      {/* Meditation Content */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl mx-auto px-4 md:px-8">
          {/* Timer Display */}
          <div className="bg-[#efe0bd] border-2 border-[#2c2c2c] rounded-xl shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset] p-4 md:p-8 flex flex-col md:flex-row items-center md:items-center justify-between gap-4 md:gap-0 mb-6 md:mb-8">
            {/* Left text */}
            <div className="text-gray-700 text-base md:text-xl font-medium text-center md:text-left">
              {t('meditate.remaining')}
            </div>
            
            {/* Center timer */}
            <div className="flex items-center order-first md:order-none">
              {showCountdownTimer ? (
                <CountdownTimer 
                  initialMinutes={30} 
                  initialSeconds={0} 
                  onComplete={handleCountdownComplete}
                />
              ) : (
                <div className="text-gray-800 text-5xl md:text-7xl font-twk-everett font-normal">
                  {formatTime(timer.timeLeft)}
                </div>
              )}
            </div>
            
            {/* Right status */}
            <div className="text-gray-700 text-sm md:text-lg">
              {timer.isRunning ? t('meditate.status.running') : t('meditate.status.ready')}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex flex-col md:flex-row justify-center gap-3 md:gap-6">
            <Button
              onClick={toggleTimer}
              disabled={timer.timeLeft === 0}
              className={`w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold text-base md:text-lg transition-transform duration-200 border-2 border-[#2c2c2c] shadow-[0_6px_0_#00000040,0_0_0_4px_#00000010_inset] hover:scale-105 active:scale-95 ${
                timer.isRunning
                  ? 'bg-[#991b1b] hover:bg-[#7a1515] text-[#f6efe0]'
                  : 'bg-[#991b1b] hover:bg-[#7a1515] text-[#f6efe0]'
              }`}
            >
              {timer.isRunning ? (
                <>
                  <Pause className="w-6 h-6 mr-3" />
                  {t('meditate.pause')}
                </>
              ) : (
                <>
                  <Play className="w-6 h-6 mr-3" />
                  {t('meditate.start')}
                </>
              )}
            </Button>
            
            <Button
              onClick={resetTimer}
              className="w-full md:w-auto px-6 md:px-8 py-3 md:py-4 rounded-xl text-[#1f1f1f] bg-[#f3ead7] hover:bg-[#efe2c9] border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset] text-base md:text-lg"
            >
              <RotateCcw className="w-6 h-6 mr-3" />
              {t('meditate.reset')}
            </Button>
          </div>

          {/* Meditation Instructions */}
          {/* <div className="mt-12 text-center">
            <div className="bg-[#d4c4a0]/90 rounded-lg p-6 max-w-2xl mx-auto border border-[#c4b490]">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                🧘‍♀️ Hướng dẫn tĩnh tâm
              </h3>
              <div className="text-gray-700 space-y-2">
                <p>• Ngồi thẳng lưng, thả lỏng vai</p>
                <p>• Nhắm mắt hoặc nhìn xuống dưới</p>
                <p>• Tập trung vào hơi thở tự nhiên</p>
                <p>• Khi tâm tán loạn, nhẹ nhàng quay về hơi thở</p>
                <p>• Giữ tâm bình an và từ bi</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>

      {/* Hidden audio element for notification sound */}
      <audio ref={audioRef} preload="auto">
        <source src="/sounds/meditation-bell.mp3" type="audio/mpeg" />
        <source src="/sounds/meditation-bell.wav" type="audio/wav" />
      </audio>

      {/* Meditation Completion Notification */}
      <MeditationNotification 
        show={showNotification} 
        onClose={() => setShowNotification(false)} 
      />
    </div>
  )
}
