import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../../services/api'
import type { RootState } from '../../store'

const schema = z.object({
  email: z.email({ message: 'Enter a valid email address' }),
  currentPassword: z.string().min(1, { message: 'Enter your password to confirm' }),
})

type FormData = z.infer<typeof schema>

const EmailForm = ({ onDone }: { onDone: () => void }) => {
  const user = useSelector((s: RootState) => s.auth.user)
  const [sent, setSent] = useState(false)

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { email: user?.email ?? '', currentPassword: '' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/api/v1/auth/email/change', data)
      setSent(true)
    } catch (error: any) {
      setError('root', { message: error.response?.data?.message || 'Could not start the email change. Check your password and try again.' })
    }
  }

  if (sent) {
    return (
      <div className='dashboard__form'>
        <p className='dashboard__notice'>
          We sent a verification link to your new email address. Click it to confirm the change. Your current email stays active until then.
        </p>
        <div className='dashboard__form-actions'>
          <button type='button' className='dashboard__save-btn' onClick={onDone}>Done</button>
        </div>
      </div>
    )
  }

  return (
    <form className='dashboard__form' onSubmit={handleSubmit(onSubmit)}>
      <div className='dashboard__field'>
        <label className='dashboard__field-label' htmlFor='email-address'>Email</label>
        <div className='dashboard__field-control'>
          <input id='email-address' type='email' autoComplete='email'
            className={`dashboard__input ${errors.email ? 'dashboard__input--error' : ''}`}
            {...register('email')} />
          {errors.email && <span className='dashboard__error'>{errors.email.message}</span>}
        </div>
      </div>

      <div className='dashboard__field'>
        <label className='dashboard__field-label' htmlFor='email-password'>Password</label>
        <div className='dashboard__field-control'>
          <input id='email-password' type='password' autoComplete='current-password'
            placeholder='Enter password to confirm'
            className={`dashboard__input ${errors.currentPassword ? 'dashboard__input--error' : ''}`}
            {...register('currentPassword')} />
          {errors.currentPassword && <span className='dashboard__error'>{errors.currentPassword.message}</span>}
        </div>
      </div>

      {errors.root && <div className='dashboard__api-error'>{errors.root.message}</div>}

      <div className='dashboard__form-actions'>
        <button type='button' className='dashboard__cancel-btn' onClick={onDone} disabled={isSubmitting}>Cancel</button>
        <button type='submit' className='dashboard__save-btn' disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default EmailForm
