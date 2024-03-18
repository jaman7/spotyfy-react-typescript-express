import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

import translationPL from './assets/i18/pl.json';

const resources = {
  pl: {
    translation: translationPL,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    lng: 'pl',
    fallbackLng: 'pl',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    resources,
  });

export default i18n;
