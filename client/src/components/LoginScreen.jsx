import { useTranslation } from 'react-i18next';

export default function LoginScreen({ denied }) {
  const { t } = useTranslation();

  function signIn() {
    window.location.href = '/oauth2/authorization/google';
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-badge" aria-hidden="true">FT</div>
        <h1 className="login-title">{t('appName')}</h1>
        <p className="login-sub">{t('loginSub')}</p>

        {denied && (
          <div className="login-error" role="alert">
            {t('loginDenied')}
          </div>
        )}

        <button type="button" className="login-google" onClick={signIn}>
          <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
            <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92c1.71-1.58 2.69-3.9 2.69-6.62z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 009 18z"/>
            <path fill="#FBBC05" d="M3.97 10.72A5.41 5.41 0 013.67 9c0-.6.1-1.18.29-1.72V4.95H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.05l3.01-2.33z"/>
            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"/>
          </svg>
          {t('loginWithGoogle')}
        </button>
      </div>
    </div>
  );
}
