"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Volume2, 
  Palette, 
  Database, 
  Shield,
  Globe,
  Moon,
  Sun,
  Monitor,
  LogOut,
  X,
  Download,
  Trash2,
  Crown
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "@/hooks/use-translations";
import { useAuthStore } from "@/store/auth";
import { SelectVoice } from "../v2/admin/voice/select-voice";
import { cn } from "@/lib/utils";
import { Language } from "@/interfaces/chat";
import { useRouter } from "next/navigation";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type SettingsSection = "general" | "voice" | "appearance" | "data" | "account";

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { t, language, changeLanguage } = useTranslations();
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SettingsSection>("general");
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const [autoSave, setAutoSave] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);

  const sidebarItems = [
    { id: "general" as SettingsSection, label: t("settings.sections.general"), icon: User },
    { id: "voice" as SettingsSection, label: t("settings.sections.voice"), icon: Volume2 },
    { id: "appearance" as SettingsSection, label: t("settings.sections.appearance"), icon: Palette },
    { id: "data" as SettingsSection, label: t("settings.sections.data"), icon: Database },
    { id: "account" as SettingsSection, label: t("settings.sections.account"), icon: Shield },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{t("settings.general.title")}</h3>
              <p className="text-gray-600">{t("settings.general.subtitle")}</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Globe className="w-5 h-5 text-orange-500" />
                      {t("settings.general.language")}
                    </Label>
                    <p className="text-sm text-gray-600">{t("settings.general.languageDescription")}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    onClick={() => changeLanguage(Language.EN)}
                    className={cn(
                      "flex-1 h-12 text-base font-medium transition-all duration-200 bg-[#991b1b] hover:bg-[#7a1515] text-[#f6efe0] border-2 border-[#2c2c2c] rounded-xl shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]",
                    )}
                  >
                    🇺🇸 English
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => changeLanguage(Language.VI)}
                    className={cn(
                      "flex-1 h-12 text-base font-medium transition-all duration-200 bg-[#991b1b] hover:bg-[#7a1515] text-[#f6efe0] border-2 border-[#2c2c2c] rounded-xl shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]",
                    )}
                  >
                    🇻🇳 Tiếng Việt
                  </Button>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Database className="w-5 h-5 text-green-500" />
                      Auto-save conversations
                    </Label>
                    <p className="text-sm text-gray-600">Automatically save your chat history for future reference</p>
                  </div>
                  <Switch
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label className="text-base font-semibold flex items-center gap-2">
                      <Volume2 className="w-5 h-5 text-blue-500" />
                      Sound effects
                    </Label>
                    <p className="text-sm text-gray-600">Play sounds for notifications and interactions</p>
                  </div>
                  <Switch
                    checked={soundEffects}
                    onCheckedChange={setSoundEffects}
                    className="data-[state=checked]:bg-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "voice":
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Voice Settings</h3>
              <p className="text-gray-600">Configure audio preferences and voice options</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              <SelectVoice />
            </div>
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Appearance</h3>
              <p className="text-gray-600">Customize the look and feel of your interface</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="space-y-4">
                <div className="space-y-3">
                  <Label className="text-base font-semibold flex items-center gap-2">
                    <Palette className="w-5 h-5 text-purple-500" />
                    Theme
                  </Label>
                  <p className="text-sm text-gray-600">Choose your preferred color scheme</p>
                  <div className="grid grid-cols-3 gap-3">
                    <Button
                      size="lg"
                      onClick={() => setTheme("light")}
                      className={cn(
                        "h-16 flex flex-col items-center gap-2 transition-all duration-200 bg-[#991b1b] hover:bg-[#7a1515] text-[#f6efe0] border-2 border-[#2c2c2c] rounded-xl shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]",
                      )}
                    >
                      <Sun className="w-6 h-6" />
                      <span className="text-sm font-medium">Light</span>
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => setTheme("dark")}
                      className={cn(
                        "h-16 flex flex-col items-center gap-2 transition-all duration-200 bg-[#991b1b] hover:bg-[#7a1515] text-[#f6efe0] border-2 border-[#2c2c2c] rounded-xl shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]",
                      )}
                    >
                      <Moon className="w-6 h-6" />
                      <span className="text-sm font-medium">Dark</span>
                    </Button>
                    <Button
                      size="lg"
                      onClick={() => setTheme("system")}
                      className={cn(
                        "h-16 flex flex-col items-center gap-2 transition-all duration-200 bg-[#991b1b] hover:bg-[#7a1515] text-[#f6efe0] border-2 border-[#2c2c2c] rounded-xl shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]",
                      )}
                    >
                      <Monitor className="w-6 h-6" />
                      <span className="text-sm font-medium">System</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "data":
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Data & Privacy</h3>
              <p className="text-gray-600">Manage your data and privacy settings</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-green-100">
                    <Download className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Export Data</h4>
                    <p className="text-sm text-gray-600">Download your chat history and settings</p>
                  </div>
                </div>
                <Button size="lg" className="w-full flex items-center gap-2 bg-[#991b1b] hover:bg-[#7a1515] text-[#f6efe0] border-2 border-[#2c2c2c] rounded-xl shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]">
                  <Download className="w-5 h-5" />
                  Export Data
                </Button>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 bg-red-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-red-100">
                    <Trash2 className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-red-900">Clear Data</h4>
                    <p className="text-sm text-red-700">Permanently delete all your chat history and settings</p>
                  </div>
                </div>
                <Button size="lg" className="w-full flex items-center gap-2 bg-[#991b1b] hover:bg-[#7a1515] text-[#f6efe0] border-2 border-[#2c2c2c] rounded-xl shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]">
                  <Trash2 className="w-5 h-5" />
                  Clear All Data
                </Button>
              </div>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Account Settings</h3>
              <p className="text-gray-600">Manage your account information and preferences</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-base font-semibold flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="mt-2 bg-gray-50 border-gray-200 h-12"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="role" className="text-base font-semibold flex items-center gap-2">
                      <Shield className="w-5 h-5 text-purple-500" />
                      Account Type
                    </Label>
                    <Input
                      id="role"
                      value={user?.role || 'Free'}
                      disabled
                      className="mt-2 bg-gray-50 border-gray-200 h-12"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 bg-red-50/50">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-red-100">
                    <LogOut className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-red-900">Sign Out</h4>
                    <p className="text-sm text-red-700">Sign out of your account securely</p>
                  </div>
                </div>
                <Button 
                  size="lg"
                  onClick={() => {
                    logout();
                    onOpenChange(false);
                  }}
                  className="w-full flex items-center gap-2 bg-[#991b1b] hover:bg-[#7a1515] text-[#f6efe0] border-2 border-[#2c2c2c] rounded-xl shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-0 bg-[#EFE0BD] border-2 border-black shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset] flex flex-col w-[92vw] h-[82vh] rounded-2xl md:rounded-none md:w-[1000px] md:h-[700px] md:sm:max-w-[1000px]">
        <DialogTitle className="sr-only">{t("settings.title")}</DialogTitle>
        {/* Fixed Header */}
        <div className="flex-shrink-0 p-4 md:p-6 pb-3 md:pb-4 border-b border-[#2c2c2c] bg-[#EFE0BD]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-bold text-black">
              <div className="p-2 md:p-2 rounded-xl bg-[#991b1b] text-[#f6efe0] border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]">
                <User className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
{t("settings.title")}
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => {
                  onOpenChange(false);
                  router.push('/pricing');
                }}
                className="bg-[#991b1b] hover:bg-[#7a1515] text-[#f6efe0] border-2 border-[#2c2c2c] shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset] flex items-center gap-2 text-xs md:text-sm px-3 py-2 md:px-4 md:py-2 rounded-xl"
              >
                <Crown className="w-3 h-3 md:w-4 md:h-4" />
                {t("common.upgrade")}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 md:h-10 md:w-10 p-0 rounded-full hover:bg-amber-100 transition-colors"
              >
                {/* <X className="h-5 w-5" /> */}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Fixed Sidebar */}
          <div className="flex-shrink-0 w-16 md:w-32 border-r border-[#2c2c2c] bg-[#EFE0BD] p-2 md:p-3 overflow-hidden">
            <nav className="space-y-2 h-full overflow-y-auto settings-sidebar" style={{scrollbarWidth: 'none', msOverflowStyle: 'none'}}>
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant="ghost"
                    className={cn(
                      "w-full flex-col h-auto p-2 rounded-lg transition-all duration-200 group items-center",
                      activeSection === item.id 
                        ? "bg-[#991b1b] text-[#f6efe0] border-2 border-[#2c2c2c] rounded-xl shadow-[0_2px_0_#00000030,0_0_0_3px_#00000010_inset]" 
                        : "text-[#2c2c2c] hover:text-black"
                    )}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <div className={cn(
                      "p-1.5 rounded-md mb-1 transition-colors",
                      activeSection === item.id 
                        ? "bg-white/20" 
                        : "bg-[#f3ead7] group-hover:bg-[#efe0bd]"
                    )}>
                      <Icon className={cn(
                        "w-4 h-4 transition-colors",
                        activeSection === item.id ? "text-white" : "text-[#2c2c2c]"
                      )} />
                    </div>
                    <span className="hidden md:block text-xs font-medium text-center leading-tight px-1">{item.label}</span>
                  </Button>
                );
              })}
            </nav>
          </div>

          {/* Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto bg-[#f3ead7]">
            <div className="p-4 md:p-6">
              <div className="max-w-3xl">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}