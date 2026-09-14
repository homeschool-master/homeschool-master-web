import api from './api'
import type { CalendarEvent, CalendarEventInput, CalendarEventRange } from '../types'

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
      start_date: range.startDate,
      end_date: range.endDate,
      ...(studentId ? { student_id: studentId } : {}),
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
