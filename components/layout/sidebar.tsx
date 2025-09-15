"use client";

import type React from "react";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatList } from "@/components/chat/chat-list";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { SettingsModal } from "@/components/layout/settings-modal";
import useCreateChat from "@/hooks/use-create-chat";
import { useTranslations } from "@/hooks/use-translations";
import { Language } from "@/interfaces/chat";
import { useChatStore } from "@/store/chat";
import {
  BookOpen,
  Edit,
  Heart,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  MoreVertical,
  PenTool,
  Plus,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authService } from "@/service/auth";
import { appToast } from "@/lib/toastify";
import { Role } from "@/interfaces/user";
import { useAuthStore } from "@/store/auth";
import useAgents from "@/hooks/use-agents";

export function Sidebar({
  isMobileOpen,
  setIsMobileOpen,
}: {
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const { user } = useAuthStore();
  const { t, language, changeLanguage } = useTranslations();
  const {
    chats,
    deleteChat,
    updateChat,
    activeChatId,
    setActiveChatId,
    getMessages,
    loadingTitleChatId,
    getChats,
    totalChats,
  } = useChatStore();
  const isAdmin = user?.role === Role.ADMIN;
  const router = useRouter();
  const { handleCreateChat } = useCreateChat();
  const { setSelectedAgentId } = useAgents();
  const renderLogoutDialog = () => {
    return (
      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <AlertDialogContent className="sm:max-w-[425px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-orange-600" />
              {t("auth.confirmLogout")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              {t("auth.logoutConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-orange-200 hover:bg-orange-50">
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              {t("auth.logoutConfirmButton")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  const handleLogoutConfirmation = () => {
    console.log("handleLogoutConfirmation");
    setIsLogoutDialogOpen(true);
  };

  const handleLogout = async () => {
    await authService.logout();
    router.push("/login");
    appToast(t("auth.logoutSuccess"), {
      type: "success",
    });
    setIsLogoutDialogOpen(false);
  };

  const handleCreateNewChat = () => {
    const uuid = handleCreateChat();
    setActiveChatId(uuid);
    setIsMobileOpen(false); // Close mobile sidebar after creating new chat
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteChat(chatId);

    // If the active chat is deleted, select the first available chat
    if (chatId === activeChatId && chats.length > 1) {
      const remainingChats = chats.filter((chat) => chat.uuid !== chatId);
      setActiveChatId(remainingChats[0].uuid);
    } else {
      router.push("/chat/new");
    }
  };

  const editChatTitle = (chatId: string, newTitle: string) => {
    updateChat(chatId, { title: newTitle });
  };

  const setActiveChatAndGetMessages = async (chatId: string) => {
    setActiveChatId(chatId);
    
    const messages = await getMessages(chatId);
    let agentId = chats.find((chat) => chat.uuid === chatId)?.agent_id;
    if (!agentId && messages && messages.length > 0) {
      agentId = messages[0].agent_id;
    }
    if (agentId) {
      setSelectedAgentId(agentId);
    }
    setIsMobileOpen(false); // Close mobile sidebar when selecting chat
  };

  const handleLoadMore = async (page: number) => {
    try {
      await getChats(page);
    } catch (error) {
      console.error("Error loading more chats:", error);
    }
  };

  // Mobile overlay
  if (isMobileOpen) {
    return (
      <>
        {/* Mobile overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />

        {/* Mobile sidebar */}
        <div
          className={`fixed left-0 top-0 h-full w-80 bg-white border-r border-orange-200 flex flex-col z-50 md:hidden transform transition-transform duration-300 ease-in-out`}
        >
          {/* Header */}
          <div className="p-4 border-b border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center">
                  <span className="text-orange-700 text-sm font-bold">🙏</span>
                </div>
                <h1 className="font-bold text-lg text-gray-800">
                  {t("app.title")}
                </h1>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Admin Panel Button */}
            {isAdmin && (
              <div className="mb-4" key="admin-panel-button">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    router.push("/admin");
                    setIsMobileOpen(false);
                  }}
                  className="w-full justify-start gap-2 h-8 text-xs border-orange-200 hover:bg-orange-50 hover:border-orange-300"
                >
                  <span className="text-gray-700">{t("navigation.admin")}</span>
                </Button>
              </div>
            )}

            {/* New Chat Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleCreateNewChat}
              className="w-full justify-start gap-2 bg-orange-500 hover:bg-orange-600"
            >
              <Plus className="w-4 h-4" />
              <span>{t("chat.newChat")}</span>
            </Button>
          </div>

          {/* Search and Chats */}
          <div className="flex-1 overflow-y-auto p-2">
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="text"
                placeholder={t("common.search")}
                className="pl-9 h-9 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Chat List */}
            <ChatList
              chats={chats}
              activeChatId={activeChatId}
              loadingTitleChatId={loadingTitleChatId}
              totalChats={totalChats}
              onChatSelect={setActiveChatAndGetMessages}
              onDeleteChat={handleDeleteChat}
              onEditChatTitle={editChatTitle}
              onLoadMore={handleLoadMore}
            />
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-orange-100">
            <div className="flex items-center justify-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="center" className="w-48">
                  <DropdownMenuItem
                    onClick={() => setIsSettingsModalOpen(true)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {t("navigation.settings")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogoutConfirmation}>
                    <LogOut className="w-4 h-4 mr-2" />
                    {t("auth.logout")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button
                variant={language === Language.VI ? "outline" : "ghost"}
                size="sm"
                className="text-xs"
                onClick={() => changeLanguage(Language.VI)}
              >
                🇻🇳 {t("settings.vietnamese")}
              </Button>
              <Button
                variant={language === Language.EN ? "outline" : "ghost"}
                size="sm"
                className="text-xs text-gray-500"
                onClick={() => changeLanguage(Language.EN)}
              >
                🇺🇸 {t("settings.english")}
              </Button>
            </div>
          </div>
        </div>

        {/* Settings Modal - Mobile */}
        <SettingsModal
          open={isSettingsModalOpen}
          onOpenChange={setIsSettingsModalOpen}
        />

        {/* Logout Confirmation Dialog - Mobile */}
        {renderLogoutDialog()}
      </>
    );
  }

  // Collapsed sidebar
  if (isCollapsed) {
    return (
      <div className="hidden md:flex w-16 bg-white border-r border-orange-200 flex-col items-center py-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setIsCollapsed(false);
          }}
          className="mb-4"
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Admin Panel Button - Collapsed */}
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin")}
            className="w-10 h-10 p-0 mb-6 hover:bg-purple-50"
            title={t("navigation.admin")}
          >
            <span className="text-sm">⚙️</span>
          </Button>
        )}
        {/* New Chat Button - Collapsed */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCreateNewChat}
          className="w-10 h-10 p-0 mb-4"
          title={t("chat.newChat")}
        >
          <Plus className="w-4 h-4" />
        </Button>

        {/* User Menu - Collapsed */}
        <div className="mt-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="w-10 h-10 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-48">
              <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                <Settings className="w-4 h-4 mr-2" />
                {t("navigation.settings")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogoutConfirmation}>
                <LogOut className="w-4 h-4 mr-2" />
                {t("auth.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }

  // Desktop expanded sidebar
  return (
    <div className="hidden md:flex w-80 bg-white border-r border-orange-200 flex-col transform transition-all duration-300 ease-in-out">
      {/* Header */}
      <div className="p-4 border-b border-orange-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center">
              <span className="text-orange-700 text-sm font-bold">🙏</span>
            </div>
            <h1 className="font-bold text-lg text-gray-800">
              {t("app.title")}
            </h1>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(true)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Admin Panel Button */}
        {isAdmin && (
          <div className="mb-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/admin")}
              className="w-full justify-start gap-2 h-8 text-xs border-orange-200 hover:bg-orange-50 hover:border-orange-300"
            >
              <span className="text-gray-700">{t("navigation.admin")}</span>
            </Button>
          </div>
        )}
        {/* New Chat Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handleCreateNewChat}
          className="w-full justify-start gap-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
        >
          <Plus className="w-4 h-4" />
          <span>{t("chat.newChat")}</span>
        </Button>
      </div>

      {/* Search and Chats */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder={t("common.search")}
            className="pl-9 h-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Chat List */}
        <ChatList
          chats={chats}
          activeChatId={activeChatId}
          loadingTitleChatId={loadingTitleChatId}
          totalChats={totalChats}
          onChatSelect={setActiveChatAndGetMessages}
          onDeleteChat={handleDeleteChat}
          onEditChatTitle={editChatTitle}
          onLoadMore={handleLoadMore}
        />
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-orange-100">
        <div className="flex items-center justify-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="center" className="w-48">
              <DropdownMenuItem onClick={() => setIsSettingsModalOpen(true)}>
                <Settings className="w-4 h-4 mr-2" />
                {t("navigation.settings")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogoutConfirmation}>
                <LogOut className="w-4 h-4 mr-2" />
                {t("auth.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={language === Language.VI ? "outline" : "ghost"}
            size="sm"
            className="text-xs"
            onClick={() => changeLanguage(Language.VI)}
          >
            🇻🇳 {t("settings.vietnamese")}
          </Button>
          <Button
            variant={language === Language.EN ? "outline" : "ghost"}
            size="sm"
            className="text-xs text-gray-500"
            onClick={() => changeLanguage(Language.EN)}
          >
            🇺🇸 {t("settings.english")}
          </Button>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        open={isSettingsModalOpen}
        onOpenChange={setIsSettingsModalOpen}
      />

      {/* Logout Confirmation Dialog */}
      {renderLogoutDialog()}
    </div>
  );
}

// Export mobile trigger component
export function MobileSidebarTrigger({ onOpen }: { onOpen: () => void }) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onOpen}
      className="md:hidden fixed top-4 left-4 z-30 bg-white border border-orange-200 shadow-sm"
    >
      <Menu className="w-5 h-5" />
    </Button>
  );
}
