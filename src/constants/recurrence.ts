/**
 * The copy for repeating anything, shared by calendar events and tasks.
 *
 * Every word here is about the rule or about how far an edit reaches, and
 * neither of those is a calendar idea: a lesson and a to-do repeat on the same
 * terms. The two nouns that do differ, "event" and "task", are supplied by the
 * caller rather than written into the shared strings.
 */
export const RECURRENCE_CONTENT = {
  frequencyLabel: 'Does this repeat?',
  none: 'Does not repeat',
  daily: 'Every day',
  weekly: 'Every week',
  monthly: 'Every month',
  yearly: 'Every year',

  weekdays: 'On these days',
  weekdaysHint: 'Pick more than one and it is still a single series.',
  weekdayNames: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

  monthlyAnchor: 'Each month, on',
  monthlyByDate: 'The same date',
  monthlyByPosition: 'The same weekday',
  /**
   * Says what the app does about the months that have no such day, because it
   * is the one thing about a monthly repeat that surprises people.
   */
  monthlyByDateHint: 'A month without that date is skipped rather than moved.',
  monthlyByPositionHint: 'A month without that weekday is skipped rather than moved.',

  untilDate: 'Until',
  /**
   * A date rather than a number of times. Expanding on read means "the tenth
   * occurrence" cannot be answered without counting from the beginning of the
   * series every time any window is drawn, while a date is a comparison.
   */
  untilHint: 'Optional. Leave it blank and it repeats indefinitely.',

  /** Shown on a row so a series is recognisable at a glance. */
  seriesBadge: 'Repeats',
}

/**
 * Choosing how far an edit or a deletion of one occurrence reaches. The two
 * headings name the thing being changed, because "this repeats" is only
 * meaningful when you know what "this" is.
 */
export const SERIES_SCOPE_CONTENT = {
  this: 'This occurrence',
  thisAndFuture: 'This and all later ones',
  all: 'Every occurrence',
  thisHint: 'The others stay as they are.',
  thisAndFutureHint: 'The ones before it stay as they are.',
  allHint: 'Including the ones already past.',
  confirmEdit: 'Save',
  confirmDelete: 'Delete',
  cancel: 'Cancel',
}
