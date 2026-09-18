import { useState } from 'react'
import type { Student } from '../../types'
import { CALENDAR_CONTENT } from '../../constants/calendar'
import FormField, { FormInput, FormSelect } from '../shared/FormField'

export type TimingFilter = 'all' | 'allDay' | 'timed'

export interface CalendarFilterValues {
  studentId: string
  timing: TimingFilter
  search: string
}

interface CalendarFiltersProps {
  values: CalendarFilterValues
  students: Student[]
  onChange: (next: Partial<CalendarFilterValues>) => void
  onClear: () => void
  /**
   * Mobile puts the three fields behind a toggle so the dates come first.
   * Desktop leaves the panel open under the section nav, as it always was.
   */
  collapsible?: boolean
}

const { filters } = CALENDAR_CONTENT

/** Only one of the two placements renders at a time, so a fixed id is safe. */
const FIELDS_ID = 'calendar-filter-fields'

const countActive = (values: CalendarFilterValues): number =>
  (values.studentId === '' ? 0 : 1) +
  (values.timing === 'all' ? 0 : 1) +
  (values.search.trim() === '' ? 0 : 1)

/**
 * Student filters server side, through the query param the events endpoint
 * supports. Timing and search narrow the loaded range in the page: neither has
 * a server counterpart, and both are cheap over a range that is already bounded
 * by the visible dates.
 */
const CalendarFilters = ({
  values,
  students,
  onChange,
  onClear,
  collapsible = false,
}: CalendarFiltersProps) => {
  const [open, setOpen] = useState(false)

  const activeCount = countActive(values)
  const isFiltered = activeCount > 0
  // Collapsing is a mobile affordance only: when the panel is not collapsible
  // there is nothing to expand and the fields are simply there.
  const expanded = !collapsible || open

  return (
    <section
      className={`calendar-filters${collapsible ? ' calendar-filters--collapsible' : ''}`}
    >
      <h2 className='calendar-filters__heading'>
        {collapsible ? (
          // A real button carrying aria-expanded and aria-controls, so the state
          // is announced rather than merely drawn. The name stays "Filters":
          // the expanded state belongs in aria-expanded, not in the label.
          <button
            type='button'
            className='calendar-filters__toggle'
            aria-expanded={open}
            aria-controls={FIELDS_ID}
            onClick={() => setOpen((current) => !current)}
          >
            <span>{filters.heading}</span>

            {/* The count is the whole point of collapsing safely: a filter that
                is on stays visible while its field is not. */}
            {isFiltered && (
              <span className='calendar-filters__count'>
                {activeCount}
                <span className='calendar__sr-only'> {filters.activeCountLabel}</span>
              </span>
            )}

            <span className='calendar-filters__chevron' aria-hidden='true' />
          </button>
        ) : (
          filters.heading
        )}
      </h2>

      {/* hidden rather than unmounted, so aria-controls always points at a real
          element: the attribute also takes the fields out of the tab order. */}
      <div className='calendar-filters__fields' id={FIELDS_ID} hidden={!expanded}>
        <FormField label={filters.student} htmlFor='filter-student'>
          <FormSelect
            id='filter-student'
            value={values.studentId}
            onChange={(changeEvent) => onChange({ studentId: changeEvent.target.value })}
          >
            <option value=''>{filters.allStudents}</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName}
              </option>
            ))}
          </FormSelect>
        </FormField>

        <FormField label={filters.timing} htmlFor='filter-timing'>
          <FormSelect
            id='filter-timing'
            value={values.timing}
            onChange={(changeEvent) =>
              onChange({ timing: changeEvent.target.value as TimingFilter })
            }
          >
            <option value='all'>{filters.timingAll}</option>
            <option value='allDay'>{filters.timingAllDay}</option>
            <option value='timed'>{filters.timingTimed}</option>
          </FormSelect>
        </FormField>

        <FormField label={filters.search} htmlFor='filter-search'>
          <FormInput
            id='filter-search'
            type='search'
            placeholder={filters.searchPlaceholder}
            value={values.search}
            onChange={(changeEvent) => onChange({ search: changeEvent.target.value })}
          />
        </FormField>

        <p className='calendar-filters__note'>{filters.activeNote}</p>

        {isFiltered && (
          <button type='button' className='calendar-filters__clear' onClick={onClear}>
            {filters.clear}
          </button>
        )}
      </div>
    </section>
  )
}

export default CalendarFilters
