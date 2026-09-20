import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import type { Task, TaskInput } from '../../types'
import {
  clearRemoveError,
  clearSaveError,
  createTask,
  fetchTasks,
  removeTask,
  toggleTask,
  updateTask,
} from '../../store/tasksSlice'
import { fetchStudents } from '../../store/studentsSlice'
import { TASKS_CONTENT } from '../../constants/tasks'
import { todayKey } from '../../utils/calendarDates'
import { fillTemplate } from '../../utils/grades'
import { TASK_FILTERS, applyTaskFilter, isTaskFilter } from '../../utils/tasks'
import type { TaskFilter } from '../../utils/tasks'
import {
  DEFAULT_PROFILE,
  MODE_PARAM,
  OVERRIDE_ALL,
  OVERRIDE_PARAM,
  STUDENT_PARAM,
  hasOverride,
  matchesTaskScope,
  profileLabel,
  readProfile,
  readScope,
  scopeLabel,
  unknownStudentIds,
  writeOverrideIds,
} from '../../utils/profile'
import Button from '../../components/shared/Button'
import ScopeNotice from '../../components/shared/ScopeNotice'
import StudentPicker from '../../components/shared/StudentPicker'
import TaskForm from '../../components/tasks/TaskForm'
import TaskRow from '../../components/tasks/TaskRow'

type Mode =
  | { kind: 'idle' }
  | { kind: 'add' }
  | { kind: 'edit'; task: Task }
  | { kind: 'remove'; task: Task }

const TasksPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [searchParams, setSearchParams] = useSearchParams()
  const { items, loading, error, saving, saveError, togglingId, removingId, removeError } =
    useSelector((state: RootState) => state.tasks)
  const { items: students, loaded: studentsLoaded } = useSelector(
    (state: RootState) => state.students
  )

  const [mode, setMode] = useState<Mode>({ kind: 'idle' })

  // In the URL like the calendar's view state, so a filtered list is linkable
  // and survives a reload. All is the default and writes no param, so a bare
  // /tasks is everything: the two narrower views are the ones worth spelling
  // out in a link.
  const filterParam = searchParams.get('show')
  const filter: TaskFilter = isTaskFilter(filterParam) ? filterParam : 'all'

  /**
   * Tasks name students now, so this page reads the profile the way the
   * calendar does, and takes the same temporary override: the picker never
   * writes the profile and nothing carries the override onward, so leaving and
   * coming back lands on the profile again. Only the dashboard switcher
   * changes profiles.
   */
  const profile = readProfile(searchParams)
  const scope = readScope(searchParams)
  const overridden = hasOverride(searchParams)
  const pickedIds = scope.kind === 'student' ? scope.studentIds : []
  const pickedKey = pickedIds.join(',')

  const today = todayKey()

  useEffect(() => {
    dispatch(fetchTasks())
    // The rows name the students a task holds, so a direct link needs the
    // roster as much as the tasks.
    dispatch(fetchStudents())
  }, [dispatch])

  const visible = useMemo(
    () => applyTaskFilter(items.filter((task) => matchesTaskScope(task, scope)), filter),
    // scope is rebuilt from the URL each render, so its parts stand in for it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, filter, scope.kind, pickedKey]
  )

  const updateParams = (changes: Record<string, string | null>) => {
    setSearchParams((current) => {
      const params = new URLSearchParams(current)

      Object.entries(changes).forEach(([key, value]) => {
        if (value === null || value === '') params.delete(key)
        else params.set(key, value)
      })

      return params
    })
  }

  const selectFilter = (next: TaskFilter) => {
    // The default carries no param, so a bare /tasks is the whole list.
    updateParams({ show: next === 'all' ? null : next })
  }

  /**
   * The picker writes the override, never the profile's own studentId. Picking
   * exactly what the profile already says drops the override rather than
   * pinning the same answer twice.
   */
  const setStudentOverride = (picked: string[]): string | null => {
    if (picked.length === 0 && profile.kind === 'everyone') return null
    if (picked.length === 1 && profile.kind === 'student' && profile.studentId === picked[0]) {
      return null
    }

    return picked.length === 0 ? OVERRIDE_ALL : writeOverrideIds(picked)
  }

  /**
   * Brings whatever just opened above the list into view: the add and edit
   * form, and the remove confirmation, which share one slot because only one
   * of them is ever open.
   *
   * The test is whether the top of the panel is on screen, not whether all of
   * it is. Adding from the control at the top opens the form exactly where the
   * button was, so its first field is already under the eye even though a tall
   * form runs past the fold: scrolling there would be the jolt, not the fix.
   * Editing or removing from a row far down opens above the list, out of
   * sight, and that does have to travel.
   *
   * Measured synchronously: the ref runs after the form is in the document and
   * reading its box forces the layout, so the number is already right. It is
   * deliberately not deferred to an animation frame, which never runs while the
   * document is hidden and would leave the form quietly off screen. The page
   * sets overflow-anchor: none so nothing shifts under the measurement either.
   *
   * No smooth behavior: it is ignored outright in some contexts, and a scroll
   * that silently does nothing is worse than one that simply arrives.
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

  const handleSubmit = async (values: TaskInput): Promise<boolean> => {
    const result =
      mode.kind === 'edit'
        ? await dispatch(updateTask({ id: mode.task.id, input: values }))
        : await dispatch(createTask(values))

    return mode.kind === 'edit'
      ? updateTask.fulfilled.match(result)
      : createTask.fulfilled.match(result)
  }

  const handleRemove = async (task: Task) => {
    const result = await dispatch(removeTask(task.id))
    if (removeTask.fulfilled.match(result)) setMode({ kind: 'idle' })
  }

  const showList = !loading && !error && visible.length > 0
  const showEmpty = !loading && !error && visible.length === 0
  const isEditingOrAdding = mode.kind === 'add' || mode.kind === 'edit'

  // Distinct per opening, including edit on one row then edit on another, so
  // the slot remounts and the reveal fires each time rather than swapping its
  // contents somewhere off screen.
  const panelKey =
    mode.kind === 'add' || mode.kind === 'idle' ? mode.kind : `${mode.kind}:${mode.task.id}`

  return (
    <div className='tasks'>
      <div className='tasks__inner'>
        <header className='tasks__header'>
          <p className='tasks__eyebrow'>{TASKS_CONTENT.page.eyebrow}</p>
          <h1 className='tasks__heading'>{TASKS_CONTENT.page.heading}</h1>
          <p className='tasks__subhead'>{TASKS_CONTENT.page.subhead}</p>
        </header>

        {/* Out in the open rather than behind a disclosure: at phone width a
            collapsed panel hides the one thing that explains an empty list.
            The same is true of the scope line and the student picker, so
            neither of them collapses either. */}
        <ScopeNotice
          scopeLabel={scopeLabel(scope, students)}
          scopeIsDefault={scope.kind === DEFAULT_PROFILE.kind && !overridden}
          profileLabel={overridden ? profileLabel(profile, students) : null}
          onResetToProfile={() => updateParams({ [OVERRIDE_PARAM]: null })}
          unknownCount={studentsLoaded ? unknownStudentIds(scope, students).length : 0}
          onResetToDefault={() =>
            updateParams({ [MODE_PARAM]: null, [STUDENT_PARAM]: null, [OVERRIDE_PARAM]: null })
          }
          className='tasks'
        />

        {students.length > 0 && (
          <div className='tasks__students'>
            <StudentPicker
              students={students}
              selected={pickedIds}
              onChange={(picked) =>
                updateParams({ [OVERRIDE_PARAM]: setStudentOverride(picked) })
              }
              idPrefix='task-filter-student'
              label={TASKS_CONTENT.filters.students}
              allLabel={TASKS_CONTENT.filters.allStudents}
            />
          </div>
        )}

        <div className='tasks__filters' role='group' aria-label={TASKS_CONTENT.filters.label}>
          {TASK_FILTERS.map((option) => (
            <button
              key={option}
              type='button'
              className={`tasks__filter${filter === option ? ' tasks__filter--active' : ''}`}
              aria-pressed={filter === option}
              onClick={() => selectFilter(option)}
            >
              {TASKS_CONTENT.filters[option]}
            </button>
          ))}
        </div>

        {!loading && !error && mode.kind === 'idle' && (
          <div className='tasks__actions'>
            <Button color='cream' onClick={() => goTo({ kind: 'add' })}>
              {TASKS_CONTENT.addButton}
            </Button>
          </div>
        )}

        {/* Whatever is open replaces the Add control in the same spot, so
            neither adding nor removing sends the eye somewhere else. Editing
            and removing are triggered from rows that can be a long way down,
            so the slot brings itself into view. */}
        {mode.kind !== 'idle' && (
          <div key={panelKey} className='tasks__slot' ref={revealPanel}>
            {isEditingOrAdding && (
              <>
                {saveError && (
                  <p className='tasks__error' role='alert'>
                    {saveError}
                  </p>
                )}
                <TaskForm
                  key={mode.kind === 'edit' ? mode.task.id : 'new'}
                  task={mode.kind === 'edit' ? mode.task : null}
                  students={students}
                  saving={saving}
                  onSubmit={handleSubmit}
                  onCancel={() => goTo({ kind: 'idle' })}
                />
              </>
            )}

            {mode.kind === 'remove' && (
              <div className='tasks__confirm'>
                {removeError && (
                  <p className='tasks__error' role='alert'>
                    {removeError}
                  </p>
                )}
                <p className='task-form__title'>{TASKS_CONTENT.remove.heading}</p>
                <p className='tasks__confirm-task'>{mode.task.title}</p>
                <p className='tasks__confirm-body'>{TASKS_CONTENT.remove.body}</p>
                <div className='task-form__actions'>
                  <button
                    type='button'
                    className='task-form__cancel'
                    onClick={() => goTo({ kind: 'idle' })}
                    disabled={removingId !== null}
                  >
                    {TASKS_CONTENT.remove.cancel}
                  </button>
                  <Button
                    color='danger'
                    onClick={() => handleRemove(mode.task)}
                    disabled={removingId !== null}
                  >
                    {removingId !== null
                      ? TASKS_CONTENT.remove.removing
                      : TASKS_CONTENT.remove.confirm}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {loading && <p className='tasks__status'>{TASKS_CONTENT.loading}</p>}

        {!loading && error && (
          <p className='tasks__error' role='alert'>
            {error}
          </p>
        )}

        {/* A list emptied by the student picker is a different question from
            an empty list, and pointing at "add your first task" when the
            answer is "change the students" is the wrong next step. */}
        {showEmpty && (
          <p className='tasks__status'>
            {scope.kind === 'student'
              ? fillTemplate(TASKS_CONTENT.emptyForScope[filter], {
                  names: scopeLabel(scope, students),
                })
              : TASKS_CONTENT.empty[filter]}
          </p>
        )}

        {showList && (
          <ul className='tasks__list'>
            {visible.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                today={today}
                toggling={togglingId === task.id}
                onToggle={(next) =>
                  dispatch(toggleTask({ id: next.id, completed: !next.completed }))
                }
                onEdit={(next) => goTo({ kind: 'edit', task: next })}
                onRemove={(next) => goTo({ kind: 'remove', task: next })}
                students={students}
              />
            ))}
          </ul>
        )}

      </div>
    </div>
  )
}

export default TasksPage
