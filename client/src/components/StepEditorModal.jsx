import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function StepEditorModal({ open, initial, onSave, onClose }) {
  const { t } = useTranslation();
  const [value, setValue] = useState(initial);

  useEffect(() => {
    if (open) setValue(initial);
  }, [open, initial]);

  if (!open) return null;

  function handleSubmit(e) {
    e.preventDefault();
    const n = Math.max(0, Math.min(200000, Math.round(Number(value) || 0)));
    onSave(n);
  }

  return (
    <div className="settings-overlay" onClick={onClose}>
      <form
        className="settings-modal"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <header className="settings-header">
          <h2>{t('stepsEditTitle')}</h2>
          <button
            type="button"
            className="settings-close"
            onClick={onClose}
            aria-label={t('close')}
          >
            ×
          </button>
        </header>

        <label className="settings-field">
          <span className="eyebrow">{t('stepsToday')}</span>
          <input
            type="number"
            inputMode="numeric"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            min={0}
            max={200000}
            step={100}
            autoFocus
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
