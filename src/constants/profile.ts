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

  viewing: 'Viewing',
  profile: 'Profile',
  overrideSuffix: 'for this visit only',
  reset: 'Reset to profile',
  resetLabel: 'Reset the calendar to the selected profile',
}
