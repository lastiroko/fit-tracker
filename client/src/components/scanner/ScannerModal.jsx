import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import useCamera from './hooks/useCamera';
import CameraView from './CameraView';
import ScanModeSelector from './ScanModeSelector';
import BarcodeScanner from './BarcodeScanner';
import FoodPhotoCapture from './FoodPhotoCapture';
import ScanResults from './ScanResults';
import FoodEditor from './FoodEditor';
import './ScannerModal.css';

export default function ScannerModal({ open, onClose, onMealAdded }) {
  const { t } = useTranslation();
  const [mode, setMode] = useState('barcode');
  const [scanResult, setScanResult] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const usePhotoCamera = open && !scanResult && mode === 'photo';
  const { videoRef, error, ready, captureFrame, stopStream } = useCamera(usePhotoCamera);

  function handleClose() {
    stopStream();
    setScanResult(null);
    setEditing(false);
    setLoading(false);
    onClose();
  }

  function handleScanResult(result) {
    setLoading(false);
    setScanResult(result);
  }

  function handleEdit() {
    setEditing(true);
  }

  function handleSave(editedResult) {
    setEditing(false);
    setScanResult(editedResult);
  }

  function handleAddToLog() {
    if (scanResult && onMealAdded) {
      onMealAdded(scanResult);
    }
    handleClose();
  }

  function handleRescan() {
    setScanResult(null);
    setEditing(false);
  }

  if (!open) return null;

  return (
    <div className="scanner-overlay" onClick={handleClose}>
      <div className="scanner-modal" onClick={(e) => e.stopPropagation()}>
        <header className="scanner-header">
          <h2>{t('scannerTitle')}</h2>
          <button type="button" className="close-btn" onClick={handleClose} aria-label={t('close')}>
            &times;
          </button>
        </header>

        {!scanResult && (
          <>
            <ScanModeSelector mode={mode} onModeChange={setMode} />
            <div className="scanner-content">
              {mode === 'barcode' && (
                <BarcodeScanner
                  onResult={handleScanResult}
                  onLoading={setLoading}
                />
              )}
              {mode === 'photo' && (
                <>
                  <CameraView videoRef={videoRef} error={error} ready={ready} />
                  {ready && !error && (
                    <FoodPhotoCapture
                      captureFrame={captureFrame}
                      onResult={handleScanResult}
                      onLoading={setLoading}
                      loading={loading}
                    />
                  )}
                </>
              )}
            </div>
            {loading && <div className="scanner-loading-bar">{t('scanning')}</div>}
          </>
        )}

        {scanResult && !editing && (
          <ScanResults
            result={scanResult}
            onEdit={handleEdit}
            onAdd={handleAddToLog}
            onRescan={handleRescan}
          />
        )}

        {scanResult && editing && (
          <FoodEditor
            result={scanResult}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        )}
      </div>
    </div>
  );
}
