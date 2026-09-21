import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import type { ProgressEntry, ProgressTotals } from '../../types'
import { fetchAssignments } from '../../store/assignmentsSlice'
import { fetchStudentProgress } from '../../store/progressSlice'
import { fetchStudents } from '../../store/studentsSlice'
import { fetchSubjects } from '../../store/subjectsSlice'
import { GRADES_CONTENT } from '../../constants/grades'
import GradebookRow from './GradebookRow'
import { isDateKey, todayKey } from '../../utils/calendarDates'
import { readProfile } from '../../utils/profile'
import {
  defaultProgressRange,
  fillTemplate,
  formatDecimal,
  formatPercentage,
  monthStart,
  schoolYearStart,
} from '../../utils/grades'

const { progress } = GRADES_CONTENT
const { book } = progress

const STUDENT_PARAM = 'student'
const FROM_PARAM = 'from'
const TO_PARAM = 'to'

/** Assignments is its own section now, so every link out points at it. */
const ASSIGNMENTS_PATH = '/assignments'
const STUDENTS_PATH = '/settings/students'
const SUBJECTS_PATH = '/settings/subjects'

/**
 * Why a report has nothing in it. Ordered by what has to be true before the
 * next one can be: there is no point telling someone to set work when they
 * have no subject to file it under.
 */
type EmptyReason = 'noStudents' | 'noSubjects' | 'noAssignments' | 'unassigned' | 'allUndated' | 'range'

interface TotalsProps {
  label: string
  totals: ProgressTotals
  /** The overall roll up is the headline, so it is drawn larger. */
  headline?: boolean
  /**
   * The work this figure was summed from, listed beneath it. The roll up is
   * the heading of the group it rolls up, so the number and the rows that
   * produced it are read together rather than on two separate screens.
   */
  entries?: ProgressEntry[]
  assignmentHref?: (entry: ProgressEntry) => string
}

/**
 * One subject's figures, or the overall row in the same shape. The percentage
 * never appears without the counts beside it: 100% of one marked piece out of
 * nine is not the same claim as 100% of nine.
 */
