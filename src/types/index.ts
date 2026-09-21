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

/**
 * How something repeats. Deliberately not a full RRULE: a frequency, which
 * days of the week, which monthly anchor, and when it stops, because every
 * field here has to be answerable by a control on a form.
 */
export type RecurrenceFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'
export type MonthlyAnchor = 'day_of_month' | 'weekday_position'

export interface Recurrence {
  frequency: RecurrenceFrequency
  /** 0 for Sunday through 6 for Saturday. Weekly only, and several at once. */
  weekdays: number[]
  monthlyAnchor: MonthlyAnchor | null
  /** The last day the series can produce an occurrence. Null never ends. */
  untilDate: string | null
}

/**
 * How far an edit or a deletion of one occurrence reaches. Absent means all
 * of it, which is the only answer an event that does not repeat has.
 */
export type SeriesScope = 'this' | 'this_and_future' | 'all'

export interface CalendarEvent {
  /**
   * A bare uuid for an ordinary event, or "<uuid>:<date>" for one occurrence
   * of a series. Occurrences are computed rather than stored, so they have no
   * id of their own: opaque to the client, which hands it straight back.
   */
  id: string
  /** The series this occurrence came from, and null for an ordinary event. */
  seriesId: string | null
  /** The local date of this occurrence, and null for an ordinary event. */
  occurrenceDate: string | null
  /** The rule, on every occurrence of a series and null on anything else. */
  recurrence: Recurrence | null
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
/**
 * A teacher's own to-do item. completed and completedAt are two faces of one
 * nullable column server side: completed is the boolean a checkbox binds to,
 * completedAt is the instant it was ticked. They cannot disagree.
 */
export interface Task {
  /**
   * A bare uuid for an ordinary task, or "<uuid>:<date>" for one occurrence of
   * a repeating one. Occurrences are computed rather than stored, so they have
   * no id of their own: opaque to the client, which hands it straight back.
   */
  id: string
  /** The series this occurrence came from, and null for an ordinary task. */
  seriesId: string | null
  /** The local date of this occurrence, and null for an ordinary task. */
  occurrenceDate: string | null
  /** The repeat rule, and null for a task that does not repeat. */
  recurrence: Recurrence | null
  teacherId: string
  title: string
  description: string | null
  /** A bare YYYY-MM-DD, not an instant: a to-do is due on a day. */
  dueDate: string | null
  completed: boolean
  completedAt: string | null
  /**
   * Whose job it is, which naming students cannot express on its own:
   * "Export report cards" names Scarlett and is the teacher's work, while
   * "Finish the science fair project" names her and is hers.
   */
  ownedBy: TaskOwner
  /**
   * Who the task concerns. Ids only, like event attendees: the client
   * resolves names and colours from the students slice.
   */
  studentIds: string[]
  createdAt: string
}

/** A task that is a student's, or shared, has to name at least one student. */
export type TaskOwner = 'teacher' | 'student' | 'both'

export interface TaskInput {
  /** Null stops it repeating, and a rule replaces whatever was there. */
  recurrence?: Recurrence | null
  title: string
  description: string | null
  dueDate: string | null
  ownedBy: TaskOwner
  studentIds: string[]
}

/** Ticking a checkbox is a partial update, so every field is optional here. */
export type TaskUpdateInput = Partial<TaskInput> & { completed?: boolean }

/**
 * A subject a teacher tags work with. Removal is a soft delete server side, so
 * an inactive subject keeps its row and its history: the index only ever
 * returns the active ones.
 */
export interface Subject {
  id: string
  teacherId: string
  name: string
  color: string | null
  description: string | null
  isActive: boolean
  createdAt: string
}

export interface SubjectInput {
  name: string
  color: string | null
  description: string | null
}

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
  /** Null stops it repeating; absent leaves whatever rule it has alone. */
  recurrence?: Recurrence | null
}

/** Update takes the same fields minus createdTimeZone, which is create only. */
export type CalendarEventUpdateInput = Omit<CalendarEventInput, 'createdTimeZone'>

export interface CalendarEventRange {
  startDate: string
  endDate: string
}

/**
 * One student's row on one assignment. The row existing is what gives that
 * student the work: there is no separate join table. pointsEarned null means
 * it has not been marked yet, which keeps it out of every average rather than
 * scoring it zero, and an explicit 0 is a real mark that does count.
 */
