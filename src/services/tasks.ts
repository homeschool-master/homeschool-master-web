import api from './api'
import type { SeriesScope, Task, TaskInput, TaskUpdateInput } from '../types'

interface TasksResponse {
  data: Task[]
}

interface TaskResponse {
  data: Task
}

/** The span of days the server expands repeating tasks over. */
export interface TaskWindow {
  from: string
  to: string
}

/**
 * No completed or due_by params: the whole list is small, and one fetch shared
 * between the tasks page and the dashboard panel means ticking a checkbox in
 * either place updates both without a refetch. The server filters are still
 * there if a bigger list ever needs them.
 *
 * The window is a different thing from a filter. A repeating task produces
 * occurrences forever, so the server needs a bound to expand them over, and it
 * applies to those only: an ordinary task comes back whatever its due date.
 * Left to the server's default unless a caller wants something narrower, so
 * the page and the dashboard are looking at the same span by construction.
 */
export const fetchTasksRequest = async (window?: TaskWindow): Promise<Task[]> => {
  const response = await api.get<TasksResponse>('/api/v1/tasks', {
    params: window ? { from: window.from, to: window.to } : {},
  })
  return response.data.data
}

/**
 * The api client sends X-Key-Inflection, so dueDate arrives as due_date.
 *
 * studentIds has to travel as JSON rather than form encoding: an empty array
 * is dropped by form encoding, and the server would read that as "leave the
 * students alone" instead of "take them all off".
 */
export const createTaskRequest = async (input: TaskInput): Promise<Task> => {
  const response = await api.post<TaskResponse>('/api/v1/tasks', input)
  return response.data.data
}

/**
 * On an occurrence of a series, scope says how far the edit reaches: this
 * occurrence, this and future, or all of them. A tick never carries one,
 * because ticking is always about the one occurrence it names.
 *
 * The id is encoded because an occurrence's is "<uuid>:<date>", and a colon in
 * a path segment is not something to leave to chance.
 */
export const updateTaskRequest = async (
  id: string,
  input: TaskUpdateInput,
  scope?: SeriesScope
): Promise<Task> => {
  const response = await api.patch<TaskResponse>(
    `/api/v1/tasks/${encodeURIComponent(id)}`,
    scope ? { ...input, scope } : input
  )
  return response.data.data
}

/**
 * Hard delete server side: a to-do the teacher removed is meant to be gone.
 * On an occurrence, scope reaches as far as it does on an edit.
 */
export const removeTaskRequest = async (id: string, scope?: SeriesScope): Promise<void> => {
  await api.delete(`/api/v1/tasks/${encodeURIComponent(id)}`, {
    params: scope ? { scope } : {},
  })
}
