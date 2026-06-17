import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import api from '../../services/api'
import { setUser } from '../../store/authSlice'
import type { AppDispatch, RootState } from '../../store'

const schema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  currentPassword: z.string().min(1, { message: 'Enter your password to confirm' }),
})

type FormData = z.infer<typeof schema>

const NameForm = ({ onDone }: { onDone: () => void }) => {
  const user = useSelector((s: RootState) => s.auth.user)
  const dispatch = useDispatch<AppDispatch>()

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { firstName: user?.firstName ?? '', lastName: user?.lastName ?? '', currentPassword: '' },
  })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await api.patch('/api/v1/profile', data)
      dispatch(setUser(res.data.data))
      onDone()
    } catch (error: any) {
      setError('root', {
        message:
          error.response?.data?.error?.message ||
          'Could not update name. Check your password and try again.',
      })
    }
  }

  return (
    <form className='dashboard__form' onSubmit={handleSubmit(onSubmit)}>
      <div className='dashboard__field'>
        <label className='dashboard__field-label' htmlFor='name-first'>First Name</label>
        <div className='dashboard__field-control'>
          <input id='name-first' type='text' autoComplete='given-name'
            className={`dashboard__input ${errors.firstName ? 'dashboard__input--error' : ''}`}
            {...register('firstName')} />
          {errors.firstName && <span className='dashboard__error'>{errors.firstName.message}</span>}
        </div>
      </div>

      <div className='dashboard__field'>
        <label className='dashboard__field-label' htmlFor='name-last'>Last Name</label>
        <div className='dashboard__field-control'>
          <input id='name-last' type='text' autoComplete='family-name'
            className={`dashboard__input ${errors.lastName ? 'dashboard__input--error' : ''}`}
            {...register('lastName')} />
          {errors.lastName && <span className='dashboard__error'>{errors.lastName.message}</span>}
        </div>
      </div>

      <div className='dashboard__field'>
        <label className='dashboard__field-label' htmlFor='name-password'>Password</label>
        <div className='dashboard__field-control'>
          <input id='name-password' type='password' autoComplete='current-password'
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
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default NameForm
