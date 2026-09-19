import type { Task } from '../../types'
import { TASKS_CONTENT } from '../../constants/tasks'
import { formatDueDate, isDueToday, isOverdue } from '../../utils/tasks'

interface TaskRowProps {
  task: Task
  today: string
  /** True while this row's own checkbox is in flight. */
  toggling: boolean
  onToggle: (task: Task) => void
  /** Omitted on the dashboard panel, which lists rather than manages. */
  onEdit?: (task: Task) => void
  onRemove?: (task: Task) => void
}

/**
 * One line of a to-do list: a real checkbox, the title, and when it is due.
 * Used by the tasks page and by the dashboard panel, so ticking behaves the
 * same in both places.
 */
const TaskRow = ({ task, today, toggling, onToggle, onEdit, onRemove }: TaskRowProps) => {
  const overdue = isOverdue(task, today)
  const dueToday = isDueToday(task, today)

  const dueLabel = (): string => {
    if (task.completed) {
      return task.completedAt
        ? `${TASKS_CONTENT.completedOn} ${formatDueDate(task.completedAt.slice(0, 10))}`
        : TASKS_CONTENT.completedOn
    }
    if (overdue) return `${TASKS_CONTENT.overdue}: ${formatDueDate(task.dueDate as string)}`
    if (dueToday) return TASKS_CONTENT.dueToday
    return task.dueDate ? formatDueDate(task.dueDate) : TASKS_CONTENT.noDueDate
  }

  const modifier = task.completed ? ' task-row--done' : overdue ? ' task-row--overdue' : ''

  return (
    <li className={`task-row${modifier}`}>
      {/* A real checkbox, so it is reachable by tab and toggled by space
          without any of that being reimplemented. */}
      <input
        type='checkbox'
        className='task-row__checkbox'
        id={`task-${task.id}`}
        checked={task.completed}
        disabled={toggling}
        onChange={() => onToggle(task)}
        aria-label={task.completed ? TASKS_CONTENT.uncompleteLabel : TASKS_CONTENT.completeLabel}
      />

      <label className='task-row__body' htmlFor={`task-${task.id}`}>
        <span className='task-row__title'>{task.title}</span>
        <span className='task-row__due'>{dueLabel()}</span>
      </label>

      {task.description && <p className='task-row__notes'>{task.description}</p>}

      {(onEdit || onRemove) && (
        <span className='task-row__actions'>
          {onEdit && (
            <button type='button' className='task-row__action' onClick={() => onEdit(task)}>
              {TASKS_CONTENT.editAction}
            </button>
          )}
          {onRemove && (
            <button type='button' className='task-row__action' onClick={() => onRemove(task)}>
              {TASKS_CONTENT.removeAction}
            </button>
          )}
        </span>
      )}
    </li>
  )
}

export default TaskRow
