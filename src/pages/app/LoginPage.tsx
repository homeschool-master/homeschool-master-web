import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import api from '../../services/api'
import { setUser } from '../../store/authSlice'
import type { AppDispatch } from '../../store'
import Button from '../../components/shared/Button'
import AuthLayout from '../../components/auth/AuthLayout'

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
    <AuthLayout
      heroTitle="WELCOME BACK"
      heroSubtitle="Sign in to manage your account and settings."
      formTitle="LOG IN"
      socialVerb="Log in"
      onApple={handleAppleLogin}
      onGoogle={handleGoogleLogin}
      isSubmitting={isSubmitting}
      promptLabel="Don't have an account? Sign Up →"
      onPrompt={handleSignUp}
    >
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

        <div className="auth-page__form-group">
          <div className="auth-page__password-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
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
            <span className="auth-page__error-message">{errors.password.message}</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleForgotPassword}
          className="auth-page__forgot-link"
          disabled={isSubmitting}
        >
          Forgot password?
        </button>

        {errors.root && <div className="auth-page__api-error">{errors.root.message}</div>}

        <Button type="submit" disabled={isSubmitting} className='auth-page__submit-btn'>
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </AuthLayout>
  )
}

export default LoginPage
