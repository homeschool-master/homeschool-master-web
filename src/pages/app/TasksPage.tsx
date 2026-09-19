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
import { TASKS_CONTENT } from '../../constants/tasks'
import { todayKey } from '../../utils/calendarDates'
import { TASK_FILTERS, applyTaskFilter, isTaskFilter } from '../../utils/tasks'
import type { TaskFilter } from '../../utils/tasks'
import Button from '../../components/shared/Button'
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

  const [mode, setMode] = useState<Mode>({ kind: 'idle' })

  // In the URL like the calendar's view state, so a filtered list is linkable
  // and survives a reload.
  const filterParam = searchParams.get('show')
  const filter: TaskFilter = isTaskFilter(filterParam) ? filterParam : 'open'

  const today = todayKey()

  useEffect(() => {
    dispatch(fetchTasks())
  }, [dispatch])

  const visible = useMemo(() => applyTaskFilter(items, filter), [items, filter])

  const selectFilter = (next: TaskFilter) => {
    setSearchParams((current) => {
      const params = new URLSearchParams(current)
      if (next === 'open') params.delete('show')
      else params.set('show', next)

      return params
    })
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

  return (
    <div className='tasks'>
      <div className='tasks__inner'>
        <header className='tasks__header'>
          <p className='tasks__eyebrow'>{TASKS_CONTENT.page.eyebrow}</p>
          <h1 className='tasks__heading'>{TASKS_CONTENT.page.heading}</h1>
          <p className='tasks__subhead'>{TASKS_CONTENT.page.subhead}</p>
        </header>

        {/* Out in the open rather than behind a disclosure: at phone width a
            collapsed panel hides the one thing that explains an empty list. */}
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

        {loading && <p className='tasks__status'>{TASKS_CONTENT.loading}</p>}

        {!loading && error && (
          <p className='tasks__error' role='alert'>
            {error}
          </p>
        )}

        {showEmpty && <p className='tasks__status'>{TASKS_CONTENT.empty[filter]}</p>}

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
              />
            ))}
          </ul>
        )}

        {removeError && (
          <p className='tasks__error' role='alert'>
            {removeError}
          </p>
        )}

        {!loading && !error && mode.kind === 'idle' && (
          <div className='tasks__actions'>
            <Button color='cream' onClick={() => goTo({ kind: 'add' })}>
              {TASKS_CONTENT.addButton}
            </Button>
          </div>
        )}

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
              saving={saving}
              onSubmit={handleSubmit}
              onCancel={() => goTo({ kind: 'idle' })}
            />
          </>
        )}

        {mode.kind === 'remove' && (
          <div className='tasks__confirm'>
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
                {removingId !== null ? TASKS_CONTENT.remove.removing : TASKS_CONTENT.remove.confirm}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TasksPage
