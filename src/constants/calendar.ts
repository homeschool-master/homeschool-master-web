export const CALENDAR_CONTENT = {
  grid: {
    weekdays: ['S', 'M', 'T', 'W', 'TH', 'F', 'S'],
    previousMonthLabel: 'Previous month',
    nextMonthLabel: 'Next month',
    newEventLabel: 'Add an event',
    loading: 'Loading your calendar...',
    empty: 'No events this month yet.',
    moreSuffix: 'more',
    untitledEvent: 'Untitled event',
    todayLabel: 'Today',
    openDayLabel: 'Open this day',
    /** Completed with the day itself, so each control names its own date. */
    addOnDayLabel: 'Add an event on',
    addOnDaySymbol: '+',
  },
  views: {
    rangeLabel: 'Date range',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    viewLabel: 'Month layout',
    grid: 'Grid',
    list: 'List',
    previous: 'Previous',
    next: 'Next',
    today: 'Today',
  },
  list: {
    empty: 'Nothing scheduled in this range.',
    noEventsOnDay: 'Nothing scheduled.',
    allDay: 'All day',
  },
  week: {
    eventCountLabel: 'events',
    attendeesLabel: 'Attendees',
    noAttendees: 'No students',
  },
  filters: {
    heading: 'Filters',
    student: 'Student',
    allStudents: 'All students',
    timing: 'Timing',
    timingAll: 'Any',
    timingAllDay: 'All day only',
    timingTimed: 'Timed only',
    search: 'Search',
    searchPlaceholder: 'Title, location or notes',
    clear: 'Clear filters',
    activeNote: 'Filters apply to every view.',
    // Mobile collapses the panel: the badge says how many filters are on, so a
    // hidden filter is never the unexplained reason a calendar looks empty.
    activeCountLabel: 'filters active',
  },
  /** Shown for an attendee id no longer on the roster: a removed student. */
  formerStudent: 'Former student',
  form: {
    heading: 'New Event',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    title: 'Title',
    date: 'Date',
    allDay: 'All Day',
    start: 'Start',
    end: 'End',
    recurrence: 'Is this event reoccurring?',
    recurrenceValue: 'Does not repeat',
    recurrenceDaily: 'Every day',
    recurrenceWeekly: 'Every week',
    recurrenceMonthly: 'Every month',
    recurrenceYearly: 'Every year',

    weekdays: 'On these days',
    weekdaysHint: 'Pick more than one and it is still a single series.',
    weekdayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    monthlyAnchor: 'Each month, on',
    monthlyByDate: 'The same date',
    monthlyByPosition: 'The same weekday',
    /**
     * Says what the app does about the months that have no such day, because
     * it is the one thing about a monthly repeat that surprises people.
     */
    monthlyByDateHint: 'A month without that date is skipped rather than moved.',
    monthlyByPositionHint: 'A month without that weekday is skipped rather than moved.',

    untilDate: 'Until',
    /**
     * A date rather than a number of times. Expanding on read means "the tenth
     * occurrence" cannot be answered without counting from the beginning of
     * the series every time any window is drawn, while a date is a comparison.
     */
    untilHint: 'Optional. Leave it blank and it repeats indefinitely.',
    attendees: 'Attendees',
    allStudents: 'All Students',
    noStudents: 'No students yet. Add one before inviting attendees.',
    loadingStudents: 'Loading students...',
    location: 'Location',
    notes: 'Notes',
    editHeading: 'Edit Event',
    delete: 'Delete',
    loadingEvent: 'Loading this event...',
  },
  detail: {
    backToCalendar: 'Back to calendar',
    heading: 'Event',
    allDay: 'All day',
    date: 'Date',
    time: 'Time',
    attendees: 'Attendees',
    location: 'Location',
    notes: 'Notes',
    noAttendees: 'No students on this event.',
    edit: 'Edit',
    delete: 'Delete',
    loading: 'Loading this event...',
    notFound: 'That event no longer exists. It may have been deleted.',
  },
  deleteConfirm: {
    heading: 'Delete this event?',
    body: 'It is removed for every student on it, and it cannot be brought back.',
    confirm: 'Delete',
    deleting: 'Deleting...',
    cancel: 'Cancel',
  },
  /** Choosing how far an edit or a deletion of one occurrence reaches. */
  scope: {
    editHeading: 'This event repeats. Which ones are you changing?',
    deleteHeading: 'This event repeats. Which ones are you deleting?',
    this: 'This occurrence',
    thisAndFuture: 'This and all later ones',
    all: 'Every occurrence',
    thisHint: 'The others stay as they are.',
    thisAndFutureHint: 'The ones before it stay as they are.',
    allHint: 'Including the ones already past.',
    confirmEdit: 'Save',
    confirmDelete: 'Delete',
    cancel: 'Cancel',
  },

  /** Shown on a row and on the detail page so a series is recognisable. */
  seriesBadge: 'Repeats',

  validation: {
    titleRequired: 'Please give the event a title.',
    dateRequired: 'Please choose a date.',
    timesRequired: 'Please choose a start and end time.',
    endBeforeStart: 'The end time must be after the start time.',
  },
  errors: {
    loadEvents: 'Could not load your calendar. Please try again.',
    loadStudents: 'Could not load your students. Please try again.',
    createEvent: 'Could not save this event. Please try again.',
    loadEvent: 'Could not load this event. Please try again.',
    updateEvent: 'Could not save your changes. Please try again.',
    deleteEvent: 'Could not delete this event. Please try again.',
  },
} as const

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

/** Pills for events with no attendees, and the fallback for a student with no color. */
export const NEUTRAL_EVENT_COLOR = '#f4e3c1'

/** Desktop shows three pills per cell, mobile two, then a "+N more" line. */
export const MAX_PILLS_DESKTOP = 3
export const MAX_PILLS_MOBILE = 2
