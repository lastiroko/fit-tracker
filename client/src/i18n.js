import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: 'Fit Tracker',
      tagline: 'Your daily activity at a glance',
      language: 'Language',
      english: 'English',
      german: 'German',
      homeTitle: 'Home',
      today: 'Today',
      scanModeTitle: 'Scan Mode',
      scanModeSubtitle: 'Capture your meal to see nutrients and pollutants.',
      scanCta: 'Scan',
      scanHint: 'Hold steady above the plate',
      dailyStats: 'Daily Stats',
      dailyStatsSubtitle: 'Goal · 1,500 kcal',
      viewAll: 'View all',
      nutrients: 'Nutrients',
      nutrientsValue: '76%',
      nutrientsDetail: 'Rich in omega-3 and vitamins',
      pollutants: 'Pollutants',
      pollutantsValue: '18%',
      pollutantsDetail: 'Within safe limits',
      mealLog: 'Meal Log',
      mealCaloriesToday: '1,280 kcal today',
      addMeal: 'Add meal',
      mealSalmon: 'Salmon with Vegetables',
      mealSalmonDetail: 'Lunch · 12:45 PM',
      mealTagDetox: 'Detox Binder',
      buy: 'Buy',
      mealSalad: 'Caesar Salad',
      mealSaladDetail: 'Breakfast · 8:30 AM',
      profile: 'Profile',
    },
  },
  de: {
    translation: {
      appName: 'Fit Tracker',
      tagline: 'Deine täglichen Aktivitäten auf einen Blick',
      language: 'Sprache',
      english: 'Englisch',
      german: 'Deutsch',
      homeTitle: 'Startseite',
      today: 'Heute',
      scanModeTitle: 'Scan-Modus',
      scanModeSubtitle: 'Erfasse deine Mahlzeit, um Nährstoffe und Schadstoffe zu sehen.',
      scanCta: 'Scannen',
      scanHint: 'Halte das Gerät ruhig über den Teller',
      dailyStats: 'Tageswerte',
      dailyStatsSubtitle: 'Ziel · 1.500 kcal',
      viewAll: 'Alle ansehen',
      nutrients: 'Nährstoffe',
      nutrientsValue: '76 %',
      nutrientsDetail: 'Reich an Omega-3 und Vitaminen',
      pollutants: 'Schadstoffe',
      pollutantsValue: '18 %',
      pollutantsDetail: 'Im sicheren Bereich',
      mealLog: 'Mahlzeiten',
      mealCaloriesToday: '1.280 kcal heute',
      addMeal: 'Mahlzeit hinzufügen',
      mealSalmon: 'Lachs mit Gemüse',
      mealSalmonDetail: 'Mittagessen · 12:45 Uhr',
      mealTagDetox: 'Detox-Binder',
      buy: 'Kaufen',
      mealSalad: 'Caesar-Salat',
      mealSaladDetail: 'Frühstück · 8:30 Uhr',
      profile: 'Profil',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lang') || 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
