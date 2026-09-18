export interface User {
  id: string
  email: string
  firstName: string
  middleName: string | null
  lastName: string
  notifyAccountUpdates: boolean
  notifyProductUpdates: boolean
  notifyHomeschoolResources: boolean
  onboardingCompleted: boolean
}

export interface Student {
  id: string
  teacherId: string
  firstName: string
  middleName: string | null
  lastName: string
  gradeLevel: string | null
  color: string | null
  profileImageUrl: string | null
  isActive: boolean
  createdAt: string
}

export interface CalendarEvent {
  id: string
  teacherId: string
  title: string
  notes: string | null
  location: string | null
  startTime: string
  endTime: string
  allDay: boolean
  createdTimeZone: string | null
  /**
   * Ids only: the client resolves names and colours from the students slice.
   * A month can carry hundreds of events, and nesting the student record on
   * each one repeats the same few students hundreds of times.
   */
  attendeeIds: string[]
  createdAt: string
}

/**
 * Request bodies are camelCase, like the rest of the client: the API converts
 * every incoming key to snake_case at the boundary, so Rails still receives the
 * names it expects. Timestamps are UTC ISO strings: the server stores them as
 * sent and never converts, so build them from local input with toISOString.
 */
/** The fields the students endpoint accepts from web: no photo upload yet. */
export interface StudentInput {
  firstName: string
  middleName: string
  lastName: string
  gradeLevel: string
  color: string
}

export interface CalendarEventInput {
  title: string
  notes: string | null
  location: string | null
  startTime: string
  endTime: string
  allDay: boolean
  studentIds: string[]
  createdTimeZone: string
}

/** Update takes the same fields minus createdTimeZone, which is create only. */
export type CalendarEventUpdateInput = Omit<CalendarEventInput, 'createdTimeZone'>

export interface CalendarEventRange {
  startDate: string
  endDate: string
}
