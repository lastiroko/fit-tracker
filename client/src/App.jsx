import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import './App.css';

export default function App() {
  const { t } = useTranslation();

  const todayLabel = useMemo(() => {
    return new Intl.DateTimeFormat(undefined, { month: 'long', day: 'numeric' }).format(new Date());
  }, []);

  const stats = useMemo(() => [
    {
      key: 'nutrients',
      label: t('nutrients'),
      value: t('nutrientsValue'),
      percent: 76,
      tone: 'good',
      detail: t('nutrientsDetail'),
    },
    {
      key: 'pollutants',
      label: t('pollutants'),
      value: t('pollutantsValue'),
      percent: 18,
      tone: 'warn',
      detail: t('pollutantsDetail'),
    },
  ], [t]);

  const meals = useMemo(() => [
    {
      key: 'salmon',
      name: t('mealSalmon'),
      detail: t('mealSalmonDetail'),
      tag: t('mealTagDetox'),
      action: t('buy'),
    },
    {
      key: 'salad',
      name: t('mealSalad'),
      detail: t('mealSaladDetail'),
    },
  ], [t]);

  return (
    <div className="app-page">
      <div className="app-backdrop" aria-hidden="true">
        <span className="backdrop-shape primary" />
        <span className="backdrop-shape accent" />
      </div>

      <main className="app-shell">
        <header className="topbar">
          <div className="topbar-text">
            <span className="eyebrow">{t('today')}</span>
            <h1>{t('homeTitle')}</h1>
            <span className="topbar-date">{todayLabel}</span>
          </div>
          <div className="topbar-actions">
            <LanguageSwitcher />
            <button className="avatar-button" type="button" aria-label={t('profile')}>
              JA
            </button>
          </div>
        </header>

        <section className="scan-card" aria-labelledby="scan-mode">
          <div className="scan-copy">
            <h2 id="scan-mode">{t('scanModeTitle')}</h2>
            <p>{t('scanModeSubtitle')}</p>
          </div>
          <button className="scan-button" type="button">
            {t('scanCta')}
          </button>
          <p className="scan-hint">{t('scanHint')}</p>
        </section>

        <section className="card stats-card" aria-labelledby="daily-stats">
          <div className="card-header">
            <div>
              <h2 id="daily-stats">{t('dailyStats')}</h2>
              <p className="meta">{t('dailyStatsSubtitle')}</p>
            </div>
            <button className="ghost-button" type="button">{t('viewAll')}</button>
          </div>

          <div className="stat-grid">
            {stats.map((stat) => (
              <article key={stat.key} className="stat-item">
                <div className="stat-header">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-value">{stat.value}</span>
                </div>
                <div
                  className={`progress ${stat.tone === 'warn' ? 'warn' : ''}`}
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={stat.percent}
                  aria-label={stat.label}
                >
                  <div className="progress-bar" style={{ width: `${stat.percent}%` }} />
                </div>
                <p className="stat-detail">{stat.detail}</p>
              </article>
            ))}
          </div>

          <div className="card-divider" role="presentation" />

          <div className="meal-header">
            <div>
              <h3>{t('mealLog')}</h3>
              <p className="meta">{t('mealCaloriesToday')}</p>
            </div>
            <button className="ghost-button" type="button">{t('addMeal')}</button>
          </div>

          <ul className="meal-list">
            {meals.map((meal) => (
              <li key={meal.key} className="meal-item">
                <div>
                  <p className="meal-name">{meal.name}</p>
                  <p className="meta">{meal.detail}</p>
                </div>
                <div className="meal-actions">
                  {meal.tag ? <span className="chip">{meal.tag}</span> : null}
                  {meal.action ? <button type="button" className="pill-button">{meal.action}</button> : null}
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
