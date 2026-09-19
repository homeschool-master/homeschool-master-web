import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../store'
import type { CalendarEvent } from '../../types'
import { fetchCalendarEvents } from '../../store/calendarEventsSlice'
import { fetchStudents } from '../../store/studentsSlice'
import { fetchTasks, toggleTask } from '../../store/tasksSlice'
import {
  DASHBOARD_CONTENT,
  UPCOMING_DAYS,
  UPCOMING_LIMIT,
} from '../../constants/dashboard'
import { dueByToday, openTasks } from '../../utils/tasks'
import {
  eventDateKeys,
  fromDateKey,
  isoToDateKey,
  shiftDate,
  todayKey,
  upcomingEvents,
} from '../../utils/calendarDates'
import {
  DEFAULT_PROFILE,
  calendarHref,
  isUnknownProfile,
  matchesProfile,
  profileParams,
  readProfile,
  sameProfile,
  serverStudentId,
  withProfile,
} from '../../utils/profile'
import type { Profile } from '../../utils/profile'
import ProfileSwitcher from '../../components/dashboard/ProfileSwitcher'
import TodaysItems from '../../components/dashboard/TodaysItems'
import UpcomingEventsPanel from '../../components/dashboard/UpcomingEventsPanel'
import type { UpcomingDay } from '../../components/dashboard/UpcomingEventsPanel'
import TasksDuePanel from '../../components/dashboard/TasksDuePanel'

const { upcoming } = DASHBOARD_CONTENT

/** Today, Tomorrow, then the weekday and date for anything further out. */
const dayLabel = (dateKey: string, today: string, tomorrow: string): string => {
  if (dateKey === today) return upcoming.today
  if (dateKey === tomorrow) return upcoming.tomorrow

  return fromDateKey(dateKey).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

/** Groups the first few by the day they start on, keeping that order. */
const groupUpcoming = (events: CalendarEvent[], today: string): UpcomingDay[] => {
  const tomorrow = shiftDate('day', today, 1)
  const days: UpcomingDay[] = []

  events.slice(0, UPCOMING_LIMIT).forEach((event) => {
    const dateKey = isoToDateKey(event.startTime)
    const last = days[days.length - 1]

    if (last?.dateKey === dateKey) last.events.push(event)
    else days.push({ dateKey, label: dayLabel(dateKey, today, tomorrow), events: [event] })
  })

  return days
}

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [searchParams, setSearchParams] = useSearchParams()

  const { items: events, loading, error } = useSelector(
    (state: RootState) => state.calendarEvents
  )
  const { items: students, loaded: studentsLoaded } = useSelector(
    (state: RootState) => state.students
  )
  const {
    items: tasks,
    loading: tasksLoading,
    error: tasksError,
    togglingId: taskTogglingId,
  } = useSelector((state: RootState) => state.tasks)

  const profile = readProfile(searchParams)
  const today = todayKey()

  // A month ahead: enough that a light calendar still has something to show,
  // and still one request.
  const range = useMemo(
    () => ({ startDate: today, endDate: shiftDate('day', today, UPCOMING_DAYS) }),
    [today]
  )

  const studentId = serverStudentId(profile)

  useEffect(() => {
    dispatch(fetchStudents())
    dispatch(fetchTasks())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchCalendarEvents({ range, studentId }))
  }, [dispatch, range, studentId])

  // A named student is already filtered by the server: the other profiles have
  // no server counterpart, so they are applied to the loaded range here.
  const visible = useMemo(
    () => events.filter((event) => matchesProfile(event, profile)),
    [events, profile]
  )

  const ahead = useMemo(() => upcomingEvents(visible), [visible])
  const days = useMemo(() => groupUpcoming(ahead, today), [ahead, today])

  // The count card is today's remaining items, not the whole month ahead.
  const todayCount = useMemo(
    () => ahead.filter((event) => eventDateKeys(event).includes(today)).length,
    [ahead, today]
  )

  const selectProfile = (next: Profile) => {
    setSearchParams((current) => {
      const params = new URLSearchParams(current)

      Object.entries(profileParams(next)).forEach(([key, value]) => {
        if (value === null) params.delete(key)
        else params.set(key, value)
      })

      return params
    })
  }

  // An empty roster and a roster that has not arrived look identical, so the
  // claim waits until the request has settled.
  const unknownProfile = studentsLoaded && isUnknownProfile(profile, students)

  /**
   * The count card counts what is left of today, so it opens today, not the
   * month. See More continues the panel's own chronological list rather than
   * dropping the reader into a grid that is shaped nothing like it.
   */
  // Tasks belong to the teacher rather than to a student, so the profile does
  // not narrow them and these links carry none of it.
  const open = useMemo(() => openTasks(tasks), [tasks])
  const dueToday = useMemo(() => dueByToday(tasks, today), [tasks, today])

  const todayHref = calendarHref(profile, { range: 'day', date: today })
  const seeMoreHref = calendarHref(profile, { view: 'list', date: today })

  return (
    <div className='dashboard-home'>
      <ProfileSwitcher
        profile={profile}
        students={students}
        onSelect={selectProfile}
        unknownProfile={unknownProfile}
      />

      <TodaysItems
        upcomingCount={loading || error ? null : todayCount}
        tasksCount={tasksLoading || tasksError ? null : dueToday.length}
        eventsHref={todayHref}
        tasksHref='/tasks'
      />

      <section className='dashboard-home__panels'>
        <div className='dashboard-home__panels-inner'>
          <UpcomingEventsPanel
            days={days}
            loading={loading}
            error={error}
            filtered={!sameProfile(profile, DEFAULT_PROFILE)}
            unknownProfile={unknownProfile}
            seeMoreHref={seeMoreHref}
            addHref='/calendar/new'
            eventHref={(event) => withProfile(`/calendar/${event.id}`, profile)}
          />

          <TasksDuePanel
            openTasks={open}
            totalTasks={tasks.length}
            today={today}
            loading={tasksLoading}
            error={tasksError}
            togglingId={taskTogglingId}
            onToggle={(task) => dispatch(toggleTask({ id: task.id, completed: !task.completed }))}
          />
        </div>
      </section>
    </div>
  )
}

export default DashboardPage
