import { Link } from 'react-router-dom'
import type { CalendarEvent } from '../../types'
import { DASHBOARD_CONTENT } from '../../constants/dashboard'
import { formatTime } from '../../utils/calendarDates'

const { upcoming } = DASHBOARD_CONTENT

export interface UpcomingDay {
  dateKey: string
  label: string
  events: CalendarEvent[]
}

interface UpcomingEventsPanelProps {
  days: UpcomingDay[]
  loading: boolean
  error: string | null
  /** True when a profile is narrowing the list, which changes the empty state. */
  filtered: boolean
  seeMoreHref: string
  addHref: string
  eventHref: (event: CalendarEvent) => string
}

/**
 * The next few events, grouped by day. The mockup leaves today's block
 * unlabelled and names only "Tomorrow": every group is labelled here, so a list
 * that happens to start tomorrow is not read as today's.
 */
const UpcomingEventsPanel = ({
  days,
  loading,
  error,
  filtered,
  seeMoreHref,
  addHref,
  eventHref,
}: UpcomingEventsPanelProps) => {
  const isEmpty = !loading && !error && days.length === 0

  return (
    <section className='panel-card'>
      <header className='panel-card__header'>
        <span className='panel-card__icon' aria-hidden='true'>
          <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
            <rect x='3' y='5' width='18' height='16' rx='2' /><path d='M3 10h18' />
            <path d='M8 3v4M16 3v4' />
          </svg>
        </span>

        <h2 className='panel-card__title'>{upcoming.heading}</h2>

        <Link to={addHref} className='panel-card__add' aria-label={upcoming.addLabel}>
          {upcoming.addSymbol}
        </Link>
      </header>

      <div className='panel-card__body'>
        {error && <p className='panel-card__error'>{error}</p>}
        {loading && <p className='panel-card__status'>{upcoming.loading}</p>}
        {isEmpty && (
          <p className='panel-card__status'>
            {filtered ? upcoming.emptyFiltered : upcoming.empty}
          </p>
        )}

        {days.map((day) => (
          <div key={day.dateKey} className='upcoming-day'>
            <p className='upcoming-day__label'>{day.label}</p>

            <ul className='upcoming-day__list'>
              {day.events.map((event) => (
                <li key={event.id} className='upcoming-day__row'>
                  <Link to={eventHref(event)} className='upcoming-day__link'>
                    <span className='upcoming-day__time'>
                      {event.allDay ? upcoming.allDay : formatTime(event.startTime)}
                    </span>
                    <span className='upcoming-day__title'>
                      {event.title || upcoming.untitled}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {days.length > 0 && (
          <div className='panel-card__footer'>
            <Link
              to={seeMoreHref}
              className='panel-card__more'
              aria-label={upcoming.seeMoreLabel}
            >
              {upcoming.seeMore}
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default UpcomingEventsPanel
