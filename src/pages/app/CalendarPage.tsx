import { useContext, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import type { CalendarEvent } from '../../types'
import type { Profile } from '../../utils/profile'
import { fetchCalendarEvents } from '../../store/calendarEventsSlice'
import { fetchStudents } from '../../store/studentsSlice'
import { CALENDAR_CONTENT, MONTH_NAMES } from '../../constants/calendar'
import {
  buildMonthCells,
  dateKeysBetween,
  formatLongDate,
  formatWeekRange,
  fromDateKey,
  groupEventsByDay,
  isDateKey,
  rangeFor,
  shiftDate,
  todayKey,
} from '../../utils/calendarDates'
import type { CalendarRangeKind } from '../../utils/calendarDates'
import DayCell from '../../components/calendar/DayCell'
import EventList from '../../components/calendar/EventList'
import WeekColumns from '../../components/calendar/WeekColumns'
import CalendarFilters from '../../components/calendar/CalendarFilters'
import { SidebarSlotContext } from '../../components/app/sidebarSlot'
import { useIsMobile } from '../../hooks/useIsMobile'
import {
  DEFAULT_PROFILE,
  MODE_PARAM,
  OVERRIDE_ALL,
  OVERRIDE_PARAM,
  STUDENT_PARAM,
  hasOverride,
  isUnknownProfile,
  matchesProfile,
  profileLabel,
  profileSearch,
  readCalendarScope,
  readProfile,
  sameProfile,
  serverStudentId,
} from '../../utils/profile'
import type { CalendarFilterValues, TimingFilter } from '../../components/calendar/CalendarFilters'

const { views } = CALENDAR_CONTENT

const RANGE_KINDS: CalendarRangeKind[] = ['day', 'week', 'month']
const TIMING_VALUES: TimingFilter[] = ['all', 'allDay', 'timed']

/**
 * Everything the view depends on lives in the query string: the range, the
 * month layout, the anchor date and all three filters. That makes a filtered
 * week linkable, survives a reload, and keeps the filters in place when the
 * range changes or a day cell is opened.
 */
const readDateKey = (params: URLSearchParams): string => {
  const date = params.get('date')
  return isDateKey(date) ? date : todayKey()
}

const readRangeKind = (params: URLSearchParams): CalendarRangeKind => {
  const value = params.get('range')
  return RANGE_KINDS.find((kind) => kind === value) ?? 'month'
}

const readTiming = (params: URLSearchParams): TimingFilter => {
  const value = params.get('timing')
  return TIMING_VALUES.find((timing) => timing === value) ?? 'all'
}

/**
 * Timing, search and the profile narrow what the server already scoped to the
 * range. A named student is the one filter the endpoint understands, so it is
 * already applied when it gets here: the other profiles are attendee counts,
 * which have no server counterpart.
 */
const applyClientFilters = (
  events: CalendarEvent[],
  timing: TimingFilter,
  search: string,
  scope: Profile
): CalendarEvent[] => {
  const needle = search.trim().toLowerCase()

  return events.filter((event) => {
    if (!matchesProfile(event, scope)) return false
    if (timing === 'allDay' && !event.allDay) return false
    if (timing === 'timed' && event.allDay) return false
    if (!needle) return true

    return [event.title, event.location, event.notes].some((field) =>
      (field ?? '').toLowerCase().includes(needle)
    )
  })
}

const CalendarPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const { items, loading, error } = useSelector((state: RootState) => state.calendarEvents)
  const { items: students, loaded: studentsLoaded } = useSelector(
    (state: RootState) => state.students
  )
  // Seven columns cannot work at phone width, so the week falls back to the
  // stacked list there. The other views are responsive in CSS alone.
  const isMobile = useIsMobile()

  const dateKey = readDateKey(searchParams)
  const rangeKind = readRangeKind(searchParams)
  const isGrid = rangeKind === 'month' && searchParams.get('view') !== 'list'

  // The profile the app is navigating with, and what this visit is actually
  // showing: the same thing unless the student dropdown has overridden it.
  const profile = readProfile(searchParams)
  const scope = readCalendarScope(searchParams)
  const overridden = hasOverride(searchParams)
  // Event links carry the profile, never the override, so a detour through an
  // event and back is the same journey as any other: the profile survives it,
  // the override does not.
  const eventLinkSearch = profileSearch(profile)

  const filterValues: CalendarFilterValues = {
    studentId: scope.kind === 'student' ? scope.studentId ?? '' : '',
    timing: readTiming(searchParams),
    search: searchParams.get('q') ?? '',
  }
  const { timing, search } = filterValues
  const studentId = serverStudentId(scope)

  const range = useMemo(() => rangeFor(rangeKind, dateKey), [rangeKind, dateKey])

  // The pills resolve names and colours from the roster, so a cold load or a
  // direct link needs the students as much as the events.
  useEffect(() => {
    dispatch(fetchStudents())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchCalendarEvents({ range, studentId }))
  }, [dispatch, range, studentId])

  const visibleEvents = useMemo(
    () => applyClientFilters(items, timing, search, scope),
    // Spread rather than the object, which is rebuilt from the URL each render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [items, timing, search, scope.kind, scope.studentId]
  )
  const eventsByDay = useMemo(() => groupEventsByDay(visibleEvents), [visibleEvents])
  const today = todayKey()

  /**
   * Writes the next view state without dropping the filters already set. The
   * updater form reads the live params rather than the ones this render closed
   * over, so two changes landing in the same tick cannot clobber each other.
   */
  const updateParams = (changes: Record<string, string | null>) => {
    setSearchParams((current) => {
      const next = new URLSearchParams(current)

      Object.entries(changes).forEach(([key, value]) => {
        if (value === null || value === '') next.delete(key)
        else next.set(key, value)
      })

      return next
    })
  }

  const openDay = (day: string) => updateParams({ range: 'day', date: day, view: null })

  /** The form reads the same date param the calendar anchors on. */
  const addEventOn = (day: string) => navigate(`/calendar/new?date=${day}`)

  const anchorDate = fromDateKey(dateKey)
  const rangeTitle =
    rangeKind === 'month'
      ? `${MONTH_NAMES[anchorDate.getMonth()]} ${anchorDate.getFullYear()}`
      : rangeKind === 'week'
        ? formatWeekRange(range.startDate, range.endDate)
        : formatLongDate(`${dateKey}T12:00:00`)

  const monthCells = useMemo(
    () => buildMonthCells(anchorDate.getFullYear(), anchorDate.getMonth()),
    [anchorDate]
  )
  const listDateKeys = useMemo(
    () => dateKeysBetween(range.startDate, range.endDate),
    [range]
  )

  // On desktop the filter panel belongs under the app nav, which the layout
  // owns. At phone width that slot sits above the whole page, so three filter
  // fields would push the dates off the first screen: there the panel renders
  // inline with the calendar's own controls instead, collapsed behind a toggle.
  const filterSlot = useContext(SidebarSlotContext)

  /**
   * The dropdown writes to the override param, never to the profile's own
   * studentId. That is the whole of how the two stay out of each other's way:
   * the profile is only ever written by the dashboard switcher, the override is
   * only ever written here, and nothing carries the override onward, so leaving
   * the calendar and coming back lands on the profile again.
   */
  const setStudentOverride = (value: string): string | null => {
    // Back to exactly what the profile already says: drop the override rather
    // than pinning the same answer twice.
    if (value === '' && profile.kind === 'everyone') return null
    if (value !== '' && profile.kind === 'student' && profile.studentId === value) return null

    return value === '' ? OVERRIDE_ALL : value
  }

  const filterPanel = (
    <CalendarFilters
      values={filterValues}
      students={students}
      collapsible={isMobile}
      scopeLabel={profileLabel(scope, students)}
      scopeIsDefault={sameProfile(scope, DEFAULT_PROFILE) && !overridden}
      profileLabel={overridden ? profileLabel(profile, students) : null}
      onResetToProfile={() => updateParams({ [OVERRIDE_PARAM]: null })}
      unknownProfile={studentsLoaded && isUnknownProfile(scope, students)}
      onResetToDefault={() =>
        updateParams({ [MODE_PARAM]: null, [STUDENT_PARAM]: null, [OVERRIDE_PARAM]: null })
      }
      onChange={(changes) => {
        const next = { ...filterValues, ...changes }
        updateParams({
          // Left out entirely unless the dropdown itself moved, so changing the
          // timing or the search never disturbs the override either way.
          ...(changes.studentId === undefined
            ? {}
            : { [OVERRIDE_PARAM]: setStudentOverride(next.studentId) }),
          timing: next.timing === 'all' ? null : next.timing,
          q: next.search || null,
        })
      }}
      onClear={() =>
        updateParams({ [OVERRIDE_PARAM]: null, timing: null, q: null })
      }
    />
  )

  return (
    <div className='calendar'>
      {!isMobile && filterSlot && createPortal(filterPanel, filterSlot)}

      <div className='calendar__inner'>
        <header className='calendar__toolbar'>
          <div className='calendar__month-nav'>
            <button
              type='button'
              className='calendar__arrow'
              onClick={() => updateParams({ date: shiftDate(rangeKind, dateKey, -1) })}
              aria-label={views.previous}
            >
              &lt;
            </button>
            <h1
              className={`calendar__month-name${
                rangeKind === 'week' ? ' calendar__month-name--week' : ''
              }`}
            >
              {rangeTitle}
            </h1>
            <button
              type='button'
              className='calendar__arrow'
              onClick={() => updateParams({ date: shiftDate(rangeKind, dateKey, 1) })}
              aria-label={views.next}
            >
              &gt;
            </button>
          </div>

          <button
            type='button'
            className='calendar__add calendar__add--tooltip-end'
            onClick={() => navigate(`/calendar/new?date=${dateKey}`)}
            data-tooltip={CALENDAR_CONTENT.grid.newEventLabel}
            aria-label={CALENDAR_CONTENT.grid.newEventLabel}
          >
            +
          </button>
        </header>

        <div className='calendar__toggles'>
          <div className='calendar__toggle-group' role='group' aria-label={views.rangeLabel}>
            {RANGE_KINDS.map((kind) => (
              <button
                key={kind}
                type='button'
                className={`calendar__toggle${rangeKind === kind ? ' calendar__toggle--active' : ''}`}
                aria-pressed={rangeKind === kind}
                onClick={() => updateParams({ range: kind === 'month' ? null : kind })}
              >
                {views[kind]}
              </button>
            ))}
          </div>

          <button
            type='button'
            className='calendar__toggle calendar__toggle--today'
            onClick={() => updateParams({ date: today })}
          >
            {views.today}
          </button>

          {/* Grid and list are a month choice: week and day are always lists. */}
          {rangeKind === 'month' && (
            <div className='calendar__toggle-group' role='group' aria-label={views.viewLabel}>
              <button
                type='button'
                className={`calendar__toggle${isGrid ? ' calendar__toggle--active' : ''}`}
                aria-pressed={isGrid}
                onClick={() => updateParams({ view: null })}
              >
                {views.grid}
              </button>
              <button
                type='button'
                className={`calendar__toggle${isGrid ? '' : ' calendar__toggle--active'}`}
                aria-pressed={!isGrid}
                onClick={() => updateParams({ view: 'list' })}
              >
                {views.list}
              </button>
            </div>
          )}
        </div>

        {isMobile && filterPanel}

        {error && <p className='calendar__error'>{error}</p>}
        {loading && <p className='calendar__status'>{CALENDAR_CONTENT.grid.loading}</p>}

        {isGrid ? (
          <>
            <div className='calendar__grid'>
              {CALENDAR_CONTENT.grid.weekdays.map((weekday, index) => (
                <div key={`${weekday}-${index}`} className='calendar__weekday'>
                  {weekday}
                </div>
              ))}

              {monthCells.map((cell, index) => (
                <DayCell
                  key={cell.key ?? `blank-${index}`}
                  dateKey={cell.key}
                  dayNumber={cell.dayNumber}
                  events={cell.key ? eventsByDay[cell.key] ?? [] : []}
                  students={students}
                  isToday={cell.key === today}
                  onOpenDay={openDay}
                  onAddEvent={addEventOn}
                  linkSearch={eventLinkSearch}
                />
              ))}
            </div>

            {!loading && !error && visibleEvents.length === 0 && (
              <p className='calendar__status'>{CALENDAR_CONTENT.grid.empty}</p>
            )}
          </>
        ) : rangeKind === 'week' && !isMobile ? (
          <WeekColumns
            dateKeys={listDateKeys}
            eventsByDay={eventsByDay}
            students={students}
            todayKey={today}
            linkSearch={eventLinkSearch}
            onAddEvent={addEventOn}
          />
        ) : (
          <EventList
            dateKeys={listDateKeys}
            eventsByDay={eventsByDay}
            students={students}
            todayKey={today}
            linkSearch={eventLinkSearch}
          />
        )}
      </div>
    </div>
  )
}

export default CalendarPage
