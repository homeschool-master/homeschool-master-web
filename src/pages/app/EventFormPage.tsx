import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import {
  clearCreateError,
  clearCurrentEvent,
  clearDeleteError,
  clearUpdateError,
  createCalendarEvent,
  deleteCalendarEvent,
  fetchCalendarEvent,
  updateCalendarEvent,
} from '../../store/calendarEventsSlice'
import { fetchStudents } from '../../store/studentsSlice'
import FormField, { FormInput, FormSelect, FormTextarea } from '../../components/shared/FormField'
import EventDeleteConfirm from '../../components/calendar/EventDeleteConfirm'
import { CALENDAR_CONTENT, NEUTRAL_EVENT_COLOR } from '../../constants/calendar'
import {
  browserTimeZone,
  isoToDateKey,
  isoToMonthKey,
  isoToTimeValue,
  localDayEndIso,
  localDayStartIso,
  localToUtcIso,
  monthKey,
  parseMonthKey,
  toDateKey,
} from '../../utils/calendarDates'
import { readableTextColor } from '../../utils/studentColor'

const DEFAULT_START_TIME = '09:00'
const DEFAULT_END_TIME = '10:00'

/**
 * Serves both /calendar/new and /calendar/:id/edit: an id in the route puts it
 * in edit mode, where it prefills from the event and patches instead of
 * posting.
 */
const EventFormPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { id } = useParams()
  const isEditing = Boolean(id)

  const {
    creating,
    createError,
    current,
    currentLoading,
    currentError,
    currentNotFound,
    updating,
    updateError,
    deletingId,
    deleteError,
  } = useSelector((state: RootState) => state.calendarEvents)
  const { items: students, loading: studentsLoading } = useSelector(
    (state: RootState) => state.students
  )

  // The grid passes the month it was showing, so the date defaults inside that
  // month rather than today when the teacher has paged away from it.
  const monthParam = searchParams.get('month')
  const defaultDate = useMemo(() => {
    const originMonth = parseMonthKey(monthParam)
    const now = new Date()
    if (!originMonth) return toDateKey(now)

    const isCurrentMonth =
      originMonth.year === now.getFullYear() && originMonth.month === now.getMonth()

    return isCurrentMonth
      ? toDateKey(now)
      : toDateKey(new Date(originMonth.year, originMonth.month, 1))
  }, [monthParam])

  const [title, setTitle] = useState('')
  const [date, setDate] = useState(defaultDate)
  const [allDay, setAllDay] = useState(false)
  const [startTime, setStartTime] = useState(DEFAULT_START_TIME)
  const [endTime, setEndTime] = useState(DEFAULT_END_TIME)
  const [allStudents, setAllStudents] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [validationError, setValidationError] = useState<string | null>(null)
  const [confirmingDelete, setConfirmingDelete] = useState(false)

  useEffect(() => {
    dispatch(fetchStudents())
    return () => {
      dispatch(clearCreateError())
      dispatch(clearUpdateError())
      dispatch(clearDeleteError())
    }
  }, [dispatch])

  useEffect(() => {
    if (!id) return
    dispatch(fetchCalendarEvent(id))
    return () => {
      dispatch(clearCurrentEvent())
    }
  }, [dispatch, id])

  // Seeded once per event, adjusting state during render rather than in an
  // effect: React's own answer for state derived from data that just arrived,
  // and it never overwrites the teacher's edits on a later render.
  const [prefilledId, setPrefilledId] = useState<string | null>(null)
  if (id && current && current.id === id && prefilledId !== id) {
    setPrefilledId(id)
    setTitle(current.title)
    setDate(isoToDateKey(current.startTime))
    setAllDay(current.allDay)
    // An all day event is stored as the day's bounds. Showing 00:00 and 23:59
    // in the pickers would be noise, so the defaults stand by until the teacher
    // turns all day off.
    setStartTime(current.allDay ? DEFAULT_START_TIME : isoToTimeValue(current.startTime))
    setEndTime(current.allDay ? DEFAULT_END_TIME : isoToTimeValue(current.endTime))
    setSelectedIds(current.attendees.map((attendee) => attendee.id))
    setLocation(current.location ?? '')
    setNotes(current.notes ?? '')
  }

  const toggleStudent = (id: string) => {
    setValidationError(null)
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    )
  }

  // All Students is a client side convenience: it expands to the full id list
  // at submit time so a student added later does not join this event.
  const toggleAllStudents = () => {
    setValidationError(null)
    setAllStudents((current) => !current)
  }

  const isAttendeeChecked = (id: string) => allStudents || selectedIds.includes(id)

  const validate = (): string | null => {
    if (!title.trim()) return CALENDAR_CONTENT.validation.titleRequired
    if (!date) return CALENDAR_CONTENT.validation.dateRequired
    if (!allDay) {
      if (!startTime || !endTime) return CALENDAR_CONTENT.validation.timesRequired
      if (localToUtcIso(date, endTime) <= localToUtcIso(date, startTime)) {
        return CALENDAR_CONTENT.validation.endBeforeStart
      }
    }
    return null
  }

  const handleSubmit = async (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault()

    const problem = validate()
    if (problem) {
      setValidationError(problem)
      return
    }
    setValidationError(null)

    // The submitted attendee list replaces the set outright, so it is always
    // the full intended roster for the event rather than a delta.
    const attendeeIds = allStudents ? students.map((student) => student.id) : selectedIds

    const fields = {
      title: title.trim(),
      notes: notes.trim() || null,
      location: location.trim() || null,
      start_time: allDay ? localDayStartIso(date) : localToUtcIso(date, startTime),
      end_time: allDay ? localDayEndIso(date) : localToUtcIso(date, endTime),
      all_day: allDay,
      student_ids: attendeeIds,
    }

    if (isEditing && id) {
      // created_time_zone is create only and is deliberately absent here.
      const result = await dispatch(updateCalendarEvent({ id, input: fields }))
      if (updateCalendarEvent.fulfilled.match(result)) navigate(`/calendar/${id}`)
      return
    }

    const result = await dispatch(
      createCalendarEvent({ ...fields, created_time_zone: browserTimeZone() })
    )

    if (createCalendarEvent.fulfilled.match(result)) {
      const [year, month] = date.split('-').map(Number)
      navigate(`/calendar?month=${monthKey(year, month - 1)}`)
    }
  }

  const handleDelete = async () => {
    if (!id || !current) return
    const month = isoToMonthKey(current.startTime)
    const result = await dispatch(deleteCalendarEvent(id))
    if (deleteCalendarEvent.fulfilled.match(result)) navigate(`/calendar?month=${month}`)
  }

  const saving = isEditing ? updating : creating
  const submitError = isEditing ? updateError : createError

  // Editing waits for the record: the form would otherwise flash empty fields
  // and then fill them in underneath the teacher.
  if (isEditing && currentLoading) {
    return <p className='event-form__status event-form__status--page'>{CALENDAR_CONTENT.form.loadingEvent}</p>
  }

  if (isEditing && (currentNotFound || currentError)) {
    return (
      <p className='event-form__error' role='alert'>
        {currentNotFound ? CALENDAR_CONTENT.detail.notFound : currentError}
      </p>
    )
  }

  return (
    <form className='event-form' onSubmit={handleSubmit}>
      <header className='event-form__bar'>
        <button
          type='button'
          className='event-form__cancel'
          onClick={() => navigate(-1)}
          disabled={saving}
        >
          {CALENDAR_CONTENT.form.cancel}
        </button>
        <h1 className='event-form__heading'>
          {isEditing ? CALENDAR_CONTENT.form.editHeading : CALENDAR_CONTENT.form.heading}
        </h1>
        <button type='submit' className='event-form__save' disabled={saving}>
          {saving ? CALENDAR_CONTENT.form.saving : CALENDAR_CONTENT.form.save}
        </button>
      </header>

      {(validationError || submitError) && (
        <p className='event-form__error' role='alert'>
          {validationError ?? submitError}
        </p>
      )}

      <section className='event-form__card'>
        <div className='event-form__row'>
          <FormField label={CALENDAR_CONTENT.form.title} htmlFor='event-title'>
            <FormInput
              id='event-title'
              type='text'
              value={title}
              onChange={(changeEvent) => {
                setTitle(changeEvent.target.value)
                setValidationError(null)
              }}
            />
          </FormField>
        </div>

        <div className='event-form__row'>
          <FormField label={CALENDAR_CONTENT.form.date} htmlFor='event-date'>
            <FormInput
              id='event-date'
              type='date'
              value={date}
              onChange={(changeEvent) => {
                setDate(changeEvent.target.value)
                setValidationError(null)
              }}
            />
          </FormField>
          <label className='event-form__all-day' htmlFor='event-all-day'>
            <input
              id='event-all-day'
              type='checkbox'
              className='event-form__checkbox'
              checked={allDay}
              onChange={() => {
                setAllDay((current) => !current)
                setValidationError(null)
              }}
            />
            <span className='event-form__all-day-text'>{CALENDAR_CONTENT.form.allDay}</span>
          </label>
        </div>

        {!allDay && (
          <div className='event-form__row event-form__row--times'>
            <FormField label={CALENDAR_CONTENT.form.start} htmlFor='event-start'>
              <FormInput
                id='event-start'
                type='time'
                value={startTime}
                onChange={(changeEvent) => {
                  setStartTime(changeEvent.target.value)
                  setValidationError(null)
                }}
              />
            </FormField>
            <FormField label={CALENDAR_CONTENT.form.end} htmlFor='event-end'>
              <FormInput
                id='event-end'
                type='time'
                value={endTime}
                onChange={(changeEvent) => {
                  setEndTime(changeEvent.target.value)
                  setValidationError(null)
                }}
              />
            </FormField>
          </div>
        )}

        <div className='event-form__row event-form__row--recurrence'>
          <FormField label={CALENDAR_CONTENT.form.recurrence} htmlFor='event-recurrence'>
            <FormSelect
              id='event-recurrence'
              value='none'
              disabled
              title={CALENDAR_CONTENT.form.recurrenceHint}
              onChange={() => undefined}
            >
              <option value='none'>{CALENDAR_CONTENT.form.recurrenceValue}</option>
            </FormSelect>
          </FormField>
        </div>
      </section>

      <section className='event-form__card'>
        <div className='event-form__attendees-head'>
          <span className='event-form__label'>{CALENDAR_CONTENT.form.attendees}</span>
          <label className='event-form__toggle-pill event-form__toggle-pill--all' htmlFor='attendee-all'>
            <span className='event-form__toggle'>
              <input
                id='attendee-all'
                type='checkbox'
                className='event-form__toggle-input'
                checked={allStudents}
                onChange={toggleAllStudents}
              />
              <span className='event-form__toggle-track' aria-hidden='true' />
              <span className='event-form__toggle-knob' aria-hidden='true' />
            </span>
            <span className='event-form__toggle-text'>{CALENDAR_CONTENT.form.allStudents}</span>
          </label>
        </div>

        <div className='event-form__attendees'>
          {studentsLoading && (
            <p className='event-form__status'>{CALENDAR_CONTENT.form.loadingStudents}</p>
          )}
          {!studentsLoading && students.length === 0 && (
            <p className='event-form__status'>{CALENDAR_CONTENT.form.noStudents}</p>
          )}

          {students.map((student) => {
            const pillColor = student.color ?? NEUTRAL_EVENT_COLOR

            return (
              <label
                key={student.id}
                className='event-form__toggle-pill'
                htmlFor={`attendee-${student.id}`}
                style={{ backgroundColor: pillColor, color: readableTextColor(pillColor) }}
              >
                <span className='event-form__toggle'>
                  <input
                    id={`attendee-${student.id}`}
                    type='checkbox'
                    className='event-form__toggle-input'
                    checked={isAttendeeChecked(student.id)}
                    disabled={allStudents}
                    onChange={() => toggleStudent(student.id)}
                  />
                  <span className='event-form__toggle-track' aria-hidden='true' />
                  <span className='event-form__toggle-knob' aria-hidden='true' />
                </span>
                <span className='event-form__toggle-text'>{student.firstName}</span>
              </label>
            )
          })}
        </div>
      </section>

      <section className='event-form__card'>
        <div className='event-form__row'>
          <FormField label={CALENDAR_CONTENT.form.location} htmlFor='event-location'>
            <FormTextarea
              id='event-location'
              className='event-form__area'
              rows={2}
              value={location}
              onChange={(changeEvent) => setLocation(changeEvent.target.value)}
            />
          </FormField>
        </div>

        <div className='event-form__row'>
          <FormField label={CALENDAR_CONTENT.form.notes} htmlFor='event-notes'>
            <FormTextarea
              id='event-notes'
              className='event-form__area'
              rows={3}
              value={notes}
              onChange={(changeEvent) => setNotes(changeEvent.target.value)}
            />
          </FormField>
        </div>
      </section>

      {isEditing && current && (
        <div className='event-form__danger'>
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
              disabled={saving}
            >
              {CALENDAR_CONTENT.form.delete}
            </button>
          )}
        </div>
      )}
    </form>
  )
}

export default EventFormPage
