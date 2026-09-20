import type { CalendarEvent, Student, Task } from '../types'
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

/**
 * What a view is actually showing, which the profile is only one way to
 * arrive at. Same four kinds, but a named scope can hold several students,
 * because the calendar and tasks filters let a teacher look at two children at
 * once. The profile itself stays single: only the switcher writes it, and it
 * names one person.
 */
export interface Scope {
  kind: ProfileKind
  /** The named students. Empty for every kind but 'student'. */
  studentIds: string[]
}

export const DEFAULT_PROFILE: Profile = { kind: 'everyone', studentId: null }
export const DEFAULT_SCOPE: Scope = { kind: 'everyone', studentIds: [] }

/** A profile read as a scope: the one student it can name, as a list of one. */
export const scopeOf = (profile: Profile): Scope => ({
  kind: profile.kind,
  studentIds: profile.studentId === null ? [] : [profile.studentId],
})

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

/**
 * Several ids in one param, comma separated: only=a,b. The param already held
 * either one id or the literal "all", so a list extends what it says rather
 * than introducing a second name for the same idea.
 */
const OVERRIDE_SEPARATOR = ','

export const readOverrideIds = (value: string): string[] =>
  value.split(OVERRIDE_SEPARATOR).map((id) => id.trim()).filter(Boolean)

export const writeOverrideIds = (ids: string[]): string => ids.join(OVERRIDE_SEPARATOR)

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
 * A calendar link carrying the profile plus whatever view the caller wants it
 * to open on. The extra params win, so nothing here can be shadowed by a
 * profile key it does not use.
 */
export const calendarHref = (
  profile: Profile,
  params: Record<string, string> = {}
): string => {
  const search = new URLSearchParams(profileSearch(profile))
  Object.entries(params).forEach(([key, value]) => search.set(key, value))

  const query = search.toString()
  return query ? `/calendar?${query}` : '/calendar'
}

/**
 * Named students in the URL that the roster does not have: a link shared
 * before the student was removed, or a hand edited address. Only meaningful
 * once the roster has actually loaded, so callers gate on that.
 */
export const unknownStudentIds = (scope: Scope, students: Student[]): string[] =>
  scope.kind !== 'student'
    ? []
    : scope.studentIds.filter((id) => !students.some((student) => student.id === id))

export const isUnknownProfile = (profile: Profile, students: Student[]): boolean =>
  unknownStudentIds(scopeOf(profile), students).length > 0

/**
 * What a view is actually showing. An override replaces the profile outright
 * rather than narrowing it: picking students while the profile is Teacher
 * shows those students, not the empty intersection of the two.
 */
export const readScope = (params: URLSearchParams): Scope => {
  const override = params.get(OVERRIDE_PARAM)

  if (override === OVERRIDE_ALL) return DEFAULT_SCOPE
  if (override) {
    const studentIds = readOverrideIds(override)
    // only= with nothing usable in it is the same as no override at all,
    // rather than a named scope that can never match anybody.
    if (studentIds.length > 0) return { kind: 'student', studentIds }
  }

  return scopeOf(readProfile(params))
}

/** True while the view is showing something other than the profile. */
export const hasOverride = (params: URLSearchParams): boolean =>
  params.get(OVERRIDE_PARAM) !== null

/**
 * Named students filter server side, through the param the events endpoint
 * takes. The other kinds are counts of attendees with no server counterpart,
 * so the page applies them.
 */
export const serverStudentIds = (scope: Scope): string[] | undefined =>
  scope.kind === 'student' && scope.studentIds.length > 0 ? scope.studentIds : undefined

/** Any of the named students, not all of them: two children means either. */
export const matchesScope = (event: CalendarEvent, scope: Scope): boolean => {
  if (scope.kind === 'everyone') return true
  if (scope.kind === 'teacher') return event.attendeeIds.length === 0
  if (scope.kind === 'students') return event.attendeeIds.length > 0

  return scope.studentIds.some((id) => event.attendeeIds.includes(id))
}

/**
 * The same question asked of a task, which carries two facts an event does
 * not: who it concerns, and whose job it is.
 *
 * The two fixed kinds read the ownership, because "Teacher" means the work
 * that is mine and "All Students" means the work a child is on the hook for.
 * A named student reads the students instead: "Export report cards" is about
 * Scarlett and is the teacher's job, and someone looking at Scarlett wants to
 * see it. Hiding it would mean reviewing a child and missing what you owe
 * them, while listing it under All Students would claim she has to do it.
 */
export const matchesTaskScope = (task: Task, scope: Scope): boolean => {
  if (scope.kind === 'everyone') return true
  if (scope.kind === 'teacher') return task.ownedBy !== 'student'
  if (scope.kind === 'students') return task.ownedBy !== 'teacher'

  return scope.studentIds.some((id) => task.studentIds.includes(id))
}

export const sameProfile = (first: Profile, second: Profile): boolean =>
  first.kind === second.kind && first.studentId === second.studentId

export const isDefaultScope = (scope: Scope): boolean => scope.kind === 'everyone'

/** What to call a profile in a sentence: the fixed names, or a first name. */
export const profileLabel = (profile: Profile, students: Student[]): string =>
  scopeLabel(scopeOf(profile), students)

const firstNameOf = (id: string, students: Student[]): string =>
  students.find((candidate) => candidate.id === id)?.firstName ??
  PROFILE_CONTENT.unknownStudent

/**
 * Joined as a sentence rather than with commas throughout: "Eliza and Samuel"
 * is what the line is read as aloud, and the Viewing line is a sentence.
 */
export const joinNames = (names: string[]): string => {
  if (names.length === 0) return ''
  if (names.length === 1) return names[0]

  return `${names.slice(0, -1).join(', ')} ${PROFILE_CONTENT.and} ${names[names.length - 1]}`
}

/** What to call a scope in a sentence, naming every student it holds. */
export const scopeLabel = (scope: Scope, students: Student[]): string => {
  if (scope.kind !== 'student') return PROFILE_CONTENT[scope.kind]

  return joinNames(scope.studentIds.map((id) => firstNameOf(id, students)))
}

/** The chip list: the three fixed profiles, then one per student on the roster. */
export const profileOptionsFor = (students: Student[]): Profile[] => [
  { kind: 'teacher', studentId: null },
  DEFAULT_PROFILE,
  { kind: 'students', studentId: null },
  ...students.map((student): Profile => ({ kind: 'student', studentId: student.id })),
]
