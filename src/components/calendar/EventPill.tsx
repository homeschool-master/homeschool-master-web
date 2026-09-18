import { Link } from 'react-router-dom'
import type { CalendarEvent, Student } from '../../types'
import { CALENDAR_CONTENT } from '../../constants/calendar'
import { eventColor, resolveAttendees } from '../../utils/attendees'
import { readableTextColor } from '../../utils/studentColor'

interface EventPillProps {
  event: CalendarEvent
  students: Student[]
}

const EventPill = ({ event, students }: EventPillProps) => {
  const attendees = resolveAttendees(event.attendeeIds, students)
  const attendeeNames = attendees.map((attendee) => attendee.name).join(', ')
  const title = event.title || CALENDAR_CONTENT.grid.untitledEvent
  const background = eventColor(event.attendeeIds, students)

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
