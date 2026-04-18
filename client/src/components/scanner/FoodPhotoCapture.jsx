import { useTranslation } from 'react-i18next';
import { scanPhoto } from '../../api';

export default function FoodPhotoCapture({ captureFrame, onResult, onLoading, loading }) {
  const { t } = useTranslation();

  async function handleCapture() {
    const imageData = captureFrame();
    if (!imageData) return;

    onLoading(true);
    try {
      const result = await scanPhoto(imageData);
      onResult(result);
    } catch (err) {
      console.error('Photo scan failed:', err);
      onLoading(false);
    }
  }

  return (
    <button
      type="button"
      className="capture-btn"
      onClick={handleCapture}
      disabled={loading}
      aria-label={t('capturePhoto')}
    />
  );
}
