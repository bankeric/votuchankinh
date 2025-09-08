"use client"

import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { ChatMode } from "@/interfaces/chat"
import { useTranslation } from "react-i18next"
import useAgents from "@/hooks/use-agents"


interface WelcomeScreenProps {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>, value?: string) => Promise<void>
}

export function WelcomeScreen({ handleSubmit }: WelcomeScreenProps) {
  const { t } = useTranslation();
  const {currentAgent} = useAgents();
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">🙏</span>
          </div>

          {/* <h2 className="text-3xl font-bold text-gray-800 mb-3">{content.title}</h2> */}
          <h2 className="text-3xl font-bold text-gray-800 mb-3">{currentAgent?.name}</h2>
          <p className="text-gray-600 text-lg leading-relaxed">{currentAgent?.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentAgent && currentAgent?.conversation_starters?.map((example: string, index: number) => (
            <Button
              key={index}
              variant="outline"
              className="p-4 h-auto text-left hover:bg-orange-50 hover:border-orange-200 border-orange-100"
              onClick={(e) => handleSubmit(e as any, example)}
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-orange-500 mt-1 flex-shrink-0" />
                <span className="text-sm text-gray-700">{example}</span>
              </div>
            </Button>
          ))}
        </div>

        <div className="text-sm text-gray-500">
          {t('welcome.tip')}
        </div>
      </div>
    </div>
  )
}
