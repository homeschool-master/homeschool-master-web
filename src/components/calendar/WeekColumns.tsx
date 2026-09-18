import { Link } from 'react-router-dom'
import type { CalendarEvent, Student } from '../../types'
import { CALENDAR_CONTENT } from '../../constants/calendar'
import { formatTime, fromDateKey } from '../../utils/calendarDates'
import { resolveAttendees } from '../../utils/attendees'

interface WeekColumnsProps {
  /** The seven days of the visible week, in order. */
  dateKeys: string[]
  eventsByDay: Record<string, CalendarEvent[]>
  students: Student[]
  todayKey: string
  onAddEvent: (dateKey: string) => void
}

const { list, week } = CALENDAR_CONTENT

const weekdayLabel = (dateKey: string): string =>
  fromDateKey(dateKey).toLocaleDateString(undefined, { weekday: 'short' })

/**
 * One panel of seven columns, one per day, divided by rules rather than boxed
 * separately.
 *
 * A homeschool week is lopsided: one day can carry twenty events while the rest
 * carry two. The columns stretch so the dividers run the full height, but their
 * content stays at the top, so a quiet day shows its one event against the top
 * rule rather than being stretched or floated to the middle. Only the busiest
 * column sets the panel's height, and it stops at a capped height and scrolls
 * inside itself, so one heavy day cannot push the row off the screen. The
 * header carries its own count, so a column with more below the fold says so.
 */
const WeekColumns = ({
  dateKeys,
  eventsByDay,
  students,
  todayKey,
  onAddEvent,
}: WeekColumnsProps) => (
  <div className='week-columns'>
    {dateKeys.map((dateKey) => {
      const dayEvents = eventsByDay[dateKey] ?? []
      const isToday = dateKey === todayKey

      return (
        <section
          key={dateKey}
          className={`week-columns__day${isToday ? ' week-columns__day--today' : ''}`}
        >
          <header className='week-columns__header'>
            <span className='week-columns__weekday'>{weekdayLabel(dateKey)}</span>
            <span className='week-columns__date'>{fromDateKey(dateKey).getDate()}</span>
            {dayEvents.length > 0 && (
              <span className='week-columns__count'>
                {dayEvents.length}
                <span className='calendar__sr-only'> {week.eventCountLabel}</span>
              </span>
            )}

            {/* In the header, above the event cards, so it never competes with
                a card's own click. */}
            <button
              type='button'
              className='week-columns__add'
              onClick={() => onAddEvent(dateKey)}
              aria-label={`${CALENDAR_CONTENT.grid.addOnDayLabel}: ${dateKey}`}
            >
              {CALENDAR_CONTENT.grid.addOnDaySymbol}
            </button>
          </header>

          {dayEvents.length === 0 ? (
            <p className='week-columns__empty'>{list.noEventsOnDay}</p>
          ) : (
            <ul className='week-columns__events'>
              {dayEvents.map((event) => {
                const attendees = resolveAttendees(event.attendeeIds, students)
                const attendeeNames = attendees.map((attendee) => attendee.name).join(', ')

                return (
                  <li key={event.id} className='week-columns__event'>
                    <Link to={`/calendar/${event.id}`} className='week-columns__link'>
                      <span className='week-columns__time'>
                        {event.allDay ? list.allDay : formatTime(event.startTime)}
                      </span>
                      <span className='week-columns__title'>
                        {event.title || CALENDAR_CONTENT.grid.untitledEvent}
                      </span>

                      {/* Dots rather than named pills: a column is too narrow
                          for names, and the detail page carries the full list.
                          The names ride along for anyone not reading colour. */}
                      <span
                        className='week-columns__dots'
                        title={`${week.attendeesLabel}: ${attendeeNames || week.noAttendees}`}
                      >
                        {attendees.map((attendee) => (
                          <span
                            key={attendee.id}
                            className={`week-columns__dot${
                              attendee.isKnown ? '' : ' week-columns__dot--former'
                            }`}
                            style={{ backgroundColor: attendee.color }}
                            aria-hidden='true'
                          />
                        ))}
                        <span className='calendar__sr-only'>
                          {attendeeNames || week.noAttendees}
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      )
    })}
  </div>
)

export default WeekColumns
