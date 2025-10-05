"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Globe, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/hooks/use-translations";
import { Language } from "@/interfaces/chat";

type SettingsSection = "language" | "billing";

const SettingsPage = () => {
  const router = useRouter();
  const { language, changeLanguage } = useTranslations();
  const [activeSection, setActiveSection] = useState<SettingsSection>("language");

  const sidebarItems = [
    { id: "language" as SettingsSection, label: "Language", icon: Globe },
    { id: "billing" as SettingsSection, label: "Billing", icon: CreditCard },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case "language":
        return (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-8 text-red-800">Language Settings</h1>
            <div className="bg-[#f9f0dc] p-6 rounded-lg border-2 border-black">
              <div className="mb-4">
                <label htmlFor="language" className="block text-sm font-medium mb-2 text-black">
                  Select Language
                </label>
                <Select value={language} onValueChange={(value) => changeLanguage(value as Language)}>
                  <SelectTrigger className="w-full border-black focus:ring-red-200">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="vi">Tiếng Việt</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case "billing":
        return (
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-8 text-red-800">Billing Settings</h1>
            <div className="bg-[#f9f0dc] p-6 rounded-lg border-2 border-black">
              <p className="text-black">Billing settings coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f3ead7]">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen border-r-2 border-black bg-[#f9f0dc] p-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-red-800 hover:text-red-900 hover:bg-red-50/50 mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </Button>
          
          <h2 className="text-xl font-semibold mb-6 text-black">Settings</h2>
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className={cn(
                  "w-full justify-start text-red-800 hover:text-red-900 hover:bg-red-50/50",
                  activeSection === item.id && "bg-red-50/50 text-red-900"
                )}
                onClick={() => setActiveSection(item.id)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                <span>{item.label}</span>
              </Button>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
