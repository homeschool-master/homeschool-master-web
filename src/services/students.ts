import api from './api'
import type { Student, StudentInput } from '../types'

interface StudentsResponse {
  data: Student[]
}

interface StudentResponse {
  data: Student
}

export const fetchStudentsRequest = async (): Promise<Student[]> => {
  const response = await api.get<StudentsResponse>('/api/v1/students')
  return response.data.data
}

// The api client sends X-Key-Inflection, so these camelCase keys arrive as the
// snake_case columns the endpoint permits.
export const createStudentRequest = async (input: StudentInput): Promise<Student> => {
  const response = await api.post<StudentResponse>('/api/v1/students', input)
  return response.data.data
}

export const updateStudentRequest = async (
  id: string,
  input: StudentInput
): Promise<Student> => {
  const response = await api.patch<StudentResponse>(`/api/v1/students/${id}`, input)
  return response.data.data
}

/** Soft delete: the server flips is_active, so events and grades are kept. */
export const removeStudentRequest = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/students/${id}`)
}
