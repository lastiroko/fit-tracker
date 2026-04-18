import { useTranslation } from 'react-i18next';

export default function ScanModeSelector({ mode, onModeChange }) {
  const { t } = useTranslation();

  return (
    <div className="scan-mode-selector">
      <button
        type="button"
        className={`mode-btn ${mode === 'barcode' ? 'active' : ''}`}
        onClick={() => onModeChange('barcode')}
      >
        {t('modeBarcode')}
      </button>
      <button
        type="button"
        className={`mode-btn ${mode === 'photo' ? 'active' : ''}`}
        onClick={() => onModeChange('photo')}
      >
        {t('modePhoto')}
      </button>
    </div>
  );
}
