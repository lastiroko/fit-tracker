import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function SettingsModal({ open, settings, onSave, onClose }) {
  const { t } = useTranslation();
  const [name, setName] = useState(settings.name);
  const [calorieGoal, setCalorieGoal] = useState(settings.calorieGoal);
  const [stepGoal, setStepGoal] = useState(settings.stepGoal);
  const [weeklyBudget, setWeeklyBudget] = useState(settings.weeklyBudget);

  useEffect(() => {
    if (open) {
      setName(settings.name);
      setCalorieGoal(settings.calorieGoal);
      setStepGoal(settings.stepGoal);
      setWeeklyBudget(settings.weeklyBudget);
    }
  }, [open, settings]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      name: name.trim() || 'You',
      calorieGoal: Math.max(200, Math.min(10000, Number(calorieGoal) || 1500)),
      stepGoal: Math.max(500, Math.min(100000, Number(stepGoal) || 10000)),
      weeklyBudget: Math.max(0, Math.min(10000, Number(weeklyBudget) || 0)),
    });
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <form
        className="settings-modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <header className="settings-header">
          <h2>{t('settingsTitle')}</h2>
          <button type="button" className="settings-close" onClick={onClose} aria-label={t('close')}>
            ×
          </button>
        </header>

        <label className="settings-field">
          <span className="eyebrow">{t('settingsName')}</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={24}
            autoComplete="given-name"
          />
        </label>

        <label className="settings-field">
          <span className="eyebrow">{t('settingsCalorieGoal')}</span>
          <input
            type="number"
            inputMode="numeric"
            value={calorieGoal}
            onChange={(e) => setCalorieGoal(e.target.value)}
            min={200}
            max={10000}
            step={50}
          />
        </label>

        <label className="settings-field">
          <span className="eyebrow">{t('settingsStepGoal')}</span>
          <input
            type="number"
            inputMode="numeric"
            value={stepGoal}
            onChange={(e) => setStepGoal(e.target.value)}
            min={500}
            max={100000}
            step={500}
          />
        </label>

        <label className="settings-field">
          <span className="eyebrow">{t('settingsWeeklyBudget')}</span>
          <input
            type="number"
            inputMode="decimal"
            value={weeklyBudget}
            onChange={(e) => setWeeklyBudget(e.target.value)}
            min={0}
            max={10000}
            step={5}
          />
        </label>

        <div className="settings-actions">
          <button type="button" className="settings-btn ghost" onClick={onClose}>
            {t('cancel')}
          </button>
          <button type="submit" className="settings-btn primary">
            {t('save')}
          </button>
        </div>
      </form>
    </div>
  );
}
