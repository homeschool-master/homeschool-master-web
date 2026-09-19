import type { Task } from '../types'
import { fromDateKey } from './calendarDates'

export type TaskFilter = 'open' | 'done' | 'all'

/** Rendered in this order, default first: the page maps straight over it. */
export const TASK_FILTERS: TaskFilter[] = ['all', 'open', 'done']

export const isTaskFilter = (value: string | null): value is TaskFilter =>
  TASK_FILTERS.some((filter) => filter === value)

/**
 * Due dates are bare YYYY-MM-DD, so string comparison is date comparison and
 * no Date object or timezone enters into it. "Today" comes from the caller,
 * which reads the clock once rather than once per task.
 */
export const isOverdue = (task: Task, today: string): boolean =>
  !task.completed && task.dueDate !== null && task.dueDate < today

export const isDueToday = (task: Task, today: string): boolean =>
  !task.completed && task.dueDate === today

/** The server's own order: due ascending, undated last, creation order for ties. */
export const byDueDate = (first: Task, second: Task): number => {
  if (first.dueDate === second.dueDate) return first.createdAt.localeCompare(second.createdAt)
  if (first.dueDate === null) return 1
  if (second.dueDate === null) return -1

  return first.dueDate.localeCompare(second.dueDate)
}

/** Most recently finished first: a done list is a record, read newest down. */
export const byCompletedAt = (first: Task, second: Task): number =>
  (second.completedAt ?? '').localeCompare(first.completedAt ?? '')

export const applyTaskFilter = (tasks: Task[], filter: TaskFilter): Task[] => {
  if (filter === 'done') return tasks.filter((task) => task.completed).slice().sort(byCompletedAt)

  const visible = filter === 'open' ? tasks.filter((task) => !task.completed) : tasks

  return visible.slice().sort(byDueDate)
}

/** What the dashboard panel lists: still to do, soonest first. */
export const openTasks = (tasks: Task[]): Task[] => applyTaskFilter(tasks, 'open')

/**
 * What the count card counts: open work that is due today or already late.
 * Undated tasks are on the list but not on today's plate, so they are left out
 * of a figure sitting under the heading "Today's Items".
 */
export const dueByToday = (tasks: Task[], today: string): Task[] =>
  openTasks(tasks).filter((task) => task.dueDate !== null && task.dueDate <= today)

/** Short and dateless where the year is obvious: "Fri, Sep 25". */
export const formatDueDate = (dateKey: string): string =>
  fromDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
