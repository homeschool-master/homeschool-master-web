import type { ReactNode } from 'react'

interface AuthLayoutProps {
  heroTitle: string
  heroSubtitle: string
  formTitle: string
  socialVerb: string
  onApple: () => void
  onGoogle: () => void
  isSubmitting: boolean
  promptLabel: string
  onPrompt: () => void
  children: ReactNode
}

const AuthLayout = ({
  heroTitle,
  heroSubtitle,
  formTitle,
  socialVerb,
  onApple,
  onGoogle,
  isSubmitting,
  promptLabel,
  onPrompt,
  children,
}: AuthLayoutProps) => {
  return (
    <div className="auth-page">
      <section className="auth-page__hero">
        <div className="auth-page__hero-content">
          <p className="auth-page__hero-label">ACCOUNT</p>
          <h1 className="auth-page__hero-title">{heroTitle}</h1>
          <p className="auth-page__hero-subtitle">{heroSubtitle}</p>
        </div>
      </section>

      <section className="auth-page__form-section">
        <div className="auth-page__form-wrapper">
          <div className="auth-page__form-column">
            <h2 className="auth-page__form-title">{formTitle}</h2>
            {children}
          </div>

          <div className="auth-page__divider"></div>

          <div className="auth-page__social-column">
            <button
              type="button"
              onClick={onApple}
              className="auth-page__social-btn auth-page__social-btn--apple"
              disabled={isSubmitting}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 13.5c-.91 0-1.71.46-2.21 1.15.39.63.75 1.35.98 2.15.27 1.02.27 2.06 0 3.08-.32 1.19-.95 2.27-1.81 3.11-.47.43-1.06.76-1.69.95-.6.18-1.22.27-1.84.27-.62 0-1.24-.09-1.84-.27-.63-.19-1.22-.52-1.69-.95-.86-.84-1.49-1.92-1.81-3.11-.27-1.02-.27-2.06 0-3.08.23-.8.59-1.52.98-2.15-.5-.69-1.3-1.15-2.21-1.15C3.68 13.5 2.5 14.68 2.5 16.14v3.36C2.5 20.96 3.54 22 4.78 22h14.44c1.24 0 2.28-1.04 2.28-2.32v-3.36c0-1.46-1.18-2.82-2.65-2.82zm-6.05-12.1c0 1.15-.93 2.08-2.08 2.08s-2.08-.93-2.08-2.08.93-2.08 2.08-2.08 2.08.93 2.08 2.08z" />
              </svg>
              {socialVerb} with Apple
            </button>

            <button
              type="button"
              onClick={onGoogle}
              className="auth-page__social-btn auth-page__social-btn--google"
              disabled={isSubmitting}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {socialVerb} with Google
            </button>
          </div>
        </div>

        <div className="auth-page__prompt">
          <button type="button" onClick={onPrompt} className="auth-page__prompt-link">
            {promptLabel}
          </button>
        </div>
      </section>
    </div>
  )
}

export default AuthLayout