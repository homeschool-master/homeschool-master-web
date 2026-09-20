import FormField, { FormInput, FormSelect } from '../shared/FormField'
import { CALENDAR_CONTENT } from '../../constants/calendar'
import type { MonthlyAnchor, Recurrence, RecurrenceFrequency } from '../../types'

const { form } = CALENDAR_CONTENT

/** Rendered in this order, the "off" state first. */
const FREQUENCIES: { value: RecurrenceFrequency | 'none'; label: string }[] = [
  { value: 'none', label: form.recurrenceValue },
  { value: 'daily', label: form.recurrenceDaily },
  { value: 'weekly', label: form.recurrenceWeekly },
  { value: 'monthly', label: form.recurrenceMonthly },
  { value: 'yearly', label: form.recurrenceYearly },
]

interface RecurrenceFieldsProps {
  /** Null while the event does not repeat. */
  value: Recurrence | null
  onChange: (next: Recurrence | null) => void
  /** The date the series is anchored on, which the monthly wording reads. */
  startDate: string
  disabled?: boolean
}

/**
 * The repeat rule on the event form. Only the fields the chosen frequency
 * actually uses are shown: daily and yearly need no day picked, weekly needs
 * which days, monthly needs which of its two anchors.
 */
const RecurrenceFields = ({ value, onChange, startDate, disabled = false }: RecurrenceFieldsProps) => {
  const frequency = value?.frequency ?? 'none'

  const selectFrequency = (next: RecurrenceFrequency | 'none') => {
    if (next === 'none') return onChange(null)

    onChange({
      frequency: next,
      // A weekly series starts on the day the event is on, which is the only
      // answer that cannot contradict the date above it.
      weekdays: next === 'weekly' ? [weekdayOf(startDate)] : [],
      monthlyAnchor: next === 'monthly' ? 'day_of_month' : null,
      untilDate: value?.untilDate ?? null,
    })
  }

  const toggleWeekday = (day: number) => {
    if (value === null) return

    const next = value.weekdays.includes(day)
      ? value.weekdays.filter((existing) => existing !== day)
      : [...value.weekdays, day].sort((first, second) => first - second)

    // A weekly series with no days at all has no meaning and the server
    // refuses it, so the last day cannot be turned off.
    if (next.length === 0) return

    onChange({ ...value, weekdays: next })
  }

  return (
    <>
      <FormField label={form.recurrence} htmlFor='event-recurrence'>
        <FormSelect
          id='event-recurrence'
          value={frequency}
          disabled={disabled}
          onChange={(changeEvent) =>
            selectFrequency(changeEvent.target.value as RecurrenceFrequency | 'none')
          }
        >
          {FREQUENCIES.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </FormSelect>
      </FormField>

      {value?.frequency === 'weekly' && (
        <fieldset className='event-form__weekdays'>
          <legend className='event-form__label'>{form.weekdays}</legend>
          <div className='event-form__weekday-row'>
            {form.weekdayNames.map((name, day) => (
              <label
                key={name}
                className={`weekday-chip${value.weekdays.includes(day) ? ' weekday-chip--on' : ''}`}
                htmlFor={`event-weekday-${day}`}
              >
                <input
                  id={`event-weekday-${day}`}
                  type='checkbox'
                  className='weekday-chip__box'
                  checked={value.weekdays.includes(day)}
                  disabled={disabled}
                  onChange={() => toggleWeekday(day)}
                />
                <span className='weekday-chip__name'>{name}</span>
              </label>
            ))}
          </div>
          <p className='event-form__hint'>{form.weekdaysHint}</p>
        </fieldset>
      )}

      {value?.frequency === 'monthly' && (
        <FormField label={form.monthlyAnchor} htmlFor='event-monthly-anchor'>
          <FormSelect
            id='event-monthly-anchor'
            value={value.monthlyAnchor ?? 'day_of_month'}
            disabled={disabled}
            onChange={(changeEvent) =>
              onChange({ ...value, monthlyAnchor: changeEvent.target.value as MonthlyAnchor })
            }
          >
            <option value='day_of_month'>{form.monthlyByDate}</option>
            <option value='weekday_position'>{form.monthlyByPosition}</option>
          </FormSelect>
          {/* Says what happens to the months that have no such day, which is
              the one thing about a monthly repeat that surprises people. */}
          <p className='event-form__hint'>
            {value.monthlyAnchor === 'weekday_position'
              ? form.monthlyByPositionHint
              : form.monthlyByDateHint}
          </p>
        </FormField>
      )}

      {value !== null && (
        <FormField label={form.untilDate} htmlFor='event-until'>
          <FormInput
            id='event-until'
            type='date'
            value={value.untilDate ?? ''}
            disabled={disabled}
            onChange={(changeEvent) =>
              onChange({ ...value, untilDate: changeEvent.target.value || null })
            }
          />
          <p className='event-form__hint'>{form.untilHint}</p>
        </FormField>
      )}
    </>
  )
}

/** The day of the week a YYYY-MM-DD falls on, read as a local date. */
const weekdayOf = (dateKey: string): number => {
  const [year, month, day] = dateKey.split('-').map(Number)
  return new Date(year, month - 1, day).getDay()
}

export default RecurrenceFields
