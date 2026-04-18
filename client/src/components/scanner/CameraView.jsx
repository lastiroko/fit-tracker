import { useTranslation } from 'react-i18next';

export default function CameraView({ videoRef, error, ready }) {
  const { t } = useTranslation();

  if (error === 'permission') {
    return (
      <div className="camera-error">
        <p>{t('cameraPermissionDenied')}</p>
      </div>
    );
  }

  if (error === 'unavailable') {
    return (
      <div className="camera-error">
        <p>{t('cameraUnavailable')}</p>
      </div>
    );
  }

  return (
    <div className="camera-view">
      <video ref={videoRef} playsInline muted />
      {!ready && <div className="camera-loading">{t('cameraLoading')}</div>}
    </div>
  );
}
