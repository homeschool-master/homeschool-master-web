/** Every string the subjects section renders. */
export const SUBJECTS_CONTENT = {
  heading: 'Subjects',
  intro: 'The subjects you tag work with. Assignments and report cards group by these.',

  loading: 'Loading subjects',
  /** A teacher who has never made one: this is a first visit, not a failure. */
  empty: 'No subjects yet. Add your first one with the button above.',
  noDescription: 'No description',

  addButton: 'Add a subject',
  editAction: 'Edit',
  removeAction: 'Remove',

  form: {
    addTitle: 'Add a subject',
    editTitle: 'Edit subject',
    name: 'Name',
    namePlaceholder: 'Math',
    description: 'Description',
    descriptionPlaceholder: 'What this subject covers',
    color: 'Colour',
    colorHint: 'Used to mark this subject wherever it appears.',
    save: 'Save subject',
    saving: 'Saving...',
    cancel: 'Cancel',
  },

  validation: {
    name: 'Give the subject a name',
    nameLength: 'Keep the name under 100 characters',
  },

  remove: {
    heading: 'Remove this subject?',
    // Soft delete, the same as a student: say so plainly, because "remove"
    // otherwise reads as losing the work filed under it.
    body: 'Assignments and grades already recorded against it are kept: it stops showing in your list, and nothing already saved is lost. You can use the name again afterwards.',
    confirm: 'Remove',
    removing: 'Removing...',
    cancel: 'Cancel',
  },

  errors: {
    load: 'We could not load your subjects.',
    create: 'Could not save this subject. Please try again.',
    update: 'Could not save that change. Please try again.',
    remove: 'Could not remove this subject. Please try again.',
    /**
     * The server rejects a duplicate with "has already been taken", which reads
     * like a database complaint. The rule is worth spelling out instead: it
     * ignores case, and it only counts subjects still on the list.
     */
    duplicateName:
      'You already have a subject with that name. Capitals do not make it different, so Math and math count as the same.',
  },
}
