import type { CalendarEvent, Student } from '../types'
import { PROFILE_CONTENT } from '../constants/profile'

/**
 * Whose calendar you are looking at. One vocabulary, shared by the dashboard
 * and the calendar, and held entirely in the query string.
 *
 *   (no params)          Teacher & Students, the default: everything
 *   ?mode=teacher        the teacher's own items: events with no attendees
 *   ?mode=students       anything a student is on: events with at least one
 *   ?studentId=<id>      one named student
 *
 * studentId is the param the events endpoint already takes, so a named student
 * filters server side and needs no second name for the same idea. mode carries
 * the three that have no server counterpart and are applied in the page.
 */
export type ProfileKind = 'teacher' | 'everyone' | 'students' | 'student'

export interface Profile {
  kind: ProfileKind
  /** The named student, and null for every other kind. */
  studentId: string | null
}

export const DEFAULT_PROFILE: Profile = { kind: 'everyone', studentId: null }

export const MODE_PARAM = 'mode'
export const STUDENT_PARAM = 'studentId'

/**
 * The calendar's own student dropdown writes here rather than to studentId, so
 * that picking a student to look at does not rewrite the profile the rest of
 * the app is navigating with. A student id scopes this visit to that student,
 * and the literal "all" scopes it to everyone: either way it replaces the
 * profile for as long as it is in the URL, and nothing propagates it onward.
 */
export const OVERRIDE_PARAM = 'only'
export const OVERRIDE_ALL = 'all'

export const readProfile = (params: URLSearchParams): Profile => {
  const studentId = params.get(STUDENT_PARAM)
  if (studentId) return { kind: 'student', studentId }

  const mode = params.get(MODE_PARAM)
  if (mode === 'teacher') return { kind: 'teacher', studentId: null }
  if (mode === 'students') return { kind: 'students', studentId: null }

  // Anything unrecognised, including nothing at all, is the default.
  return DEFAULT_PROFILE
}

/** The param changes that put a profile in the URL, for updateParams callers. */
export const profileParams = (profile: Profile): Record<string, string | null> => ({
  [MODE_PARAM]: profile.kind === 'teacher' || profile.kind === 'students' ? profile.kind : null,
  [STUDENT_PARAM]: profile.kind === 'student' ? profile.studentId : null,
})

/** The same thing as a query string, for links: "" for the default profile. */
export const profileSearch = (profile: Profile): string => {
  const params = new URLSearchParams()

  Object.entries(profileParams(profile)).forEach(([key, value]) => {
    if (value) params.set(key, value)
  })

  const query = params.toString()
  return query ? `?${query}` : ''
}

/** Appends the profile to a path, so navigation carries it without losing it. */
export const withProfile = (path: string, profile: Profile): string =>
  `${path}${profileSearch(profile)}`

/**
 * What the calendar is actually showing. An override replaces the profile
 * outright rather than narrowing it: picking a student while the profile is
 * Teacher shows that student, not the empty intersection of the two.
 */
export const readCalendarScope = (params: URLSearchParams): Profile => {
  const override = params.get(OVERRIDE_PARAM)

  if (override === OVERRIDE_ALL) return DEFAULT_PROFILE
  if (override) return { kind: 'student', studentId: override }

  return readProfile(params)
}

/** True while the calendar is showing something other than the profile. */
export const hasOverride = (params: URLSearchParams): boolean =>
  params.get(OVERRIDE_PARAM) !== null

/** Only a named student has a server side filter: the rest are applied here. */
export const serverStudentId = (scope: Profile): string | undefined =>
  scope.kind === 'student' && scope.studentId ? scope.studentId : undefined

export const matchesProfile = (event: CalendarEvent, scope: Profile): boolean => {
  if (scope.kind === 'everyone') return true
  if (scope.kind === 'teacher') return event.attendeeIds.length === 0
  if (scope.kind === 'students') return event.attendeeIds.length > 0

  return scope.studentId !== null && event.attendeeIds.includes(scope.studentId)
}

export const sameProfile = (first: Profile, second: Profile): boolean =>
  first.kind === second.kind && first.studentId === second.studentId

/** What to call a profile in a sentence: the fixed names, or a first name. */
export const profileLabel = (profile: Profile, students: Student[]): string => {
  if (profile.kind !== 'student') return PROFILE_CONTENT[profile.kind]

  const student = students.find((candidate) => candidate.id === profile.studentId)
  return student?.firstName ?? PROFILE_CONTENT.unknownStudent
}

/** The chip list: the three fixed profiles, then one per student on the roster. */
export const profileOptionsFor = (students: Student[]): Profile[] => [
  { kind: 'teacher', studentId: null },
  DEFAULT_PROFILE,
  { kind: 'students', studentId: null },
  ...students.map((student): Profile => ({ kind: 'student', studentId: student.id })),
]
