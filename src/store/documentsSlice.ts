import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { DocumentAttachableType, TeacherDocument } from '../types'
import {
  attachDocumentRequest,
  detachDocumentRequest,
  fetchDocumentsRequest,
  removeDocumentRequest,
  renameDocumentRequest,
  uploadDocumentRequest,
} from '../services/documents'
import { apiErrorMessage } from '../services/apiError'
import { DOCUMENTS_CONTENT } from '../constants/documents'

interface DocumentsState {
  items: TeacherDocument[]
  loading: boolean
  loaded: boolean
  error: string | null
  uploading: boolean
  /** 0 to 100 while bytes are moving, null the rest of the time. */
  uploadProgress: number | null
  uploadError: string | null
  saving: boolean
  saveError: string | null
  removingId: string | null
  removeError: string | null
  /** The document being filed or unfiled, so only its own row disables. */
  filingId: string | null
  filingError: string | null
}

const initialState: DocumentsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
  uploading: false,
  uploadProgress: null,
  uploadError: null,
  saving: false,
  saveError: null,
  removingId: null,
  removeError: null,
  filingId: null,
  filingError: null,
}

/**
 * One list for the whole app.
 *
 * A teacher's library is small, and the panels on an assignment, a task and an
 * event all filter the same list rather than each fetching their own. So
 * uploading from an event puts the document in the library without a refetch,
 * and unfiling it in one place updates every other place it shows.
 */
export const fetchDocuments = createAsyncThunk(
  'documents/fetchDocuments',
  async (_: void, { rejectWithValue }) => {
    try {
      return await fetchDocumentsRequest()
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, DOCUMENTS_CONTENT.errors.load))
    }
  }
)

export const uploadDocument = createAsyncThunk(
  'documents/uploadDocument',
  async ({ file, title }: { file: File; title: string }, { dispatch, rejectWithValue }) => {
    try {
      return await uploadDocumentRequest(file, title, (percent) => {
        dispatch(documentsSlice.actions.setUploadProgress(percent))
      })
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, DOCUMENTS_CONTENT.errors.upload))
    }
  }
)

export const renameDocument = createAsyncThunk(
  'documents/renameDocument',
  async ({ id, title }: { id: string; title: string }, { rejectWithValue }) => {
    try {
      return await renameDocumentRequest(id, title)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, DOCUMENTS_CONTENT.errors.update))
    }
  }
)

export const removeDocument = createAsyncThunk(
  'documents/removeDocument',
  async (id: string, { rejectWithValue }) => {
    try {
      await removeDocumentRequest(id)
      return id
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, DOCUMENTS_CONTENT.errors.remove))
    }
  }
)

export const attachDocument = createAsyncThunk(
  'documents/attachDocument',
  async (
    {
      id,
      attachableType,
      targetId,
    }: { id: string; attachableType: DocumentAttachableType; targetId: string },
    { rejectWithValue }
  ) => {
    try {
      return await attachDocumentRequest(id, attachableType, targetId)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, DOCUMENTS_CONTENT.errors.attach))
    }
  }
)

export const detachDocument = createAsyncThunk(
  'documents/detachDocument',
  async ({ id, attachmentId }: { id: string; attachmentId: string }, { rejectWithValue }) => {
    try {
      return await detachDocumentRequest(id, attachmentId)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, DOCUMENTS_CONTENT.errors.detach))
    }
  }
)

const replaceDocument = (items: TeacherDocument[], document: TeacherDocument): TeacherDocument[] =>
  items.map((item) => (item.id === document.id ? document : item))

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setUploadProgress: (state, action: { payload: number }) => {
      state.uploadProgress = action.payload
    },
    clearUploadError: (state) => {
      state.uploadError = null
    },
    clearSaveError: (state) => {
      state.saveError = null
    },
    clearFilingError: (state) => {
      state.filingError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = action.payload
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.error = action.payload as string
      })

      .addCase(uploadDocument.pending, (state) => {
        state.uploading = true
        state.uploadProgress = 0
        state.uploadError = null
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.uploading = false
        state.uploadProgress = null
        // Newest first, which is the order the server lists them in.
        state.items.unshift(action.payload)
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.uploading = false
        state.uploadProgress = null
        state.uploadError = action.payload as string
      })

      .addCase(renameDocument.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      .addCase(renameDocument.fulfilled, (state, action) => {
        state.saving = false
        state.items = replaceDocument(state.items, action.payload)
      })
      .addCase(renameDocument.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      .addCase(removeDocument.pending, (state, action) => {
        state.removingId = action.meta.arg
        state.removeError = null
      })
      .addCase(removeDocument.fulfilled, (state, action) => {
        state.removingId = null
        state.items = state.items.filter((document) => document.id !== action.payload)
      })
      .addCase(removeDocument.rejected, (state, action) => {
        state.removingId = null
        state.removeError = action.payload as string
      })

      .addCase(attachDocument.pending, (state, action) => {
        state.filingId = action.meta.arg.id
        state.filingError = null
      })
      .addCase(attachDocument.fulfilled, (state, action) => {
        state.filingId = null
        state.items = replaceDocument(state.items, action.payload)
      })
      .addCase(attachDocument.rejected, (state, action) => {
        state.filingId = null
        state.filingError = action.payload as string
      })

      .addCase(detachDocument.pending, (state, action) => {
        state.filingId = action.meta.arg.id
        state.filingError = null
      })
      .addCase(detachDocument.fulfilled, (state, action) => {
        state.filingId = null
        state.items = replaceDocument(state.items, action.payload)
      })
      .addCase(detachDocument.rejected, (state, action) => {
        state.filingId = null
        state.filingError = action.payload as string
      })
  },
})

export const { clearUploadError, clearSaveError, clearFilingError } = documentsSlice.actions
export default documentsSlice.reducer
