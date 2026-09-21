/** Every string the assignment types settings section renders. */
export const ASSIGNMENT_TYPES_CONTENT = {
  heading: 'Assignment types',
  subhead:
    'What kinds of work you set, and how much each kind counts by default. Every type starts counting once.',

  loading: 'Loading assignment types',
  empty: 'No types yet.',
  addButton: 'Add a type',

  builtInBadge: 'Built in',
  builtInHint: 'Comes with every account. You can change what it counts, but not its name.',

  editAction: 'Edit',
  removeAction: 'Remove',

  form: {
    addTitle: 'Add a type',
    editTitle: 'Edit type',
    name: 'Name',
    namePlaceholder: 'Narration',
    nameBuiltInHint: 'A built in type keeps its name, so the work already filed under it still reads.',
    defaultWeight: 'Counts by default',
    save: 'Save type',
    saving: 'Saving',
    cancel: 'Cancel',
  },

  /**
   * The three ways a changed default can reach existing work. Each option says
   * what it leaves alone, because that is the part that is hard to picture.
   *
   * Out in the open above the list rather than behind a disclosure: it is the
   * question that decides what happens to a term's worth of marks.
   */
  apply: {
    heading: 'This changes what {name} counts. Which work should it apply to?',
    newOnly: 'New work only',
    newOnlyHint: 'Everything already set keeps the weight it has.',
    all: 'All work of this type',
    allHint: 'Including work already marked and work with no due date.',
    fromDate: 'Work due from a date onward',
    fromDateHint: 'Anything due before that date keeps its weight. Undated work is left alone.',
    dateLabel: 'Due from',
    dateMissing: 'Pick the date to apply from.',
    /**
     * The rule a teacher cannot see from the list, said where she is choosing.
     * Without it she has no way to know that one test she set to count 5 is
     * about to be left behind, which looks like a bug rather than a promise.
     */
    overrideNote:
      'Work where you set the weight yourself is never moved by this: your choice on one piece of work stays.',
    confirm: 'Apply',
    cancel: 'Cancel',
  },

  /** Said after the fact, since the three modes look identical until they run. */
  result: {
    none: 'Saved. No existing work changed.',
    one: 'Saved. 1 piece of work moved to the new weight.',
    many: 'Saved. {count} pieces of work moved to the new weight.',
  },

  remove: {
    heading: 'Remove this type?',
    body: 'Work already filed under it keeps its type and its marks. You just stop being offered it on new work.',
    confirm: 'Remove type',
    removing: 'Removing',
    cancel: 'Keep it',
  },

  validation: {
    name: 'Give the type a name',
    nameLength: 'Keep the name under 100 characters',
    weight: 'Enter a weight of zero or more',
  },

  errors: {
    load: 'We could not load your assignment types.',
    create: 'We could not save that type.',
    update: 'We could not save that change.',
    remove: 'We could not remove that type.',
    duplicateName: 'You already have a type with that name.',
  },
}
