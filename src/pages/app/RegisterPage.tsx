import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import api from '../../services/api'
import Button from '../../components/shared/Button'
import AuthLayout from '../../components/auth/AuthLayout'

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
    <AuthLayout
      heroTitle="CREATE AN ACCOUNT"
      heroSubtitle="Sign up to start running your homeschool."
      formTitle="SIGN UP"
      socialVerb="Sign up"
      onApple={handleAppleSignup}
      onGoogle={handleGoogleSignup}
      isSubmitting={isSubmitting}
      promptLabel="Already have an account? Log in →"
      onPrompt={handleLogIn}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="auth-page__form">
        <div className="auth-page__form-group">
          <input
            type="text"
            placeholder="First Name"
            {...register('firstName')}
            className={`auth-page__input ${errors.firstName ? 'auth-page__input--error' : ''}`}
            disabled={isSubmitting}
          />
          {errors.firstName && (
            <span className="auth-page__error-message">{errors.firstName.message}</span>
          )}
        </div>

        <div className="auth-page__form-group">
          <input
            type="text"
            placeholder="Last Name"
            {...register('lastName')}
            className={`auth-page__input ${errors.lastName ? 'auth-page__input--error' : ''}`}
            disabled={isSubmitting}
          />
          {errors.lastName && (
            <span className="auth-page__error-message">{errors.lastName.message}</span>
          )}
        </div>

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
          <span className="auth-page__password-hint">8+ characters with at least one number</span>
          {errors.password && (
            <span className="auth-page__error-message">{errors.password.message}</span>
          )}
        </div>

        <div className="auth-page__form-group">
          <div className="auth-page__password-wrapper">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              {...register('confirmPassword')}
              className={`auth-page__input ${errors.confirmPassword ? 'auth-page__input--error' : ''}`}
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="auth-page__password-toggle"
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
            <span className="auth-page__error-message">{errors.confirmPassword.message}</span>
          )}
        </div>

        {errors.root && <div className="auth-page__api-error">{errors.root.message}</div>}

        <Button type='submit' disabled={isSubmitting} className='auth-page__submit-btn'>
          {isSubmitting ? 'Creating Account...' : 'Create Account'}
        </Button>

        <p className="auth-page__terms-text">
          By creating an account, you agree to our{' '}
          <a href="/terms" className="auth-page__terms-link">
            Terms
          </a>{' '}
          and{' '}
          <a href="/privacy" className="auth-page__terms-link">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </AuthLayout>
  )
}

export default RegisterPage
