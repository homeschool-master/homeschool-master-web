import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import {
  clearCurrentEvent,
  clearDeleteError,
  deleteCalendarEvent,
  fetchCalendarEvent,
} from '../../store/calendarEventsSlice'
import { CALENDAR_CONTENT, NEUTRAL_EVENT_COLOR } from '../../constants/calendar'
import {
  formatLongDate,
  formatTime,
  isoToDateKey,
  isoToMonthKey,
} from '../../utils/calendarDates'
import { readableTextColor } from '../../utils/studentColor'
import EventDeleteConfirm from '../../components/calendar/EventDeleteConfirm'

const { detail } = CALENDAR_CONTENT

const EventDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const { current, currentLoading, currentError, currentNotFound, deletingId, deleteError } =
    useSelector((state: RootState) => state.calendarEvents)

  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // Fetched by id rather than read out of the grid's slice, so the URL works on
  // a cold load or a refresh.
  useEffect(() => {
    if (!id) return
    dispatch(fetchCalendarEvent(id))
    return () => {
      dispatch(clearCurrentEvent())
      dispatch(clearDeleteError())
    }
  }, [dispatch, id])

  const monthHref = current ? `/calendar?month=${isoToMonthKey(current.startTime)}` : '/calendar'

  const handleDelete = async () => {
    if (!current) return
    const month = isoToMonthKey(current.startTime)
    const result = await dispatch(deleteCalendarEvent(current.id))
    if (deleteCalendarEvent.fulfilled.match(result)) {
      navigate(`/calendar?month=${month}`)
    }
  }

  const renderBody = () => {
    if (currentLoading) return <p className='event-detail__status'>{detail.loading}</p>

    if (currentNotFound) {
      return (
        <p className='event-detail__status' role='alert'>
          {detail.notFound}
        </p>
      )
    }

    if (currentError) {
      return (
        <p className='event-detail__error' role='alert'>
          {currentError}
        </p>
      )
    }

    if (!current) return null

    const startsAndEndsSameDay = isoToDateKey(current.startTime) === isoToDateKey(current.endTime)
    const dateText = startsAndEndsSameDay
      ? formatLongDate(current.startTime)
      : `${formatLongDate(current.startTime)} to ${formatLongDate(current.endTime)}`

    return (
      <>
        <section className='event-detail__card'>
          <h2 className='event-detail__title'>
            {current.title || CALENDAR_CONTENT.grid.untitledEvent}
          </h2>

          <div className='event-detail__row'>
            <span className='event-detail__label'>{detail.date}</span>
            <span className='event-detail__value'>{dateText}</span>
          </div>

          <div className='event-detail__row'>
            <span className='event-detail__label'>{detail.time}</span>
            <span className='event-detail__value'>
              {current.allDay
                ? detail.allDay
                : `${formatTime(current.startTime)} to ${formatTime(current.endTime)}`}
            </span>
          </div>
        </section>

        <section className='event-detail__card'>
          <span className='event-detail__label'>{detail.attendees}</span>
          {current.attendees.length === 0 ? (
            <p className='event-detail__value'>{detail.noAttendees}</p>
          ) : (
            <ul className='event-detail__attendees'>
              {current.attendees.map((attendee) => {
                const background = attendee.color ?? NEUTRAL_EVENT_COLOR
                return (
                  <li
                    key={attendee.id}
                    className='event-detail__attendee'
                    style={{ backgroundColor: background, color: readableTextColor(background) }}
                  >
                    {attendee.firstName}
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        {/* Empty location and notes are left out rather than shown blank. */}
        {(current.location || current.notes) && (
          <section className='event-detail__card'>
            {current.location && (
              <div className='event-detail__block'>
                <span className='event-detail__label'>{detail.location}</span>
                <p className='event-detail__value'>{current.location}</p>
              </div>
            )}
            {current.notes && (
              <div className='event-detail__block'>
                <span className='event-detail__label'>{detail.notes}</span>
                <p className='event-detail__value'>{current.notes}</p>
              </div>
            )}
          </section>
        )}

        <div className='event-detail__actions'>
          {confirmingDelete ? (
            <EventDeleteConfirm
              title={current.title || CALENDAR_CONTENT.grid.untitledEvent}
              deleting={deletingId === current.id}
              error={deleteError}
              onConfirm={handleDelete}
              onCancel={() => {
                dispatch(clearDeleteError())
                setConfirmingDelete(false)
              }}
            />
          ) : (
            <button
              type='button'
              className='event-detail__delete'
              onClick={() => setConfirmingDelete(true)}
            >
              {detail.delete}
            </button>
          )}
        </div>
      </>
    )
  }

  return (
    <div className='event-detail'>
      <header className='event-detail__bar'>
        <Link to={monthHref} className='event-detail__back'>
          {detail.backToCalendar}
        </Link>
        <h1 className='event-detail__heading'>{detail.heading}</h1>
        {current ? (
          <Link to={`/calendar/${current.id}/edit`} className='event-detail__edit'>
            {detail.edit}
          </Link>
        ) : (
          <span className='event-detail__edit-placeholder' aria-hidden='true' />
        )}
      </header>

      {renderBody()}
    </div>
  )
}

export default EventDetailPage
