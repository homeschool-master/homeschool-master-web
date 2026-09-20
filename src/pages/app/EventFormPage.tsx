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
import FormField, { FormInput, FormTextarea } from '../../components/shared/FormField'
import EventDeleteConfirm from '../../components/calendar/EventDeleteConfirm'
import RecurrenceFields from '../../components/shared/RecurrenceFields'
import SeriesScopeChoice from '../../components/shared/SeriesScopeChoice'
import { CALENDAR_CONTENT, NEUTRAL_EVENT_COLOR } from '../../constants/calendar'
import {
  browserTimeZone,
  isDateKey,
  isoToDateKey,
  isoToTimeValue,
  localDayEndIso,
  localDayStartIso,
  localToUtcIso,
  toDateKey,
} from '../../utils/calendarDates'
import { readableTextColor } from '../../utils/studentColor'
import type { Recurrence, SeriesScope } from '../../types'

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

  // The calendar passes the day it was anchored on, so creating from a day or a
  // week lands on that date rather than today.
  const dateParam = searchParams.get('date')
  const defaultDate = useMemo(
    () => (isDateKey(dateParam) ? dateParam : toDateKey(new Date())),
    [dateParam]
  )

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
  const [recurrence, setRecurrence] = useState<Recurrence | null>(null)
  // Set while the teacher is being asked how far a change to a series reaches.
  const [pendingScope, setPendingScope] = useState<'edit' | 'delete' | null>(null)

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
    setSelectedIds(current.attendeeIds)
    setLocation(current.location ?? '')
    setNotes(current.notes ?? '')
    setRecurrence(current.recurrence)
  }

  // An occurrence carries its series id; an ordinary event does not. Only the
  // first needs the three way choice, and only it can be edited narrowly.
  const isOccurrence = Boolean(current?.seriesId)
  const editingOneOccurrence = isEditing && isOccurrence

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

  const handleSubmit = (submitEvent: React.FormEvent) => {
    submitEvent.preventDefault()

    const problem = validate()
    if (problem) {
      setValidationError(problem)
      return
    }
    setValidationError(null)

    // Saving one occurrence of a series has three possible meanings, so it
    // asks rather than picking one and rewriting days nobody looked at.
    if (editingOneOccurrence) {
      setPendingScope('edit')
      return
    }

    void save()
  }

  const save = async (scope?: SeriesScope) => {
    // The submitted attendee list replaces the set outright, so it is always
    // the full intended roster for the event rather than a delta.
    const attendeeIds = allStudents ? students.map((student) => student.id) : selectedIds

    const fields = {
      title: title.trim(),
      notes: notes.trim() || null,
      location: location.trim() || null,
      startTime: allDay ? localDayStartIso(date) : localToUtcIso(date, startTime),
      endTime: allDay ? localDayEndIso(date) : localToUtcIso(date, endTime),
      allDay,
      studentIds: attendeeIds,
    }

    if (isEditing && id) {
      // createdTimeZone is create only and is deliberately absent here.
      // The rule is sent only when the whole series is in scope: a narrower
      // edit detaches or splits, and neither of those redefines the rule.
      const result = await dispatch(
        updateCalendarEvent({
          id,
          input: scope && scope !== 'all' ? fields : { ...fields, recurrence },
          scope,
        })
      )
      if (updateCalendarEvent.fulfilled.match(result)) {
        navigate(`/calendar?date=${date}`)
      }
      return
    }

    const result = await dispatch(
      createCalendarEvent({ ...fields, recurrence, createdTimeZone: browserTimeZone() })
    )

    if (createCalendarEvent.fulfilled.match(result)) {
      navigate(`/calendar?date=${date}`)
    }
  }

  const handleDelete = async (scope?: SeriesScope) => {
    if (!id || !current) return
    const eventDate = isoToDateKey(current.startTime)
    const result = await dispatch(deleteCalendarEvent({ id, scope }))
    if (deleteCalendarEvent.fulfilled.match(result)) navigate(`/calendar?date=${eventDate}`)
  }

  // An occurrence asks how far to reach; an ordinary event asks only whether
  // the teacher is sure, which is the confirmation it has always had.
  const startDelete = () => {
    if (editingOneOccurrence) setPendingScope('delete')
    else setConfirmingDelete(true)
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
      {pendingScope && (
        <div className='event-form__scope'>
          <SeriesScopeChoice
            mode={pendingScope}
            heading={
              pendingScope === 'delete'
                ? CALENDAR_CONTENT.scope.deleteHeading
                : CALENDAR_CONTENT.scope.editHeading
            }
            busy={saving || deletingId !== null}
            onConfirm={(scope) => {
              setPendingScope(null)
              if (pendingScope === 'delete') void handleDelete(scope)
              else void save(scope)
            }}
            onCancel={() => setPendingScope(null)}
          />
        </div>
      )}

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
          {/* Editing one occurrence cannot change the rule: the rule belongs
              to the series, and the scope choice below is what decides how far
              a change reaches. */}
          <RecurrenceFields
            value={recurrence}
            onChange={setRecurrence}
            idPrefix='event'
            label={CALENDAR_CONTENT.form.recurrence}
            startDate={date}
            disabled={editingOneOccurrence}
          />
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
              onClick={startDelete}
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
