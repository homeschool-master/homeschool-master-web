export const CALENDAR_CONTENT = {
  grid: {
    weekdays: ['S', 'M', 'T', 'W', 'TH', 'F', 'S'],
    previousMonthLabel: 'Previous month',
    nextMonthLabel: 'Next month',
    newEventLabel: 'New event',
    loading: 'Loading your calendar...',
    empty: 'No events this month yet.',
    moreSuffix: 'more',
    untitledEvent: 'Untitled event',
    todayLabel: 'Today',
  },
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
    recurrenceHint: 'Repeating events are coming soon.',
    attendees: 'Attendees',
    allStudents: 'All Students',
    noStudents: 'No students yet. Add one before inviting attendees.',
    loadingStudents: 'Loading students...',
    location: 'Location',
    notes: 'Notes',
  },
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
