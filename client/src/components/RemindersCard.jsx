import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getPreferences, updatePreferences } from '../api';
import { ensurePermission, pushSupported, subscribePush, unsubscribePush } from '../push';

const CYCLES = ['bulk', 'cut', 'maintain'];
const DEFAULT_TIMES = ['08:00', '12:30', '18:30'];

function clientTz() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export default function RemindersCard() {
  const { t } = useTranslation();
  const [prefs, setPrefs] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getPreferences()
      .then((p) => {
        setPrefs({
          ...p,
          timezone: p.timezone && p.timezone !== 'UTC' ? p.timezone : clientTz(),
          mealTimes: p.mealTimes?.length ? p.mealTimes : DEFAULT_TIMES,
        });
      })
      .catch((err) => console.error('Failed to load preferences:', err));
  }, []);

  if (!prefs) return null;

  function updateLocal(patch) {
    setPrefs((cur) => ({ ...cur, ...patch }));
  }

  function setTime(idx, value) {
    const next = [...prefs.mealTimes];
    next[idx] = value;
    updateLocal({ mealTimes: next });
  }

  function addTime() {
    updateLocal({ mealTimes: [...prefs.mealTimes, '15:00'] });
  }

  function removeTime(idx) {
    const next = prefs.mealTimes.filter((_, i) => i !== idx);
    updateLocal({ mealTimes: next });
  }

  async function handleToggleEnable(nextEnabled) {
    setError(null);
    if (nextEnabled) {
      if (!pushSupported()) {
        setError(t('remindersUnsupported'));
        return;
      }
      const perm = await ensurePermission();
      if (perm !== 'granted') {
        setError(t('remindersPermissionDenied'));
        return;
      }
      try {
        await subscribePush();
      } catch (err) {
        setError(err.message === 'push-not-configured' ? t('remindersServerNotConfigured') : t('remindersSubscribeFailed'));
        return;
      }
    } else {
      await unsubscribePush();
    }
    updateLocal({ remindersEnabled: nextEnabled });
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const saved = await updatePreferences({
        ...prefs,
        timezone: clientTz(),
        mealTimes: prefs.mealTimes.filter(Boolean),
      });
      setPrefs({
        ...saved,
        mealTimes: saved.mealTimes?.length ? saved.mealTimes : DEFAULT_TIMES,
      });
    } catch (err) {
      console.error('Failed to save preferences:', err);
      setError(t('remindersSaveFailed'));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="reminders-card">
      <div className="reminders-head">
        <div>
          <div className="eyebrow">{t('remindersEyebrow')}</div>
          <div className="you-name">{t('remindersTitle')}</div>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={!!prefs.remindersEnabled}
            onChange={(e) => handleToggleEnable(e.target.checked)}
          />
          <span className="switch-slider" />
        </label>
      </div>

      <div className="eyebrow" style={{ marginTop: 4, opacity: 0.7 }}>
        {t('remindersCycleLabel')}
      </div>
      <div className="reminders-cycles">
        {CYCLES.map((c) => (
          <button
            key={c}
            type="button"
            className={`nav-pill${prefs.cycle === c ? ' active' : ''}`}
            onClick={() => updateLocal({ cycle: c })}
          >
            {t(`cycle_${c}`)}
          </button>
        ))}
      </div>

      <div className="eyebrow" style={{ marginTop: 12, opacity: 0.7 }}>
        {t('remindersTimesLabel')}
      </div>
      <div className="reminders-times">
        {prefs.mealTimes.map((tm, idx) => (
          <div className="reminders-time-row" key={idx}>
            <input
              type="time"
              value={tm}
              onChange={(e) => setTime(idx, e.target.value)}
            />
            <button
              type="button"
              className="meal-delete"
              aria-label={t('remove')}
              onClick={() => removeTime(idx)}
            >
              ×
            </button>
          </div>
        ))}
        <button type="button" className="nav-pill butter" onClick={addTime}>
          + {t('remindersAddTime')}
        </button>
      </div>

      {error && <div className="login-error" style={{ marginTop: 10 }}>{error}</div>}

      <button
        type="button"
        className="you-edit-btn"
        style={{ marginTop: 14 }}
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? t('loading') : t('save')}
      </button>
    </div>
  );
}
