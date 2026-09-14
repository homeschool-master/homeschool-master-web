import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import { fetchCalendarEvents } from '../../store/calendarEventsSlice'
import { CALENDAR_CONTENT, MONTH_NAMES } from '../../constants/calendar'
import {
  buildMonthCells,
  groupEventsByDay,
  monthKey,
  monthRange,
  parseMonthKey,
  todayKey,
} from '../../utils/calendarDates'
import DayCell from '../../components/calendar/DayCell'

const currentMonth = () => {
  const now = new Date()
  return { year: now.getFullYear(), month: now.getMonth() }
}

const CalendarPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const { items, loading, error } = useSelector((state: RootState) => state.calendarEvents)

  // The visible month lives in the query string rather than component state, so
  // saving an event can return here on the month it was created in and the view
  // survives a reload.
  const monthParam = searchParams.get('month')
  const visibleMonth = useMemo(
    () => parseMonthKey(monthParam) ?? currentMonth(),
    [monthParam]
  )
  const visibleKey = monthKey(visibleMonth.year, visibleMonth.month)

  const range = useMemo(
    () => monthRange(visibleMonth.year, visibleMonth.month),
    [visibleMonth]
  )

  useEffect(() => {
    dispatch(fetchCalendarEvents(range))
  }, [dispatch, range])

  const cells = useMemo(
    () => buildMonthCells(visibleMonth.year, visibleMonth.month),
    [visibleMonth]
  )
  const eventsByDay = useMemo(() => groupEventsByDay(items), [items])
  const today = todayKey()

  const changeMonth = (delta: number) => {
    const next = new Date(visibleMonth.year, visibleMonth.month + delta, 1)
    setSearchParams({ month: monthKey(next.getFullYear(), next.getMonth()) })
  }

  return (
    <div className='calendar'>
      <div className='calendar__inner'>
        <header className='calendar__toolbar'>
          <div className='calendar__month-nav'>
            <button
              type='button'
              className='calendar__arrow'
              onClick={() => changeMonth(-1)}
              aria-label={CALENDAR_CONTENT.grid.previousMonthLabel}
            >
              &lt;
            </button>
            <h1 className='calendar__month-name'>
              {MONTH_NAMES[visibleMonth.month]} {visibleMonth.year}
            </h1>
            <button
              type='button'
              className='calendar__arrow'
              onClick={() => changeMonth(1)}
              aria-label={CALENDAR_CONTENT.grid.nextMonthLabel}
            >
              &gt;
            </button>
          </div>

          <button
            type='button'
            className='calendar__add'
            onClick={() => navigate(`/calendar/new?month=${visibleKey}`)}
            aria-label={CALENDAR_CONTENT.grid.newEventLabel}
          >
            +
          </button>
        </header>

        {error && <p className='calendar__error'>{error}</p>}
        {loading && <p className='calendar__status'>{CALENDAR_CONTENT.grid.loading}</p>}

        <div className='calendar__grid'>
          {CALENDAR_CONTENT.grid.weekdays.map((weekday, index) => (
            <div key={`${weekday}-${index}`} className='calendar__weekday'>
              {weekday}
            </div>
          ))}

          {cells.map((cell, index) => (
            <DayCell
              key={cell.key ?? `blank-${index}`}
              dayNumber={cell.dayNumber}
              events={cell.key ? eventsByDay[cell.key] ?? [] : []}
              isToday={cell.key === today}
            />
          ))}
        </div>

        {!loading && !error && items.length === 0 && (
          <p className='calendar__status'>{CALENDAR_CONTENT.grid.empty}</p>
        )}
      </div>
    </div>
  )
}

export default CalendarPage