const TotalsCard = ({
  label,
  totals,
  headline = false,
  entries,
  assignmentHref,
}: TotalsProps) => {
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

      {entries && entries.length > 0 && assignmentHref && (
        <ul className='gradebook' aria-label={fillTemplate(book.subjectWork, { name: label })}>
          {entries.map((entry) => (
            <GradebookRow
              key={entry.assignmentId}
              entry={entry}
              href={assignmentHref(entry)}
            />
          ))}
        </ul>
      )}
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
  // Telling an empty report apart from a report of nothing needs the work
  // itself, not just the roll up: the endpoint only answers for the period it
  // was asked about, so it cannot say whether anything exists outside it.
  const { items: assignments, loaded: assignmentsLoaded } = useSelector(
    (state: RootState) => state.assignments
  )
  const { items: subjects, loaded: subjectsLoaded } = useSelector(
    (state: RootState) => state.subjects
  )
  const { report, loading, error } = useSelector((state: RootState) => state.progress)

  useEffect(() => {
    dispatch(fetchStudents())
    dispatch(fetchSubjects())
    dispatch(fetchAssignments())
  }, [dispatch])

  const today = todayKey()
  const fallback = defaultProgressRange(today)

  /**
   * Whose gradebook this is.
   *
   * The page keeps its own student param rather than following the profile
   * switcher: a gradebook is one student's by definition, and two of the
   * switcher's four answers cannot name one. "Teacher" has no marks at all and
   * "Teacher & Students" is not a person, so following the profile would mean
   * inventing a meaning for both. What the profile does do is choose the
   * opening student when it names one, so arriving from a dashboard set to
   * Eliza lands on Eliza. This page's own param wins over it, which is what
   * makes a gradebook link a link to that gradebook.
   *
   * An id that is not on the roster falls back to the first student rather
   * than asking the server for a report it will refuse.
   */
  const profile = readProfile(searchParams)
  const onRoster = (id: string | null): boolean =>
    id !== null && students.some((student) => student.id === id)

  const studentParam = searchParams.get(STUDENT_PARAM)
  const studentId = onRoster(studentParam)
    ? studentParam
    : onRoster(profile.studentId)
      ? profile.studentId
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

  /**
   * Where a mark is opened. Grades reads and never scores, so the row links
   * into the Assignments section rather than growing a score box: one place
   * does the marking, and this page points at it. The subject filter comes
   * along so the list lands narrowed to the work in hand.
   */
  const assignmentHref = (entry: ProgressEntry): string => {
    const params = new URLSearchParams({ open: entry.assignmentId })
    return `${ASSIGNMENTS_PATH}?${params.toString()}`
  }

  const selectedStudent = students.find((student) => student.id === studentId) ?? null
  const studentName = selectedStudent
    ? `${selectedStudent.firstName} ${selectedStudent.lastName}`
    : ''

  /** Every piece of work this student holds, whenever it is due. */
  const held = useMemo(
    () =>
      studentId === null
        ? []
        : assignments.filter((assignment) =>
            assignment.grades.some((grade) => grade.studentId === studentId)
          ),
    [assignments, studentId]
  )

  /**
   * The first thing that is missing, which is the only one worth naming: a
   * teacher with no subjects also has no assignments, and telling her both
   * would bury the step that unblocks the other.
   *
   * The last two look alike and are not. Undated work belongs to no period at
   * all, so widening the range can never reach it, while work that is simply
   * due elsewhere is exactly what the range is for.
   */
  const emptyReason = (): EmptyReason => {
    if (students.length === 0) return 'noStudents'
    if (subjects.length === 0) return 'noSubjects'
    if (assignments.length === 0) return 'noAssignments'
    if (held.length === 0) return 'unassigned'
    if (held.every((assignment) => assignment.dueDate === null)) return 'allUndated'

    return 'range'
  }

  // Settled only once all three lists have answered: before that an empty one
  // means "not back yet" rather than "there are none", and naming the wrong
  // cause is the whole thing this is here to avoid.
  const settled = studentsLoaded && subjectsLoaded && assignmentsLoaded
  // The report has to be this student's own, so a report still in flight for
  // someone else is not read as an empty one for them.
  const reportIsEmpty =
    report !== null && report.studentId === studentId && report.subjects.length === 0

  const showEmpty =
    settled && !loading && !studentsLoading && !error && rangeValid &&
    (studentId === null || reportIsEmpty)

  /**
   * The message, and the place the next step is taken. Nothing here sits
   * behind a disclosure: it is the only thing on the page explaining why a
   * report is blank.
   */
  const renderEmpty = () => {
    const reason = emptyReason()
    const { empty } = progress
    const said = fillTemplate(empty[reason], { name: studentName })

    const action: Record<Exclude<EmptyReason, 'range'>, { label: string; to: string }> = {
      noStudents: { label: empty.noStudentsAction, to: STUDENTS_PATH },
      noSubjects: { label: empty.noSubjectsAction, to: SUBJECTS_PATH },
      noAssignments: { label: empty.noAssignmentsAction, to: ASSIGNMENTS_PATH },
      unassigned: { label: empty.unassignedAction, to: ASSIGNMENTS_PATH },
      allUndated: { label: empty.allUndatedAction, to: ASSIGNMENTS_PATH },
    }

    return (
      <p className='grades__status'>
        {said}
        {reason !== 'range' && (
          <>
            {' '}
            <Link className='grades__status-link' to={action[reason].to}>
              {action[reason].label}
            </Link>
          </>
        )}
      </p>
    )
  }

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

      {(loading || studentsLoading) && <p className='grades__status'>{progress.loading}</p>}

      {!loading && error && (
        <p className='grades__error' role='alert'>
          {error}
        </p>
      )}

      {showEmpty && renderEmpty()}

      {!loading && !error && rangeValid && report !== null && report.subjects.length > 0 && (
        <>
          <ul className='progress-list'>
            {/* The headline first, then each subject as the heading of the work
                it was summed from: one page, so the figure and the rows behind
                it are never two separate claims. */}
            <TotalsCard label={progress.overall} totals={report.overall} headline />
            {report.subjects.map((subject) => (
              <TotalsCard
                key={subject.subjectId}
                label={subject.subjectName}
                totals={subject}
                entries={subject.assignments}
                assignmentHref={assignmentHref}
              />
            ))}
          </ul>
        </>
      )}

      {/* Below every figure and outside all of them, with the reason in the
          open: a teacher who cannot find a piece of work in the report needs
          to be told where it went rather than left widening the dates. */}
      {!loading && !error && rangeValid && report !== null && report.undated.length > 0 && (
        <section className='gradebook-undated'>
          <h2 className='gradebook-undated__heading'>{book.undatedHeading}</h2>
          <p className='gradebook-undated__note'>{book.undatedNote}</p>
          <ul className='gradebook'>
            {report.undated.map((entry) => (
              <GradebookRow key={entry.assignmentId} entry={entry} href={assignmentHref(entry)} />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}

export default ProgressView
