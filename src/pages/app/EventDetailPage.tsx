import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import {
  clearCurrentEvent,
  clearDeleteError,
  deleteCalendarEvent,
  fetchCalendarEvent,
} from '../../store/calendarEventsSlice'
import { fetchStudents } from '../../store/studentsSlice'
import { CALENDAR_CONTENT } from '../../constants/calendar'
import {
  formatLongDate,
  formatTime,
  isoToDateKey,
} from '../../utils/calendarDates'
import { readableTextColor } from '../../utils/studentColor'
import { resolveAttendees } from '../../utils/attendees'
import { profileSearch, readProfile } from '../../utils/profile'
import EventDeleteConfirm from '../../components/calendar/EventDeleteConfirm'
import SeriesScopeChoice from '../../components/shared/SeriesScopeChoice'
import AttachedDocuments from '../../components/documents/AttachedDocuments'
import type { SeriesScope } from '../../types'

const { detail } = CALENDAR_CONTENT

const EventDetailPage = () => {
  const { id } = useParams()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const { current, currentLoading, currentError, currentNotFound, deletingId, deleteError } =
    useSelector((state: RootState) => state.calendarEvents)
  const { items: students } = useSelector((state: RootState) => state.students)

  const [confirmingDelete, setConfirmingDelete] = useState(false)

  // Attendee ids resolve against the roster, so a cold load needs it too.
  useEffect(() => {
    dispatch(fetchStudents())
  }, [dispatch])

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

  /**
   * The profile rides in on the link that opened this page, so going back to
   * the calendar has to hand it over again: a bare /calendar would drop it and
   * silently reset the teacher to the default profile.
   */
  const profile = readProfile(searchParams)

  const backToCalendar = (dateKey?: string): string => {
    const params = new URLSearchParams(profileSearch(profile))
    if (dateKey) params.set('date', dateKey)

    const query = params.toString()
    return query ? `/calendar?${query}` : '/calendar'
  }

  const calendarHref = current
    ? backToCalendar(isoToDateKey(current.startTime))
    : backToCalendar()

  const handleDelete = async (scope?: SeriesScope) => {
    if (!current) return
    const eventDate = isoToDateKey(current.startTime)
    const result = await dispatch(deleteCalendarEvent({ id: current.id, scope }))
    if (deleteCalendarEvent.fulfilled.match(result)) {
      navigate(backToCalendar(eventDate))
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

          {/* Says the event belongs to a series before anything is edited, so
              the three way choice further down is not a surprise. */}
          {current.seriesId && (
            <span className='event-detail__series'>{CALENDAR_CONTENT.seriesBadge}</span>
          )}

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
          {current.attendeeIds.length === 0 ? (
            <p className='event-detail__value'>{detail.noAttendees}</p>
          ) : (
            <ul className='event-detail__attendees'>
              {resolveAttendees(current.attendeeIds, students).map((attendee) => (
                <li
                  key={attendee.id}
                  className={`event-detail__attendee${
                    attendee.isKnown ? '' : ' event-detail__attendee--former'
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

        {/* Below what the event is and above what can be done to it: a
            document is part of the record rather than an action on it. On one
            occurrence of a series the panel says so itself, because filing a
            receipt against every co-op morning is the mistake to prevent. */}
        <section className='event-detail__card'>
          <AttachedDocuments
            attachableType='CalendarEvent'
            targetId={current.id}
            repeats={Boolean(current.seriesId)}
          />
        </section>

        <div className='event-detail__actions'>
          {/* Deleting one occurrence of a series has three possible meanings,
              so it asks which rather than picking one. An ordinary event has
              only ever had the one confirmation, and keeps it. */}
          {confirmingDelete && current.seriesId ? (
            <SeriesScopeChoice
              mode='delete'
            heading={CALENDAR_CONTENT.scope.deleteHeading}
              busy={deletingId === current.id}
              onConfirm={(scope) => {
                setConfirmingDelete(false)
                void handleDelete(scope)
              }}
              onCancel={() => {
                dispatch(clearDeleteError())
                setConfirmingDelete(false)
              }}
            />
          ) : confirmingDelete ? (
            <EventDeleteConfirm
              title={current.title || CALENDAR_CONTENT.grid.untitledEvent}
              deleting={deletingId === current.id}
              error={deleteError}
              onConfirm={() => handleDelete()}
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
        <Link to={calendarHref} className='event-detail__back'>
          {detail.backToCalendar}
        </Link>
        <h1 className='event-detail__heading'>{detail.heading}</h1>
        {current ? (
          <Link
            to={`/calendar/${current.id}/edit${profileSearch(profile)}`}
            className='event-detail__edit'
          >
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
