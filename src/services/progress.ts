import api from './api'
import type { ProgressRange, StudentProgress } from '../types'

interface ProgressResponse {
  data: StudentProgress
}

/**
 * The weighted roll up for one student over a period. Both ends are required
 * by the endpoint: a report with no period would quietly answer a different
 * question from the one the page is asking.
 */
export const fetchStudentProgressRequest = async (
  studentId: string,
  range: ProgressRange
): Promise<StudentProgress> => {
  const response = await api.get<ProgressResponse>(
    `/api/v1/students/${studentId}/progress`,
    { params: { from: range.from, to: range.to } }
  )
  return response.data.data
}
