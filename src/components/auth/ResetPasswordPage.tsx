import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../../services/api'
import Button from '../../components/shared/Button'

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string().min(1, { message: 'Please re-type your new password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [succeeded, setSucceeded] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onBlur',
  })

  // After a successful reset, redirect to login so they can sign in with the new password.
  useEffect(() => {
    if (!succeeded) return
    const timer = setTimeout(() => navigate('/login'), 4000)
    return () => clearTimeout(timer)
  }, [succeeded, navigate])

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      setError('root', { message: 'This reset link is invalid or has expired. Please request a new one.' })
      return
    }

    try {
      await api.post('/api/v1/auth/password/reset', {
        token,
        password: data.password,
      })
      setSucceeded(true)
    } catch (error: any) {
      setError('root', {
        message:
          error.response?.data?.error?.message ||
          'This reset link is invalid or has expired. Please request a new one.',
      })
    }
  }

  const handleBackToLogin = () => {
    navigate('/login')
  }

  const eyeOpen = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  )

  const eyeClosed = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  )

  return (
    <div className="auth-page">
      <section className="auth-page__hero">
        <div className="auth-page__hero-content">
          <p className="auth-page__hero-label">ACCOUNT</p>
          <h1 className="auth-page__hero-title">RESET YOUR PASSWORD</h1>
        </div>
      </section>

      <section className="auth-page__form-section">
        {succeeded ? (
          <div className="auth-page__reset-confirm">
            <h2 className="auth-page__reset-confirm-title">PASSWORD RESET</h2>
            <p className="auth-page__reset-confirm-body">
              Your password has been reset.
              <br />
              You will now be redirected to log in using your new password.
            </p>
            <Button color="white" onClick={handleBackToLogin}>Go to log in now →</Button>
          </div>
        ) : (
          <div className="auth-page__reset-request">
            <h2 className="auth-page__reset-heading">CHOOSE A NEW PASSWORD</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="auth-page__form">
              <div className="auth-page__form-group">
                <div className="auth-page__password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    {...register('password')}
                    className={`auth-page__input ${errors.password ? 'auth-page__input--error' : ''}`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="auth-page__password-toggle"
                    disabled={isSubmitting}
                  >
                    {showPassword ? eyeOpen : eyeClosed}
                  </button>
                </div>
                {errors.password && (
                  <span className="auth-page__error-message">{errors.password.message}</span>
                )}
              </div>

              <div className="auth-page__form-group">
                <div className="auth-page__password-wrapper">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Re-type New Password"
                    {...register('confirmPassword')}
                    className={`auth-page__input ${errors.confirmPassword ? 'auth-page__input--error' : ''}`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="auth-page__password-toggle"
                    disabled={isSubmitting}
                  >
                    {showConfirm ? eyeOpen : eyeClosed}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="auth-page__error-message">{errors.confirmPassword.message}</span>
                )}
              </div>

              {errors.root && <div className="auth-page__api-error">{errors.root.message}</div>}

              <Button type="submit" disabled={isSubmitting} className="auth-page__submit-btn">
                {isSubmitting ? 'Resetting...' : 'Reset Password'}
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

export default ResetPasswordPage
