'use client'

import React, { useEffect, useState } from 'react'
import { Bell, CheckCircle, Sparkles } from 'lucide-react'
import { appToast } from '@/lib/toastify'

interface MeditationNotificationProps {
  show: boolean
  onClose: () => void
}

export const MeditationNotification: React.FC<MeditationNotificationProps> = ({
  show,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      
      // Show browser notification if permission is granted
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('🎉 Hoàn thành tĩnh tâm!', {
          body: 'Bạn đã hoàn thành 30 phút tĩnh tâm. Hãy dành thời gian để cảm nhận sự bình an trong tâm hồn.',
          icon: '/images/giac-ngo-logo-6.png',
          badge: '/images/giac-ngo-logo-6.png',
          tag: 'meditation-complete',
          requireInteraction: true
        })
      }

      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={() => {
          setIsVisible(false)
          setTimeout(onClose, 300)
        }}
      />
      
      {/* Notification Card */}
      <div 
        className={`relative bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full transform transition-all duration-300 ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <div className="absolute -top-2 -right-2">
              <Sparkles className="w-6 h-6 text-yellow-500 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          🎉 Hoàn thành!
        </h2>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6 leading-relaxed">
          Bạn đã hoàn thành <strong>30 phút tĩnh tâm</strong>. 
          Hãy dành thời gian để cảm nhận sự bình an trong tâm hồn và 
          mang năng lượng tích cực này vào cuộc sống hàng ngày.
        </p>

        {/* Stats */}
        <div className="bg-green-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center text-sm">
            <span className="text-green-700">Thời gian tĩnh tâm:</span>
            <span className="font-semibold text-green-800">30:00</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-2">
            <span className="text-green-700">Trạng thái:</span>
            <span className="font-semibold text-green-800">Hoàn thành</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
            }}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Tuyệt vời!
          </button>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 300)
              // Navigate to meditation page to start new session
              window.location.href = '/meditate'
            }}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
          >
            Tĩnh tâm tiếp
          </button>
        </div>

        {/* Close button */}
        <button
          onClick={() => {
            setIsVisible(false)
            setTimeout(onClose, 300)
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default MeditationNotification

