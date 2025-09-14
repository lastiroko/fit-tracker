import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';

export default function App() {
  const { t } = useTranslation();

  return (
    <div className="container">
      <header className="header">
        <div>
          <h1 className="h1">{t('appName')}</h1>
          <div className="tagline">{t('tagline')}</div>
        </div>
        <LanguageSwitcher />
      </header>

      <section className="card">
        <h2>{t('steps')}</h2>
        <p className="tagline">6,916 / 10,000</p>
      </section>

      <section className="card">
        <h2>{t('workouts')}</h2>
        <p className="tagline">Morning Run · 30 min · 240 kcal</p>
      </section>

      <section className="card">
        <h2>{t('achievements')}</h2>
        <p className="tagline">Streak · 3 days</p>
      </section>

      <section className="card">
        <h2>{t('recommendations')}</h2>
        <p className="tagline">Light stretch before bed</p>
      </section>
    </div>
  );
}
