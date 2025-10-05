"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, CheckCircle } from "lucide-react";
import { useTranslations } from "@/hooks/use-translations";
import { Language } from "@/interfaces/chat";

interface OnboardingModalProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingModal({ open, onComplete }: OnboardingModalProps) {
  const { language, changeLanguage, t } = useTranslations();
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null);

  const handleLanguageSelect = (lang: Language) => {
    setSelectedLanguage(lang);
    changeLanguage(lang);
  };

  const handleContinue = () => {
    onComplete();
  };

  const handleSkip = () => {
    onComplete();
  };

  const languages = [
    {
      code: Language.EN,
      name: "English",
      flag: "🇺🇸",
      description: "Get Buddhist teachings and guidance in English"
    },
    {
      code: Language.VI,
      name: "Tiếng Việt",
      flag: "🇻🇳",
      description: "Nhận những lời dạy và hướng dẫn Phật giáo bằng tiếng Việt"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={() => {}} modal>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto [&>button]:hidden bg-[#f3ead7] border-2 border-black rounded-lg"
      >
        <DialogHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[#f9f0dc] border-2 border-black rounded-full flex items-center justify-center">
              <span className="text-red-800 text-2xl font-bold">🙏</span>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-red-800 text-center">
            {t('onboarding.welcome')}
          </DialogTitle>
          <p className="text-lg text-red-800 font-medium text-center">
            {t('onboarding.subtitle')}
          </p>
          <p className="text-gray-700 max-w-md mx-auto">
            {t('onboarding.description')}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center">
              <Globe className="w-5 h-5 text-red-800" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t('onboarding.selectLanguage')}
              </h3>
            </div>

            <div className="grid gap-3">
              {languages.map((lang) => (
                <Card 
                  key={lang.code}
                  className={`cursor-pointer transition-all duration-200 border-2 ${
                    selectedLanguage === lang.code || language === lang.code
                      ? 'bg-[#f9f0dc] border-red-800' 
                      : 'bg-[#f9f0dc] border-black'
                  }`}
                  onClick={() => handleLanguageSelect(lang.code)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{lang.flag}</span>
                      <div>
                        <h4 className="font-semibold text-gray-900">{lang.name}</h4>
                        <p className="text-sm text-gray-600">{lang.description}</p>
                      </div>
                    </div>
                    {(selectedLanguage === lang.code || language === lang.code) && (
                      <CheckCircle className="w-5 h-5 text-red-800" />
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="flex-1 border-2 border-black bg-gray-200 hover:bg-gray-300 text-black"
            >
              {t('onboarding.skip')}
            </Button>
            <Button
              onClick={handleContinue}
              className="flex-1 bg-red-800 hover:bg-red-900 text-white border-2 border-red-800"
            >
              {t('onboarding.continue')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 