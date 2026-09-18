/**
 * The names of the profiles, and the calendar's copy about them. Shared,
 * because the dashboard picks a profile and the calendar reports which one it
 * is honouring: one vocabulary means one set of words for it.
 */
export const PROFILE_CONTENT = {
  teacher: 'Teacher',
  everyone: 'Teacher & Students',
  students: 'All Students',
  /** A student id in the URL that is not on the roster any more. */
  unknownStudent: 'Former student',

  // A link can outlive the student it names. This explains the empty result
  // rather than letting it read as a page that failed to load.
  unknownHeading: 'That student is not on this roster.',
  unknownNote: 'They may have been removed since this link was made.',
  unknownReset: 'Show Teacher & Students',

  viewing: 'Viewing',
  profile: 'Profile',
  overrideSuffix: 'for this visit only',
  reset: 'Reset to profile',
  resetLabel: 'Reset the calendar to the selected profile',
}