export interface AssignmentGrade {
  id: string
  assignmentId: string
  studentId: string
  /**
   * Decimals arrive as strings, "18.0" rather than 18: the server never
   * rounds them and parsing here would be the only place that could.
   */
  pointsEarned: string | null
  percentage: string | null
  graded: boolean
  /**
   * The letter the teacher chose, or null when she typed a number. Provenance
   * only: pointsEarned is still what everything calculates with, so reopening
   * a mark can show the A she picked rather than the 95 it became.
   */
  enteredLetter: string | null
  gradedAt: string | null
  notes: string | null
}

/**
 * A piece of work in a subject, given to one or more students. It carries what
 * the work is out of and how much it counts; what each student earned lives on
 * their own grade row, because one assignment given to three students cannot
 * carry one score.
 */
export interface Assignment {
  id: string
  teacherId: string
  subjectId: string
  assignmentTypeId: string
  /** Carried on the row so a list can name the kind of work without a lookup. */
  assignmentTypeName: string | null
  title: string
  description: string | null
  /** A bare YYYY-MM-DD. Undated work belongs to no report period. */
  dueDate: string | null
  pointsPossible: string
  weight: string
  /**
   * False when the weight is the type's default, true when the teacher set it
   * on this one piece of work. An overridden weight is never moved by a later
   * change to the type's default, and the form says so.
   */
  weightOverridden: boolean
  /**
   * Nested rather than reduced to ids, unlike calendar event attendees: there
   * the ids kept a month of events small, here the grades are the record.
   */
  grades: AssignmentGrade[]
  createdAt: string
}

export interface AssignmentInput {
  subjectId: string
  assignmentTypeId: string
  title: string
  description: string | null
  dueDate: string | null
  pointsPossible: number
  weight: number
  /**
   * Replaces the assigned set on update. A student dropped from the list has
   * their grade row deleted, score and all, so the form treats unassigning as
   * destructive rather than as a tidy up.
   */
  studentIds: string[]
}

/**
 * Recording a mark, one way or the other. A number is a percentage of the
 * points; a letter is sent as itself and becomes a score on the server, once,
 * so the two entry styles cannot drift apart. Null points puts the work back
 * to unmarked and clears both gradedAt and the letter.
 */
export interface ScoreInput {
  pointsEarned: number | null
  enteredLetter?: string | null
}

/** One of the five letters on the scale. */
export type GradeLetter = 'A' | 'B' | 'C' | 'D' | 'F'

/**
 * A kind of work, and what that kind counts by default. Three are built in for
 * every teacher and cannot be renamed or removed; the rest are her own.
 */
export interface AssignmentType {
  id: string
  teacherId: string
  name: string
  defaultWeight: string
  isBuiltIn: boolean
  createdAt: string
}

/** How far back a changed default weight reaches. */
export type WeightApplyMode = 'new_only' | 'all' | 'from_date'

export interface AssignmentTypeInput {
  name: string
  defaultWeight?: number
  applyMode?: WeightApplyMode
  /** Required by the from_date mode, ignored by the other two. */
  fromDate?: string | null
}

/**
 * The weighted roll up for one subject or for everything at once. percentage
 * and letter are null when nothing is marked, rather than a zero nobody
 * earned, so the counts are what tell the reader how much the figure covers.
 */
export interface ProgressTotals {
  assignedCount: number
  gradedCount: number
  ungradedCount: number
  pointsEarned: string
  pointsPossible: string
  percentage: string | null
  letter: string | null
}

/**
 * One piece of work as a single student holds it. Comes out of the same pass
 * that produces the figures above it, so the list and the percentage are one
 * calculation rather than two.
 */
export interface ProgressEntry {
  assignmentId: string
  title: string
  assignmentTypeName: string | null
  /** Null for work that belongs to no period. */
  dueDate: string | null
  weight: string
  pointsPossible: string
  /** Null while unmarked, which is not the same as a zero. */
  pointsEarned: string | null
  graded: boolean
  percentage: string | null
  letter: string | null
  /** The letter she chose, when she marked it by letter rather than by number. */
  enteredLetter: string | null
}

export type ProgressSubject = ProgressTotals & {
  subjectId: string
  subjectName: string
  /** The work this subject's figures were summed from, in due date order. */
  assignments: ProgressEntry[]
}

export interface StudentProgress {
  studentId: string
  from: string
  to: string
  subjects: ProgressSubject[]
  overall: ProgressTotals
  /**
   * Work with no due date. In none of the figures above, because it sits in no
   * period, and reported anyway so it is not silently missing from the page.
   */
  undated: ProgressEntry[]
}

/** Both ends required: a roll up with no period answers a different question. */
export interface ProgressRange {
  from: string
  to: string
}
