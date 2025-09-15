"use client"

import type React from "react"

import { useState } from "react"
import { Send, Square } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ChatInputProps {
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  stop: () => void
}

export function ChatInput({ input, handleInputChange, handleSubmit, isLoading, stop }: ChatInputProps) {
  const [rows, setRows] = useState(1)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (input.trim() && !isLoading) {
        handleSubmit(e as any)
      }
    }
  }

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleInputChange(e)

    // Auto-resize textarea
    const lineHeight = 24
    const maxRows = 5
    const textareaLineHeight = e.target.scrollHeight / lineHeight
    const newRows = Math.min(Math.max(textareaLineHeight, 1), maxRows)
    setRows(newRows)
  }

  return (
    <div className="border-t bg-white p-4">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        <div className="relative flex items-end gap-2">
          <div className="flex-1 relative">
            <textarea
              value={input}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder="Nhập tin nhắn của bạn..."
              rows={rows}
              className="w-full resize-none rounded-lg border border-gray-300 px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={isLoading}
            />
          </div>

          {isLoading ? (
            <Button type="button" onClick={stop} size="sm" variant="outline" className="px-3">
              <Square className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="submit" size="sm" disabled={!input.trim() || isLoading} className="px-3">
              <Send className="w-4 h-4" />
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
