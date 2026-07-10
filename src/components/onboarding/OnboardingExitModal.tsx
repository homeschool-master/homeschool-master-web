import { useEffect, useRef } from 'react'
import Button from '../shared/Button'

interface OnboardingExitModalProps {
  onConfirm: () => void
  onCancel: () => void
  isSubmitting: boolean
}

const OnboardingExitModal = ({ onConfirm, onCancel, isSubmitting }: OnboardingExitModalProps) => {
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    panelRef.current?.focus()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isSubmitting, onCancel])

  const handleOverlayClick = () => {
    if (!isSubmitting) onCancel()
  }

  return (
    <div className='onboarding-modal' onClick={handleOverlayClick}>
      <div
        ref={panelRef}
        tabIndex={-1}
        className='onboarding-modal__panel'
        role='dialog'
        aria-modal='true'
        aria-labelledby='onboarding-modal-title'
        aria-describedby='onboarding-modal-body'
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id='onboarding-modal-title' className='onboarding-modal__title'>
          Finish setting up later?
        </h2>

        <p id='onboarding-modal-body' className='onboarding-modal__body'>
          The students you have already added are saved. You can add the rest anytime
          from your dashboard.
        </p>

        <div className='onboarding-modal__actions'>
          <Button color='cream' onClick={onCancel} disabled={isSubmitting}>
            Keep setting up
          </Button>
          <Button onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Finishing...' : 'Go to dashboard'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OnboardingExitModal
