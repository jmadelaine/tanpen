import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enUS from './locales/en-US.json';

export const defaultLocale = 'en-US';

void i18n.use(initReactI18next).init({
  resources: {
    [defaultLocale]: {
      translation: enUS,
    },
  },
  lng: defaultLocale,
  fallbackLng: defaultLocale,
  defaultNS: 'translation',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
