'use client'
import { MainLayout } from '@/components/layout/main-layout'
import useCreateChat from '@/hooks/use-create-chat'
import { useOnce } from '@/hooks/use-once'
import { useAuthStore } from '@/store/auth'
import { useChatStore } from '@/store/chat'
export default function Home() {
  const { getChats } = useChatStore()
  const { handleCreateChat } = useCreateChat()
  const { user } = useAuthStore()

  const initChats = async () => {
    handleCreateChat()
    if (!user) return
    await getChats()
  }
  useOnce(() => {
    initChats()
  }, [])

  return <MainLayout />
}
