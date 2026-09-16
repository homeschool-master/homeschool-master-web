import { CALENDAR_CONTENT } from '../../constants/calendar'
import Button from '../shared/Button'

interface EventDeleteConfirmProps {
  title: string
  deleting: boolean
  error: string | null
  onConfirm: () => void
  onCancel: () => void
}

/**
 * The same in page confirmation the student roster uses: no modal, a plain
 * block where the action was, saying what the delete actually does.
 */
const EventDeleteConfirm = ({
  title,
  deleting,
  error,
  onConfirm,
  onCancel,
}: EventDeleteConfirmProps) => (
  <div className='event-detail__confirm'>
    <p className='event-detail__confirm-heading'>{CALENDAR_CONTENT.deleteConfirm.heading}</p>
    <p className='event-detail__confirm-title'>{title}</p>
    <p className='event-detail__confirm-body'>{CALENDAR_CONTENT.deleteConfirm.body}</p>

    {error && (
      <p className='event-detail__error' role='alert'>
        {error}
      </p>
    )}

    <div className='event-detail__confirm-actions'>
      <button
        type='button'
        className='dashboard__cancel-btn'
        onClick={onCancel}
        disabled={deleting}
      >
        {CALENDAR_CONTENT.deleteConfirm.cancel}
      </button>
      <Button color='danger' onClick={onConfirm} disabled={deleting}>
        {deleting ? CALENDAR_CONTENT.deleteConfirm.deleting : CALENDAR_CONTENT.deleteConfirm.confirm}
      </Button>
    </div>
  </div>
)

export default EventDeleteConfirm
