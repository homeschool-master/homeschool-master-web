/**
 * Copy for the students panel in account settings.
 *
 * Student management used to be mobile only, which is why the empty state once
 * sent teachers to the app. Web can add, edit and remove here now, so the copy
 * points at this page instead.
 */
export const STUDENTS_CONTENT = {
  loading: 'Loading your students...',
  empty: 'No students yet. Add your first one below.',
  addButton: 'Add Student',
  editAction: 'Edit',
  removeAction: 'Remove',
  form: {
    addTitle: 'Add a student',
    editTitle: 'Edit student',
    firstName: 'First Name',
    middleName: 'Middle Name',
    middleNamePlaceholder: 'Optional',
    lastName: 'Last Name',
    gradeLevel: 'Grade Level',
    gradePlaceholder: 'Select a grade level',
    color: 'Color',
    colorHint: 'Marks this student on the calendar.',
    previewName: 'Name',
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
  },
  validation: {
    firstName: 'First name is required',
    lastName: 'Last name is required',
    gradeLevel: 'Select a grade level',
    color: 'Select a color',
  },
  remove: {
    heading: 'Remove this student?',
    body: 'Their events and records are kept: they stop showing on your roster, and nothing already saved against them is lost.',
    confirm: 'Remove',
    removing: 'Removing...',
    cancel: 'Cancel',
  },
  errors: {
    create: 'Could not add this student. Please try again.',
    update: 'Could not save this student. Please try again.',
    remove: 'Could not remove this student. Please try again.',
  },
}
