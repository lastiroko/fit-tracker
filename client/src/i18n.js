import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: { translation: {
    appName: "Fit Tracker",
    tagline: "Your daily activity at a glance",
    steps: "Steps",
    workouts: "Workouts",
    achievements: "Achievements",
    recommendations: "Recommendations",
    language: "Language",
    english: "English",
    german: "German"
  }},
  de: { translation: {
    appName: "Fit Tracker",
    tagline: "Deine täglichen Aktivitäten auf einen Blick",
    steps: "Schritte",
    workouts: "Workouts",
    achievements: "Erfolge",
    recommendations: "Empfehlungen",
    language: "Sprache",
    english: "Englisch",
    german: "Deutsch"
  }}
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lang') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false }
  });

export default i18n;
