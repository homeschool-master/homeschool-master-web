import type { CalendarEvent } from '../types'

const pad = (value: number): string => String(value).padStart(2, '0')

/** A bare YYYY-MM-DD key for a Date, read in the browser's local zone. */
export const toDateKey = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/** The local day an ISO timestamp falls on. UTC in, local day out. */
export const isoToDateKey = (iso: string): string => toDateKey(new Date(iso))

export const todayKey = (): string => toDateKey(new Date())

export const monthKey = (year: number, month: number): string => `${year}-${pad(month + 1)}`

export const parseMonthKey = (value: string | null): { year: number; month: number } | null => {
  if (!value) return null
  const match = /^(\d{4})-(\d{2})$/.exec(value)
  if (!match) return null

  const year = Number(match[1])
  const month = Number(match[2]) - 1
  if (month < 0 || month > 11) return null

  return { year, month }
}

/**
 * The bare date range covering a whole month. The server reads these in the
 * teacher's zone, so no offset is attached.
 */
export const monthRange = (year: number, month: number) => ({
  startDate: toDateKey(new Date(year, month, 1)),
  endDate: toDateKey(new Date(year, month + 1, 0)),
})

export interface DayCell {
  /** Null for the blank leading and trailing cells around the month. */
  key: string | null
  dayNumber: number | null
}

/**
 * Six week rows are not padded out: leading and trailing cells are blank, as in
 * the design, rather than showing the adjacent month's days.
 */
export const buildMonthCells = (year: number, month: number): DayCell[] => {
  const firstOfMonth = new Date(year, month, 1)
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const leadingBlanks = firstOfMonth.getDay()

  const cells: DayCell[] = []
  for (let i = 0; i < leadingBlanks; i += 1) {
    cells.push({ key: null, dayNumber: null })
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({ key: toDateKey(new Date(year, month, day)), dayNumber: day })
  }
  while (cells.length % 7 !== 0) {
    cells.push({ key: null, dayNumber: null })
  }

  return cells
}

/**
 * Every local day an event touches, so a genuine multi day event appears in
 * each cell it spans. An event ending exactly at local midnight belongs to the
 * day before, not the one it just touches.
 */
export const eventDateKeys = (event: CalendarEvent): string[] => {
  const start = new Date(event.startTime)
  const end = new Date(event.endTime)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return []

  const endsAtMidnight =
    end.getHours() === 0 && end.getMinutes() === 0 && end.getSeconds() === 0 && end > start

  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const last = new Date(end.getFullYear(), end.getMonth(), end.getDate())
  if (endsAtMidnight) last.setDate(last.getDate() - 1)

  const keys: string[] = []
  while (cursor <= last) {
    keys.push(toDateKey(cursor))
    cursor.setDate(cursor.getDate() + 1)
  }

  return keys.length > 0 ? keys : [toDateKey(start)]
}

/** Groups events by local day key, each day ordered by start time. */
export const groupEventsByDay = (events: CalendarEvent[]): Record<string, CalendarEvent[]> => {
  const grouped: Record<string, CalendarEvent[]> = {}

  events.forEach((event) => {
    eventDateKeys(event).forEach((key) => {
      grouped[key] = grouped[key] ?? []
      grouped[key].push(event)
    })
  })

  Object.values(grouped).forEach((dayEvents) => {
    dayEvents.sort((a, b) => a.startTime.localeCompare(b.startTime))
  })

  return grouped
}

/** The month an event belongs to, for returning to the grid it came from. */
export const isoToMonthKey = (iso: string): string => {
  const date = new Date(iso)
  return monthKey(date.getFullYear(), date.getMonth())
}

/** A long, readable local date: the detail view's spelling. */
export const formatLongDate = (iso: string): string =>
  new Date(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

/** A readable local clock time, matching the browser's locale. */
export const formatTime = (iso: string): string =>
  new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

/** The local HH:MM an ISO timestamp falls at, for a time input. */
export const isoToTimeValue = (iso: string): string => {
  const date = new Date(iso)
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/** Combines a YYYY-MM-DD date and an HH:MM time into a UTC ISO string. */
export const localToUtcIso = (dateValue: string, timeValue: string): string => {
  const [year, month, day] = dateValue.split('-').map(Number)
  const [hours, minutes] = timeValue.split(':').map(Number)
  return new Date(year, month - 1, day, hours, minutes, 0, 0).toISOString()
}

/** The local start of a day, as UTC. */
export const localDayStartIso = (dateValue: string): string => {
  const [year, month, day] = dateValue.split('-').map(Number)
  return new Date(year, month - 1, day, 0, 0, 0, 0).toISOString()
}

/** The local end of a day, as UTC. */
export const localDayEndIso = (dateValue: string): string => {
  const [year, month, day] = dateValue.split('-').map(Number)
  return new Date(year, month - 1, day, 23, 59, 59, 0).toISOString()
}

export const browserTimeZone = (): string =>
  Intl.DateTimeFormat().resolvedOptions().timeZone
