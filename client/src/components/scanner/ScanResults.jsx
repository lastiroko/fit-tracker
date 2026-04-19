import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { addFavorite } from '../../api';

export default function ScanResults({ result, onEdit, onAdd, onRescan }) {
  const { t } = useTranslation();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  const confidencePercent = Math.round((result.confidence || 0) * 100);

  async function handleSaveFavorite() {
    if (saved || saving) return;
    setSaving(true);
    try {
      await addFavorite(result);
      setSaved(true);
    } catch (err) {
      console.error('Failed to save favorite:', err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="scan-results">
      <div className="result-header">
        <div>
          <h3 className="result-name">{result.name}</h3>
          {result.brand && <p className="result-brand">{result.brand}</p>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="result-confidence">{confidencePercent}%</span>
          <p className="result-source">
            {result.source === 'barcode' ? t('sourceBarcode') : t('sourceAI')}
          </p>
        </div>
      </div>

      <div className="nutrition-grid">
        <div className="nutrition-item calories" style={{ gridColumn: 'span 2' }}>
          <div className="nutrition-value">{result.calories}</div>
          <div className="nutrition-label">{t('calories')}</div>
        </div>
        <div className="nutrition-item">
          <div className="nutrition-value">{result.protein}g</div>
          <div className="nutrition-label">{t('protein')}</div>
        </div>
        <div className="nutrition-item">
          <div className="nutrition-value">{result.carbs}g</div>
          <div className="nutrition-label">{t('carbs')}</div>
        </div>
        <div className="nutrition-item">
          <div className="nutrition-value">{result.fat}g</div>
          <div className="nutrition-label">{t('fat')}</div>
        </div>
        <div className="nutrition-item">
          <div className="nutrition-value">{result.servingSize || '-'}</div>
          <div className="nutrition-label">{t('serving')}</div>
        </div>
      </div>

      <button
        type="button"
        className={`favorite-toggle${saved ? ' saved' : ''}`}
        onClick={handleSaveFavorite}
        disabled={saved || saving}
      >
        {saved ? t('favoriteSaved') : t('saveAsFavorite')}
      </button>

      <div className="result-actions">
        <button type="button" className="btn-secondary" onClick={onRescan}>
          {t('rescan')}
        </button>
        <button type="button" className="btn-secondary" onClick={onEdit}>
          {t('edit')}
        </button>
        <button type="button" className="btn-primary" onClick={onAdd}>
          {t('addToLog')}
        </button>
      </div>
    </div>
  );
}
