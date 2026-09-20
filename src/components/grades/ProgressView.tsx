import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import type { ProgressTotals } from '../../types'
import { fetchStudentProgress } from '../../store/progressSlice'
import { fetchStudents } from '../../store/studentsSlice'
import { GRADES_CONTENT } from '../../constants/grades'
import { isDateKey, todayKey } from '../../utils/calendarDates'
import {
  defaultProgressRange,
  fillTemplate,
  formatDecimal,
  formatPercentage,
  monthStart,
  schoolYearStart,
} from '../../utils/grades'

const { progress } = GRADES_CONTENT

const STUDENT_PARAM = 'student'
const FROM_PARAM = 'from'
const TO_PARAM = 'to'

interface TotalsProps {
  label: string
  totals: ProgressTotals
  /** The overall roll up is the headline, so it is drawn larger. */
  headline?: boolean
}

/**
 * One subject's figures, or the overall row in the same shape. The percentage
 * never appears without the counts beside it: 100% of one marked piece out of
 * nine is not the same claim as 100% of nine.
 */
const TotalsCard = ({ label, totals, headline = false }: TotalsProps) => {
  const percent = formatPercentage(totals.percentage)

  return (
    <li className={`progress-card${headline ? ' progress-card--headline' : ''}`}>
      <span className='progress-card__name'>{label}</span>

      <span className='progress-card__figure'>
        {percent === null ? (
          <span className='progress-card__unmarked'>{progress.notMarked}</span>
        ) : (
          <>
            <span className='progress-card__percent'>{percent}</span>
            {totals.letter && <span className='progress-card__letter'>{totals.letter}</span>}
          </>
        )}
      </span>

      <span className='progress-card__counts'>
        <span className='progress-card__count'>
          {fillTemplate(progress.counts, {
            graded: String(totals.gradedCount),
            assigned: String(totals.assignedCount),
          })}
        </span>
        {totals.ungradedCount > 0 && (
          <span className='progress-card__count progress-card__count--pending'>
            {fillTemplate(progress.ungraded, { ungraded: String(totals.ungradedCount) })}
          </span>
        )}
        {totals.gradedCount > 0 && (
          <span className='progress-card__count'>
            {fillTemplate(progress.points, {
              earned: formatDecimal(totals.pointsEarned),
              possible: formatDecimal(totals.pointsPossible),
            })}
          </span>
        )}
      </span>
    </li>
  )
}

/**
 * The weighted roll up, per student and per subject, over a period. The period
 * is required by the endpoint, so this opens on the school year so far rather
 * than asking a teacher to pick two dates before anything appears. Both ends
 * stay on screen and editable, so the default is visible rather than implied.
 */
const ProgressView = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [searchParams, setSearchParams] = useSearchParams()

  const { items: students, loading: studentsLoading, loaded: studentsLoaded } = useSelector(
    (state: RootState) => state.students
  )
  const { report, loading, error } = useSelector((state: RootState) => state.progress)

  useEffect(() => {
    dispatch(fetchStudents())
  }, [dispatch])

  const today = todayKey()
  const fallback = defaultProgressRange(today)

  // A student id that is not on the roster falls back to the first one rather
  // than asking the server for a report it will refuse.
  const studentParam = searchParams.get(STUDENT_PARAM)
  const studentId =
    studentParam !== null && students.some((student) => student.id === studentParam)
      ? studentParam
      : (students[0]?.id ?? null)

  const fromParam = searchParams.get(FROM_PARAM)
  const toParam = searchParams.get(TO_PARAM)
  const from = isDateKey(fromParam) ? fromParam : fallback.from
  const to = isDateKey(toParam) ? toParam : fallback.to

  // The endpoint rejects a reversed range, so it is caught here and said in
  // the app's own words instead of being sent to be refused.
  const rangeValid = from <= to

  useEffect(() => {
    if (studentId === null || !rangeValid) return

    dispatch(fetchStudentProgress({ studentId, range: { from, to } }))
  }, [dispatch, studentId, from, to, rangeValid])

  const updateParams = (next: Record<string, string | null>) => {
    setSearchParams((current) => {
      const params = new URLSearchParams(current)
      Object.entries(next).forEach(([key, value]) => {
        if (value === null) params.delete(key)
        else params.set(key, value)
      })

      return params
    })
  }

  const selectedStudent = students.find((student) => student.id === studentId) ?? null
  const studentName = selectedStudent
    ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
    : ''

  const showEmptyRange =
    !loading && !error && rangeValid && report !== null && report.subjects.length === 0

  return (
    <div className='grades__view'>
      {/* Always on the page, never behind a disclosure: the period and the
          student are what explain a report that looks emptier than expected. */}
      <div className='grades__filters grades__filters--progress'>
        <label className='grades__filter-field' htmlFor='progress-student'>
          <span className='grades__filter-label'>{progress.studentLabel}</span>
          <select
            id='progress-student'
            className='grades__select'
            value={studentId ?? ''}
            disabled={students.length === 0}
            onChange={(changeEvent) => updateParams({ [STUDENT_PARAM]: changeEvent.target.value })}
          >
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.firstName} {student.lastName}
              </option>
            ))}
          </select>
        </label>

        <label className='grades__filter-field' htmlFor='progress-from'>
          <span className='grades__filter-label'>{progress.fromLabel}</span>
          <input
            id='progress-from'
            type='date'
            className='grades__date'
            value={from}
            onChange={(changeEvent) => updateParams({ [FROM_PARAM]: changeEvent.target.value })}
          />
        </label>

        <label className='grades__filter-field' htmlFor='progress-to'>
          <span className='grades__filter-label'>{progress.toLabel}</span>
          <input
            id='progress-to'
            type='date'
            className='grades__date'
            value={to}
            onChange={(changeEvent) => updateParams({ [TO_PARAM]: changeEvent.target.value })}
          />
        </label>

        <div className='grades__marks' role='group' aria-label={progress.presetLabel}>
          <button
            type='button'
            className='grades__mark'
            onClick={() =>
              updateParams({ [FROM_PARAM]: monthStart(today), [TO_PARAM]: today })
            }
          >
            {progress.thisMonth}
          </button>
          <button
            type='button'
            className='grades__mark'
            onClick={() =>
              updateParams({ [FROM_PARAM]: schoolYearStart(today), [TO_PARAM]: today })
            }
          >
            {progress.schoolYear}
          </button>
        </div>
      </div>

      <p className='grades__explainer'>{progress.explainer}</p>

      {!rangeValid && (
        <p className='grades__error' role='alert'>
          {progress.invalidRange}
        </p>
      )}

      {studentsLoaded && students.length === 0 && (
        <p className='grades__status'>{progress.noStudents}</p>
      )}

      {(loading || studentsLoading) && <p className='grades__status'>{progress.loading}</p>}

      {!loading && error && (
        <p className='grades__error' role='alert'>
          {error}
        </p>
      )}

      {showEmptyRange && (
        <p className='grades__status'>
          {fillTemplate(progress.emptyRange, { name: studentName })}
        </p>
      )}

      {!loading && !error && rangeValid && report !== null && report.subjects.length > 0 && (
        <ul className='progress-list'>
          <TotalsCard label={progress.overall} totals={report.overall} headline />
          {report.subjects.map((subject) => (
            <TotalsCard key={subject.subjectId} label={subject.subjectName} totals={subject} />
          ))}
        </ul>
      )}
    </div>
  )
}

export default ProgressView
