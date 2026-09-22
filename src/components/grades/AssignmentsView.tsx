import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import type { Assignment, AssignmentInput } from '../../types'
import type { ScoreChange } from '../../store/assignmentsSlice'
import {
  clearRemoveError,
  clearSaveError,
  clearScoreError,
  createAssignment,
  fetchAssignments,
  recordScores,
  removeAssignment,
  updateAssignment,
} from '../../store/assignmentsSlice'
import { fetchStudents } from '../../store/studentsSlice'
import { fetchSubjects } from '../../store/subjectsSlice'
import { fetchAssignmentTypes } from '../../store/assignmentTypesSlice'
import { GRADES_CONTENT } from '../../constants/grades'
import { DOCUMENTS_CONTENT } from '../../constants/documents'
import { countsByTarget } from '../../utils/documents'
import { fetchDocuments } from '../../store/documentsSlice'
import { MARK_FILTERS, applyAssignmentFilters, isMarkFilter } from '../../utils/grades'
import type { MarkFilter } from '../../utils/grades'
import Button from '../shared/Button'
import AssignmentForm from './AssignmentForm'
import AssignmentRow from './AssignmentRow'
import AttachedDocuments from '../documents/AttachedDocuments'
import ScorePanel from './ScorePanel'

type Mode =
  | { kind: 'idle' }
  | { kind: 'add' }
  | { kind: 'edit'; assignment: Assignment }
  | { kind: 'score'; assignment: Assignment }
  | { kind: 'remove'; assignment: Assignment }
  | { kind: 'documents'; assignment: Assignment }

const SUBJECT_PARAM = 'subject'
const MARK_PARAM = 'show'
/** Names the one piece of work a link from the gradebook came to open. */
const OPEN_PARAM = 'open'

/**
 * The list of work, following the tasks and subjects pages: one shared fetch,
 * URL backed filters, the Add control above the list, and a single slot
 * beneath it holding whichever panel is open. Scoring is the fourth thing that
 * slot can hold, since only one of the four is ever open at a time.
 */
