import type { Student } from '../types'
import { CALENDAR_CONTENT, NEUTRAL_EVENT_COLOR } from '../constants/calendar'

export interface ResolvedAttendee {
  id: string
  name: string
  color: string
  /** False when the id is not on the roster: a student who was removed. */
  isKnown: boolean
}

/**
 * Events carry attendee ids, and the roster comes from the students slice.
 *
 * The students index returns active students only, and removal is a soft
 * delete, so an event can outlive the student on it. Those ids resolve to a
 * neutral "former student" attendee rather than being dropped: the event really
 * did involve someone, and hiding that silently would misreport who it was for.
 */
export const resolveAttendees = (
  attendeeIds: string[],
  students: Student[]
): ResolvedAttendee[] =>
  attendeeIds.map((id) => {
    const student = students.find((candidate) => candidate.id === id)

    return student
      ? {
          id,
          name: student.firstName,
          color: student.color ?? NEUTRAL_EVENT_COLOR,
          isKnown: true,
        }
      : {
          id,
          name: CALENDAR_CONTENT.formerStudent,
          color: NEUTRAL_EVENT_COLOR,
          isKnown: false,
        }
  })

/**
 * An event takes the colour of the first attendee still on the roster. One with
 * no attendees, or only former students, falls back to the neutral fill.
 */
export const eventColor = (attendeeIds: string[], students: Student[]): string => {
  const known = resolveAttendees(attendeeIds, students).find((attendee) => attendee.isKnown)
  return known?.color ?? NEUTRAL_EVENT_COLOR
}
