import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../store'
import type { AssignmentType, WeightApplyMode } from '../../types'
import {
  clearRemoveError,
  clearSaveError,
  clearUpdatedCount,
  createAssignmentType,
  fetchAssignmentTypes,
  removeAssignmentType,
  updateAssignmentType,
} from '../../store/assignmentTypesSlice'
import { ASSIGNMENT_TYPES_CONTENT } from '../../constants/assignmentTypes'
import { fillTemplate, weightSentence } from '../../utils/grades'
import Button from '../shared/Button'
import AssignmentTypeForm from './AssignmentTypeForm'
import type { TypeFormValues } from './AssignmentTypeForm'
import WeightApplyChoice from './WeightApplyChoice'

type Mode =
  | { kind: 'idle' }
  | { kind: 'add' }
  | { kind: 'edit'; assignmentType: AssignmentType }
  | { kind: 'remove'; assignmentType: AssignmentType }

/** A save held back until the teacher says how far the new weight reaches. */
interface PendingWeight {
  assignmentType: AssignmentType
  values: TypeFormValues
}

const content = ASSIGNMENT_TYPES_CONTENT

/**
 * The teacher's own vocabulary for kinds of work, beside Subjects because it
 * is the same sort of list: a short set of names she sets up once and then
 * picks from while working. Putting it on the Assignments page would park a
 * management list in the middle of the view she uses every day.
 */
