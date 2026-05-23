import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../../services/api'
import Button from '../../components/shared/Button'

const forgotPasswordSchema = z.object({
  email: z.email({ message: 'Enter a valid email address' }),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

const ForgotPasswordPage = () => {
  const navigate = useNavigate()
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await api.post('/api/v1/auth/password/reset-request', data)
      setSubmittedEmail(data.email)
    } catch (error: any) {
      // Note: the API intentionally returns success even for unknown emails to avoid
      // account enumeration, so this branch only fires on network/server errors.
      setError('root', {
        message: error.response?.data?.message || 'Something went wrong. Please try again.',
      })
    }
  }

  const handleResend = async () => {
    if (!submittedEmail) return
    try {
      await api.post('/api/v1/auth/password/reset-request', { email: submittedEmail })
    } catch (error) {
      console.error('Resend failed:', error)
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  return (
    <div className="auth-page">
      <section className="auth-page__hero">
        <div className="auth-page__hero-content">
          <p className="auth-page__hero-label">ACCOUNT</p>
          <h1 className="auth-page__hero-title">RESET YOUR PASSWORD</h1>
        </div>
      </section>

      <section className="auth-page__form-section">
        {submittedEmail ? (
          <div className="auth-page__reset-confirm">
            <h2 className="auth-page__reset-confirm-title">CHECK YOUR EMAIL</h2>
            <p className="auth-page__reset-confirm-body">
              We sent a password reset link to {submittedEmail}.
              <br />
              The link expires in 1 hour.
            </p>
            <Button color="white" onClick={handleResend}>Resend Email</Button>
            <button
              type="button"
              onClick={handleBackToLogin}
              className="auth-page__reset-link"
            >
              Back to log in →
            </button>
          </div>
        ) : (
          <div className="auth-page__reset-request">
            <h2 className="auth-page__reset-heading">
              ENTER YOUR EMAIL AND WE'LL SEND YOU A RESET LINK
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-page__form">
              <div className="auth-page__form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register('email')}
                  className={`auth-page__input ${errors.email ? 'auth-page__input--error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="auth-page__error-message">{errors.email.message}</span>
                )}
              </div>

              {errors.root && <div className="auth-page__api-error">{errors.root.message}</div>}

              <Button type="submit" disabled={isSubmitting} className="auth-page__submit-btn">
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <button
                type="button"
                onClick={handleBackToLogin}
                className="auth-page__reset-link"
              >
                Remember your password? Sign in →
              </button>
            </form>
          </div>
        )}
      </section>
    </div>
  )
}

export default ForgotPasswordPage
