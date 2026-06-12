import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import es from './locales/es.json';
import en from './locales/en.json';
import fr from './locales/fr.json';
import ja from './locales/ja.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: { es: { translation: es }, en: { translation: en }, fr: { translation: fr }, ja: { translation: ja } },
        fallbackLng: 'es',
        supportedLngs: ['es', 'en', 'fr', 'ja'],
        interpolation: { escapeValue: false },
    });

export default i18n;
