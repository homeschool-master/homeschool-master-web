import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../../services/api'

const schema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Enter your current password' }),
    newPassword: z.string().min(8, { message: 'New password must be at least 8 characters' }),
    confirmNewPassword: z.string().min(1, { message: 'Confirm your new password' }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Passwords do not match',
    path: ['confirmNewPassword'],
  })

type FormData = z.infer<typeof schema>

const EyeIcon = ({ shown }: { shown: boolean }) =>
  shown ? (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
      <circle cx='12' cy='12' r='3'></circle>
    </svg>
  ) : (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
      <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
      <line x1='1' y1='1' x2='23' y2='23'></line>
    </svg>
  )

const PasswordForm = ({ onDone }: { onDone: () => void }) => {
  const [done, setDone] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { currentPassword: '', newPassword: '', confirmNewPassword: '' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      await api.post('/api/v1/auth/password/change', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      setDone(true)
    } catch (error: any) {
      setError('root', { message: error.response?.data?.message || 'Could not change password. Check your current password and try again.' })
    }
  }

  if (done) {
    return (
      <div className='dashboard__form'>
        <p className='dashboard__notice'>Your password has been updated.</p>
        <div className='dashboard__form-actions'>
          <button type='button' className='dashboard__save-btn' onClick={onDone}>Done</button>
        </div>
      </div>
    )
  }

  return (
    <form className='dashboard__form' onSubmit={handleSubmit(onSubmit)}>
      <div className='dashboard__field'>
        <label className='dashboard__field-label' htmlFor='pw-current'>Current Password</label>
        <div className='dashboard__field-control'>
          <input id='pw-current' type='password' autoComplete='current-password'
            className={`dashboard__input ${errors.currentPassword ? 'dashboard__input--error' : ''}`}
            {...register('currentPassword')} />
          {errors.currentPassword && <span className='dashboard__error'>{errors.currentPassword.message}</span>}
        </div>
      </div>

      <div className='dashboard__field'>
        <label className='dashboard__field-label' htmlFor='pw-new'>New Password</label>
        <div className='dashboard__field-control'>
          <div className='dashboard__password-wrapper'>
            <input id='pw-new' type={showNew ? 'text' : 'password'} autoComplete='new-password'
              className={`dashboard__input ${errors.newPassword ? 'dashboard__input--error' : ''}`}
              {...register('newPassword')} />
            <button type='button' className='dashboard__password-toggle'
              onClick={() => setShowNew((v) => !v)} disabled={isSubmitting}
              aria-label={showNew ? 'Hide password' : 'Show password'}>
              <EyeIcon shown={showNew} />
            </button>
          </div>
          {errors.newPassword && <span className='dashboard__error'>{errors.newPassword.message}</span>}
        </div>
      </div>

      <div className='dashboard__field'>
        <label className='dashboard__field-label' htmlFor='pw-confirm'>Confirm New Password</label>
        <div className='dashboard__field-control'>
          <div className='dashboard__password-wrapper'>
            <input id='pw-confirm' type={showConfirm ? 'text' : 'password'} autoComplete='new-password'
              className={`dashboard__input ${errors.confirmNewPassword ? 'dashboard__input--error' : ''}`}
              {...register('confirmNewPassword')} />
            <button type='button' className='dashboard__password-toggle'
              onClick={() => setShowConfirm((v) => !v)} disabled={isSubmitting}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}>
              <EyeIcon shown={showConfirm} />
            </button>
          </div>
          {errors.confirmNewPassword && <span className='dashboard__error'>{errors.confirmNewPassword.message}</span>}
        </div>
      </div>

      {errors.root && <div className='dashboard__api-error'>{errors.root.message}</div>}

      <div className='dashboard__form-actions'>
        <button type='button' className='dashboard__cancel-btn' onClick={onDone} disabled={isSubmitting}>Cancel</button>
        <button type='submit' className='dashboard__save-btn' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default PasswordForm
