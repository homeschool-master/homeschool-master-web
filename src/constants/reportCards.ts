/** Every string the report cards section renders. */
export const REPORT_CARDS_CONTENT = {
  heading: 'Report cards',
  subhead:
    "A saved copy of a student's grades for a period. Once you issue one, it keeps saying what it said, even if you change a mark afterwards.",

  loading: 'Loading report cards',
  empty: 'No report cards yet.',
  emptyForStudent: 'No report cards for {name} yet.',
  addButton: 'New report card',

  draftBadge: 'Draft',
  issuedBadge: 'Issued',
  versionLabel: 'Version {version}',
  issuedOn: 'Issued {date}',
  periodLabel: '{start} to {end}',
  supersededNote:
    'This is version {version}. A later version has been issued, and that one is the current card.',

  /**
   * Said on a draft, where the figures move under the teacher as she marks.
   * Out in the open above the subjects, never behind a control: it is the
   * difference between a working document and the thing she hands over.
   */
  draftNote:
    'This is a draft. Its grades follow your marking and will keep changing until you issue it.',
  capturedNote:
    'This version carries the figures from the version it replaces, so editing it will not change any grade. Refresh to bring them up to date with your current marking.',
  issuedNote:
    'Issued {date}. This card is frozen: changing a mark now will not change it. Editing creates a new version and leaves this one as it is.',

  actions: {
    open: 'Open',
    edit: 'Edit',
    issue: 'Issue this card',
    issuing: 'Issuing',
    refresh: 'Refresh the figures',
    refreshing: 'Refreshing',
    remove: 'Delete draft',
    removing: 'Deleting',
    back: 'Back to report cards',
    viewVersion: 'View',
  },

  /** Asked before freezing, since issuing is the one step that cannot be undone. */
  issueConfirm: {
    heading: 'Issue this report card?',
    body: 'Issuing saves a copy of these grades as they are now. After that the card cannot be changed, and changing a mark will not change it. Editing it later creates a new version and keeps this one.',
    confirm: 'Issue it',
    cancel: 'Not yet',
  },

  removeConfirm: {
    heading: 'Delete this draft?',
    body: 'Nothing has been handed to anyone, so a draft can go. An issued card cannot be deleted.',
    confirm: 'Delete draft',
    cancel: 'Keep it',
  },

  form: {
    addTitle: 'New report card',
    editTitle: 'Edit report card',
    student: 'Student',
    title: 'Title',
    titlePlaceholder: 'Autumn term 2026',
    periodStart: 'Period from',
    periodEnd: 'Period to',
    comments: 'Overall comments',
    commentsPlaceholder: 'How the term went, in your own words',
    save: 'Save',
    saving: 'Saving',
    cancel: 'Cancel',
  },

  /** The subject lines, and what a teacher can put on them. */
  card: {
    subjectsHeading: 'Subjects',
    overallHeading: 'Overall',
    noSubjects: 'No work is recorded in this period, so there is nothing to report on yet.',
    calculated: 'Calculated',
    calculatedWas: 'Calculated: {letter}',
    overriddenBadge: 'Your grade',
    overrideLabel: 'Issue instead',
    overrideNone: 'Use the calculated grade',
    overrideReasonLabel: 'Why (optional)',
    overrideReasonPlaceholder: 'What the numbers do not show',
    commentsLabel: 'Comments',
    commentsPlaceholder: 'What to say about this subject',
    counts: '{graded} of {assigned} marked',
    points: '{earned} of {possible} points',
    notMarked: 'No marks yet',
    workHeading: 'Work behind this grade',
    /** Says the list is a copy, not a live query, on an issued card. */
    workCaptured: 'Saved with the card on {date}.',
  },

  versions: {
    heading: 'Versions',
    note: 'Every version stays readable. The highest number is the card that stands.',
  },

  validation: {
    student: 'Choose a student',
    title: 'Give the report card a title',
    period: 'The period has to end on or after it starts',
  },

  errors: {
    load: 'We could not load your report cards.',
    loadOne: 'We could not load that report card.',
    create: 'We could not create that report card.',
    update: 'We could not save that change.',
    issue: 'We could not issue that report card.',
    refresh: 'We could not refresh those figures.',
    remove: 'We could not delete that draft.',
  },
}
