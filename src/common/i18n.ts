import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

import vi from "./translations/vi.json";

const resources = {
  vi: {
    translation: vi,
  },
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    debug: process.env.NODE_ENV !== "production",
    lng: "en",
    fallbackLng: "vi",
    interpolation: {
      escapeValue: true,
    },
    react: {
      useSuspense: true,
    },
  });

export default i18n;
