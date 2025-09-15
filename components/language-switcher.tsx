'use client';

import React from 'react';
import { useTranslations } from '@/hooks/use-translations';
import { Language } from '@/interfaces/chat';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const languages = [
  { code: Language.EN, name: 'English', nativeName: 'English' },
  { code: Language.VI, name: 'Vietnamese', nativeName: 'Tiếng Việt' },
];

// export function LanguageSwitcher() {
//   const { t, language, changeLanguage } = useTranslations();

//   return (
//     <div className="flex items-center gap-2">
//       <Globe className="h-4 w-4" />
//       <Select value={language} onValueChange={(value) => changeLanguage(value as Language)}>
//         <SelectTrigger className="w-[140px]">
//           <SelectValue placeholder={t('settings.languageSelection')} />
//         </SelectTrigger>
//         <SelectContent>
//           {languages.map((lang) => (
//             <SelectItem key={lang.code} value={lang.code}>
//               {lang.nativeName}
//             </SelectItem>
//           ))}
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }

export function LanguageSwitcherButton() {
  const { language, changeLanguage } = useTranslations();

  const toggleLanguage = () => {
    const currentIndex = languages.findIndex(lang => lang.code === language);
    const nextIndex = (currentIndex + 1) % languages.length;
    changeLanguage(languages[nextIndex].code);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {languages.find(lang => lang.code === language)?.nativeName}
    </Button>
  );
} 