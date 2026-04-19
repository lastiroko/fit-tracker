import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './components/LanguageSwitcher';
import LoginScreen from './components/LoginScreen';
import StepRing from './components/StepRing';
import SettingsModal from './components/SettingsModal';
import StepEditorModal from './components/StepEditorModal';
import WeekChart from './components/WeekChart';
import QuickLogStrip from './components/QuickLogStrip';
import ScannerModal from './components/scanner/ScannerModal';
import {
  getTodaySteps,
  saveMeal,
  getTodayMeals,
  getTodayStats,
  getWeekStats,
  deleteMeal,
  setTodaySteps,
  getWeekSteps,
  getRecentMeals,
  getCurrentUser,
  logout,
  getFavorites,
  removeFavorite,
  formatMealMeta,
} from './api';
import './App.css';

const INK = '#1a1a1a';

const DEFAULT_SETTINGS = { name: 'You', calorieGoal: 1500, stepGoal: 10000 };

function loadSettings() {
  try {
    const raw = localStorage.getItem('fit-tracker:settings');
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      name: typeof parsed.name === 'string' && parsed.name ? parsed.name : DEFAULT_SETTINGS.name,
      calorieGoal: Number(parsed.calorieGoal) || DEFAULT_SETTINGS.calorieGoal,
      stepGoal: Number(parsed.stepGoal) || DEFAULT_SETTINGS.stepGoal,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

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
  const [stepData, setStepData] = useState({ steps: 0, goal: 10000 });
  const [weekSteps, setWeekSteps] = useState([]);
  const [weekStats, setWeekStats] = useState([]);
  const [allMeals, setAllMeals] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [view, setView] = useState('home');
  const [scannerOpen, setScannerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [stepEditorOpen, setStepEditorOpen] = useState(false);
  const [authUser, setAuthUser] = useState(undefined); // undefined = loading, null = signed out
  const [authDenied, setAuthDenied] = useState(
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('auth') === 'denied',
  );

  useEffect(() => {
    getCurrentUser()
      .then((u) => setAuthUser(u))
      .catch(() => setAuthUser(null));
  }, []);
  const [scannedMeals, setScannedMeals] = useState([]);
  const [dailyStats, setDailyStats] = useState({
    nutrientScore: 0,
    pollutantScore: 0,
    calories: 0,
    calorieGoal: 1500,
    mealCount: 0,
  });
  const [settings, setSettings] = useState(() => loadSettings());

  useEffect(() => {
    try {
      localStorage.setItem('fit-tracker:settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    if (!authUser) return;
    getTodaySteps()
      .then(setStepData)
      .catch((err) => console.error('Failed to fetch steps:', err));
    getWeekSteps()
      .then(setWeekSteps)
      .catch((err) => console.error('Failed to fetch week steps:', err));
    getTodayMeals()
      .then(setScannedMeals)
      .catch((err) => console.error('Failed to fetch meals:', err));
    getTodayStats()
      .then(setDailyStats)
      .catch((err) => console.error('Failed to fetch stats:', err));
    getWeekStats()
      .then(setWeekStats)
      .catch((err) => console.error('Failed to fetch week stats:', err));
    getFavorites()
      .then(setFavorites)
      .catch((err) => console.error('Failed to fetch favorites:', err));
  }, [authUser]);

  async function handleStepsSave(count) {
    try {
      const updated = await setTodaySteps(count);
      setStepData(updated);
      setStepEditorOpen(false);
      getWeekSteps().then(setWeekSteps).catch(() => {});
    } catch (err) {
      console.error('Failed to save steps:', err);
    }
  }

  async function refreshStats() {
    try {
      const [today, week] = await Promise.all([getTodayStats(), getWeekStats()]);
      setDailyStats(today);
      setWeekStats(week);
    } catch (err) {
      console.error('Failed to refresh stats:', err);
    }
  }

  useEffect(() => {
    if (view !== 'meals') return;
    getRecentMeals(30)
      .then(setAllMeals)
      .catch((err) => console.error('Failed to fetch all meals:', err));
  }, [view]);

  async function handleMealAdded(scanResult) {
    try {
      const saved = await saveMeal(scanResult);
      setScannedMeals((prev) => [saved, ...prev]);
      refreshStats();
      getFavorites().then(setFavorites).catch(() => {});
    } catch (err) {
      console.error('Failed to save meal:', err);
      setScannedMeals((prev) => [scanResult, ...prev]);
    }
  }

  async function handleQuickLog(scanResult) {
    try {
      const saved = await saveMeal(scanResult);
      setScannedMeals((prev) => [saved, ...prev]);
      refreshStats();
    } catch (err) {
      console.error('Failed to quick-log:', err);
    }
  }

  async function handleRemoveFavorite(id) {
    try {
      await removeFavorite(id);
      setFavorites((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      console.error('Failed to remove favorite:', err);
    }
  }

  async function handleMealDelete(meal) {
    if (!meal.id) return;
    if (!window.confirm(t('confirmDeleteMeal', { name: meal.name }))) return;
    try {
      await deleteMeal(meal.id);
      setScannedMeals((prev) => prev.filter((m) => m.id !== meal.id));
      setAllMeals((prev) => prev.filter((m) => m.id !== meal.id));
      refreshStats();
    } catch (err) {
      console.error('Failed to delete meal:', err);
    }
  }

  const mealsByDate = useMemo(() => {
    const groups = new Map();
    for (const m of allMeals) {
      if (!m.createdAt) continue;
      const d = new Date(m.createdAt);
      const label = new Intl.DateTimeFormat(undefined, {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      }).format(d);
      const key = d.toISOString().slice(0, 10);
      if (!groups.has(key)) groups.set(key, { key, label, meals: [] });
      groups.get(key).meals.push(m);
    }
    return [...groups.values()];
  }, [allMeals]);

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
    const caloriesLeft = Math.max(0, settings.calorieGoal - dailyStats.calories);
    const movePct = Math.round((stepData.steps / settings.stepGoal) * 100);
    const moveLeft = Math.max(0, settings.stepGoal - stepData.steps);

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
  }, [t, dailyStats, stepData, settings]);

  const tabs = [
    { key: 'home', label: t('tabHome'), color: 'butter' },
    { key: 'meals', label: t('tabMeals'), color: 'coral' },
    { key: 'scan', label: t('tabScan'), color: 'mint' },
    { key: 'you', label: t('tabYou'), color: 'lavender' },
  ];

  function handleTabClick(key) {
    if (key === 'scan') {
      setScannerOpen(true);
      return;
    }
    setView(key);
  }

  if (authUser === undefined) {
    return <div className="app-page" aria-busy="true" />;
  }

  if (authUser === null) {
    return <LoginScreen denied={authDenied} />;
  }

  return (
    <div className="app-page">
      <main className="app-shell">
        {view === 'home' && (
        <>
        {/* Header block */}
        <header className="header-block">
          <div className="nav-row">
            <div className="eyebrow">{t('appName')}</div>
            <span className="spacer" />
            <LanguageSwitcher />
          </div>

          <div className="hero">
            <div className="hero-text">
              <div className="eyebrow">{todayLabel}</div>
              <h1 className="hero-title">
                {t('greetingPrefix')}
                <br />
                {settings.name}.
              </h1>
              <p className="hero-sub">{t('heroSub')}</p>
            </div>
            <button
              type="button"
              className="pixel-portrait"
              onClick={() => setSettingsOpen(true)}
              aria-label={t('settingsTitle')}
            >
              <img src="/pixel-portrait.png" alt="" />
            </button>
          </div>

          <button
            type="button"
            className="step-ring-card step-ring-button"
            onClick={() => setStepEditorOpen(true)}
            aria-label={t('stepsEditTitle')}
          >
            <StepRing value={stepData.steps} max={settings.stepGoal} />
            <span className="step-ring-edit">{t('stepsEditHint')}</span>
          </button>

          <WeekChart
            days={weekSteps.map((d) => ({ date: d.date, value: d.count }))}
            goal={settings.stepGoal}
            title={t('weekStepsTitle')}
            goalLabel={t('weekStepsGoal', { goal: settings.stepGoal.toLocaleString() })}
          />

          <WeekChart
            days={weekStats.map((d) => ({ date: d.date, value: d.nutrientScore }))}
            goal={70}
            yMaxFloor={100}
            title={t('weekNutrientsTitle')}
            goalLabel={t('weekNutrientsGoal')}
            barColor="var(--mint)"
            todayColor="var(--chip-green)"
            format={(n) => `${n}%`}
          />
        </header>

        <QuickLogStrip
          favorites={favorites}
          onQuickLog={handleQuickLog}
          onRemoveFavorite={handleRemoveFavorite}
        />

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
            <div className="eyebrow">
              {t('dailyStatsGoal', { kcal: settings.calorieGoal.toLocaleString() })}
            </div>
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
        </>
        )}

        {view === 'meals' && (
          <>
            <header className="view-header">
              <div className="eyebrow">{t('viewMealsEyebrow')}</div>
              <h1 className="view-title">{t('viewMealsTitle')}</h1>
            </header>
            <section className="section">
              {mealsByDate.length === 0 ? (
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
                mealsByDate.map((group) => (
                  <div key={group.key} className="day-group">
                    <div className="day-group-head">
                      <div className="section-title">{group.label}</div>
                      <div className="eyebrow" style={{ opacity: 0.7 }}>
                        {t('mealCaloriesToday', {
                          kcal: group.meals.reduce((a, m) => a + (m.calories || 0), 0).toLocaleString(),
                        })}
                      </div>
                    </div>
                    <ul className="meal-log-list">
                      {group.meals.map((meal) => (
                        <MealRow
                          key={meal.id}
                          title={meal.name}
                          meta={formatMealMeta(meal)}
                          kcal={meal.calories}
                          chips={[
                            {
                              label: meal.source === 'barcode' ? t('sourceBarcode') : t('sourceAI'),
                              color: meal.source === 'barcode' ? 'chip-teal' : 'chip-violet',
                            },
                          ]}
                          onDelete={() => handleMealDelete(meal)}
                        />
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </section>
          </>
        )}

        {view === 'you' && (
          <>
            <header className="view-header">
              <div className="eyebrow">{t('viewYouEyebrow')}</div>
              <h1 className="view-title">{t('settingsTitle')}</h1>
            </header>
            <section className="section you-section">
              <button
                type="button"
                className="you-profile-card"
                onClick={() => setSettingsOpen(true)}
              >
                <div className="pixel-portrait you-portrait" aria-hidden="true">
                  <img src="/pixel-portrait.png" alt="" />
                </div>
                <div>
                  <div className="eyebrow">{t('settingsName')}</div>
                  <div className="you-name">{settings.name}</div>
                </div>
                <span className="scan-arrow" aria-hidden="true">→</span>
              </button>

              <div className="you-goal-grid">
                <div className="you-goal-card">
                  <div className="eyebrow">{t('settingsCalorieGoal')}</div>
                  <div className="you-goal-value">{settings.calorieGoal.toLocaleString()}</div>
                  <div className="kcal-label">kcal / day</div>
                </div>
                <div className="you-goal-card">
                  <div className="eyebrow">{t('settingsStepGoal')}</div>
                  <div className="you-goal-value">{settings.stepGoal.toLocaleString()}</div>
                  <div className="kcal-label">steps / day</div>
                </div>
              </div>

              <div className="you-lang-row">
                <div className="eyebrow">{t('language')}</div>
                <LanguageSwitcher />
              </div>

              <button
                type="button"
                className="you-edit-btn"
                onClick={() => setSettingsOpen(true)}
              >
                {t('settingsTitle')} →
              </button>

              <button
                type="button"
                className="you-edit-btn"
                style={{ background: '#fff', color: 'var(--ink)', boxShadow: 'none' }}
                onClick={async () => {
                  await logout();
                  setAuthUser(null);
                }}
              >
                {t('signOut')}
              </button>
            </section>
          </>
        )}

        {/* Bottom tab bar */}
        <nav className="tab-bar" aria-label="Primary">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              className={`tab${view === tab.key ? ' active' : ''}`}
              style={{ '--tab-color': `var(--${tab.color})` }}
              onClick={() => handleTabClick(tab.key)}
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

      <SettingsModal
        open={settingsOpen}
        settings={settings}
        onSave={(next) => {
          setSettings(next);
          setSettingsOpen(false);
        }}
        onClose={() => setSettingsOpen(false)}
      />

      <StepEditorModal
        open={stepEditorOpen}
        initial={stepData.steps}
        onSave={handleStepsSave}
        onClose={() => setStepEditorOpen(false)}
      />
    </div>
  );
}
