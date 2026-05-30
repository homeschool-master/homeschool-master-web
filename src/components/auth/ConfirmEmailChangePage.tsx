import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../../services/api'

type Status = 'loading' | 'success' | 'error'

const ConfirmEmailChangePage = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<Status>('loading')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('error')
      setErrorMessage('This confirmation link is missing its token.')
      return
    }

    const confirm = async () => {
      try {
        await api.post('/api/v1/auth/email/change/confirm', { token })
        setStatus('success')
      } catch (error: any) {
        setStatus('error')
        setErrorMessage(
          error.response?.data?.error?.message ||
            'This confirmation link is invalid or has expired.'
        )
      }
    }

    confirm()
  }, [searchParams])

  return (
    <div className='auth-page'>
      <section className='auth-page__hero'>
        <div className='auth-page__hero-content'>
          <p className='auth-page__hero-label'>ACCOUNT</p>
          <h1 className='auth-page__hero-title'>EMAIL CHANGE</h1>
        </div>
      </section>

      <section className='auth-page__form-section'>
        {status === 'loading' && (
          <div className='auth-page__reset-confirm'>
            <p className='auth-page__reset-confirm-body'>Confirming your new email address...</p>
          </div>
        )}

        {status === 'success' && (
          <div className='auth-page__reset-confirm'>
            <h2 className='auth-page__reset-confirm-title'>EMAIL UPDATED</h2>
            <p className='auth-page__reset-confirm-body'>
              Your email has been updated. Please sign in with your new email address.
            </p>
            <Link to='/login' className='button button--orange button--large'>Sign in</Link>
          </div>
        )}

        {status === 'error' && (
          <div className='auth-page__reset-confirm'>
            <h2 className='auth-page__reset-confirm-title'>LINK INVALID</h2>
            <p className='auth-page__reset-confirm-body'>{errorMessage}</p>
            <p className='auth-page__reset-confirm-body'>
              To change your email, sign in and try again from your account settings.
            </p>
            <Link to='/login' className='button button--orange button--large'>Sign in</Link>
          </div>
        )}
      </section>
    </div>
  )
}

export default ConfirmEmailChangePage
