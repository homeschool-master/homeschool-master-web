/**
 * Every string the grades pages render. Templates carry {named} placeholders
 * filled by fillTemplate, so the wording stays here as plain data rather than
 * being assembled out of fragments at the call site.
 */
export const GRADES_CONTENT = {
  page: {
    eyebrow: 'Planning',
    heading: 'Grades',
    subhead: 'The work you set, what each student earned, and how it adds up.',
  },

  views: {
    label: 'View',
    assignments: 'Assignments',
    progress: 'Progress',
  },

  filters: {
    subjectLabel: 'Subject',
    allSubjects: 'All subjects',
    markLabel: 'Marking',
    all: 'All',
    unmarked: 'Needs marking',
    marked: 'Fully marked',
  },

  /**
   * Each filter combination needs its own wording: an empty list under a
   * subject filter means something different from an empty one under no
   * filter, and only the second is a first visit.
   */
  empty: {
    all: 'No assignments yet. Add your first one with the button above.',
    unmarked: 'Nothing is waiting to be marked.',
    marked: 'Nothing is fully marked yet.',
    subject: 'No assignments in this subject. Change the subject filter above to see the rest.',
    subjectAndMark: 'Nothing in this subject matches that marking filter. Change either filter above to see more.',
    noSubjects: 'Add a subject in Settings first: every assignment belongs to one.',
  },

  loading: 'Loading assignments',
  addButton: 'Add an assignment',
  scoreAction: 'Score',
  editAction: 'Edit',
  removeAction: 'Remove',

  row: {
    /** Only the marked figure is at a glance: the detail is in the score panel. */
    marked: '{marked} of {total} marked',
    noStudents: 'Not given to anyone yet',
    outOf: 'Out of {points}',
    noDueDate: 'No due date',
    unknownSubject: 'Subject removed',
  },

  /**
   * Weight in words. The number alone means nothing to a teacher who has never
   * weighted anything, so the form says what it does in a sentence and the row
   * carries the short form whenever it is not the ordinary 1.
   */
  weight: {
    sentence: {
      zero: 'Not counted towards the average. Useful for practice work you still want to hand out and mark.',
      normal: 'Counts as much as any other ordinary piece of work.',
      half: 'Counts half as much as ordinary work.',
      double: 'Counts twice as much as ordinary work.',
      triple: 'Counts three times as much as ordinary work.',
      other: 'Counts {factor} times as much as ordinary work.',
    },
    chip: {
      zero: 'Not counted',
      half: 'Counts half',
      double: 'Counts double',
      triple: 'Counts triple',
      other: 'Counts {factor}x',
    },
  },

  form: {
    addTitle: 'Add an assignment',
    editTitle: 'Edit assignment',
    subject: 'Subject',
    subjectPlaceholder: 'Choose a subject',
    title: 'Title',
    titlePlaceholder: 'Chapter 4 problems',
    description: 'Notes',
    descriptionPlaceholder: 'Odd numbered questions only',
    dueDate: 'Due date',
    dueDateHint: 'Optional, but work with no due date counts towards no report period.',
    pointsPossible: 'Out of',
    pointsPossibleHint: 'What a perfect piece of work scores. Marking out of 100 means you can type the percentage straight in; marking pass or fail means 1.',
    weight: 'Weight',
    weightHint: 'How much this counts towards the subject average next to other work. Leave it at 1 for ordinary work.',
    students: 'Given to',
    studentsHint: 'Each student gets their own row to mark.',
    noStudents: 'Add a student in Settings before setting work.',
    loadingStudents: 'Loading students',
    /** Unassigning deletes the score with the row, so the form says so first. */
    removalWarning: 'Taking a student off this assignment deletes the mark recorded against them as well.',
    save: 'Save assignment',
    saving: 'Saving',
    cancel: 'Cancel',
  },

  validation: {
    subject: 'Choose a subject for this assignment',
    title: 'Give the assignment a title',
    titleLength: 'Keep the title under 255 characters',
    pointsPossible: 'Points must be a number above zero',
    weight: 'Weight must be a number, zero or more',
  },

  score: {
    heading: 'Score {title}',
    outOf: 'Out of {points}',
    /** The one rule that is easy to get wrong, said where marks are entered. */
    hint: 'Leave a box empty for work you have not marked yet. Empty is not the same as 0: empty stays out of the average, 0 counts in it as a zero.',
    notMarked: 'Not marked',
    over: 'Extra credit',
    noStudents: 'This assignment is not given to anyone yet. Edit it to add students.',
    unknownStudent: 'Student removed',
    save: 'Save scores',
    saving: 'Saving',
    cancel: 'Cancel',
    unchanged: 'Nothing changed',
    inputLabel: 'Points earned by {name}',
  },

  remove: {
    heading: 'Remove this assignment?',
    body: 'It will be deleted for good, and every mark recorded against it goes with it. This one cannot be undone.',
    confirm: 'Remove assignment',
    removing: 'Removing',
    cancel: 'Keep it',
  },

  progress: {
    studentLabel: 'Student',
    fromLabel: 'From',
    toLabel: 'To',
    presetLabel: 'Period',
    thisMonth: 'This month',
    schoolYear: 'School year so far',
    /** Says what the figure is, since a weighted mean is not an obvious one. */
    explainer: 'Each subject average weighs every assignment by its own weight, not by how many points it was out of. Work you have not marked is left out rather than counted as zero, so the counts below say how much of the period the figure covers.',
    overall: 'Overall',
    notMarked: 'No marks yet',
    counts: '{graded} of {assigned} marked',
    ungraded: '{ungraded} still to mark',
    points: '{earned} of {possible} points',
    loading: 'Loading progress',
    invalidRange: 'The From date has to come before the To date.',

    /**
     * An empty report has several causes and they are not interchangeable.
     * Pointing at the date range when the work was never set sends a teacher
     * to fiddle with two dates that were never the problem, so each cause
     * names the one next step that actually changes the answer, and links to
     * wherever that step is taken.
     */
    empty: {
      noStudents: 'There is nobody to report on yet.',
      noStudentsAction: 'Add a student in Settings',
      /** Subjects come first because an assignment cannot exist without one. */
      noSubjects: 'Every assignment belongs to a subject, and there are none yet.',
      noSubjectsAction: 'Add a subject in Settings',
      noAssignments: 'No work has been set yet, so there is nothing to roll up.',
      noAssignmentsAction: 'Add an assignment',
      /**
       * Separate from having no assignments at all: the work exists, this
       * student is just not on any of it, so the step is editing a piece of
       * work rather than creating one.
       */
      unassigned: '{name} is not on any assignment yet, so no date range will show anything.',
      unassignedAction: 'Put them on an assignment',
      /**
       * Undated work belongs to no report period, so widening the dates can
       * never surface it. Saying "try a wider range" here would be advice that
       * cannot work.
       */
      allUndated: 'The work {name} holds has no due dates, and undated work counts towards no period.',
      allUndatedAction: 'Give it a due date',
      /** The only cause the date range actually answers. */
      range: 'Nothing {name} holds is due between these dates. Widen the range to see more.',
    },
  },

  errors: {
    load: 'We could not load your assignments.',
    create: 'We could not save that assignment.',
    update: 'We could not save that change.',
    remove: 'We could not remove that assignment.',
    score: 'We could not save those scores.',
    progress: 'We could not load that progress report.',
  },
}
