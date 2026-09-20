import api from './api'
import type { Task, TaskInput, TaskUpdateInput } from '../types'

interface TasksResponse {
  data: Task[]
}

interface TaskResponse {
  data: Task
}

/**
 * No completed or due_by params: the whole list is small, and one fetch shared
 * between the tasks page and the dashboard panel means ticking a checkbox in
 * either place updates both without a refetch. The server filters are still
 * there if a bigger list ever needs them.
 */
export const fetchTasksRequest = async (): Promise<Task[]> => {
  const response = await api.get<TasksResponse>('/api/v1/tasks')
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

export const updateTaskRequest = async (
  id: string,
  input: TaskUpdateInput
): Promise<Task> => {
  const response = await api.patch<TaskResponse>(`/api/v1/tasks/${id}`, input)
  return response.data.data
}

/** Hard delete server side: a to-do the teacher removed is meant to be gone. */
export const removeTaskRequest = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/tasks/${id}`)
}
