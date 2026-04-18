import { useTranslation } from 'react-i18next';

export default function ScanResults({ result, onEdit, onAdd, onRescan }) {
  const { t } = useTranslation();

  const confidencePercent = Math.round((result.confidence || 0) * 100);

  return (
    <div className="scan-results">
      <div className="result-header">
        <div>
          <h3 className="result-name">{result.name}</h3>
          {result.brand && <p className="result-brand">{result.brand}</p>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="result-confidence">{confidencePercent}%</span>
          <p className="result-source">{result.source === 'barcode' ? t('sourceBarcode') : t('sourceAI')}</p>
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
