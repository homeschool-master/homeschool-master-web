import type { Student } from '../../types'

interface StudentPickerProps {
  students: Student[]
  /** The ids currently picked. Empty means everyone, not nobody. */
  selected: string[]
  onChange: (next: string[]) => void
  /** Prefixes the control ids, so two pickers can sit on one page. */
  idPrefix: string
  label: string
  /**
   * What nobody picked is called. The profile names for this are about the
   * teacher as well as the students, which reads wrong at the head of a list
   * of children, so each caller passes the wording its own control used.
   */
  allLabel: string
}

/**
 * Picks any number of students. Checkboxes rather than a multiple select: a
 * native multi select needs a modifier key to add a second choice, which is
 * undiscoverable on a desktop and absent on a phone, and it hides everything
 * not scrolled to.
 *
 * Nothing picked means everyone, which is the state this starts in and the one
 * the All row returns it to. That keeps "no filter" and "filter matching
 * nobody" from looking the same.
 */
const StudentPicker = ({
  students,
  selected,
  onChange,
  idPrefix,
  label,
  allLabel,
}: StudentPickerProps) => {
  const toggle = (id: string) => {
    onChange(selected.includes(id) ? selected.filter((value) => value !== id) : [...selected, id])
  }

  return (
    <fieldset className='student-picker'>
      <legend className='student-picker__legend'>{label}</legend>

      <label className='student-picker__row' htmlFor={`${idPrefix}-all`}>
        <input
          id={`${idPrefix}-all`}
          type='checkbox'
          className='student-picker__box'
          checked={selected.length === 0}
          // Already everyone: ticking it again would be a no-op that reads as
          // a control that does nothing, so it only ever clears.
          onChange={() => onChange([])}
        />
        <span className='student-picker__name'>{allLabel}</span>
      </label>

      {students.map((student) => (
        <label
          key={student.id}
          className='student-picker__row'
          htmlFor={`${idPrefix}-${student.id}`}
        >
          <input
            id={`${idPrefix}-${student.id}`}
            type='checkbox'
            className='student-picker__box'
            checked={selected.includes(student.id)}
            onChange={() => toggle(student.id)}
          />
          <span
            className='student-picker__dot'
            style={student.color ? { backgroundColor: student.color } : undefined}
            aria-hidden='true'
          />
          <span className='student-picker__name'>{student.firstName}</span>
        </label>
      ))}
    </fieldset>
  )
}

export default StudentPicker
