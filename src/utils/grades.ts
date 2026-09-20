import type { Assignment } from '../types'
import { GRADES_CONTENT } from '../constants/grades'
import { fromDateKey, toDateKey } from './calendarDates'

/**
 * Fills {named} placeholders in a content template. Keeps the wording in the
 * constants file as plain data rather than assembling sentences out of
 * fragments wherever they are rendered.
 */
export const fillTemplate = (template: string, values: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match)

/**
 * The API sends decimals as strings so it never rounds them. Parsing is for
 * arithmetic and comparison only: what came back is what gets displayed.
 */
export const toNumber = (value: string | null): number | null => {
  if (value === null || value.trim() === '') return null

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

/** "20.0" reads as 20 and "2.50" as 2.5: trailing zeros are noise on a page. */
export const formatDecimal = (value: string | null): string => {
  const parsed = toNumber(value)
  return parsed === null ? '' : String(Math.round(parsed * 100) / 100)
}

/** A percentage to at most one decimal, with its sign: "90%", "87.5%". */
export const formatPercentage = (value: string | null): string | null => {
  const parsed = toNumber(value)
  return parsed === null ? null : `${Math.round(parsed * 10) / 10}%`
}

export type MarkFilter = 'all' | 'unmarked' | 'marked'

/** Rendered in this order, default first: the view maps straight over it. */
export const MARK_FILTERS: MarkFilter[] = ['all', 'unmarked', 'marked']

export const isMarkFilter = (value: string | null): value is MarkFilter =>
  MARK_FILTERS.some((filter) => filter === value)

/** How many of the students holding this work have a mark recorded. */
export const markedCount = (assignment: Assignment): number =>
  assignment.grades.filter((grade) => grade.graded).length

/**
 * Work with nobody on it is not "fully marked": there is nothing to mark, and
 * calling it done would hide an assignment that was never given out.
 */
export const isFullyMarked = (assignment: Assignment): boolean =>
  assignment.grades.length > 0 && markedCount(assignment) === assignment.grades.length

export const needsMarking = (assignment: Assignment): boolean => !isFullyMarked(assignment)

/**
 * The server's own order, so the list stays put after a write rather than
 * jumping on the next load: due ascending, undated last, creation order ties.
 */
export const byDueDate = (first: Assignment, second: Assignment): number => {
  if (first.dueDate === second.dueDate) return first.createdAt.localeCompare(second.createdAt)
  if (first.dueDate === null) return 1
  if (second.dueDate === null) return -1

  return first.dueDate.localeCompare(second.dueDate)
}

/**
 * Both filters narrow one shared fetch, the way the tasks page does. Subject
 * is the server's own parameter, but refetching per subject would trade a
 * single load for one per click on a list a family can hold in memory.
 */
export const applyAssignmentFilters = (
  assignments: Assignment[],
  subjectId: string | null,
  mark: MarkFilter
): Assignment[] => {
  const bySubject =
    subjectId === null
      ? assignments
      : assignments.filter((assignment) => assignment.subjectId === subjectId)

  const byMark =
    mark === 'all'
      ? bySubject
      : bySubject.filter((assignment) =>
          mark === 'marked' ? isFullyMarked(assignment) : needsMarking(assignment)
        )

  return byMark.slice().sort(byDueDate)
}

const { weight: weightContent } = GRADES_CONTENT

/**
 * Weight said in words. A teacher who has never weighted anything reads "2"
 * as a quantity of something rather than as a multiplier, so every place the
 * number appears is paired with a phrase that names what it does.
 */
export const weightSentence = (weight: string): string => {
  const factor = toNumber(weight)
  const { sentence } = weightContent

  if (factor === null || factor === 1) return sentence.normal
  if (factor === 0) return sentence.zero
  if (factor === 0.5) return sentence.half
  if (factor === 2) return sentence.double
  if (factor === 3) return sentence.triple

  return fillTemplate(sentence.other, { factor: formatDecimal(weight) })
}

/**
 * The short form for a row, or null at the ordinary weight of 1: a chip on
 * every line saying "counts once" would be noise on the common case, and the
 * form is where the concept is taught.
 */
export const weightChip = (weight: string): string | null => {
  const factor = toNumber(weight)
  const { chip } = weightContent

  if (factor === null || factor === 1) return null
  if (factor === 0) return chip.zero
  if (factor === 0.5) return chip.half
  if (factor === 2) return chip.double
  if (factor === 3) return chip.triple

  return fillTemplate(chip.other, { factor: formatDecimal(weight) })
}

/**
 * August starts the school year, so a report opened in September covers the
 * term that is running rather than the one that finished in the summer.
 */
export const schoolYearStart = (today: string): string => {
  const date = fromDateKey(today)
  const august = 7
  const year = date.getMonth() >= august ? date.getFullYear() : date.getFullYear() - 1

  return `${year}-08-01`
}

/** The first of the month the given day falls in. */
export const monthStart = (today: string): string => {
  const date = fromDateKey(today)
  return toDateKey(new Date(date.getFullYear(), date.getMonth(), 1))
}

/**
 * What the progress page opens on. The period is required by the endpoint, so
 * the choice is between a default and an empty page that asks before it shows
 * anything: the school year so far is the report a teacher means by "how are
 * they doing", and both ends stay visible and editable above the figures.
 */
export const defaultProgressRange = (today: string) => ({
  from: schoolYearStart(today),
  to: today,
})
