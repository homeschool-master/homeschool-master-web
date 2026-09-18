import type { CalendarEvent, Student } from '../../types'
import {
  CALENDAR_CONTENT,
  MAX_PILLS_DESKTOP,
  MAX_PILLS_MOBILE,
} from '../../constants/calendar'
import EventPill from './EventPill'

interface DayCellProps {
  dateKey: string | null
  dayNumber: number | null
  events: CalendarEvent[]
  students: Student[]
  isToday: boolean
  onOpenDay: (dateKey: string) => void
  onAddEvent: (dateKey: string) => void
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
}: DayCellProps) => {
  if (dayNumber === null || dateKey === null) {
    return <div className='calendar__cell calendar__cell--blank' aria-hidden='true' />
  }

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
          className='calendar__day-number'
          onClick={() => onOpenDay(dateKey)}
          aria-label={`${CALENDAR_CONTENT.grid.openDayLabel}: ${dateKey}`}
        >
          {dayNumber}
          {isToday && (
            <span className='calendar__sr-only'> {CALENDAR_CONTENT.grid.todayLabel}</span>
          )}
        </button>

        {/* A real button, so the cell's own click handler skips it and the
            keyboard reaches it: the cell click still opens the day. */}
        <button
          type='button'
          className='calendar__add-day'
          onClick={() => onAddEvent(dateKey)}
          aria-label={`${CALENDAR_CONTENT.grid.addOnDayLabel}: ${dateKey}`}
        >
          {CALENDAR_CONTENT.grid.addOnDaySymbol}
        </button>
      </div>

      <div className='calendar__events'>
        {events.map((event) => (
          <EventPill key={`${event.id}-${dayNumber}`} event={event} students={students} />
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
