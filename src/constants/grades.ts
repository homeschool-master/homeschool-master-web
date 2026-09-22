import type { GradeLetter } from '../types'

/**
 * Every string the grades pages render. Templates carry {named} placeholders
 * filled by fillTemplate, so the wording stays here as plain data rather than
 * being assembled out of fragments at the call site.
 */
/**
 * What each letter is worth, mirroring LetterScale on the server.
 *
 * Held here because the key has to be drawn on the page and the box has to
 * fill in as soon as a letter is picked, neither of which can wait for a round
 * trip. The server is still the authority: it recomputes the score from the
 * letter it is sent, so if these ever drifted the saved mark would be the
 * server's and the box would correct itself, rather than a wrong number being
 * stored.
 *
 * Each value sits in the middle of its band under the 90/80/70/60 scale, which
 * is what makes an entered A average back out as an A.
 */
export const LETTER_SCALE: { letter: GradeLetter; percentage: number }[] = [
  { letter: 'A', percentage: 95 },
  { letter: 'B', percentage: 85 },
  { letter: 'C', percentage: 75 },
  { letter: 'D', percentage: 65 },
  { letter: 'F', percentage: 50 },
]

export const GRADES_CONTENT = {
  page: {
    eyebrow: 'Planning',
    heading: 'Grades',
    subhead: 'How the work you have set and marked adds up, by subject.',
  },

  /** The working section: setting work and marking it. */
  assignmentsPage: {
    eyebrow: 'Planning',
    heading: 'Assignments',
    subhead: 'The work you set, who holds it, and what each student earned.',
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
  /** Carries a count when there are any, so a row says it has files. */
  documentsAction: 'Documents',
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
    assignmentType: 'Kind of work',
    assignmentTypeHint: 'Sets the starting weight below. Manage your types in Settings.',
    weight: 'Weight',
    weightHint: 'How much this counts towards the subject average next to other work. Leave it at 1 for ordinary work.',
    /**
     * The worked example, for a parent who has never weighted anything. A bare
     * "3" reads as a quantity rather than as a multiplier, and the sentence
     * that fixes that is too long to sit under every form field, so it rides
     * on the hint control beside the label.
     */
    weightTooltip:
      'Weight is how many times a piece of work counts. A test at 3 counts as if it appeared three times next to ordinary work at 1. At 0 it is marked but kept out of the average.',
    weightTooltipLabel: 'What does weight mean?',
    /** Says which way the number in the box got there, and what follows from it. */
    weightFromType: 'This is what {name} counts by default. Changing that default later will move this too.',
    weightOverridden: 'You set this weight yourself, so changing what {name} counts by default will leave it alone.',
    /** The way back, once a weight is hers. */
    weightUseDefault: 'Use the {name} default instead',
    /**
     * Shown above a weight of more than five, on an assignment or on a type.
     *
     * It exists for one mistake: typing 30 when 3 was meant. A weight like
     * that lets a single piece of work swallow a subject average, and without
     * this there is nothing on screen saying so. It warns and does not block,
     * because a large weight is a real thing to want.
     */
    weightLarge:
      'That is a large weight. This will count {factor} times as much as an ordinary piece of work, so it will dominate the subject average. If you meant a smaller number, change it now. You can still save it.',
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
    assignmentType: 'Choose a kind of work',
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
    /**
     * Letter entry. The key is rendered from the same values the server maps
     * with, and it sits in the open beside the boxes rather than behind a
     * toggle: a teacher typing A has to be able to see that it is becoming a
     * number, and what number.
     */
    byPercentage: 'By points',
    byLetter: 'By letter',
    entryLabel: 'How are you marking?',
    keyHeading: 'What each letter is worth',
    keyNote: 'A letter is stored as its score, so it averages in like any other mark. The letter you picked is remembered.',
    letterLabel: 'Letter for {name}',
    letterClear: 'Not marked',
    letterWorth: '{letter} is {percentage}%',
    enteredAsLetter: 'Entered as {letter}',
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

    /**
     * The gradebook itself: every piece of work behind the figures. The list
     * sits under the subject it belongs to, because that subject's percentage
     * is the sum of exactly those rows, and seeing them together is what makes
     * the number checkable rather than a claim.
     */
    book: {
      heading: 'The work behind these figures',
      subjectWork: 'Work in {name}',
      /** Column headings, shown once per subject on desktop. */
      columnWork: 'Work',
      columnGrade: 'Grade',
      columnScore: 'Score',
      notMarked: 'Not marked',
      notMarkedHint: 'Left out of the average until it is marked.',
      notCounted: 'Not counted',
      notCountedHint: 'Marked, but weighted zero, so it moves no average.',
      enteredAsLetter: 'You entered {letter}',
      outOf: '{earned} of {possible}',
      /** Unmarked work has no earned half to report, only what it is out of. */
      outOfOnly: 'Out of {possible}',
      noDueDate: 'No due date',
      openAction: 'Open in Assignments',
      openLabel: 'Open {title} in Assignments',

      /**
       * Undated work, in its own block below the figures rather than inside
       * them. Out in the open with its reason stated, because a teacher who
       * cannot find a piece of work in the report needs to be told where it
       * went, not left to widen the dates forever.
       */
      undatedHeading: 'Work with no due date',
      undatedNote:
        'Undated work belongs to no period, so none of the figures above include it. Give a piece of work a due date to bring it into a report.',
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
