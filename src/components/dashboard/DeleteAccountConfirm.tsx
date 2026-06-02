import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Button from '../shared/Button'

const GRACE_PERIOD_DAYS = 30

const schema = z.object({
  currentPassword: z.string().min(1, { message: 'Enter your password to confirm' }),
})

type FormData = z.infer<typeof schema>

const BackIcon = () => (
  <svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
    <line x1='19' y1='12' x2='5' y2='12'></line>
    <polyline points='12 19 5 12 12 5'></polyline>
  </svg>
)

const DeleteAccountConfirm = ({ onBack }: { onBack: () => void }) => {
  const [scheduled, setScheduled] = useState(false)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
    defaultValues: { currentPassword: '' },
  })

  const onSubmit = async (data: FormData) => {
    // TODO: POST /api/v1/account/deletion once the endpoint exists. It should
    // re-verify currentPassword, soft-delete (deactivate) the account, start the
    // 30-day purge timer, and queue the two notification emails (now + day before).
    // Stubbed for now so the flow is demonstrable.
    console.log('Account deletion requested (stubbed)', data.currentPassword ? '[password provided]' : '')
    setScheduled(true)
  }

  if (scheduled) {
    return (
      <div className='dashboard__data-privacy'>
        <button type='button' className='dashboard__dp-back' onClick={onBack}>
          <BackIcon /> Data &amp; Privacy
        </button>
        <p className='dashboard__notice'>
          Your account is scheduled for deletion in {GRACE_PERIOD_DAYS} days. We've emailed you a confirmation with a link to cancel, and we'll email you again the day before. You can also cancel anytime by logging back in before the deadline.
        </p>
      </div>
    )
  }

  return (
    <div className='dashboard__data-privacy'>
      <button type='button' className='dashboard__dp-back' onClick={onBack}>
        <BackIcon /> Data &amp; Privacy
      </button>

      <h3 className='dashboard__dp-heading'>Delete My Account</h3>

      <div className='dashboard__dp-warning'>
        <p>
          Your account won't be deleted right away. You'll have a {GRACE_PERIOD_DAYS}-day grace period to change your mind, and you can cancel the deletion at any point by logging back in.
        </p>
        <p>
          We'll email you twice: once now, and again the day before your account is permanently deleted. Each email tells you how many days remain to cancel.
        </p>
        <p>
          Deleting your account does not cancel your subscription. If you subscribed through the App Store, cancel it there first so you aren't billed again.
        </p>
      </div>

      <form className='dashboard__form' onSubmit={handleSubmit(onSubmit)}>
        <div className='dashboard__field'>
          <label className='dashboard__field-label' htmlFor='delete-password'>Enter your password to confirm</label>
          <div className='dashboard__field-control'>
            <input id='delete-password' type='password' autoComplete='current-password' placeholder='Enter password to confirm' className={`dashboard__input ${errors.currentPassword ? 'dashboard__input--error' : ''}`} {...register('currentPassword')} />
            {errors.currentPassword && <span className='dashboard__error'>{errors.currentPassword.message}</span>}
          </div>
        </div>

        <Button type='submit' color='danger' className='dashboard__dp-btn' disabled={isSubmitting}>
          {isSubmitting ? 'Scheduling...' : 'Delete My Account'}
        </Button>
      </form>
    </div>
  )
}

export default DeleteAccountConfirm
