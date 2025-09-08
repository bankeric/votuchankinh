"use client";
import { MainLayout } from "@/components/layout/main-layout";
import useCreateChat from "@/hooks/use-create-chat";
import { useOnce } from "@/hooks/use-once";
import { useChatStore } from "@/store/chat";
export default function Home() {
  const { getChats } = useChatStore();
  const { handleCreateChat } = useCreateChat();
  useOnce(() => {
    const initChats = async () => {
      await getChats();
      handleCreateChat();
    };
    initChats();
  }, []);

  return <MainLayout />;
}
