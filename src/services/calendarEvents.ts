import api from './api'
import type {
  CalendarEvent,
  CalendarEventInput,
  CalendarEventRange,
  CalendarEventUpdateInput,
  SeriesScope,
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
  studentIds?: string[]
): Promise<CalendarEvent[]> => {
  const response = await api.get<CalendarEventsResponse>('/api/v1/calendar_events', {
    params: {
      startDate: range.startDate,
      endDate: range.endDate,
      // studentIds[]=a&studentIds[]=b, which the endpoint reads as any of
      // them rather than all of them. Axios repeats the key by default for an
      // array, and the brackets are what Rails needs to parse it as one.
      ...(studentIds && studentIds.length > 0 ? { 'studentIds[]': studentIds } : {}),
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

/**
 * The id may be a bare uuid or an occurrence's "<uuid>:<date>". It is encoded
 * because the colon is meaningful in a path otherwise.
 */
export const fetchCalendarEventRequest = async (id: string): Promise<CalendarEvent> => {
  const response = await api.get<CalendarEventResponse>(
    `/api/v1/calendar_events/${encodeURIComponent(id)}`
  )
  return response.data.data
}

/**
 * A submitted student_ids array replaces the attendee set outright, so callers
 * send the whole intended list. created_time_zone is create only and is not
 * part of the update payload.
 */
export const updateCalendarEventRequest = async (
  id: string,
  input: CalendarEventUpdateInput,
  scope?: SeriesScope
): Promise<CalendarEvent> => {
  const response = await api.patch<CalendarEventResponse>(
    `/api/v1/calendar_events/${encodeURIComponent(id)}`,
    scope ? { ...input, scope } : input
  )
  return response.data.data
}

/**
 * Hard delete: attendee rows cascade and the response carries no body. On an
 * occurrence of a series, scope says how far the deletion reaches, and the
 * server treats an absent scope as all of it.
 */
export const deleteCalendarEventRequest = async (
  id: string,
  scope?: SeriesScope
): Promise<void> => {
  await api.delete(`/api/v1/calendar_events/${encodeURIComponent(id)}`, {
    params: scope ? { scope } : {},
  })
}
