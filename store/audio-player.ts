import { create } from 'zustand'

interface AudioPlayerState {
  currentPlayingMessageId: string | null
  isPlaying: boolean
  isPaused: boolean
  progress: number

  // Actions
  setCurrentPlaying: (messageId: string | null) => void
  setIsPlaying: (playing: boolean) => void
  setIsPaused: (paused: boolean) => void
  setProgress: (progress: number) => void
  stopAll: () => void
}

export const useAudioPlayerStore = create<AudioPlayerState>((set) => ({
  currentPlayingMessageId: null,
  isPlaying: false,
  isPaused: false,
  progress: 0,

  setCurrentPlaying: (messageId) => set({ currentPlayingMessageId: messageId }),
  setIsPlaying: (playing) => set({ isPlaying: playing }),
  setIsPaused: (paused) => set({ isPaused: paused }),
  setProgress: (progress) => set({ progress }),
  stopAll: () =>
    set({
      currentPlayingMessageId: null,
      isPlaying: false,
      isPaused: false,
      progress: 0
    })
}))
