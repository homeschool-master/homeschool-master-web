import { GRADE_LEVELS } from '../../constants/onboarding'
import type { StudentDraft } from '../../pages/app/OnboardingPage'

interface StudentSummaryListProps {
  students: StudentDraft[]
  currentIndex: number
  onSelect: (index: number) => void
  onChangeCount: () => void
  disabled: boolean
}

const gradeLabel = (value: string) => GRADE_LEVELS.find((grade) => grade.value === value)?.label ?? ''

const StudentSummaryList = ({
  students,
  currentIndex,
  onSelect,
  onChangeCount,
  disabled,
}: StudentSummaryListProps) => {
  const firstUnsaved = students.findIndex((student) => student.id === null)

  return (
    <aside className='student-summary' aria-label='Students in this setup'>
      <div className='student-summary__header'>
        <h2 className='student-summary__heading'>Your students</h2>
        <button
          type='button'
          className='student-summary__change'
          onClick={onChangeCount}
          disabled={disabled}
        >
          Change number of students
        </button>
      </div>

      <ol className='student-summary__list'>
        {students.map((student, index) => {
          const isCurrent = index === currentIndex
          const isComplete = student.id !== null
          const isNextUp = index === firstUnsaved
          const canSelect = (isComplete || isNextUp) && !isCurrent && !disabled

          const name = student.firstName.trim()
            ? `${student.firstName} ${student.lastName}`.trim()
            : `Student ${index + 1}`

          const classes = [
            'student-summary__item',
            isCurrent ? 'student-summary__item--current' : '',
            !isComplete && !isCurrent && !isNextUp ? 'student-summary__item--pending' : '',
          ]
            .filter(Boolean)
            .join(' ')

          const body = (
            <>
              <span
                className='student-summary__dot'
                style={student.color ? { backgroundColor: student.color } : undefined}
                aria-hidden='true'
              />
              <span className='student-summary__text'>
                <span className='student-summary__name'>{name}</span>
                {student.gradeLevel && (
                  <span className='student-summary__grade'>{gradeLabel(student.gradeLevel)}</span>
                )}
              </span>
            </>
          )

          return (
            <li key={student.id ?? index} className={classes}>
              {canSelect ? (
                <button
                  type='button'
                  className='student-summary__button'
                  onClick={() => onSelect(index)}
                >
                  {body}
                  {isComplete && <span className='student-summary__action'>Edit</span>}
                </button>
              ) : (
                <div className='student-summary__static'>
                  {body}
                  {isCurrent && <span className='student-summary__action'>Current</span>}
                </div>
              )}
            </li>
          )
        })}
      </ol>
    </aside>
  )
}

export default StudentSummaryList
