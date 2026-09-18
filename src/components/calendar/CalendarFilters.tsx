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
}

const { filters } = CALENDAR_CONTENT

/**
 * Student filters server side, through the query param the events endpoint
 * supports. Timing and search narrow the loaded range in the page: neither has
 * a server counterpart, and both are cheap over a range that is already bounded
 * by the visible dates.
 */
const CalendarFilters = ({ values, students, onChange, onClear }: CalendarFiltersProps) => {
  const isFiltered =
    values.studentId !== '' || values.timing !== 'all' || values.search.trim() !== ''

  return (
    <section className='calendar-filters'>
      <h2 className='calendar-filters__heading'>{filters.heading}</h2>

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
    </section>
  )
}

export default CalendarFilters
