import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import {
  clearRemoveError,
  clearSaveError,
  createStudent,
  fetchStudents,
  removeStudent,
  updateStudent,
} from '../../store/studentsSlice'
import { GRADE_LEVELS } from '../../constants/onboarding'
import { STUDENTS_CONTENT } from '../../constants/students'
import { readableTextColor } from '../../utils/studentColor'
import type { Student, StudentInput } from '../../types'
import Button from '../shared/Button'
import StudentForm from './StudentForm'

/**
 * A student with no colour keeps whatever the stylesheet gives the element. One
 * with a colour picks its own text colour from that fill, the way the calendar
 * pills do, so any swatch a parent chooses stays readable.
 */
const colorStyle = (color: string | null): CSSProperties | undefined =>
  color ? { backgroundColor: color, color: readableTextColor(color) } : undefined

const displayName = (student: Student): string =>
  `${student.firstName} ${student.lastName}`.trim()

/** Stands in for a photo until web has an upload flow. */
const initials = (student: Student): string =>
  `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase()

const gradeLabel = (value: string | null): string | null => {
  if (!value) return null
  return GRADE_LEVELS.find((grade) => grade.value === value)?.label ?? value
}

type Mode =
  | { kind: 'idle' }
  | { kind: 'add' }
  | { kind: 'edit'; student: Student }
  | { kind: 'remove'; student: Student }

const StudentsSection = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items: students, loading, error, saving, saveError, removingId, removeError } =
    useSelector((state: RootState) => state.students)

  const [mode, setMode] = useState<Mode>({ kind: 'idle' })

  useEffect(() => {
    dispatch(fetchStudents())
  }, [dispatch])

  // Moving between the roster, the form and the confirmation drops any error
  // left over from the previous attempt.
  const goTo = (next: Mode) => {
    dispatch(clearSaveError())
    dispatch(clearRemoveError())
    setMode(next)
  }

  const handleSubmit = async (values: StudentInput): Promise<boolean> => {
    const result =
      mode.kind === 'edit'
        ? await dispatch(updateStudent({ id: mode.student.id, input: values }))
        : await dispatch(createStudent(values))

    return mode.kind === 'edit'
      ? updateStudent.fulfilled.match(result)
      : createStudent.fulfilled.match(result)
  }

  const handleRemove = async (student: Student) => {
    const result = await dispatch(removeStudent(student.id))
    if (removeStudent.fulfilled.match(result)) setMode({ kind: 'idle' })
  }

  const showRoster = !loading && !error && students.length > 0
  const showEmpty = !loading && !error && students.length === 0
  const isEditingOrAdding = mode.kind === 'add' || mode.kind === 'edit'

  return (
    <div className='dashboard__students'>
      {loading && <p className='dashboard__students-empty'>{STUDENTS_CONTENT.loading}</p>}

      {!loading && error && (
        <p className='dashboard__api-error' role='alert'>
          {error}
        </p>
      )}

      {showEmpty && <p className='dashboard__students-empty'>{STUDENTS_CONTENT.empty}</p>}

      {showRoster && (
        <ul className='dashboard__students-grid'>
          {students.map((student) => {
            const name = displayName(student)
            const grade = gradeLabel(student.gradeLevel)

            return (
              <li key={student.id} className='dashboard__student-card'>
                {student.profileImageUrl ? (
                  <img
                    className='dashboard__student-avatar'
                    src={student.profileImageUrl}
                    alt=''
                  />
                ) : (
                  <span
                    className='dashboard__student-avatar'
                    style={colorStyle(student.color)}
                    aria-hidden='true'
                  >
                    {initials(student)}
                  </span>
                )}

                {/* The title carries the name a narrow card has to truncate. */}
                <span className='dashboard__student-name' title={name}>
                  {name}
                </span>

                {grade && <span className='dashboard__student-grade'>{grade}</span>}

                <span className='dashboard__student-actions'>
                  <button
                    type='button'
                    className='dashboard__student-action'
                    onClick={() => goTo({ kind: 'edit', student })}
                  >
                    {STUDENTS_CONTENT.editAction}
                  </button>
                  <button
                    type='button'
                    className='dashboard__student-action'
                    onClick={() => goTo({ kind: 'remove', student })}
                  >
                    {STUDENTS_CONTENT.removeAction}
                  </button>
                </span>
              </li>
            )
          })}
        </ul>
      )}

      {removeError && (
        <p className='dashboard__api-error' role='alert'>
          {removeError}
        </p>
      )}

      {!loading && !error && mode.kind === 'idle' && (
        <div className='dashboard__students-actions'>
          <Button color='cream' onClick={() => goTo({ kind: 'add' })}>
            {STUDENTS_CONTENT.addButton}
          </Button>
        </div>
      )}

      {isEditingOrAdding && (
        <>
          {saveError && (
            <p className='dashboard__api-error' role='alert'>
              {saveError}
            </p>
          )}
          <StudentForm
            key={mode.kind === 'edit' ? mode.student.id : 'new'}
            student={mode.kind === 'edit' ? mode.student : null}
            saving={saving}
            onSubmit={handleSubmit}
            onCancel={() => goTo({ kind: 'idle' })}
          />
        </>
      )}

      {mode.kind === 'remove' && (
        <div className='dashboard__students-confirm'>
          <p className='dashboard__section-title'>{STUDENTS_CONTENT.remove.heading}</p>
          <span className='dashboard__student-chip' style={colorStyle(mode.student.color)}>
            {mode.student.firstName}
          </span>
          <p className='dashboard__students-confirm-body'>{STUDENTS_CONTENT.remove.body}</p>
          <div className='dashboard__form-actions'>
            <button
              type='button'
              className='dashboard__cancel-btn'
              onClick={() => goTo({ kind: 'idle' })}
              disabled={removingId !== null}
            >
              {STUDENTS_CONTENT.remove.cancel}
            </button>
            <Button
              color='danger'
              onClick={() => handleRemove(mode.student)}
              disabled={removingId !== null}
            >
              {removingId === mode.student.id
                ? STUDENTS_CONTENT.remove.removing
                : STUDENTS_CONTENT.remove.confirm}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentsSection
