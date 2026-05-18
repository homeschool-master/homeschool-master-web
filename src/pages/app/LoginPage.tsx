import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import api from '../../services/api'
import { setUser } from '../../store/authSlice'
import type { AppDispatch } from '../../store'

const loginSchema = z.object({
  email: z.email({ message: 'Enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
})

type LoginFormData = z.infer<typeof loginSchema>

const LoginPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  })

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await api.post('/api/v1/auth/login', data)
      dispatch(setUser(response.data.user))
      navigate('/dashboard')
    } catch (error: any) {
      setError('root', {
        message: error.response?.data?.message || 'Invalid email or password',
      })
    }
  }

  const handleSignUp = () => {
    navigate('/register')
  }

  const handleForgotPassword = () => {
    navigate('/forgot-password')
  }

  const handleGoogleLogin = () => {
    console.log('Google login not yet implemented')
  }

  const handleAppleLogin = () => {
    console.log('Apple login not yet implemented')
  }

  return (
    <div className="login-page">
      <section className="login-page__hero">
        <div className="login-page__hero-content">
          <p className="login-page__hero-label">ACCOUNT</p>
          <h1 className="login-page__hero-title">WELCOME BACK</h1>
          <p className="login-page__hero-subtitle">Sign in to manage your account and settings.</p>
        </div>
      </section>

      <section className="login-page__form-section">
        <div className="login-page__form-wrapper">
          <div className="login-page__form-column">
            <h2 className="login-page__form-title">LOG IN</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="login-page__form">
              <div className="login-page__form-group">
                <input
                  type="email"
                  placeholder="Email Address"
                  {...register('email')}
                  className={`login-page__input ${errors.email ? 'login-page__input--error' : ''}`}
                  disabled={isSubmitting}
                />
                {errors.email && (
                  <span className="login-page__error-message">{errors.email.message}</span>
                )}
              </div>

              <div className="login-page__form-group">
                <div className="login-page__password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    {...register('password')}
                    className={`login-page__input ${errors.password ? 'login-page__input--error' : ''}`}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="login-page__password-toggle"
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
                {errors.password && (
                  <span className="login-page__error-message">{errors.password.message}</span>
                )}
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="login-page__forgot-link"
                disabled={isSubmitting}
              >
                Forgot password?
              </button>

              {errors.root && <div className="login-page__api-error">{errors.root.message}</div>}

              <button type="submit" disabled={isSubmitting} className="login-page__submit">
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>

          <div className="login-page__divider"></div>

          <div className="login-page__social-column">
            <button
              type="button"
              onClick={handleAppleLogin}
              className="login-page__social-btn login-page__social-btn--apple"
              disabled={isSubmitting}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 13.5c-.91 0-1.71.46-2.21 1.15.39.63.75 1.35.98 2.15.27 1.02.27 2.06 0 3.08-.32 1.19-.95 2.27-1.81 3.11-.47.43-1.06.76-1.69.95-.6.18-1.22.27-1.84.27-.62 0-1.24-.09-1.84-.27-.63-.19-1.22-.52-1.69-.95-.86-.84-1.49-1.92-1.81-3.11-.27-1.02-.27-2.06 0-3.08.23-.8.59-1.52.98-2.15-.5-.69-1.3-1.15-2.21-1.15C3.68 13.5 2.5 14.68 2.5 16.14v3.36C2.5 20.96 3.54 22 4.78 22h14.44c1.24 0 2.28-1.04 2.28-2.32v-3.36c0-1.46-1.18-2.82-2.65-2.82zm-6.05-12.1c0 1.15-.93 2.08-2.08 2.08s-2.08-.93-2.08-2.08.93-2.08 2.08-2.08 2.08.93 2.08 2.08z" />
              </svg>
              Log in with Apple
            </button>

            <button
              type="button"
              onClick={handleGoogleLogin}
              className="login-page__social-btn login-page__social-btn--google"
              disabled={isSubmitting}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Log in with Google
            </button>
          </div>
        </div>

        <div className="login-page__signup-prompt">
          <button type="button" onClick={handleSignUp} className="login-page__signup-link">
            Don't have an account? Sign Up →
          </button>
        </div>
      </section>
    </div>
  )
}

export default LoginPage
