import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import StepRing from './components/StepRing';
import ScannerModal from './components/scanner/ScannerModal';
import {
  getTodaySteps,
  saveMeal,
  getTodayMeals,
  getTodayStats,
  deleteMeal,
  formatMealMeta,
} from './api';
import './App.css';

const INK = '#1a1a1a';

const Glyph = {
  leaf: (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="6" fill="none" stroke={INK} strokeWidth="2" />
      <circle cx="10" cy="10" r="2.4" fill={INK} />
    </svg>
  ),
  alert: (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <path d="M10 3 L17 16 L3 16 Z" fill="none" stroke={INK} strokeWidth="2" strokeLinejoin="round" />
      <rect x="9" y="8" width="2" height="4" fill={INK} />
      <rect x="9" y="13" width="2" height="2" fill={INK} />
    </svg>
  ),
  flame: (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <rect
        x="5"
        y="5"
        width="10"
        height="10"
        fill="none"
        stroke={INK}
        strokeWidth="2"
        transform="rotate(45 10 10)"
      />
    </svg>
  ),
  steps: (
    <svg width="20" height="20" viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="7" fill="none" stroke={INK} strokeWidth="2" />
      <circle cx="10" cy="10" r="1.8" fill={INK} />
    </svg>
  ),
  scan: (
    <svg width="22" height="22" viewBox="0 0 22 22">
      <path
        d="M3 7V4h3M19 7V4h-3M3 15v3h3M19 15v3h-3"
        stroke={INK}
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      <line x1="4" y1="11" x2="18" y2="11" stroke={INK} strokeWidth="2" />
    </svg>
  ),
};

function StatCard({ bg, icon, eyebrow, value, detail, chip, chipColor }) {
  return (
    <article className="stat-card" style={{ '--stat-bg': `var(--${bg})` }}>
      <div className="icon-badge sm">{icon}</div>
      <div className="eyebrow">{eyebrow}</div>
      <div className="stat-value">{value}</div>
      <p className="stat-detail">{detail}</p>
      {chip && (
        <span className="chip" style={{ '--chip-bg': `var(--${chipColor})` }}>
          {chip}
        </span>
      )}
    </article>
  );
}

