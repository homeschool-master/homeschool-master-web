import { Link } from 'react-router-dom'
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
    <Link
      to={`/calendar/${event.id}`}
      className='calendar__event'
      style={{ backgroundColor: background, color: readableTextColor(background) }}
      title={attendeeNames ? `${title} (${attendeeNames})` : title}
      // A link carries the href that lets a pill be opened in a new tab, but it
      // only activates on Enter: pills read as controls in the grid, so Space
      // activates them too.
      onKeyDown={(keyEvent) => {
        if (keyEvent.key === ' ' || keyEvent.key === 'Spacebar') {
          keyEvent.preventDefault()
          keyEvent.currentTarget.click()
        }
      }}
    >
      {title}
    </Link>
  )
}

export default EventPill
