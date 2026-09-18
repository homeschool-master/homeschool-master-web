import api from './api'
import type {
  CalendarEvent,
  CalendarEventInput,
  CalendarEventRange,
  CalendarEventUpdateInput,
} from '../types'

interface CalendarEventsResponse {
  data: CalendarEvent[]
}

interface CalendarEventResponse {
  data: CalendarEvent
}

/**
 * Bare dates in the range params are interpreted in the teacher's timezone, so
 * send YYYY-MM-DD and never an offset: the server widens them to that
 * teacher's local day bounds.
 */
export const fetchCalendarEventsRequest = async (
  range: CalendarEventRange,
  studentId?: string
): Promise<CalendarEvent[]> => {
  const response = await api.get<CalendarEventsResponse>('/api/v1/calendar_events', {
    params: {
      startDate: range.startDate,
      endDate: range.endDate,
      ...(studentId ? { studentId } : {}),
    },
  })
  return response.data.data
}

export const createCalendarEventRequest = async (
  input: CalendarEventInput
): Promise<CalendarEvent> => {
  const response = await api.post<CalendarEventResponse>('/api/v1/calendar_events', input)
  return response.data.data
}

export const fetchCalendarEventRequest = async (id: string): Promise<CalendarEvent> => {
  const response = await api.get<CalendarEventResponse>(`/api/v1/calendar_events/${id}`)
  return response.data.data
}

/**
 * A submitted student_ids array replaces the attendee set outright, so callers
 * send the whole intended list. created_time_zone is create only and is not
 * part of the update payload.
 */
export const updateCalendarEventRequest = async (
  id: string,
  input: CalendarEventUpdateInput
): Promise<CalendarEvent> => {
  const response = await api.patch<CalendarEventResponse>(
    `/api/v1/calendar_events/${id}`,
    input
  )
  return response.data.data
}

/** Hard delete: attendee rows cascade and the response carries no body. */
export const deleteCalendarEventRequest = async (id: string): Promise<void> => {
  await api.delete(`/api/v1/calendar_events/${id}`)
}
