import type { CalendarEvent, Student } from '../../types'
import {
  CALENDAR_CONTENT,
  MAX_PILLS_DESKTOP,
  MAX_PILLS_MOBILE,
} from '../../constants/calendar'
import { formatLongDate, fromDateKey } from '../../utils/calendarDates'
import EventPill from './EventPill'

interface DayCellProps {
  dateKey: string | null
  dayNumber: number | null
  events: CalendarEvent[]
  students: Student[]
  isToday: boolean
  onOpenDay: (dateKey: string) => void
  onAddEvent: (dateKey: string) => void
  /** The profile, so coming back from the detail page lands on it again. */
  linkSearch: string
}

/**
 * Every pill is rendered and the overflow is hidden in CSS, so the cap can
 * differ between desktop and mobile without a resize listener. The two
 * "+N more" lines are swapped by the same breakpoint, and both open the day
 * view, as does clicking the cell itself.
 */
const DayCell = ({
  dateKey,
  dayNumber,
  events,
  students,
  isToday,
  onOpenDay,
  onAddEvent,
  linkSearch,
}: DayCellProps) => {
  if (dayNumber === null || dateKey === null) {
    return <div className='calendar__cell calendar__cell--blank' aria-hidden='true' />
  }

  // Noon so a bare date key cannot be read as UTC and land on the day before.
  const longDate = formatLongDate(`${dateKey}T12:00:00`)
  const addLabel = `${CALENDAR_CONTENT.grid.addOnDayLabel} ${longDate}`

  // Sunday and Saturday sit against the edges of the grid, so their tooltips
  // anchor to their own edge and open inwards rather than off screen.
  const weekday = fromDateKey(dateKey).getDay()
  const tooltipEdge =
    weekday === 0 ? '--tooltip-start' : weekday === 6 ? '--tooltip-end' : ''
  const edgeClass = (base: string) => (tooltipEdge ? ` ${base}${tooltipEdge}` : '')

  const desktopOverflow = events.length - MAX_PILLS_DESKTOP
  const mobileOverflow = events.length - MAX_PILLS_MOBILE

  // A click on a pill is the pill's own navigation: only bare cell clicks open
  // the day. Keyboard users reach the day through the day number button.
  const handleCellClick = (clickEvent: React.MouseEvent<HTMLDivElement>) => {
    if ((clickEvent.target as HTMLElement).closest('a, button')) return
    onOpenDay(dateKey)
  }

  return (
    <div
      className={`calendar__cell${isToday ? ' calendar__cell--today' : ''}`}
      onClick={handleCellClick}
    >
      <div className='calendar__cell-header'>
        <button
          type='button'
          className={`calendar__day-number${edgeClass('calendar__day-number')}`}
          onClick={() => onOpenDay(dateKey)}
          data-tooltip={`${CALENDAR_CONTENT.grid.openDayLabel}: ${dateKey}`}
          aria-label={`${CALENDAR_CONTENT.grid.openDayLabel}: ${dateKey}`}
        >
          {dayNumber}
          {isToday && (
            <span className='calendar__sr-only'> {CALENDAR_CONTENT.grid.todayLabel}</span>
          )}
        </button>

        {/* A real button, so the cell's own click handler skips it and the
            keyboard reaches it: the cell click still opens the day.
            data-tooltip feeds the instant tooltip, aria-label is the announced
            name: both name the day, so one control is never mistaken for
            another. */}
        <button
          type='button'
          className={`calendar__add-day${edgeClass('calendar__add-day')}`}
          onClick={() => onAddEvent(dateKey)}
          data-tooltip={addLabel}
          aria-label={addLabel}
        >
          {CALENDAR_CONTENT.grid.addOnDaySymbol}
        </button>
      </div>

      <div className='calendar__events'>
        {events.map((event) => (
          <EventPill
            key={`${event.id}-${dayNumber}`}
            event={event}
            students={students}
            linkSearch={linkSearch}
          />
        ))}

        {desktopOverflow > 0 && (
          <button
            type='button'
            className='calendar__more calendar__more--desktop'
            onClick={() => onOpenDay(dateKey)}
          >
            +{desktopOverflow} {CALENDAR_CONTENT.grid.moreSuffix}
          </button>
        )}
        {mobileOverflow > 0 && (
          <button
            type='button'
            className='calendar__more calendar__more--mobile'
            onClick={() => onOpenDay(dateKey)}
          >
            +{mobileOverflow} {CALENDAR_CONTENT.grid.moreSuffix}
          </button>
        )}
      </div>
    </div>
  )
}

export default DayCell
