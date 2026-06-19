import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import api from '../../services/api'
import { setUser } from '../../store/authSlice'
import type { AppDispatch, RootState } from '../../store'

const NotificationsSection = () => {
  const user = useSelector((s: RootState) => s.auth.user)
  const dispatch = useDispatch<AppDispatch>()

  const [prefs, setPrefs] = useState({
    notifyAccountUpdates: user?.notifyAccountUpdates ?? true,
    notifyProductUpdates: user?.notifyProductUpdates ?? true,
    notifyHomeschoolResources: user?.notifyHomeschoolResources ?? true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedNotice, setSavedNotice] = useState(false)
  const [apiError, setApiError] = useState<string | null>(null)

  if (!user) return null

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
    setSavedNotice(false)
    setApiError(null)
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    setSavedNotice(false)
    setApiError(null)
    try {
      const res = await api.patch('/api/v1/notifications', prefs)
      dispatch(setUser(res.data.data))
      setSavedNotice(true)
    } catch (error: any) {
      setApiError(
        error.response?.data?.error?.message ||
        'Could not save your preferences. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='dashboard__notifications'>
      <NotificationToggle
        id='notif-account'
        label='Account Updates'
        sublabel='(security, billing)'
        checked={prefs.notifyAccountUpdates}
        onChange={() => toggle('notifyAccountUpdates')}
      />
      <NotificationToggle
        id='notif-product'
        label='Product updates'
        sublabel='(new features, tips)'
        checked={prefs.notifyProductUpdates}
        onChange={() => toggle('notifyProductUpdates')}
      />
      <NotificationToggle
        id='notif-homeschool'
        label='Homeschool resources'
        sublabel='(weekly newsletter)'
        checked={prefs.notifyHomeschoolResources}
        onChange={() => toggle('notifyHomeschoolResources')}
      />

      {savedNotice && <p className='dashboard__notice'>Your preferences have been saved.</p>}
      {apiError && <p className='dashboard__api-error'>{apiError}</p>}

      <div className='dashboard__form-actions dashboard__notif-actions'>
        <button
          type='button'
          className='dashboard__save-btn'
          onClick={handleSave}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

type ToggleProps = {
  id: string
  label: string
  sublabel?: string
  checked: boolean
  onChange: () => void
}

const NotificationToggle = ({ id, label, sublabel, checked, onChange }: ToggleProps) => (
  <label className='dashboard__notif-row' htmlFor={id}>
    <span className='dashboard__notif-label'>
      {label}
      {sublabel && <span className='dashboard__notif-sublabel'> {sublabel}</span>}
    </span>
    <span className='dashboard__toggle'>
      <input
        id={id}
        type='checkbox'
        className='dashboard__toggle-input'
        checked={checked}
        onChange={onChange}
      />
      <span className='dashboard__toggle-track' aria-hidden='true' />
      <span className='dashboard__toggle-knob' aria-hidden='true' />
    </span>
  </label>
)

export default NotificationsSection
