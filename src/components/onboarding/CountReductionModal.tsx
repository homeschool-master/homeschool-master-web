import { useEffect, useRef } from 'react'
import Button from '../shared/Button'
import type { StudentDraft } from '../../pages/app/OnboardingPage'

interface CountReductionModalProps {
  studentsToDelete: StudentDraft[]
  onConfirm: () => void
  onCancel: () => void
  isSubmitting: boolean
}

const fullName = (student: StudentDraft) => `${student.firstName} ${student.lastName}`.trim()

const CountReductionModal = ({
  studentsToDelete,
  onConfirm,
  onCancel,
  isSubmitting,
}: CountReductionModalProps) => {
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

  const count = studentsToDelete.length
  const names = studentsToDelete.map(fullName).join(', ')

  return (
    <div className='onboarding-modal' onClick={handleOverlayClick}>
      <div
        ref={panelRef}
        tabIndex={-1}
        className='onboarding-modal__panel'
        role='dialog'
        aria-modal='true'
        aria-labelledby='count-reduction-title'
        aria-describedby='count-reduction-body'
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id='count-reduction-title' className='onboarding-modal__title'>
          Delete {count === 1 ? 'this student' : 'these students'}?
        </h2>

        <p id='count-reduction-body' className='onboarding-modal__body'>
          Lowering the number of students will delete {names}. This cannot be undone. Are
          you sure you want to delete {count === 1 ? 'this student' : 'these students'}?
        </p>

        <div className='onboarding-modal__actions'>
          <Button color='cream' onClick={onCancel} disabled={isSubmitting}>
            Keep {count === 1 ? 'student' : 'students'}
          </Button>
          <Button color='danger' onClick={onConfirm} disabled={isSubmitting}>
            {isSubmitting ? 'Deleting...' : `Delete ${count === 1 ? 'student' : 'students'}`}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CountReductionModal
