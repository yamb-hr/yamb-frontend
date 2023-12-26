import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from './locales/en/translation.json';
import hrTranslation from './locales/hr/translation.json';
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
        "en-US": {
            translation: enTranslation
        },
        "hr": {
            translation: hrTranslation
        }
    },
    fallbackLng: "en-US",
    interpolation: {
        escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
