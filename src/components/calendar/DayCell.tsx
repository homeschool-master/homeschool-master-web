import type { CalendarEvent } from '../../types'
import {
  CALENDAR_CONTENT,
  MAX_PILLS_DESKTOP,
  MAX_PILLS_MOBILE,
} from '../../constants/calendar'
import EventPill from './EventPill'

interface DayCellProps {
  dayNumber: number | null
  events: CalendarEvent[]
  isToday: boolean
}

/**
 * Every pill is rendered and the overflow is hidden in CSS, so the cap can
 * differ between desktop and mobile without a resize listener. The two
 * "+N more" lines are swapped by the same breakpoint. Neither is clickable in
 * this slice: day detail comes later.
 */
const DayCell = ({ dayNumber, events, isToday }: DayCellProps) => {
  if (dayNumber === null) {
    return <div className='calendar__cell calendar__cell--blank' aria-hidden='true' />
  }

  const desktopOverflow = events.length - MAX_PILLS_DESKTOP
  const mobileOverflow = events.length - MAX_PILLS_MOBILE

  return (
    <div className={`calendar__cell${isToday ? ' calendar__cell--today' : ''}`}>
      <span className='calendar__day-number'>
        {dayNumber}
        {isToday && <span className='calendar__sr-only'> {CALENDAR_CONTENT.grid.todayLabel}</span>}
      </span>

      <div className='calendar__events'>
        {events.map((event) => (
          <EventPill key={`${event.id}-${dayNumber}`} event={event} />
        ))}

        {desktopOverflow > 0 && (
          <span className='calendar__more calendar__more--desktop'>
            +{desktopOverflow} {CALENDAR_CONTENT.grid.moreSuffix}
          </span>
        )}
        {mobileOverflow > 0 && (
          <span className='calendar__more calendar__more--mobile'>
            +{mobileOverflow} {CALENDAR_CONTENT.grid.moreSuffix}
          </span>
        )}
      </div>
    </div>
  )
}

export default DayCell
