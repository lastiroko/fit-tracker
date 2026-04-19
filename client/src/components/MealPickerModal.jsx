import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MEAL_CATEGORIES, MEAL_LIBRARY } from '../mealLibrary';

export default function MealPickerModal({ open, defaultCategory = 'breakfast', onPick, onClose }) {
  const { t } = useTranslation();
  const [category, setCategory] = useState(defaultCategory);
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MEAL_LIBRARY.filter((m) => {
      if (m.category !== category) return false;
      if (!q) return true;
      return m.name.toLowerCase().includes(q);
    });
  }, [category, query]);

  if (!open) return null;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div
        className="settings-modal picker-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="settings-header">
          <h2>{t('pickerTitle')}</h2>
          <button
            type="button"
            className="settings-close"
            onClick={onClose}
            aria-label={t('close')}
          >
            ×
          </button>
        </header>

        <div className="picker-categories">
          {MEAL_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`nav-pill${category === c ? ' active' : ''}`}
              onClick={() => setCategory(c)}
            >
              {t(`slot_${c}`)}
            </button>
          ))}
        </div>

        <input
          type="search"
          className="picker-search"
          placeholder={t('pickerSearch')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <ul className="picker-list">
          {results.length === 0 && (
            <li className="picker-empty">{t('pickerEmpty')}</li>
          )}
          {results.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                className="picker-item"
                onClick={() => onPick(m)}
              >
                <div className="picker-item-main">
                  <div className="picker-item-name">{m.name}</div>
                  <div className="picker-item-meta">
                    P{Math.round(m.protein)} · C{Math.round(m.carbs)} · F{Math.round(m.fat)} · {m.serving}
                  </div>
                </div>
                <div className="picker-item-kcal">
                  <div className="meal-kcal">{m.calories}</div>
                  <div className="kcal-label">kcal</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
