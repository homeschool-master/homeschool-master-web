import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import type { Subject, SubjectInput } from '../../types'
import {
  clearRemoveError,
  clearSaveError,
  createSubject,
  fetchSubjects,
  removeSubject,
  updateSubject,
} from '../../store/subjectsSlice'
import { SUBJECTS_CONTENT } from '../../constants/subjects'
import Button from '../shared/Button'
import SubjectForm from './SubjectForm'

type Mode =
  | { kind: 'idle' }
  | { kind: 'add' }
  | { kind: 'edit'; subject: Subject }
  | { kind: 'remove'; subject: Subject }

/**
 * Subjects are few, always active, and already ordered by name by the
 * endpoint, so there is nothing here to filter or sort: the list is the list.
 * Everything else follows the tasks page: one fetch, the Add control above the
 * list, and one slot beneath it holding whichever of the form or the remove
 * confirmation is open.
 */
const SubjectsSection = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { items, loading, error, saving, saveError, removingId, removeError } = useSelector(
    (state: RootState) => state.subjects
  )

  const [mode, setMode] = useState<Mode>({ kind: 'idle' })

  useEffect(() => {
    dispatch(fetchSubjects())
  }, [dispatch])

  /**
   * Brings whatever just opened into view. The test is whether the top of the
   * panel is on screen: adding from the control directly above it needs no
   * movement, while editing or removing from a row further down does.
   * Measured synchronously, since an animation frame never runs while the
   * document is hidden and would leave the panel quietly off screen.
   */
  const revealPanel = (node: HTMLDivElement | null) => {
    if (node === null) return

    const top = node.getBoundingClientRect().top
    if (top >= 0 && top < window.innerHeight) return

    node.scrollIntoView({ block: 'start' })
  }

  // Moving between the list, the form and the confirmation drops any error
  // left over from the previous attempt.
  const goTo = (next: Mode) => {
    dispatch(clearSaveError())
    dispatch(clearRemoveError())
    setMode(next)
  }

  const handleSubmit = async (values: SubjectInput): Promise<boolean> => {
    const result =
      mode.kind === 'edit'
        ? await dispatch(updateSubject({ id: mode.subject.id, input: values }))
        : await dispatch(createSubject(values))

    return mode.kind === 'edit'
      ? updateSubject.fulfilled.match(result)
      : createSubject.fulfilled.match(result)
  }

  const handleRemove = async (subject: Subject) => {
    const result = await dispatch(removeSubject(subject.id))
    if (removeSubject.fulfilled.match(result)) setMode({ kind: 'idle' })
  }

  const showList = !loading && !error && items.length > 0
  const showEmpty = !loading && !error && items.length === 0
  const isEditingOrAdding = mode.kind === 'add' || mode.kind === 'edit'

  // Distinct per opening, including edit on one row then edit on another, so
  // the slot remounts and the reveal fires each time.
  const panelKey =
    mode.kind === 'add' || mode.kind === 'idle' ? mode.kind : `${mode.kind}:${mode.subject.id}`

  return (
    <div className='subjects'>
      <p className='subjects__intro'>{SUBJECTS_CONTENT.intro}</p>

      {!loading && !error && mode.kind === 'idle' && (
        <div className='subjects__actions'>
          <Button color='cream' onClick={() => goTo({ kind: 'add' })}>
            {SUBJECTS_CONTENT.addButton}
          </Button>
        </div>
      )}

      {/* Whatever is open replaces the Add control in the same spot, so
          neither adding nor removing sends the eye somewhere else. */}
      {mode.kind !== 'idle' && (
        <div key={panelKey} className='subjects__slot' ref={revealPanel}>
          {isEditingOrAdding && (
            <>
              {saveError && (
                <p className='dashboard__api-error' role='alert'>
                  {saveError}
                </p>
              )}
              <SubjectForm
                key={mode.kind === 'edit' ? mode.subject.id : 'new'}
                subject={mode.kind === 'edit' ? mode.subject : null}
                saving={saving}
                onSubmit={handleSubmit}
                onCancel={() => goTo({ kind: 'idle' })}
              />
            </>
          )}

          {mode.kind === 'remove' && (
            <div className='subjects__confirm'>
              {removeError && (
                <p className='dashboard__api-error' role='alert'>
                  {removeError}
                </p>
              )}
              <p className='subject-form__title'>{SUBJECTS_CONTENT.remove.heading}</p>
              <p className='subjects__confirm-name'>{mode.subject.name}</p>
              <p className='subjects__confirm-body'>{SUBJECTS_CONTENT.remove.body}</p>
              <div className='subject-form__actions'>
                <button
                  type='button'
                  className='subject-form__cancel'
                  onClick={() => goTo({ kind: 'idle' })}
                  disabled={removingId !== null}
                >
                  {SUBJECTS_CONTENT.remove.cancel}
                </button>
                <Button
                  color='danger'
                  onClick={() => handleRemove(mode.subject)}
                  disabled={removingId !== null}
                >
                  {removingId !== null
                    ? SUBJECTS_CONTENT.remove.removing
                    : SUBJECTS_CONTENT.remove.confirm}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {loading && <p className='subjects__status'>{SUBJECTS_CONTENT.loading}</p>}

      {!loading && error && (
        <p className='dashboard__api-error' role='alert'>
          {error}
        </p>
      )}

      {showEmpty && <p className='subjects__status'>{SUBJECTS_CONTENT.empty}</p>}

      {showList && (
        <ul className='subjects__list'>
          {items.map((subject) => (
            <li key={subject.id} className='subject-row'>
              <span
                className='subject-row__dot'
                style={subject.color ? { backgroundColor: subject.color } : undefined}
                aria-hidden='true'
              />

              <span className='subject-row__body'>
                <span className='subject-row__name'>{subject.name}</span>
                <span className='subject-row__description'>
                  {subject.description ?? SUBJECTS_CONTENT.noDescription}
                </span>
              </span>

              <span className='subject-row__actions'>
                <button
                  type='button'
                  className='subject-row__action'
                  onClick={() => goTo({ kind: 'edit', subject })}
                >
                  {SUBJECTS_CONTENT.editAction}
                </button>
                <button
                  type='button'
                  className='subject-row__action'
                  onClick={() => goTo({ kind: 'remove', subject })}
                >
                  {SUBJECTS_CONTENT.removeAction}
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SubjectsSection
