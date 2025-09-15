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
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto [&>button]:hidden"
      >
        <DialogHeader className="text-center space-y-4 pb-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full flex items-center justify-center">
              <span className="text-orange-700 text-2xl font-bold">🙏</span>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-orange-900 text-center">
            {t('onboarding.welcome')}
          </DialogTitle>
          <p className="text-lg text-orange-700 font-medium text-center">
            {t('onboarding.subtitle')}
          </p>
          <p className="text-gray-600 max-w-md mx-auto">
            {t('onboarding.description')}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 justify-center">
              <Globe className="w-5 h-5 text-orange-600" />
              <h3 className="text-lg font-semibold text-gray-900">
                {t('onboarding.selectLanguage')}
              </h3>
            </div>

            <div className="grid gap-3">
              {languages.map((lang) => (
                <Card 
                  key={lang.code}
                  className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                    selectedLanguage === lang.code || language === lang.code
                      ? 'ring-2 ring-orange-500 bg-orange-50' 
                      : 'hover:bg-orange-25'
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
                      <CheckCircle className="w-5 h-5 text-orange-600" />
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
              className="flex-1 border-orange-200 hover:bg-orange-50"
            >
              {t('onboarding.skip')}
            </Button>
            <Button
              onClick={handleContinue}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {t('onboarding.continue')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 