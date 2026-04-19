import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { buildShoppingList } from '../mealLibrary';

const STORAGE_KEY = 'fit-tracker:shopping-checked';

function loadChecked() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveChecked(set) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  } catch {}
}

function formatQty(qty, unit) {
  const rounded = Math.round(qty * 100) / 100;
  return `${rounded} ${unit}`;
}

export default function ShoppingListModal({ open, plannedMeals, onClose }) {
  const { t } = useTranslation();
  const [checked, setChecked] = useState(() => loadChecked());

  const items = useMemo(() => buildShoppingList(plannedMeals), [plannedMeals]);

  useEffect(() => {
    saveChecked(checked);
  }, [checked]);

  if (!open) return null;

  function toggle(key) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function clearChecked() {
    setChecked(new Set());
  }

  const remaining = items.filter((i) => !checked.has(`${i.name}|${i.unit}`)).length;

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div className="settings-modal picker-modal" onClick={(e) => e.stopPropagation()}>
        <header className="settings-header">
          <h2>{t('shoppingTitle')}</h2>
          <button
            type="button"
            className="settings-close"
            onClick={onClose}
            aria-label={t('close')}
          >
            ×
          </button>
        </header>

        <div className="eyebrow" style={{ opacity: 0.7 }}>
          {t('shoppingRemaining', { count: remaining, total: items.length })}
        </div>

        {items.length === 0 ? (
          <div className="picker-empty">{t('shoppingEmpty')}</div>
        ) : (
          <ul className="shopping-list">
            {items.map((item) => {
              const key = `${item.name}|${item.unit}`;
              const isChecked = checked.has(key);
              return (
                <li key={key}>
                  <label className={`shopping-row${isChecked ? ' checked' : ''}`}>
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggle(key)}
                    />
                    <span className="shopping-name">{item.name}</span>
                    <span className="shopping-qty">{formatQty(item.qty, item.unit)}</span>
                  </label>
                </li>
              );
            })}
          </ul>
        )}

        {items.length > 0 && (
          <div className="settings-actions">
            <button
              type="button"
              className="settings-btn ghost"
              onClick={clearChecked}
              disabled={checked.size === 0}
            >
              {t('shoppingClearChecked')}
            </button>
            <button type="button" className="settings-btn primary" onClick={onClose}>
              {t('close')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
