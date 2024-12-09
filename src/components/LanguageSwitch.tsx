import React from 'react';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import Button from './common/Button';

const LanguageSwitch: React.FC = () => {
  const { i18n, t } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      leftIcon={<Languages className="w-4 h-4" />}
      className="flex items-center gap-2"
    >
      {i18n.language === 'ar' ? 'English' : 'عربي'}
    </Button>
  );
};

export default LanguageSwitch;