import type { CalendarEvent } from '../../types'
import { CALENDAR_CONTENT, NEUTRAL_EVENT_COLOR } from '../../constants/calendar'
import { readableTextColor } from '../../utils/studentColor'

interface EventPillProps {
  event: CalendarEvent
}

/**
 * Pills take the colour of their first attendee. An event with no attendees, or
 * an attendee with no colour set, falls back to the neutral pill.
 */
const pillColor = (event: CalendarEvent): string =>
  event.attendees[0]?.color ?? NEUTRAL_EVENT_COLOR

const EventPill = ({ event }: EventPillProps) => {
  const attendeeNames = event.attendees.map((attendee) => attendee.firstName).join(', ')
  const title = event.title || CALENDAR_CONTENT.grid.untitledEvent
  const background = pillColor(event)

  return (
    <span
      className='calendar__event'
      style={{ backgroundColor: background, color: readableTextColor(background) }}
      title={attendeeNames ? `${title} (${attendeeNames})` : title}
    >
      {title}
    </span>
  )
}

export default EventPill
