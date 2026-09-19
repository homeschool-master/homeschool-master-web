/** Every string the tasks page and the dashboard task panel render. */
export const TASKS_CONTENT = {
  page: {
    eyebrow: 'Planning',
    heading: 'Tasks',
    subhead: 'Your own to-do list: the admin that keeps the school year running.',
  },

  filters: {
    label: 'Show',
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

  loading: 'Loading tasks',
  overdue: 'Overdue',
  dueToday: 'Due today',
  noDueDate: 'No due date',
  completedOn: 'Completed',
  /** Announced with the checkbox, since the visible label is the title alone. */
  completeLabel: 'Mark complete',
  uncompleteLabel: 'Mark not complete',

  addButton: 'Add a task',
  editAction: 'Edit',
  removeAction: 'Remove',

  form: {
    addTitle: 'Add a task',
    editTitle: 'Edit task',
    title: 'Title',
    titlePlaceholder: 'Submit internet reimbursement',
    description: 'Notes',
    descriptionPlaceholder: 'Anything you need to remember',
    dueDate: 'Due date',
    dueDateHint: 'Optional. Leave it blank if it is not due on a particular day.',
    save: 'Save task',
    saving: 'Saving',
    cancel: 'Cancel',
  },

  validation: {
    title: 'Give the task a title',
    titleLength: 'Keep the title under 255 characters',
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