const AssignmentsView = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [searchParams, setSearchParams] = useSearchParams()

  const {
    items,
    loading,
    error,
    saving,
    saveError,
    removingId,
    removeError,
    scoringId,
    scoreError,
  } = useSelector((state: RootState) => state.assignments)
  const { items: subjects } = useSelector((state: RootState) => state.subjects)
  const { items: assignmentTypes } = useSelector((state: RootState) => state.assignmentTypes)
  const { items: students, loading: studentsLoading } = useSelector(
    (state: RootState) => state.students
  )
  const { items: documents } = useSelector((state: RootState) => state.documents)

  const [mode, setMode] = useState<Mode>({ kind: 'idle' })

  // One fetch for the page: the rows say how many documents they carry, and
  // the panel reads the same list rather than fetching its own.
  const documentCounts = useMemo(() => countsByTarget(documents, 'Assignment'), [documents])

  useEffect(() => {
    dispatch(fetchAssignments())
    // The rows carry a document count, which needs the library.
    dispatch(fetchDocuments())
    // The row names its subject and the form offers them, so both lists are
    // needed here rather than only on the page that edits them.
    dispatch(fetchSubjects())
    // The form needs the types to offer, and a row names the kind of work.
    dispatch(fetchAssignmentTypes())
    dispatch(fetchStudents())
  }, [dispatch])

  // In the URL like the tasks filter, so a filtered list is linkable and
  // survives a reload. Each default writes no param, so a bare /grades is
  // everything.
  const markParam = searchParams.get(MARK_PARAM)
  const mark: MarkFilter = isMarkFilter(markParam) ? markParam : 'all'

  const subjectParam = searchParams.get(SUBJECT_PARAM)
  // The work a gradebook mark linked to, marked and scrolled to on arrival.
  const openParam = searchParams.get(OPEN_PARAM)
  // A subject that is no longer on the list would filter everything away with
  // no way to tell why, so an unknown id falls back to showing all of them.
  const subjectId =
    subjectParam !== null && subjects.some((subject) => subject.id === subjectParam)
      ? subjectParam
      : null

  const visible = useMemo(
    () => applyAssignmentFilters(items, subjectId, mark),
    [items, subjectId, mark]
  )

  const updateParam = (key: string, value: string | null) => {
    setSearchParams((current) => {
      const params = new URLSearchParams(current)
      if (value === null) params.delete(key)
      else params.set(key, value)

      return params
    })
  }

  /**
   * Brings whatever just opened above the list into view. The test is whether
   * the top of the panel is on screen, not whether all of it is: adding from
   * the control directly above needs no movement, while scoring or editing
   * from a row far down does. Measured synchronously, since an animation frame
   * never runs while the document is hidden and would leave the panel quietly
   * off screen.
   */
  const revealPanel = (node: HTMLDivElement | null) => {
    if (node === null) return

    const top = node.getBoundingClientRect().top
    if (top >= 0 && top < window.innerHeight) return

    node.scrollIntoView({ block: 'start' })
  }

  // Moving between the list and any panel drops the errors left over from the
  // previous attempt.
  const goTo = (next: Mode) => {
    dispatch(clearSaveError())
    dispatch(clearRemoveError())
    dispatch(clearScoreError())
    setMode(next)
  }

  const handleSubmit = async (values: AssignmentInput): Promise<boolean> => {
    const result =
      mode.kind === 'edit'
        ? await dispatch(updateAssignment({ id: mode.assignment.id, input: values }))
        : await dispatch(createAssignment(values))

    return mode.kind === 'edit'
      ? updateAssignment.fulfilled.match(result)
      : createAssignment.fulfilled.match(result)
  }

  const handleScores = async (assignment: Assignment, changes: ScoreChange[]) => {
    const result = await dispatch(recordScores({ assignmentId: assignment.id, changes }))
    return recordScores.fulfilled.match(result)
  }

  const handleRemove = async (assignment: Assignment) => {
    const result = await dispatch(removeAssignment(assignment.id))
    if (removeAssignment.fulfilled.match(result)) setMode({ kind: 'idle' })
  }

  const subjectFor = (assignment: Assignment) =>
    subjects.find((subject) => subject.id === assignment.subjectId) ?? null

  const showList = !loading && !error && visible.length > 0
  const showEmpty = !loading && !error && visible.length === 0
  const isEditingOrAdding = mode.kind === 'add' || mode.kind === 'edit'

  /**
   * The empty state has to answer the question the teacher is actually asking,
   * and a filtered empty list is a different question from a first visit. No
   * subjects at all is a third: nothing can be added until there is one.
   */
  const emptyMessage = (): string => {
    if (subjects.length === 0) return GRADES_CONTENT.empty.noSubjects
    if (subjectId !== null && mark !== 'all') return GRADES_CONTENT.empty.subjectAndMark
    if (subjectId !== null) return GRADES_CONTENT.empty.subject

    return GRADES_CONTENT.empty[mark]
  }

  // Distinct per opening, including scoring one row then another, so the slot
  // remounts and the reveal fires each time rather than swapping its contents
  // somewhere off screen.
  const panelKey =
    mode.kind === 'add' || mode.kind === 'idle'
      ? mode.kind
      : `${mode.kind}:${mode.assignment.id}`

  // The live copy, so a panel left open across a save shows what landed.
  const current =
    mode.kind === 'edit' || mode.kind === 'score' || mode.kind === 'remove'
      ? items.find((item) => item.id === mode.assignment.id) ?? mode.assignment
      : null

  return (
    <div className='grades__view'>
      {/* Out in the open rather than behind a disclosure: at phone width a
          collapsed panel hides the one thing that explains an empty list. */}
      <div className='grades__filters'>
        <label className='grades__filter-field' htmlFor='assignment-subject-filter'>
          <span className='grades__filter-label'>{GRADES_CONTENT.filters.subjectLabel}</span>
          <select
            id='assignment-subject-filter'
            className='grades__select'
            value={subjectId ?? ''}
            onChange={(changeEvent) =>
              updateParam(SUBJECT_PARAM, changeEvent.target.value || null)
            }
          >
            <option value=''>{GRADES_CONTENT.filters.allSubjects}</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
        </label>

        <div
          className='grades__marks'
          role='group'
          aria-label={GRADES_CONTENT.filters.markLabel}
        >
          {MARK_FILTERS.map((option) => (
            <button
              key={option}
              type='button'
              className={`grades__mark${mark === option ? ' grades__mark--active' : ''}`}
              aria-pressed={mark === option}
              onClick={() => updateParam(MARK_PARAM, option === 'all' ? null : option)}
            >
              {GRADES_CONTENT.filters[option]}
            </button>
          ))}
        </div>
      </div>

      {!loading && !error && mode.kind === 'idle' && subjects.length > 0 && (
        <div className='grades__actions'>
          <Button color='cream' onClick={() => goTo({ kind: 'add' })}>
            {GRADES_CONTENT.addButton}
          </Button>
        </div>
      )}

      {/* Whatever is open replaces the Add control in the same spot, so
          neither adding nor marking sends the eye somewhere else. */}
      {mode.kind !== 'idle' && (
        <div key={panelKey} className='grades__slot' ref={revealPanel}>
          {isEditingOrAdding && (
            <>
              {saveError && (
                <p className='grades__error' role='alert'>
                  {saveError}
                </p>
              )}
              <AssignmentForm
                key={mode.kind === 'edit' ? mode.assignment.id : 'new'}
                assignment={mode.kind === 'edit' ? current : null}
                subjects={subjects}
                assignmentTypes={assignmentTypes}
                students={students}
                studentsLoading={studentsLoading}
                saving={saving}
                onSubmit={handleSubmit}
                onCancel={() => goTo({ kind: 'idle' })}
              />
            </>
          )}

          {/* In the same slot the form and the score panel use, so opening
              the documents on a row a long way down does not send the eye
              somewhere else. */}
          {mode.kind === 'documents' && (
            <div className='grades__confirm'>
              <p className='grades__confirm-title'>{mode.assignment.title}</p>
              <AttachedDocuments attachableType='Assignment' targetId={mode.assignment.id} />
              <div className='assignment-form__actions'>
                <button
                  type='button'
                  className='assignment-form__cancel'
                  onClick={() => goTo({ kind: 'idle' })}
                >
                  {DOCUMENTS_CONTENT.attached.done}
                </button>
              </div>
            </div>
          )}

          {mode.kind === 'score' && current && (
            <>
              {scoreError && (
                <p className='grades__error' role='alert'>
                  {scoreError}
                </p>
              )}
              <ScorePanel
                key={current.id}
                assignment={current}
                students={students}
                subjectName={subjectFor(current)?.name ?? GRADES_CONTENT.row.unknownSubject}
                saving={scoringId === current.id}
                onSave={(changes) => handleScores(current, changes)}
                onCancel={() => goTo({ kind: 'idle' })}
              />
            </>
          )}

          {mode.kind === 'remove' && current && (
            <div className='grades__confirm'>
              {removeError && (
                <p className='grades__error' role='alert'>
                  {removeError}
                </p>
              )}
              <p className='assignment-form__title'>{GRADES_CONTENT.remove.heading}</p>
              <p className='grades__confirm-name'>{current.title}</p>
              <p className='grades__confirm-body'>{GRADES_CONTENT.remove.body}</p>
              <div className='assignment-form__actions'>
                <button
                  type='button'
                  className='assignment-form__cancel'
                  onClick={() => goTo({ kind: 'idle' })}
                  disabled={removingId !== null}
                >
                  {GRADES_CONTENT.remove.cancel}
                </button>
                <Button
                  color='danger'
                  onClick={() => handleRemove(current)}
                  disabled={removingId !== null}
                >
                  {removingId !== null
                    ? GRADES_CONTENT.remove.removing
                    : GRADES_CONTENT.remove.confirm}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {loading && <p className='grades__status'>{GRADES_CONTENT.loading}</p>}

      {!loading && error && (
        <p className='grades__error' role='alert'>
          {error}
        </p>
      )}

      {showEmpty && <p className='grades__status'>{emptyMessage()}</p>}

      {showList && (
        <ul className='grades__list'>
          {visible.map((assignment) => (
            <AssignmentRow
              key={assignment.id}
              assignment={assignment}
              subject={subjectFor(assignment)}
              onScore={(next) => goTo({ kind: 'score', assignment: next })}
              onEdit={(next) => goTo({ kind: 'edit', assignment: next })}
              onRemove={(next) => goTo({ kind: 'remove', assignment: next })}
              onDocuments={(next) => goTo({ kind: 'documents', assignment: next })}
              documentCount={documentCounts[assignment.id] ?? 0}
              highlighted={assignment.id === openParam}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default AssignmentsView
