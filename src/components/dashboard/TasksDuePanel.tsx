import { Link } from 'react-router-dom'
import type { Task } from '../../types'
import { DASHBOARD_CONTENT } from '../../constants/dashboard'
import { DASHBOARD_TASK_LIMIT } from '../../constants/tasks'
import TaskRow from '../tasks/TaskRow'

const { tasks } = DASHBOARD_CONTENT

interface TasksDuePanelProps {
  /** Already open and ordered: the panel takes the first few and lists them. */
  openTasks: Task[]
  /** Everything on the list, so an empty panel can say which empty it means. */
  totalTasks: number
  today: string
  loading: boolean
  error: string | null
  togglingId: string | null
  onToggle: (task: Task) => void
}

/**
 * The mockup's second panel, now against real data. It lists what is still to
 * do, soonest due first, and its checkboxes write through the same thunk the
 * tasks page uses, so ticking here moves the count above it in the same tick.
 */
const TasksDuePanel = ({
  openTasks,
  totalTasks,
  today,
  loading,
  error,
  togglingId,
  onToggle,
}: TasksDuePanelProps) => {
  const visible = openTasks.slice(0, DASHBOARD_TASK_LIMIT)
  const isEmpty = !loading && !error && visible.length === 0

  return (
    <section className='panel-card'>
      <header className='panel-card__header'>
        <span className='panel-card__icon' aria-hidden='true'>
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <path d='M9 6h11M9 12h11M9 18h11' /><path d='M4 6l1.5 1.5L8 5' />
            <path d='M4 12l1.5 1.5L8 11' /><path d='M4 18l1.5 1.5L8 17' />
          </svg>
        </span>

        <h2 className='panel-card__title'>{tasks.heading}</h2>

        <Link to='/tasks' className='panel-card__add' aria-label={tasks.addLabel}>
          {tasks.addSymbol}
        </Link>
      </header>

      <div className='panel-card__body'>
        {error && <p className='panel-card__error'>{error}</p>}
        {loading && <p className='panel-card__status'>{tasks.loading}</p>}
        {/* Two empty states: a list with nothing on it reads differently from
            a list where everything has been ticked off. */}
        {isEmpty && (
          <p className='panel-card__status'>
            {totalTasks > 0 ? tasks.allDone : tasks.empty}
          </p>
        )}

        {visible.length > 0 && (
          <ul className='panel-card__tasks'>
            {visible.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                today={today}
                toggling={togglingId === task.id}
                onToggle={onToggle}
              />
            ))}
          </ul>
        )}

        {visible.length > 0 && (
          <div className='panel-card__footer'>
            <Link to='/tasks' className='panel-card__more' aria-label={tasks.seeMoreLabel}>
              {tasks.seeMore}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default TasksDuePanel
