import { PROFILE_CONTENT } from './profile'

/** Every string the dashboard renders, kept out of the components. */
export const DASHBOARD_CONTENT = {
  switcher: {
    heading: 'Select the Profile you want to view:',
    /** Names the radio group, since the visible heading is not a label. */
    groupLabel: 'Profile to view',
    teacher: PROFILE_CONTENT.teacher,
    everyone: PROFILE_CONTENT.everyone,
    students: PROFILE_CONTENT.students,
    /** Shown in place of the student chips before the roster arrives. */
    loading: 'Loading profiles',
    /** A teacher with nobody on the roster still gets the three fixed chips. */
    noStudents: 'No students yet. Add them in Settings to filter by child.',
    noStudentsLink: 'Go to Students',
    noStudentsPath: '/settings/students',
  },

  todaysItems: {
    heading: "Today's Items:",
    upcomingEvents: 'Upcoming Events',
    tasksToComplete: 'Tasks to Complete',
    tasksToCompleteLabel: 'See tasks due today',
    assignmentsToGrade: 'Assignments to be Graded',
    /** Sits where the count would be on a card that has no backend yet. */
    comingSoonCount: 'Soon',
    comingSoonHint: 'Coming soon',
    /** Read out after a disabled card's label so the state is announced. */
    unavailableNote: 'not available yet',
  },

  upcoming: {
    heading: 'Upcoming Events',
    seeMore: 'See More',
    seeMoreLabel: 'See more events in the calendar',
    addLabel: 'Add an event',
    addSymbol: '+',
    today: 'Today',
    tomorrow: 'Tomorrow',
    allDay: 'All day',
    untitled: 'Untitled event',
    loading: 'Loading events',
    empty: 'Nothing scheduled in the next 30 days.',
    /** The empty state changes meaning once a profile is narrowing the list. */
    emptyFiltered: 'Nothing scheduled in the next 30 days for this profile.',
    /** Nothing to show, and the schedule is not the reason. */
    emptyUnknown: 'No events to show while the selected student is not on this roster.',
  },

  tasks: {
    heading: 'Tasks Due',
    addLabel: 'Add a task',
    addSymbol: '+',
    seeMore: 'See More',
    seeMoreLabel: 'See all tasks',
    loading: 'Loading tasks',
    empty: 'Nothing to do right now.',
    /** Named separately: the panel lists open tasks, so this is not "no tasks". */
    allDone: 'Everything on your list is done.',
  },

  errors: {
    loadEvents: 'We could not load your events.',
  },
}

/** How far ahead the dashboard looks, and how many of those it lists. */
export const UPCOMING_DAYS = 30
export const UPCOMING_LIMIT = 5
