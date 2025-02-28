
import i18n, { LanguageDetectorAsyncModule } from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as RNLocalize from 'react-native-localize'

import en from "./en/en.json"
import ar from "./ar/ar.json"
import fr from "./fr/fr.json"
// import {fr} from "./fr/fr"

 export const languages = [
    { name: "English", value: "en" },
    { name: "العربية", value: "ar" },
    { name: "Français", value: "fr" },
  ];
export const locales = {
  en: { translation: en },
  fr: { translation: fr },
  ar: { translation: ar },
}

export const DEFAULT_LOCALE = "en"

export const defaultLanguage =
  RNLocalize.findBestLanguageTag(Object.keys(locales))?.languageTag || DEFAULT_LOCALE

export const currentLanguage = i18n.language || defaultLanguage

const useLanguageStorage: LanguageDetectorAsyncModule = {
  type: "languageDetector",
  async: true,
  
  detect: async (callback) => {
    const lang = localStorage.getItem("language") || defaultLanguage;
    console.log("locStorage language > ", lang)

    if (callback) {
      callback(lang);
    }
 
    return lang; // Ensures correct return type
  },
  // init: () => null,
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    localStorage.setItem("language", language)
  },
}

i18n
  .use(useLanguageStorage) // Language detector
  .use(initReactI18next) // React binding
  .init({
    fallbackLng: defaultLanguage,
    resources: locales,
    // ns: ["translation"], // Use a generic namespace unless you separate by language
    defaultNS: "translation",
    react: {
      useSuspense: false, // Ensures it does not block rendering
    },
    interpolation: {
      escapeValue: false, // React already prevents XSS
    },
    backend: {
              loadPath: "/translation/{{lng}}/{{lng}}.json", // Path to translation files
            },
  })
  .then(() => {
    console.log("i18n initialized with language:", i18n.language);
  });

export default i18n













// import i18n from "i18next"
// import LanguageDetector from "i18next-browser-languagedetector";
// import { initReactI18next } from "react-i18next";


// import { fr } from "./fr/fr";
// import { Translation, TranslationObjType } from "./translation";

// // let defaultLng = "en";
// // // If user has selected a language, we get it
// // const lng = localStorage.getItem("language");
// // if (lng && lng.length > 1) {
// //   defaultLng = lng;
// // }

// i18n
// .use(
//     LanguageDetector
// )
// .use(initReactI18next)
// .init({
//     lng: "fr",
//     resources: {
//       fr: { fr }
//     },
//     backend: {
//         loadPath: "/translation/{{lng}}.json", // Path to translation files
//       },
//     fallbackLng: "fr",

// })

// export default i18n;

// export function typedTranslation(s: Translation) {
//   return i18n.t(s)
// }
