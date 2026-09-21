import api from './api'
import type { AssignmentType, AssignmentTypeInput } from '../types'

interface AssignmentTypesResponse {
  data: AssignmentType[]
}

interface AssignmentTypeResponse {
  /** updated_count rides along on an update, saying how much work moved. */
  data: AssignmentType & { updatedCount?: number }
}

/**
 * The active types, built in ones first and then the teacher's own. No query
 * parameters: the endpoint has none and the list is already in the only order
 * this UI wants.
 */
export const fetchAssignmentTypesRequest = async (): Promise<AssignmentType[]> => {
  const response = await api.get<AssignmentTypesResponse>('/api/v1/assignment_types')
  return response.data.data
}

// The api client sends X-Key-Inflection, so defaultWeight arrives as
// default_weight and applyMode as apply_mode.
export const createAssignmentTypeRequest = async (
  input: AssignmentTypeInput
): Promise<AssignmentType> => {
  const response = await api.post<AssignmentTypeResponse>('/api/v1/assignment_types', input)
  return response.data.data
}

/**
 * A changed default weight carries the mode saying how far back it reaches.
 * The response says how many assignments moved, which is what the UI reports
 * back: "changed, and 4 pieces of work moved with it" is the only way a
 * teacher can tell the difference between the three modes after the fact.
 */
export const updateAssignmentTypeRequest = async (
  id: string,
  input: AssignmentTypeInput
): Promise<AssignmentType & { updatedCount?: number }> => {
  const response = await api.patch<AssignmentTypeResponse>(
    `/api/v1/assignment_types/${id}`,
    input
  )
  return response.data.data
}

/** A soft delete: work already typed keeps pointing at it and still reads. */
export const removeAssignmentTypeRequest = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/assignment_types/${id}`)
}
