import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: process.env.NODE_ENV !== "production",
    fallbackLng: "vi",
    interpolation: {
      escapeValue: true,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
