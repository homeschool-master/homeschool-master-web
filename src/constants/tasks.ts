import { RECURRENCE_CONTENT, SERIES_SCOPE_CONTENT } from './recurrence'

/** Every string the tasks page and the dashboard task panel render. */
export const TASKS_CONTENT = {
  page: {
    eyebrow: 'Planning',
    heading: 'Tasks',
    subhead: 'Your own to-do list: the admin that keeps the school year running.',
  },

  filters: {
    label: 'Show',
    students: 'Students',
    allStudents: 'Everyone',
    open: 'To do',
    done: 'Done',
    all: 'All',
  },

  /**
   * The three filters each need their own empty state: they mean different
   * things. All is the default, so its wording is what someone sees on a first
   * visit with nothing on the list.
   */
  empty: {
    open: 'Nothing to do. Add a task when something comes up.',
    done: 'Nothing completed yet.',
    all: 'No tasks yet. Add your first one with the button above.',
  },

  /** Replaces the wording above when a student filter is what emptied it. */
  emptyForScope: {
    open: 'Nothing to do for {names}.',
    done: 'Nothing completed for {names} yet.',
    all: 'No tasks for {names}. Change the students above to see more.',
  },

  loading: 'Loading tasks',
  overdue: 'Overdue',
  dueToday: 'Due today',
  noDueDate: 'No due date',
  completedOn: 'Completed',
  /**
   * An occurrence says which day it was for as well as that it is done:
   * its due date is the only thing that tells it apart from the week
   * either side of it, and a row reading only "Completed" leaves a
   * ticked Monday sitting unidentified between Sunday and Tuesday.
   */
  completedOccurrence: '{date}, completed',
  /** Announced with the checkbox, since the visible label is the title alone. */
  completeLabel: 'Mark complete',
  uncompleteLabel: 'Mark not complete',

  /**
   * Who a task involves and whose job it is, said as one phrase. The two are
   * separate fields because they answer different questions, but a reader
   * scanning a list needs them together.
   */
  ownership: {
    teacherAbout: 'About {names}',
    student: '{names} to do',
    shared: '{names} and you',
    formerStudent: 'a former student',
  },

  addButton: 'Add a task',
  editAction: 'Edit',
  removeAction: 'Remove',

  /** Shown on a row so a repeating task is recognisable before it is opened. */
  seriesBadge: RECURRENCE_CONTENT.seriesBadge,

  /**
   * The same three way choice the calendar asks, named for a task. The nouns
   * differ and nothing else does, which is why only the headings live here.
   */
  scope: {
    ...SERIES_SCOPE_CONTENT,
    editHeading: 'This task repeats. Which ones are you changing?',
    deleteHeading: 'This task repeats. Which ones are you removing?',
  },

  form: {
    addTitle: 'Add a task',
    editTitle: 'Edit task',
    title: 'Title',
    titlePlaceholder: 'Submit internet reimbursement',
    description: 'Notes',
    descriptionPlaceholder: 'Anything you need to remember',
    dueDate: 'Due date',
    recurrence: 'Does this repeat?',
    recurrenceNeedsDate: 'Give it a due date first: a task needs a day to repeat from.',
    dueDateHint: 'Optional. Leave it blank if it is not due on a particular day.',

    students: 'Who it involves',
    studentsHint: 'Leave it empty for something that concerns nobody in particular.',
    noStudents: 'Add a student in Settings to put one on a task.',

    /**
     * Asked as a question rather than labelled "Owner", because the field is
     * not a property of the task so much as an answer about it. The three
     * options say what they mean in the teacher's own terms: naming a student
     * does not say who has to do the work, which is the whole reason this is
     * here.
     */
    owner: 'Whose job is it?',
    ownerTeacher: 'Mine',
    ownerStudent: 'Theirs',
    ownerBoth: 'Both of us',
    ownerTeacherHint: 'Yours to do. It can still be about a student.',
    ownerStudentHint: 'The student does it. You are tracking it.',
    ownerBothHint: 'You do it together.',

    save: 'Save task',
    saving: 'Saving',
    cancel: 'Cancel',
  },

  validation: {
    title: 'Give the task a title',
    titleLength: 'Keep the title under 255 characters',
    /**
     * The server refuses this rather than quietly handing the task back to the
     * teacher, so the form says the same thing before it is sent and names
     * both ways out.
     */
    ownerNeedsStudent: 'Name at least one student, or make it your job instead.',
  },

  remove: {
    heading: 'Remove this task?',
    body: 'It will be deleted for good. This one cannot be undone.',
    confirm: 'Remove task',
    removing: 'Removing',
    cancel: 'Keep it',
  },

  errors: {
    load: 'We could not load your tasks.',
    create: 'We could not save that task.',
    update: 'We could not save that change.',
    toggle: 'We could not update that task.',
    remove: 'We could not remove that task.',
  },
}

/** How many the dashboard panel lists before pointing at the full page. */
export const DASHBOARD_TASK_LIMIT = 5
