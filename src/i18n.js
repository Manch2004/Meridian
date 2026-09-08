import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import hy from "./locales/hy/translation.json";
import ru from "./locales/ru/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hy: { translation: hy },
      ru: { translation: ru },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "hy", "ru"],
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

const syncDocumentLang = (lng) => {
  document.documentElement.lang = lng;
};
syncDocumentLang(i18n.resolvedLanguage || i18n.language || "en");
i18n.on("languageChanged", syncDocumentLang);

export default i18n;
