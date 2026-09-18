import { Link } from 'react-router-dom'
import type { CalendarEvent, Student } from '../../types'
import { CALENDAR_CONTENT } from '../../constants/calendar'
import { formatLongDate, formatTime } from '../../utils/calendarDates'
import { resolveAttendees } from '../../utils/attendees'
import { readableTextColor } from '../../utils/studentColor'

interface EventListProps {
  /** Every day in the visible range, in order, including empty ones. */
  dateKeys: string[]
  eventsByDay: Record<string, CalendarEvent[]>
  students: Student[]
  todayKey: string
  /** The profile, so coming back from the detail page lands on it again. */
  linkSearch: string
}

const { list } = CALENDAR_CONTENT

/**
 * The day, week and month list rendering: days in order, each day's events in
 * time order. Deliberately not a time axis grid, which reads badly once a day
 * carries a dozen blocked subjects.
 */
const EventList = ({ dateKeys, eventsByDay, students, todayKey, linkSearch }: EventListProps) => {
  const total = dateKeys.reduce((count, key) => count + (eventsByDay[key]?.length ?? 0), 0)

  if (total === 0) return <p className='calendar__status'>{list.empty}</p>

  return (
    <ol className='event-list'>
      {dateKeys.map((dateKey) => {
        const dayEvents = eventsByDay[dateKey] ?? []

        return (
          <li
            key={dateKey}
            className={`event-list__day${dateKey === todayKey ? ' event-list__day--today' : ''}`}
          >
            <h2 className='event-list__date'>{formatLongDate(`${dateKey}T12:00:00`)}</h2>

            {dayEvents.length === 0 ? (
              <p className='event-list__empty'>{list.noEventsOnDay}</p>
            ) : (
              <ul className='event-list__events'>
                {dayEvents.map((event) => {
                  const attendees = resolveAttendees(event.attendeeIds, students)

                  return (
                    <li key={event.id} className='event-list__event'>
                      <Link to={`/calendar/${event.id}${linkSearch}`} className='event-list__link'>
                        <span className='event-list__time'>
                          {event.allDay
                            ? list.allDay
                            : `${formatTime(event.startTime)} to ${formatTime(event.endTime)}`}
                        </span>
                        <span className='event-list__title'>
                          {event.title || CALENDAR_CONTENT.grid.untitledEvent}
                        </span>
                        {event.location && (
                          <span className='event-list__location'>{event.location}</span>
                        )}
                      </Link>

                      {attendees.length > 0 && (
                        <ul className='event-list__attendees'>
                          {attendees.map((attendee) => (
                            <li
                              key={attendee.id}
                              className={`event-list__attendee${
                                attendee.isKnown ? '' : ' event-list__attendee--former'
                              }`}
                              style={{
                                backgroundColor: attendee.color,
                                color: readableTextColor(attendee.color),
                              }}
                            >
                              {attendee.name}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  )
                })}
              </ul>
            )}
          </li>
        )
      })}
    </ol>
  )
}

export default EventList
