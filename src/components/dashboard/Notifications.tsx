import { useState } from 'react'

// TODO: load defaults from the user object once notification preferences live
// on the teacher record. For now, the section opens with everything on, which
// matches the canva design.
const defaultPrefs = {
  accountUpdates: true,
  productUpdates: true,
  homeschoolResources: true,
}

type Prefs = typeof defaultPrefs

const NotificationsSection = () => {
  const [prefs, setPrefs] = useState<Prefs>(defaultPrefs)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [savedNotice, setSavedNotice] = useState(false)

  const toggle = (key: keyof Prefs) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }))
    setSavedNotice(false)
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    setSavedNotice(false)
    try {
      // TODO: PATCH /api/v1/notifications with prefs once the endpoint exists.
      await new Promise((r) => setTimeout(r, 350))
      setSavedNotice(true)
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
        checked={prefs.accountUpdates}
        onChange={() => toggle('accountUpdates')}
      />
      <NotificationToggle
        id='notif-product'
        label='Product updates'
        sublabel='(new features, tips)'
        checked={prefs.productUpdates}
        onChange={() => toggle('productUpdates')}
      />
      <NotificationToggle
        id='notif-homeschool'
        label='Homeschool resources'
        sublabel='(weekly newsletter)'
        checked={prefs.homeschoolResources}
        onChange={() => toggle('homeschoolResources')}
      />

      {savedNotice && <p className='dashboard__notice'>Your preferences have been saved.</p>}

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
