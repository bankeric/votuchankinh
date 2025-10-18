'use client'

import axiosInstance, { getAuthToken } from '@/lib/axios'
import { useState, useRef } from 'react'
import { RealtimeAgent, RealtimeSession } from '@openai/agents/realtime'
import { motion } from 'framer-motion'
import { Mic } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function VoiceChatPage() {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const session = useRef<RealtimeSession | null>(null)

  const startSession = async () => {
    try {
      setLoading(true)
      console.log('Requesting ephemeral session from backend...')

      const resp = await axiosInstance.post('/api/v1/agents/voice', {
        model: 'gpt-4o-realtime-preview'
      })

      const agent = new RealtimeAgent({
        name: 'Assistant',
        instructions: 'You are a helpful assistant.'
      })
      session.current = new RealtimeSession(agent)
      // Automatically connects your microphone and audio output in the browser via WebRTC.
      try {
        await session.current.connect({
          // To get this ephemeral key string, you can run the following command or implement the equivalent on the server side:
          // curl -s -X POST https://api.openai.com/v1/realtime/client_secrets -H "Authorization: Bearer $OPENAI_API_KEY" -H "Content-Type: application/json" -d '{"session": {"type": "realtime", "model": "gpt-realtime"}}' | jq .value
          apiKey: resp.data.value
        })

        console.log('You are connected!')
        setConnected(true)
        setLoading(false)
      } catch (e) {
        console.error(e)
      }
    } catch (err) {
      console.error('Lỗi khởi tạo phiên:', err)
      setLoading(false)
    }
  }

  const stopSession = () => {
    if (!session.current) return
    session.current.close()
    setConnected(false)
    console.log('🔌 Đã ngắt kết nối.')
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-[#f4e4bc] via-[#e8d5a3] to-[#dcc48a] flex flex-col relative overflow-hidden'>
      <div
        className='absolute inset-0 opacity-10 pointer-events-none'
        style={{
          backgroundImage: `radial-gradient(circle, #d4af37 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }}
      ></div>

      <header className='absolute top-0 left-0 right-0 z-50 px-6 py-4'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <Link
            href='/ai'
            className='hover:opacity-70 transition-opacity'
          >
            <Image
              src='/images/giac-ngo-logo-6.png'
              alt='Giac Ngo'
              width={200}
              height={100}
              className='h-20 w-auto object-contain'
              priority
            />
          </Link>

          {/* <div className='flex items-center gap-3'>
            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className='bg-[#f3ead7] backdrop-blur-sm text-[#2c2c2c] font-serif text-sm rounded-2xl px-4 py-2 border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset] hover:bg-[#efe2c9] focus:outline-none transition-colors cursor-pointer'
            >
              {agents.map((a) => (
                <option
                  key={a.id}
                  value={a.id}
                >
                  {language === 'vi' ? a.name : a.nameEn}
                </option>
              ))}
            </select>

            <button
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className='bg-[#f3ead7] backdrop-blur-sm text-[#2c2c2c] font-serif text-sm rounded-2xl px-4 py-2 border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset] hover:bg-[#efe2c9] transition-colors'
            >
              {language === 'vi' ? 'EN' : 'VI'}
            </button>
          </div> */}
        </div>
      </header>

      <div className='flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-8 relative z-10'>
        <div className='w-full max-w-3xl mx-auto flex flex-col items-center'>
          <div className='relative mb-8'>
            <motion.button
              onClick={connected ? stopSession : startSession}
              className={`relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center transition-all duration-300 shadow-2xl`}
              animate={{
                scale: connected
                  ? [1, 1.05, 1]
                  : status === 'idle'
                  ? [1, 1.02, 1]
                  : 1
              }}
              transition={{
                duration: connected ? 0.8 : 2,
                repeat:
                  connected || status === 'idle' ? Number.POSITIVE_INFINITY : 0,
                ease: 'easeInOut'
              }}
            >
              {(connected || status !== 'idle') && (
                <>
                  <motion.div
                    className={`absolute inset-0 rounded-full opacity-40`}
                    animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY
                    }}
                  />
                  <motion.div
                    className={`absolute inset-0 rounded-full opacity-30`}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: 0.5
                    }}
                  />
                </>
              )}

              <Mic className='w-12 h-12 md:w-16 md:h-16 text-white relative z-10' />
            </motion.button>

            {connected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex items-center justify-center gap-1'
              >
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    className='w-1 bg-[#d4af37] rounded-full'
                    animate={{
                      height: [8, 24, 8]
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.08,
                      ease: 'easeInOut'
                    }}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
