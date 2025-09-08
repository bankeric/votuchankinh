"use client"

import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"

interface VoiceRecorderProps {
  isRecording: boolean
  onToggleRecording: (recording: boolean) => void
}

export function VoiceRecorder({ isRecording, onToggleRecording }: VoiceRecorderProps) {
  const handleToggle = () => {
    if (isRecording) {
      // Stop recording logic here
      onToggleRecording(false)
    } else {
      // Start recording logic here
      onToggleRecording(true)
    }
  }

  return (
    <Button
      type="button"
      onClick={handleToggle}
      className={`rounded-2xl px-4 ${
        isRecording ? "bg-red-500 hover:bg-red-600 animate-pulse" : "bg-orange-500 hover:bg-orange-600"
      }`}
    >
      {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
    </Button>
  )
}
