import { useState } from 'react'
import Button from '../shared/Button'
import { FormInput } from '../shared/FormField'
import { ASSIGNMENT_TYPES_CONTENT } from '../../constants/assignmentTypes'
import { fillTemplate } from '../../utils/grades'
import type { WeightApplyMode } from '../../types'

const { apply } = ASSIGNMENT_TYPES_CONTENT

const OPTIONS: { value: WeightApplyMode; label: string; hint: string }[] = [
  { value: 'new_only', label: apply.newOnly, hint: apply.newOnlyHint },
  { value: 'all', label: apply.all, hint: apply.allHint },
  { value: 'from_date', label: apply.fromDate, hint: apply.fromDateHint },
]

interface WeightApplyChoiceProps {
  /** Names the type, since "this changes what it counts" needs a subject. */
  typeName: string
  busy: boolean
  onConfirm: (mode: WeightApplyMode, fromDate: string | null) => void
  onCancel: () => void
}

/**
 * How far back a changed default weight reaches: new work only, all work of
 * that type, or work due from a date onward.
 *
 * Asked rather than assumed. All three are reasonable things to mean, two of
 * them rewrite marks already given, and guessing would silently reweight a
 * term. Each option says what it leaves alone, which is the part that is hard
 * to picture.
 *
 * The note about hand set weights is here and not in a tooltip: a teacher
 * choosing "all work of this type" has no other way to learn that the one test
 * she set to count 5 is about to be left behind, and finding that out
 * afterwards looks like a bug rather than the promise it is.
 */
const WeightApplyChoice = ({ typeName, busy, onConfirm, onCancel }: WeightApplyChoiceProps) => {
  // New work only first and selected: the narrowest choice is the safest
  // default, and it is the one that touches nothing already recorded.
  const [mode, setMode] = useState<WeightApplyMode>('new_only')
  const [fromDate, setFromDate] = useState('')
  const [dateMissing, setDateMissing] = useState(false)

  const confirm = () => {
    if (mode === 'from_date' && fromDate === '') {
      setDateMissing(true)
      return
    }

    onConfirm(mode, mode === 'from_date' ? fromDate : null)
  }

  return (
    <div className='series-scope' role='group' aria-label={apply.heading}>
      <p className='series-scope__heading'>{fillTemplate(apply.heading, { name: typeName })}</p>

      <div className='series-scope__options'>
        {OPTIONS.map((option) => (
          <label
            key={option.value}
            className={`series-scope__option${mode === option.value ? ' series-scope__option--on' : ''}`}
            htmlFor={`weight-apply-${option.value}`}
          >
            <input
              id={`weight-apply-${option.value}`}
              type='radio'
              name='weight-apply'
              className='series-scope__box'
              checked={mode === option.value}
              onChange={() => setMode(option.value)}
            />
            <span className='series-scope__body'>
              <span className='series-scope__label'>{option.label}</span>
              <span className='series-scope__hint'>{option.hint}</span>
            </span>
          </label>
        ))}
      </div>

      {mode === 'from_date' && (
        <div className='assignment-type__date'>
          <label className='form-field__label' htmlFor='weight-apply-date'>
            {apply.dateLabel}
          </label>
          <FormInput
            id='weight-apply-date'
            type='date'
            value={fromDate}
            onChange={(changeEvent) => {
              setFromDate(changeEvent.target.value)
              setDateMissing(false)
            }}
          />
          {dateMissing && (
            <p className='subject-form__error' role='alert'>
              {apply.dateMissing}
            </p>
          )}
        </div>
      )}

      <p className='assignment-type__override-note'>{apply.overrideNote}</p>

      <div className='series-scope__actions'>
        <button type='button' className='series-scope__cancel' onClick={onCancel} disabled={busy}>
          {apply.cancel}
        </button>
        <Button color='cream' onClick={confirm} disabled={busy}>
          {apply.confirm}
        </Button>
      </div>
    </div>
  )
}

export default WeightApplyChoice
