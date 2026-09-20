import api from './api'
import type { Assignment, AssignmentGrade, AssignmentInput, ScoreInput } from '../types'

interface AssignmentsResponse {
  data: Assignment[]
}

interface AssignmentResponse {
  data: Assignment
}

interface GradeResponse {
  data: AssignmentGrade
}

/**
 * The whole list in one call, grades nested. The endpoint also filters by
 * subject and due date, but the page narrows one shared fetch client side the
 * way the tasks page does: a family's assignments are a list, not a feed.
 */
export const fetchAssignmentsRequest = async (): Promise<Assignment[]> => {
  const response = await api.get<AssignmentsResponse>('/api/v1/assignments')
  return response.data.data
}

// The api client sends X-Key-Inflection, so these camelCase keys arrive as the
// snake_case columns the endpoint permits.
export const createAssignmentRequest = async (input: AssignmentInput): Promise<Assignment> => {
  const response = await api.post<AssignmentResponse>('/api/v1/assignments', input)
  return response.data.data
}

/**
 * studentIds is always sent, so the assigned set the form shows is the set
 * that is saved. It has to travel as JSON: form encoding drops an empty array,
 * which the server would then read as "leave everyone on it".
 */
export const updateAssignmentRequest = async (
  id: string,
  input: AssignmentInput
): Promise<Assignment> => {
  const response = await api.patch<AssignmentResponse>(`/api/v1/assignments/${id}`, input)
  return response.data.data
}

/** A hard delete, taking its grade rows and their marks with it. */
export const removeAssignmentRequest = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/assignments/${id}`)
}

/**
 * Records one student's mark. pointsEarned null puts the work back to unmarked
 * and takes it out of every average again, which is how a score is cleared.
 */
export const recordScoreRequest = async (
  assignmentId: string,
  gradeId: string,
  input: ScoreInput
): Promise<AssignmentGrade> => {
  const response = await api.patch<GradeResponse>(
    `/api/v1/assignments/${assignmentId}/grades/${gradeId}`,
    input
  )
  return response.data.data
}
