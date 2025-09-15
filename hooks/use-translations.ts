import { useTranslation } from "react-i18next";
import { Language } from "@/interfaces/chat";

export function useTranslations() {
  const { t, i18n } = useTranslation();
  const language = i18n.language as Language;

  const changeLanguage = (newLanguage: Language) => {
    i18n.changeLanguage(newLanguage);
  };

  const isEnglish = language === Language.EN;
  const isVietnamese = language === Language.VI;

  return {
    t,
    language,
    changeLanguage,
    isEnglish,
    isVietnamese,
    i18n,
  };
}
