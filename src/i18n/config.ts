import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import tr from './locales/tr.json';
import de from './locales/de.json';
import ar from './locales/ar.json';

const resources = {
  en: { translation: en },
  tr: { translation: tr },
  de: { translation: de },
  ar: { translation: ar },
};

// Get stored language or default to English
const storedLanguage = localStorage.getItem('toms_language') || 'en';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: storedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
  });

// Save language preference when it changes
i18n.on('languageChanged', (lng) => {
  localStorage.setItem('toms_language', lng);
  document.documentElement.lang = lng;
});

export default i18n;