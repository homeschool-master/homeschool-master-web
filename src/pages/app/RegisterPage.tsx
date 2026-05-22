import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import api from '../../services/api'
import Button from '../../components/shared/Button'

const registerSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.email({ message: 'Enter a valid email address' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/\d/, { message: 'Password must contain at least one number' }),
  confirmPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type RegisterFormData = z.infer<typeof registerSchema>

const RegisterPage = () => {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const { confirmPassword, ...registerData } = data
      await api.post('/api/v1/auth/register', registerData)
      navigate('/login')
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Registration failed. Please try again.',
      })
    }
  }

  const handleAppleSignup = () => {
    console.log('Apple signup not yet implemented')
  }

  const handleGoogleSignup = () => {
    console.log('Google signup not yet implemented')
  }

  const handleLogIn = () => {
    navigate('/login')
  }

  return (
    <div className="register-page">
      <section className="register-page__hero">
        <div className="register-page__hero-content">
          <p className="register-page__hero-label">ACCOUNT</p>
          <h1 className="register-page__hero-title">CREATE AN ACCOUNT</h1>
          <p className="register-page__hero-subtitle">Sign up to start running your homeschool.</p>
        </div>
      </section>

      <section className="register-page__form-section">
        <div className="register-page__form-wrapper">
          <div className="register-page__form-column">
            <h2 className="register-page__form-title">SIGN UP</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="register-page__form">
              <div className="register-page__form-group">
                <input
                  type="text"
                  placeholder="First Name"
                  {...register('firstName')}
                  className={`register-page__input ${errors.firstName ? 'register-page__input--error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.firstName && (
                  <span className="register-page__error-message">{errors.firstName.message}</span>
                )}
              </div>

              <div className="register-page__form-group">
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register('lastName')}
                  className={`register-page__input ${errors.lastName ? 'register-page__input--error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.lastName && (
                  <span className="register-page__error-message">{errors.lastName.message}</span>
                )}
              </div>

              <div className="register-page__form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register('email')}
                  className={`register-page__input ${errors.email ? 'register-page__input--error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="register-page__error-message">{errors.email.message}</span>
                )}
              </div>

              <div className="register-page__form-group">
                <div className="register-page__password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    {...register('password')}
                    className={`register-page__input ${errors.password ? 'register-page__input--error' : ''}`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="register-page__password-toggle"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}
                  </button>
                </div>
                <span className="register-page__password-hint">8+ characters with at least one number</span>
                {errors.password && (
                  <span className="register-page__error-message">{errors.password.message}</span>
                )}
              </div>

              <div className="register-page__form-group">
                <div className="register-page__password-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    {...register('confirmPassword')}
                    className={`register-page__input ${errors.confirmPassword ? 'register-page__input--error' : ''}`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="register-page__password-toggle"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                        <line x1="1" y1="1" x2="23" y2="23"></line>
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="register-page__error-message">{errors.confirmPassword.message}</span>
                )}
              </div>

              {errors.root && <div className="register-page__api-error">{errors.root.message}</div>}

              <Button type='submit' disabled={isSubmitting} className='register-page__submit-btn'>
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </Button>

              <p className="register-page__terms-text">
                By creating an account, you agree to our{' '}
                <a href="/terms" className="register-page__terms-link">
                  Terms
                </a>{' '}
                and{' '}
                <a href="/privacy" className="register-page__terms-link">
                  Privacy Policy
                </a>
                .
              </p>
            </form>
          </div>

          <div className="register-page__divider"></div>

          <div className="register-page__social-column">
            <button
              type="button"
              onClick={handleAppleSignup}
              className="register-page__social-btn register-page__social-btn--apple"
              disabled={isSubmitting}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 13.5c-.91 0-1.71.46-2.21 1.15.39.63.75 1.35.98 2.15.27 1.02.27 2.06 0 3.08-.32 1.19-.95 2.27-1.81 3.11-.47.43-1.06.76-1.69.95-.6.18-1.22.27-1.84.27-.62 0-1.24-.09-1.84-.27-.63-.19-1.22-.52-1.69-.95-.86-.84-1.49-1.92-1.81-3.11-.27-1.02-.27-2.06 0-3.08.23-.8.59-1.52.98-2.15-.5-.69-1.3-1.15-2.21-1.15C3.68 13.5 2.5 14.68 2.5 16.14v3.36C2.5 20.96 3.54 22 4.78 22h14.44c1.24 0 2.28-1.04 2.28-2.32v-3.36c0-1.46-1.18-2.82-2.65-2.82zm-6.05-12.1c0 1.15-.93 2.08-2.08 2.08s-2.08-.93-2.08-2.08.93-2.08 2.08-2.08 2.08.93 2.08 2.08z" />
              </svg>
              Sign up with Apple
            </button>

            <button
              type="button"
              onClick={handleGoogleSignup}
              className="register-page__social-btn register-page__social-btn--google"
              disabled={isSubmitting}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </button>
          </div>
        </div>

        <div className="register-page__login-prompt">
          <button type="button" onClick={handleLogIn} className="register-page__login-link">
            Already have an account? Log in →
          </button>
        </div>
      </section>
    </div>
  )
}

export default RegisterPage
