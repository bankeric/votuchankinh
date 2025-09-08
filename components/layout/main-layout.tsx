"use client";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu } from "lucide-react";
import { useState } from "react";
import { ChatArea } from "./chat-area";
import { TitleHeader } from "./title-header";
import { Sidebar } from "./sidebar";
import { OnboardingModal } from "./onboarding-modal";
import { useLocalStorage } from 'usehooks-ts'

export function MainLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useLocalStorage('onboarding-language', false);

  const handleOnboardingComplete = () => {
    setHasCompletedOnboarding(true);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Mobile sidebar trigger */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsMobileSidebarOpen(true)}
        className="md:hidden fixed top-4 left-4 z-30 bg-white border border-orange-200 shadow-sm"
      >
        <Menu className="w-5 h-5" />
      </Button>

      {/* Sidebar - hidden on mobile, shown on desktop */}
      <Sidebar
        isMobileOpen={isMobileSidebarOpen}
        setIsMobileOpen={setIsMobileSidebarOpen}
      />

      {/* Mobile sidebar overlay */}
      {isMobile && isMobileSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-80 bg-white border-r border-orange-200 flex flex-col z-50 md:hidden">
            <Sidebar
              isMobileOpen={isMobileSidebarOpen}
              setIsMobileOpen={setIsMobileSidebarOpen}
            />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col">
        <TitleHeader />
        <ChatArea />
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal
        open={!hasCompletedOnboarding}
        onComplete={handleOnboardingComplete}
      />
    </div>
  );
}
