import FormField, { FormInput, FormSelect } from './FormField'
import { RECURRENCE_CONTENT } from '../../constants/recurrence'
import type { MonthlyAnchor, Recurrence, RecurrenceFrequency } from '../../types'

const content = RECURRENCE_CONTENT

/** Rendered in this order, the "off" state first. */
const FREQUENCIES: { value: RecurrenceFrequency | 'none'; labelKey: keyof typeof content }[] = [
  { value: 'none', labelKey: 'none' },
  { value: 'daily', labelKey: 'daily' },
  { value: 'weekly', labelKey: 'weekly' },
  { value: 'monthly', labelKey: 'monthly' },
  { value: 'yearly', labelKey: 'yearly' },
]

interface RecurrenceFieldsProps {
  /** Null while the record does not repeat. */
  value: Recurrence | null
  onChange: (next: Recurrence | null) => void
  /** The date the series is anchored on, which the weekly and monthly wording reads. */
  startDate: string
  /**
   * Namespaces the control ids, so a page holding more than one of these keeps
   * each label pointing at its own field.
   */
  idPrefix: string
  /** The question above the frequency, which names what is repeating. */
  label: string
  disabled?: boolean
}

/**
 * The repeat rule, shared by the event form and the task form. Only the fields
 * the chosen frequency actually uses are shown: daily and yearly need no day
 * picked, weekly needs which days, monthly needs which of its two anchors.
 *
 * Nothing in here knows whether it is repeating a lesson or a to-do. That is
 * the point: the rule is the same rule, and the only thing the caller supplies
 * is the noun in the question at the top.
 */
const RecurrenceFields = ({
  value,
  onChange,
  startDate,
  idPrefix,
  label,
  disabled = false,
}: RecurrenceFieldsProps) => {
  const frequency = value?.frequency ?? 'none'

  const selectFrequency = (next: RecurrenceFrequency | 'none') => {
    if (next === 'none') return onChange(null)

    onChange({
      frequency: next,
      // A weekly series starts on the day the record is on, which is the only
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
      <FormField label={label} htmlFor={`${idPrefix}-recurrence`}>
        <FormSelect
          id={`${idPrefix}-recurrence`}
          value={frequency}
          disabled={disabled}
          onChange={(changeEvent) =>
            selectFrequency(changeEvent.target.value as RecurrenceFrequency | 'none')
          }
        >
          {FREQUENCIES.map((option) => (
            <option key={option.value} value={option.value}>
              {content[option.labelKey] as string}
            </option>
          ))}
        </FormSelect>
      </FormField>

      {value?.frequency === 'weekly' && (
        <fieldset className='recurrence-fields__weekdays'>
          <legend className='recurrence-fields__label'>{content.weekdays}</legend>
          <div className='recurrence-fields__weekday-row'>
            {content.weekdayNames.map((name, day) => (
              <label
                key={name}
                className={`weekday-chip${value.weekdays.includes(day) ? ' weekday-chip--on' : ''}`}
                htmlFor={`${idPrefix}-weekday-${day}`}
              >
                <input
                  id={`${idPrefix}-weekday-${day}`}
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
          <p className='recurrence-fields__hint'>{content.weekdaysHint}</p>
        </fieldset>
      )}

      {value?.frequency === 'monthly' && (
        <FormField label={content.monthlyAnchor} htmlFor={`${idPrefix}-monthly-anchor`}>
          <FormSelect
            id={`${idPrefix}-monthly-anchor`}
            value={value.monthlyAnchor ?? 'day_of_month'}
            disabled={disabled}
            onChange={(changeEvent) =>
              onChange({ ...value, monthlyAnchor: changeEvent.target.value as MonthlyAnchor })
            }
          >
            <option value='day_of_month'>{content.monthlyByDate}</option>
            <option value='weekday_position'>{content.monthlyByPosition}</option>
          </FormSelect>
          {/* Says what happens to the months that have no such day, which is
              the one thing about a monthly repeat that surprises people. */}
          <p className='recurrence-fields__hint'>
            {value.monthlyAnchor === 'weekday_position'
              ? content.monthlyByPositionHint
              : content.monthlyByDateHint}
          </p>
        </FormField>
      )}

      {value !== null && (
        <FormField label={content.untilDate} htmlFor={`${idPrefix}-until`}>
          <FormInput
            id={`${idPrefix}-until`}
            type='date'
            value={value.untilDate ?? ''}
            disabled={disabled}
            onChange={(changeEvent) =>
              onChange({ ...value, untilDate: changeEvent.target.value || null })
            }
          />
          <p className='recurrence-fields__hint'>{content.untilHint}</p>
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
