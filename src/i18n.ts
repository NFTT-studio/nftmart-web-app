/* eslint-disable global-require */
import i18n from 'i18next';
import Backend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './assets/locales/en.json';
import zh from './assets/locales/zh.json';

const language = ['zh', 'en'];
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      zh: {
        translation: zh,
      },
    },
    lng: `${language.indexOf(localStorage.getItem('i18nextLng') || '') > -1
      ? localStorage.getItem('i18nextLng') : 'en'}`,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
export const t = i18n.t.bind(i18n);
