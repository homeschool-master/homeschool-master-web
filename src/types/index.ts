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

export type CalendarEventAttendee = Student

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
  attendees: CalendarEventAttendee[]
  createdAt: string
}

/**
 * Request bodies are snake_case. Timestamps are UTC ISO strings: the server
 * stores them as sent and never converts, so build them from local input with
 * toISOString.
 */
export interface CalendarEventInput {
  title: string
  notes: string | null
  location: string | null
  start_time: string
  end_time: string
  all_day: boolean
  student_ids: string[]
  created_time_zone: string
}

export interface CalendarEventRange {
  startDate: string
  endDate: string
}
