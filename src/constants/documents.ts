/** Every string the documents library and the attach controls render. */
export const DOCUMENTS_CONTENT = {
  heading: 'Documents',
  subhead:
    'Photos, worksheets and receipts you have uploaded. File one against as much work as you like, or keep it here on its own.',

  loading: 'Loading documents',
  empty: 'Nothing uploaded yet.',
  emptyUnattached: 'Everything you have uploaded is filed against something.',

  filters: {
    label: 'Show',
    all: 'Everything',
    unattached: 'Filed nowhere',
  },

  upload: {
    heading: 'Add a document',
    choose: 'Choose a file',
    camera: 'Take a photo',
    /**
     * Said before the picker opens, because the limits are the thing a teacher
     * finds out the hard way otherwise.
     */
    hint: 'Photos, PDFs and documents up to 25MB. Large photos are shrunk on this device before they are sent.',
    title: 'Title',
    titlePlaceholder: 'Co-op receipt, October',
    /** A filename is a poor title, but it beats an empty box. */
    titleHint: 'What you will look for later. The file name is filled in to start with.',
    selected: 'Ready to upload: {filename} ({size})',
    shrinking: 'Shrinking the photo',
    shrunk: 'Shrunk from {before} to {after}',
    uploading: 'Uploading',
    save: 'Upload',
    cancel: 'Cancel',
  },

  card: {
    openAction: 'Open',
    downloadAction: 'Download',
    renameAction: 'Rename',
    removeAction: 'Delete',
    filedNowhere: 'Filed nowhere',
    filedAgainst: 'Filed against',
    /** The occurrence case, said in full: a date is the whole point of it. */
    occurrenceSuffix: 'on {date}',
    unfileAction: 'Unfile',
    uploadedOn: 'Uploaded {date}',
  },

  rename: {
    heading: 'Rename document',
    save: 'Save title',
    saving: 'Saving',
    cancel: 'Cancel',
  },

  remove: {
    heading: 'Delete this document?',
    /**
     * Says what is actually destroyed. Unfiling is the other thing a teacher
     * might have meant, so it is named here rather than left to be discovered.
     */
    body: 'The file is deleted from storage and taken off everything it is filed against. This cannot be undone. To keep the file and only take it off one thing, unfile it instead.',
    confirm: 'Delete document',
    removing: 'Deleting',
    cancel: 'Keep it',
  },

  /** The panel that appears on an assignment, a task and an event. */
  attached: {
    heading: 'Documents',
    none: 'No documents on this yet.',
    addAction: 'Attach a document',
    addHeading: 'Attach a document',
    /** The two ways in, said plainly, because the second one is not obvious. */
    addHint: 'Pick something already in your library, or upload a new file.',
    fromLibrary: 'From your library',
    uploadNew: 'Upload a new file',
    libraryEmpty: 'Nothing in your library yet.',
    attachAction: 'Attach',
    attaching: 'Attaching',
    detachAction: 'Take off',
    detaching: 'Taking off',
    done: 'Done',
    /** Said on one occurrence of a series, where the default is not obvious. */
    occurrenceNote: 'This attaches to {date} only, not to every one of these.',
    seriesNote: 'This attaches to every one of these.',
  },

  validation: {
    title: 'Give the document a title',
    file: 'Choose a file first',
    tooLarge: 'That file is {size}. The limit is 25MB.',
    wrongType: 'That kind of file cannot be uploaded. Photos, PDFs and common document formats only.',
  },

  errors: {
    load: 'We could not load your documents.',
    upload: 'We could not upload that file.',
    update: 'We could not save that change.',
    remove: 'We could not delete that document.',
    attach: 'We could not attach that document.',
    detach: 'We could not take that document off.',
  },
}

/**
 * What the server will keep. Held here as well so a wrong file is refused
 * before it is uploaded rather than after, and the two lists are the same
 * list: Document::ALLOWED_TYPES in the API.
 */
export const ALLOWED_DOCUMENT_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/heic',
  'image/heif',
  'application/pdf',
  'text/plain',
  'text/csv',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.oasis.opendocument.text',
  'application/vnd.oasis.opendocument.spreadsheet',
]

/** 25MB, the same number the server enforces. */
export const MAX_DOCUMENT_BYTES = 25 * 1024 * 1024

/**
 * The long edge a photo is shrunk to before it is sent.
 *
 * 2000px reads a worksheet or a receipt comfortably, including small print on
 * a till receipt, and turns a 4MB phone photo into a few hundred kilobytes.
 * The original is not kept: keeping both would double storage for something
 * nobody asked for, and the shrunk copy is the one she will look at.
 */
export const IMAGE_LONG_EDGE = 2000

/** Only photographs are worth re-encoding, and only above this size. */
export const SHRINKABLE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
export const SHRINK_ABOVE_BYTES = 512 * 1024
export const SHRINK_QUALITY = 0.82
