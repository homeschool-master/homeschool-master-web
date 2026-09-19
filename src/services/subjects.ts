import api from './api'
import type { Subject, SubjectInput } from '../types'

interface SubjectsResponse {
  data: Subject[]
}

interface SubjectResponse {
  data: Subject
}

/**
 * No query parameters: the endpoint has none, and it already returns the
 * active subjects ordered by name, which is the only order this list wants.
 */
export const fetchSubjectsRequest = async (): Promise<Subject[]> => {
  const response = await api.get<SubjectsResponse>('/api/v1/subjects')
  return response.data.data
}

// The api client sends X-Key-Inflection, so these camelCase keys arrive as the
// snake_case columns the endpoint permits.
export const createSubjectRequest = async (input: SubjectInput): Promise<Subject> => {
  const response = await api.post<SubjectResponse>('/api/v1/subjects', input)
  return response.data.data
}

export const updateSubjectRequest = async (
  id: string,
  input: SubjectInput
): Promise<Subject> => {
  const response = await api.patch<SubjectResponse>(`/api/v1/subjects/${id}`, input)
  return response.data.data
}

/**
 * Soft delete: the server flips is_active, so anything already recorded
 * against the subject keeps pointing at it and the name becomes free again.
 */
export const removeSubjectRequest = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/subjects/${id}`)
}
