import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import type { Student } from '../../types'
import type { Profile } from '../../utils/profile'
import { DEFAULT_PROFILE, profileOptionsFor, sameProfile } from '../../utils/profile'
import { readableTextColor } from '../../utils/studentColor'
import { DASHBOARD_CONTENT } from '../../constants/dashboard'
import { PROFILE_CONTENT } from '../../constants/profile'

const { switcher } = DASHBOARD_CONTENT

// Neutral marks for the three fixed profiles. The mockup puts a photo on every
// chip: there is no upload flow, so students get the coloured initials circle
// the student cards already use and the fixed three get a line glyph instead,
// which reads as a category rather than as a person with no picture.
const TeacherGlyph = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <circle cx='12' cy='8' r='3.5' /><path d='M5 20v-1a6 6 0 0 1 6-6h2a6 6 0 0 1 6 6v1' />
  </svg>
)
const FamilyGlyph = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <circle cx='8' cy='7' r='3' /><circle cx='17' cy='9' r='2.5' />
    <path d='M2 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1' /><path d='M16 14h1a4 4 0 0 1 4 4v2' />
  </svg>
)
const StudentsGlyph = () => (
  <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <circle cx='7' cy='9' r='2.5' /><circle cx='16.5' cy='9' r='2.5' />
    <path d='M2 19v-1a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v1' />
    <path d='M12.5 19v-1a4 4 0 0 1 4-4h1a4 4 0 0 1 4 4v1' />
  </svg>
)

const GLYPHS = {
  teacher: TeacherGlyph,
  everyone: FamilyGlyph,
  students: StudentsGlyph,
}

interface ProfileSwitcherProps {
  profile: Profile
  students: Student[]
  onSelect: (next: Profile) => void
  /**
   * The URL names a student the roster does not have. No chip can be checked
   * for them, so the band says why instead of just looking unselected.
   */
  unknownProfile: boolean
}

/** Stable per option, so React keys and radio ids do not collide. */
const optionKey = (option: Profile): string =>
  option.kind === 'student' ? `student:${option.studentId}` : option.kind

const initials = (student: Student): string =>
  `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase()

const colorStyle = (color: string | null): CSSProperties | undefined =>
  color ? { backgroundColor: color, color: readableTextColor(color) } : undefined

/**
 * Whose calendar the dashboard and the calendar are showing. Native radios
 * rather than buttons with aria-checked: the group then gets arrow key
 * movement, a single tab stop and the right announcement without reimplementing
 * any of it.
 */
const ProfileSwitcher = ({
  profile,
  students,
  onSelect,
  unknownProfile,
}: ProfileSwitcherProps) => {
  const options = profileOptionsFor(students)
  const studentsById = new Map(students.map((student) => [student.id, student]))

  const labelFor = (option: Profile): string => {
    if (option.kind !== 'student') return switcher[option.kind]
    return studentsById.get(option.studentId ?? '')?.firstName ?? ''
  }

  return (
    <section className='profile-switcher'>
      <div className='profile-switcher__inner'>
        <fieldset className='profile-switcher__group'>
          <legend className='profile-switcher__heading'>{switcher.heading}</legend>

          <div className='profile-switcher__grid'>
            {options.map((option) => {
              const key = optionKey(option)
              const active = sameProfile(option, profile)
              const student =
                option.kind === 'student' ? studentsById.get(option.studentId ?? '') : undefined
              const Glyph = option.kind === 'student' ? null : GLYPHS[option.kind]

              return (
                <label
                  key={key}
                  className={`profile-switcher__chip${
                    active ? ' profile-switcher__chip--active' : ''
                  }`}
                >
                  <input
                    type='radio'
                    name='dashboard-profile'
                    className='profile-switcher__input'
                    value={key}
                    checked={active}
                    onChange={() => onSelect(option)}
                  />

                  <span
                    className={`profile-switcher__avatar${
                      student ? '' : ' profile-switcher__avatar--glyph'
                    }`}
                    style={student ? colorStyle(student.color) : undefined}
                    aria-hidden='true'
                  >
                    {student ? initials(student) : Glyph && <Glyph />}
                  </span>

                  <span className='profile-switcher__name'>{labelFor(option)}</span>
                </label>
              )
            })}
          </div>
        </fieldset>

        {/* An out of date link, not a failure: say so where the reader is
            already looking for the selected chip, and offer the way back. */}
        {unknownProfile && (
          <p className='profile-switcher__note profile-switcher__note--warning' role='status'>
            <strong className='profile-switcher__note-heading'>
              {PROFILE_CONTENT.unknownHeading}
            </strong>{' '}
            {PROFILE_CONTENT.unknownNote}{' '}
            <button
              type='button'
              className='profile-switcher__note-button'
              onClick={() => onSelect(DEFAULT_PROFILE)}
            >
              {PROFILE_CONTENT.unknownReset}
            </button>
          </p>
        )}

        {/* A teacher with an empty roster still gets the three fixed chips, so
            the band is never blank: it just has nowhere to send them. */}
        {students.length === 0 && (
          <p className='profile-switcher__note'>
            {switcher.noStudents}{' '}
            <Link to={switcher.noStudentsPath} className='profile-switcher__note-link'>
              {switcher.noStudentsLink}
            </Link>
          </p>
        )}
      </div>
    </section>
  )
}

export default ProfileSwitcher
