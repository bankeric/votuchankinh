'use client'
import { useOnce } from '@/hooks/use-once'
import HydrationZustand from './hydration-zustand'
import { publicPaths } from '@/constants/route'
import { usePathname } from 'next/navigation'
import { useAuthStore } from '@/store/auth'
import { useAgentSettingStore } from '@/store/agent-setting'
import { useAgentStore } from '@/store/agent'
import { useTranslations } from '@/hooks/use-translations'
import { useAppStateStore } from '@/store/app'

// import i18n LANGUAGE
import '@/lib/i18n'
import { useChatStore } from '@/store/chat'
import useCreateChat from '@/hooks/use-create-chat'

export const ClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { getCurrentUser, user } = useAuthStore()
  const { fetchAgentSettings } = useAgentSettingStore()
  const { fetchAgents } = useAgentStore()
  const { language } = useTranslations()
  const { getModels } = useAppStateStore()
  // const pathname = usePathname()
  useOnce(() => {
    // const isPublicPath = publicPaths.some((path) => pathname === path)
    getCurrentUser()
    fetchAgents(language, false)
  }, [])

  useOnce(() => {
    if (!user) return
    fetchAgentSettings()
    getModels()
  }, [user, language])
  return <HydrationZustand>{children}</HydrationZustand>
}
