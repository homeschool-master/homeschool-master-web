import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import { fetchStudents } from '../../store/studentsSlice'
import { STUDENTS_CONTENT } from '../../constants/students'
import { readableTextColor } from '../../utils/studentColor'

/**
 * A student with no colour keeps the chip the stylesheet gives it. One with a
 * colour picks its own text colour from that fill, the way the calendar pills
 * do, so any swatch a parent chooses stays readable.
 */
const chipStyle = (color: string | null): CSSProperties | undefined =>
  color ? { backgroundColor: color, color: readableTextColor(color) } : undefined

const StudentsSection = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items: students, loading, error } = useSelector((state: RootState) => state.students)

  useEffect(() => {
    dispatch(fetchStudents())
  }, [dispatch])

  const showRoster = !loading && !error && students.length > 0
  const showEmpty = !loading && !error && students.length === 0

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
          {students.map((student) => (
            <li
              key={student.id}
              className='dashboard__student-chip'
              style={chipStyle(student.color)}
            >
              {student.firstName}
            </li>
          ))}
        </ul>
      )}

      <div className='dashboard__students-manage-wrap'>
        <Link to='/download' className='dashboard__students-manage'>
          {STUDENTS_CONTENT.manageLink} <span aria-hidden='true'>&rarr;</span>
        </Link>
      </div>
    </div>
  )
}

export default StudentsSection
