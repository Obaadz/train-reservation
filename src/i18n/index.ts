import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import arCommon from './locales/ar/common.json';
import arHome from './locales/ar/home.json';
import arSearch from './locales/ar/search.json';
import arBooking from './locales/ar/booking.json';
import arAuth from './locales/ar/auth.json';
import arDashboard from './locales/ar/dashboard.json';
import arFeatures from './locales/ar/features.json';

import enCommon from './locales/en/common.json';
import enHome from './locales/en/home.json';
import enSearch from './locales/en/search.json';
import enBooking from './locales/en/booking.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enFeatures from './locales/en/features.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        common: arCommon,
        home: arHome,
        search: arSearch,
        booking: arBooking,
        auth: arAuth,
        dashboard: arDashboard,
        features: arFeatures
      },
      en: {
        common: enCommon,
        home: enHome,
        search: enSearch,
        booking: enBooking,
        auth: enAuth,
        dashboard: enDashboard,
        features: enFeatures
      }
    },
    lng: 'ar', // Default language
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false
    },
    defaultNS: 'common',
    ns: ['common', 'home', 'search', 'booking', 'auth', 'dashboard', 'features'],
    react: {
      useSuspense: false
    }
  });

// Handle RTL direction
i18n.on('languageChanged', (lng) => {
  document.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
  document.documentElement.classList.toggle('rtl', lng === 'ar');
});

export default i18n;