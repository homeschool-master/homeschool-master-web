import api from './api'
import type { Student } from '../types'

interface StudentsResponse {
  data: Student[]
}

export const fetchStudentsRequest = async (): Promise<Student[]> => {
  const response = await api.get<StudentsResponse>('/api/v1/students')
  return response.data.data
}
