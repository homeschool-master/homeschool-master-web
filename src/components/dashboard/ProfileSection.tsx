import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { RootState } from '../../store'

const profileSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.email({ message: 'Enter a valid email address' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }).or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

const ProfileSection = () => {
  const user = useSelector((state: RootState) => state.auth.user)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    mode: 'onBlur',
    defaultValues: {
      name: user ? `${user.firstName} ${user.lastName}` : '',
      email: user?.email ?? '',
      password: '',
    },
  })

  const onSubmit = async (_data: ProfileFormData) => {
    // TODO: PATCH /api/v1/profile (endpoint not yet built). See note re: name split + password handling.
  }

  return (
    <form className='dashboard__form' onSubmit={handleSubmit(onSubmit)}>
      <div className='dashboard__field'>
        <label className='dashboard__field-label' htmlFor='profile-name'>Name</label>
        <div className='dashboard__field-control'>
          <input
            id='profile-name'
            type='text'
            className={`dashboard__input ${errors.name ? 'dashboard__input--error' : ''}`}
            {...register('name')}
          />
          {errors.name && <span className='dashboard__error'>{errors.name.message}</span>}
        </div>
      </div>

      <div className='dashboard__field'>
        <label className='dashboard__field-label' htmlFor='profile-email'>Email</label>
        <div className='dashboard__field-control'>
          <input
            id='profile-email'
            type='email'
            className={`dashboard__input ${errors.email ? 'dashboard__input--error' : ''}`}
            {...register('email')}
          />
          {errors.email && <span className='dashboard__error'>{errors.email.message}</span>}
        </div>
      </div>

      <div className='dashboard__field'>
        <label className='dashboard__field-label' htmlFor='profile-password'>Password</label>
        <div className='dashboard__field-control'>
          <input
            id='profile-password'
            type='password'
            placeholder='••••••••'
            className={`dashboard__input ${errors.password ? 'dashboard__input--error' : ''}`}
            {...register('password')}
          />
          {errors.password && <span className='dashboard__error'>{errors.password.message}</span>}
        </div>
      </div>

      <div className='dashboard__form-actions'>
        <button type='submit' className='dashboard__save-btn' disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default ProfileSection
