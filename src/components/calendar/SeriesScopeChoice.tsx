import { useState } from 'react'
import Button from '../shared/Button'
import { CALENDAR_CONTENT } from '../../constants/calendar'
import type { SeriesScope } from '../../types'

const { scope: content } = CALENDAR_CONTENT

const OPTIONS: { value: SeriesScope; label: string; hint: string }[] = [
  { value: 'this', label: content.this, hint: content.thisHint },
  { value: 'this_and_future', label: content.thisAndFuture, hint: content.thisAndFutureHint },
  { value: 'all', label: content.all, hint: content.allHint },
]

interface SeriesScopeChoiceProps {
  mode: 'edit' | 'delete'
  busy: boolean
  onConfirm: (scope: SeriesScope) => void
  onCancel: () => void
}

/**
 * The choice a calendar has to offer before an edit or a deletion touches a
 * series: this occurrence, this and everything after it, or all of it.
 *
 * Asked rather than assumed. Every one of the three is a reasonable thing to
 * mean, two of them are destructive in ways the other is not, and guessing
 * would silently rewrite occurrences the teacher never looked at. Each option
 * says what happens to the ones it does not touch, which is the part that is
 * hard to picture.
 */
const SeriesScopeChoice = ({ mode, busy, onConfirm, onCancel }: SeriesScopeChoiceProps) => {
  // "This occurrence" first and selected: the narrowest choice is the safest
  // default, and it is what someone editing one day usually means.
  const [scope, setScope] = useState<SeriesScope>('this')

  return (
    <div className='series-scope' role='group' aria-label={content.editHeading}>
      <p className='series-scope__heading'>
        {mode === 'edit' ? content.editHeading : content.deleteHeading}
      </p>

      <div className='series-scope__options'>
        {OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`series-scope__option${scope === option.value ? ' series-scope__option--on' : ''}`}
            htmlFor={`series-scope-${option.value}`}
          >
            <input
              id={`series-scope-${option.value}`}
              type='radio'
              name='series-scope'
              className='series-scope__box'
              checked={scope === option.value}
              onChange={() => setScope(option.value)}
            />
            <span className='series-scope__body'>
              <span className='series-scope__label'>{option.label}</span>
              <span className='series-scope__hint'>{option.hint}</span>
            </span>
          </label>
        ))}
      </div>

      <div className='series-scope__actions'>
        <button
          type='button'
          className='series-scope__cancel'
          onClick={onCancel}
          disabled={busy}
        >
          {content.cancel}
        </button>
        <Button
          color={mode === 'delete' ? 'danger' : 'cream'}
          onClick={() => onConfirm(scope)}
          disabled={busy}
        >
          {mode === 'delete' ? content.confirmDelete : content.confirmEdit}
        </Button>
      </div>
    </div>
  )
}

export default SeriesScopeChoice
