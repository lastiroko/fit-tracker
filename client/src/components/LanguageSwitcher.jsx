import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher(){
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage;

  const setLang = (lng) => {
    i18n.changeLanguage(lng);
    try { localStorage.setItem('lang', lng); } catch {}
  }

  return (
    <div className="langswitch" aria-label={t('language')}>
      <button
        className={current === 'en' ? 'active' : ''}
        onClick={() => setLang('en')}
      >
        {t('english')}
      </button>
      <button
        className={current === 'de' ? 'active' : ''}
        onClick={() => setLang('de')}
      >
        {t('german')}
      </button>
    </div>
  );
}