const AssignmentTypesSection = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    items,
    loading,
    error,
    saving,
    saveError,
    removingId,
    removeError,
    lastUpdatedCount,
  } = useSelector((state: RootState) => state.assignmentTypes)

  const [mode, setMode] = useState<Mode>({ kind: 'idle' })
  const [pending, setPending] = useState<PendingWeight | null>(null)

  useEffect(() => {
    dispatch(fetchAssignmentTypes())
  }, [dispatch])

  /**
   * Brings whatever just opened into view, the same test the subjects list
   * uses: the top of the panel being on screen, not all of it.
   */
  const revealPanel = (node: HTMLDivElement | null) => {
    if (node === null) return

    const top = node.getBoundingClientRect().top
    if (top >= 0 && top < window.innerHeight) return

    node.scrollIntoView({ block: 'start' })
  }

  const goTo = (next: Mode) => {
    dispatch(clearSaveError())
    dispatch(clearRemoveError())
    dispatch(clearUpdatedCount())
    setPending(null)
    setMode(next)
  }

  const close = () => {
    setPending(null)
    setMode({ kind: 'idle' })
  }

  /**
   * A changed default stops here and asks how far it reaches. Adding a type,
   * or renaming one without moving its weight, has nothing to ask about: there
   * is no existing work a new type could reach, and a rename changes no
   * arithmetic.
   */
  const handleSubmit = (values: TypeFormValues) => {
    if (mode.kind === 'edit' && values.weightChanged) {
      setPending({ assignmentType: mode.assignmentType, values })
      return
    }

    if (mode.kind === 'edit') void save(mode.assignmentType, values, 'new_only', null)
    else void add(values)
  }

  const add = async (values: TypeFormValues) => {
    const result = await dispatch(
      createAssignmentType({ name: values.name, defaultWeight: values.defaultWeight })
    )
    if (createAssignmentType.fulfilled.match(result)) close()
  }

  const save = async (
    assignmentType: AssignmentType,
    values: TypeFormValues,
    applyMode: WeightApplyMode,
    fromDate: string | null
  ) => {
    const result = await dispatch(
      updateAssignmentType({
        id: assignmentType.id,
        input: {
          name: values.name,
          defaultWeight: values.defaultWeight,
          applyMode,
          fromDate,
        },
      })
    )
    if (updateAssignmentType.fulfilled.match(result)) close()
  }

  const handleRemove = async (assignmentType: AssignmentType) => {
    const result = await dispatch(removeAssignmentType(assignmentType.id))
    if (removeAssignmentType.fulfilled.match(result)) close()
  }

  /** What actually happened, since the three modes look identical until they run. */
  const resultLine = (): string | null => {
    if (lastUpdatedCount === null) return null
    if (lastUpdatedCount === 0) return content.result.none
    if (lastUpdatedCount === 1) return content.result.one

    return fillTemplate(content.result.many, { count: String(lastUpdatedCount) })
  }

  const showList = !loading && !error && items.length > 0
  const showEmpty = !loading && !error && items.length === 0
  const isEditingOrAdding = mode.kind === 'add' || mode.kind === 'edit'

  const panelKey =
    mode.kind === 'add' || mode.kind === 'idle'
      ? mode.kind
      : `${mode.kind}:${mode.assignmentType.id}`

  return (
    <div className='subjects'>
      <p className='subjects__intro'>{content.subhead}</p>

      {/* Out in the open, above everything: what just happened to a term's
          worth of marks is not something to put behind a control. */}
      {resultLine() && (
        <p className='assignment-type__result' role='status'>
          {resultLine()}
        </p>
      )}

      {!loading && !error && mode.kind === 'idle' && (
        <div className='subjects__actions'>
          <Button color='cream' onClick={() => goTo({ kind: 'add' })}>
            {content.addButton}
          </Button>
        </div>
      )}

      {mode.kind !== 'idle' && (
        <div key={panelKey} className='subjects__slot' ref={revealPanel}>
          {/* Above the form it is about, so the question and the number it
              applies to stay on screen together. */}
          {pending && (
            <div className='subjects__scope'>
              {saveError && (
                <p className='dashboard__api-error' role='alert'>
                  {saveError}
                </p>
              )}
              <WeightApplyChoice
                typeName={pending.assignmentType.name}
                busy={saving}
                onConfirm={(applyMode, fromDate) => {
                  void save(pending.assignmentType, pending.values, applyMode, fromDate)
                }}
                onCancel={() => setPending(null)}
              />
            </div>
          )}

          {isEditingOrAdding && (
            <>
              {saveError && !pending && (
                <p className='dashboard__api-error' role='alert'>
                  {saveError}
                </p>
              )}
              <AssignmentTypeForm
                key={mode.kind === 'edit' ? mode.assignmentType.id : 'new'}
                assignmentType={mode.kind === 'edit' ? mode.assignmentType : null}
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
              <p className='subject-form__title'>{content.remove.heading}</p>
              <p className='subjects__confirm-name'>{mode.assignmentType.name}</p>
              <p className='subjects__confirm-body'>{content.remove.body}</p>
              <div className='subject-form__actions'>
                <button
                  type='button'
                  className='subject-form__cancel'
                  onClick={() => goTo({ kind: 'idle' })}
                  disabled={removingId !== null}
                >
                  {content.remove.cancel}
                </button>
                <Button
                  color='danger'
                  onClick={() => handleRemove(mode.assignmentType)}
                  disabled={removingId !== null}
                >
                  {removingId !== null ? content.remove.removing : content.remove.confirm}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {loading && <p className='subjects__status'>{content.loading}</p>}

      {!loading && error && (
        <p className='dashboard__api-error' role='alert'>
          {error}
        </p>
      )}

      {showEmpty && <p className='subjects__status'>{content.empty}</p>}

      {showList && (
        <ul className='subjects__list'>
          {items.map((assignmentType) => (
            <li key={assignmentType.id} className='subject-row subject-row--no-dot'>
              <span className='subject-row__body'>
                <span className='subject-row__name'>
                  {assignmentType.name}
                  {assignmentType.isBuiltIn && (
                    <span className='assignment-type__badge'>{content.builtInBadge}</span>
                  )}
                </span>
                <span className='subject-row__description'>
                  {weightSentence(assignmentType.defaultWeight)}
                </span>
              </span>

              <span className='subject-row__actions'>
                <button
                  type='button'
                  className='subject-row__action'
                  onClick={() => goTo({ kind: 'edit', assignmentType })}
                >
                  {content.editAction}
                </button>
                {/* A built in type is the shared vocabulary: its weight is
                    hers to set, its existence is not. */}
                {!assignmentType.isBuiltIn && (
                  <button
                    type='button'
                    className='subject-row__action'
                    onClick={() => goTo({ kind: 'remove', assignmentType })}
                  >
                    {content.removeAction}
                  </button>
                )}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AssignmentTypesSection
