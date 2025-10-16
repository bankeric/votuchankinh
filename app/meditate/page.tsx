'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Pause, RotateCcw, Bell } from 'lucide-react'
import { appToast } from '@/lib/toastify'
import CountdownTimer from '@/components/meditation/countdown-timer'
import { MeditationNotification } from '@/components/meditation/meditation-notification'

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

export default function MeditatePage() {
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
    
    appToast('🎉 Chúc mừng! Bạn đã hoàn thành 30 phút tĩnh tâm!', {
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

  const progress = ((timer.totalTime - timer.timeLeft) / timer.totalTime) * 100

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      {/* Full Screen Timer - Like Image 1 */}
      <div className="w-full max-w-4xl mx-auto px-8">
        <div className="bg-black rounded-lg p-8 flex items-center justify-between">
          {/* Left text */}
          <div className="text-gray-300 text-xl font-medium">
            Tĩnh tâm còn lại:
          </div>
          
          {/* Center timer */}
          <div className="flex items-center">
            {showCountdownTimer ? (
              <CountdownTimer 
                initialMinutes={30} 
                initialSeconds={0} 
                onComplete={handleCountdownComplete}
              />
            ) : (
              <div className="text-white text-7xl font-twk-everett font-normal">
                {formatTime(timer.timeLeft)}
              </div>
            )}
          </div>
          
          {/* Right status */}
          <div className="text-gray-300 text-lg">
            {timer.isRunning ? 'Đang tĩnh tâm...' : 'Sẵn sàng'}
          </div>
        </div>

        {/* Control Buttons - Below timer */}
        <div className="flex justify-center space-x-6 mt-8">
          <Button
            onClick={toggleTimer}
            disabled={timer.timeLeft === 0}
            className={`px-12 py-4 rounded-full font-semibold text-lg transition-all duration-200 ${
              timer.isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {timer.isRunning ? (
              <>
                <Pause className="w-6 h-6 mr-3" />
                Tạm dừng
              </>
            ) : (
              <>
                <Play className="w-6 h-6 mr-3" />
                Bắt đầu
              </>
            )}
          </Button>
          
          <Button
            onClick={resetTimer}
            variant="outline"
            className="px-8 py-4 rounded-full border-gray-400 text-gray-300 hover:bg-gray-800 text-lg"
          >
            <RotateCcw className="w-6 h-6 mr-3" />
            Reset
          </Button>
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