function MealRow({ title, meta, chips = [], kcal, onDelete }) {
  return (
    <li className="meal-row">
      <div className="meal-thumb" aria-hidden="true" />
      <div className="meal-main">
        <div className="meal-name">{title}</div>
        <div className="meal-meta">{meta}</div>
        {chips.length > 0 && (
          <div className="meal-chips">
            {chips.map((c, i) => (
              <span key={i} className="chip" style={{ '--chip-bg': `var(--${c.color})` }}>
                {c.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="meal-right">
        <div className="meal-kcal">{kcal}</div>
        <div className="kcal-label">kcal</div>
      </div>
      {onDelete && (
        <button
          type="button"
          className="meal-delete"
          onClick={onDelete}
          aria-label="Delete meal"
        >
          ×
        </button>
      )}
    </li>
  );
}

export default function App() {
  const { t } = useTranslation();
  const [stepData, setStepData] = useState({ steps: 6916, goal: 10000 });
  const [scannerOpen, setScannerOpen] = useState(false);
  const [scannedMeals, setScannedMeals] = useState([]);
  const [dailyStats, setDailyStats] = useState({
    nutrientScore: 0,
    pollutantScore: 0,
    calories: 0,
    calorieGoal: 1500,
    mealCount: 0,
  });

  useEffect(() => {
    getTodaySteps()
      .then(setStepData)
      .catch((err) => console.error('Failed to fetch steps:', err));
    getTodayMeals()
      .then(setScannedMeals)
      .catch((err) => console.error('Failed to fetch meals:', err));
    getTodayStats()
      .then(setDailyStats)
      .catch((err) => console.error('Failed to fetch stats:', err));
  }, []);

  async function refreshStats() {
    try {
      setDailyStats(await getTodayStats());
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    }
  }

  async function handleMealAdded(scanResult) {
    try {
      const saved = await saveMeal(scanResult);
      setScannedMeals((prev) => [saved, ...prev]);
      refreshStats();
    } catch (err) {
      console.error('Failed to save meal:', err);
      setScannedMeals((prev) => [scanResult, ...prev]);
    }
  }

  async function handleMealDelete(meal) {
    if (!meal.id) return;
    if (!window.confirm(t('confirmDeleteMeal', { name: meal.name }))) return;
    try {
      await deleteMeal(meal.id);
      setScannedMeals((prev) => prev.filter((m) => m.id !== meal.id));
      refreshStats();
    } catch (err) {
      console.error('Failed to delete meal:', err);
    }
  }

  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }).format(new Date()),
    [],
  );

  const stats = useMemo(() => {
    const empty = dailyStats.mealCount === 0;
    const caloriesLeft = Math.max(0, dailyStats.calorieGoal - dailyStats.calories);
    const movePct = Math.round((stepData.steps / stepData.goal) * 100);
    const moveLeft = Math.max(0, stepData.goal - stepData.steps);

    return [
      {
        key: 'nutrients',
        bg: 'mint',
        icon: Glyph.leaf,
        eyebrow: t('nutrients'),
        value: empty ? '—' : `${dailyStats.nutrientScore}%`,
        detail: empty ? t('statsEmptyHint') : t('nutrientsDetail'),
        chip: empty ? null : t('nutrientsChip'),
        chipColor: 'chip-green',
      },
      {
        key: 'pollutants',
        bg: 'butter',
        icon: Glyph.alert,
        eyebrow: t('pollutants'),
        value: empty ? '—' : `${dailyStats.pollutantScore}%`,
        detail: empty ? t('statsEmptyHint') : t('pollutantsDetail'),
        chip: empty ? null : t('pollutantsChip'),
        chipColor: 'chip-teal',
      },
      {
        key: 'calories',
        bg: 'sky',
        icon: Glyph.flame,
        eyebrow: t('caloriesLabel'),
        value: dailyStats.calories.toLocaleString(),
        detail: t('caloriesLeft', { kcal: caloriesLeft.toLocaleString() }),
        chip: t('caloriesChip'),
        chipColor: 'chip-violet',
      },
      {
        key: 'move',
        bg: 'lavender',
        icon: Glyph.steps,
        eyebrow: t('moveLabel'),
        value: stepData.steps.toLocaleString(),
        detail: t('moveFromGoal', { pct: 100 - movePct, left: moveLeft.toLocaleString() }),
        chip: t('moveChip'),
        chipColor: 'chip-orange',
      },
    ];
  }, [t, dailyStats, stepData]);

  const tabs = [
    { key: 'home', label: t('tabHome'), active: true, color: 'butter' },
    { key: 'meals', label: t('tabMeals'), color: 'coral' },
    { key: 'scan', label: t('tabScan'), color: 'mint' },
    { key: 'you', label: t('tabYou'), color: 'lavender' },
  ];

  return (
    <div className="app-page">
      <main className="app-shell">
        {/* Header block */}
        <header className="header-block">
          <div className="nav-row">
            <span className="nav-pill active">{t('navHome')}</span>
            <span className="nav-pill">{t('navMeals')}</span>
            <span className="nav-pill">{t('navMoves')}</span>
            <span className="nav-pill">{t('navPlan')}</span>
            <span className="spacer" />
            <LanguageSwitcher />
          </div>

          <div className="hero">
            <div className="hero-text">
              <div className="eyebrow">{todayLabel}</div>
              <h1 className="hero-title">
                {t('greetingPrefix')}
                <br />
                {t('userName')}.
              </h1>
              <p className="hero-sub">{t('heroSub')}</p>
            </div>
            <div className="pixel-portrait" aria-hidden="true">
              <img src="/pixel-portrait.png" alt="" />
            </div>
          </div>

          <div className="step-ring-card">
            <StepRing value={stepData.steps} max={stepData.goal} />
          </div>
        </header>

        {/* Scan CTA */}
        <button
          type="button"
          className="scan-card"
          onClick={() => setScannerOpen(true)}
        >
          <div className="icon-badge">{Glyph.scan}</div>
          <div className="scan-copy">
            <div className="eyebrow">{t('scanModeTitle')}</div>
            <h2>{t('scanHeadline')}</h2>
            <p className="scan-sub">{t('scanModeSubtitle')}</p>
          </div>
          <span className="scan-arrow" aria-hidden="true">
            →
          </span>
        </button>

        {/* Stat grid */}
        <section className="section" aria-labelledby="daily-stats">
          <div className="section-head">
            <h2 id="daily-stats" className="section-title">
              {t('dailyStats')}
            </h2>
            <div className="eyebrow">{t('dailyStatsSubtitle')}</div>
          </div>
          <div className="stat-grid">
            {stats.map((s) => (
              <StatCard key={s.key} {...s} />
            ))}
          </div>
        </section>

        {/* Meal log */}
        <section className="section" aria-labelledby="meal-log">
          <div className="section-head">
            <div>
              <h2 id="meal-log" className="section-title">
                {t('mealLog')}
              </h2>
              <div className="eyebrow" style={{ marginTop: 2, opacity: 0.7 }}>
                {t('mealCaloriesToday', { kcal: dailyStats.calories.toLocaleString() })}
              </div>
            </div>
            <button
              type="button"
              className="nav-pill butter"
              onClick={() => setScannerOpen(true)}
            >
              {t('addShort')}
            </button>
          </div>

          {scannedMeals.length === 0 ? (
            <button
              type="button"
              className="meal-empty"
              onClick={() => setScannerOpen(true)}
            >
              <div className="icon-badge sm">{Glyph.scan}</div>
              <div>
                <div className="meal-empty-title">{t('mealEmptyTitle')}</div>
                <div className="meal-empty-hint">{t('mealEmptyHint')}</div>
              </div>
              <span className="meal-empty-arrow" aria-hidden="true">→</span>
            </button>
          ) : (
            <ul className="meal-log-list">
              {scannedMeals.map((meal) => (
                <MealRow
                  key={meal.id ?? `scanned-${meal.createdAt}-${meal.name}`}
                  title={meal.name}
                  meta={formatMealMeta(meal)}
                  kcal={meal.calories}
                  chips={[
                    {
                      label: meal.source === 'barcode' ? t('sourceBarcode') : t('sourceAI'),
                      color: meal.source === 'barcode' ? 'chip-teal' : 'chip-violet',
                    },
                  ]}
                  onDelete={meal.id ? () => handleMealDelete(meal) : undefined}
                />
              ))}
            </ul>
          )}
        </section>

        {/* Bottom tab bar */}
        <nav className="tab-bar" aria-label="Primary">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`tab${tab.active ? ' active' : ''}`}
              style={{ '--tab-color': `var(--${tab.color})` }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </main>

      <ScannerModal
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onMealAdded={handleMealAdded}
      />
    </div>
  );
}
