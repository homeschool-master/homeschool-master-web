import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Subject, SubjectInput } from '../types'
import {
  createSubjectRequest,
  fetchSubjectsRequest,
  removeSubjectRequest,
  updateSubjectRequest,
} from '../services/subjects'
import { apiErrorMessage, hasFieldError } from '../services/apiError'
import { SUBJECTS_CONTENT } from '../constants/subjects'

interface SubjectsState {
  items: Subject[]
  loading: boolean
  loaded: boolean
  error: string | null
  saving: boolean
  saveError: string | null
  removingId: string | null
  removeError: string | null
}

const initialState: SubjectsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
  saving: false,
  saveError: null,
  removingId: null,
  removeError: null,
}

/**
 * The one rule a teacher will actually hit, answered in the app's own words.
 * Everything else falls through to the shared formatter.
 */
const saveErrorMessage = (error: unknown, fallback: string): string =>
  hasFieldError(error, 'name', 'has already been taken')
    ? SUBJECTS_CONTENT.errors.duplicateName
    : apiErrorMessage(error, fallback)

export const fetchSubjects = createAsyncThunk(
  'subjects/fetchSubjects',
  async (_arg, { rejectWithValue }) => {
    try {
      return await fetchSubjectsRequest()
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, SUBJECTS_CONTENT.errors.load))
    }
  }
)

export const createSubject = createAsyncThunk(
  'subjects/createSubject',
  async (input: SubjectInput, { rejectWithValue }) => {
    try {
      return await createSubjectRequest(input)
    } catch (error: unknown) {
      return rejectWithValue(saveErrorMessage(error, SUBJECTS_CONTENT.errors.create))
    }
  }
)

export const updateSubject = createAsyncThunk(
  'subjects/updateSubject',
  async ({ id, input }: { id: string; input: SubjectInput }, { rejectWithValue }) => {
    try {
      return await updateSubjectRequest(id, input)
    } catch (error: unknown) {
      return rejectWithValue(saveErrorMessage(error, SUBJECTS_CONTENT.errors.update))
    }
  }
)

export const removeSubject = createAsyncThunk(
  'subjects/removeSubject',
  async (id: string, { rejectWithValue }) => {
    try {
      await removeSubjectRequest(id)
      return id
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, SUBJECTS_CONTENT.errors.remove))
    }
  }
)

/** The endpoint orders by name, so the list keeps that order after a write. */
const byName = (first: Subject, second: Subject): number =>
  first.name.localeCompare(second.name, undefined, { sensitivity: 'base' })

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {
    clearSaveError: (state) => {
      state.saveError = null
    },
    clearRemoveError: (state) => {
      state.removeError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSubjects.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = action.payload
      })
      .addCase(fetchSubjects.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.error = action.payload as string
      })

      .addCase(createSubject.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        state.saving = false
        state.items = [...state.items, action.payload].sort(byName)
      })
      .addCase(createSubject.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      .addCase(updateSubject.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      // A rename can move it, so the list is resorted rather than replaced in
      // place: the server would return it somewhere else on the next load.
      .addCase(updateSubject.fulfilled, (state, action) => {
        state.saving = false
        state.items = state.items
          .map((subject) => (subject.id === action.payload.id ? action.payload : subject))
          .sort(byName)
      })
      .addCase(updateSubject.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      // Soft delete server side, so the row survives: it simply stops coming
      // back from the index, which is what dropping it here mirrors.
      .addCase(removeSubject.pending, (state, action) => {
        state.removingId = action.meta.arg
        state.removeError = null
      })
      .addCase(removeSubject.fulfilled, (state, action) => {
        state.removingId = null
        state.items = state.items.filter((subject) => subject.id !== action.payload)
      })
      .addCase(removeSubject.rejected, (state, action) => {
        state.removingId = null
        state.removeError = action.payload as string
      })
  },
})

export const { clearSaveError, clearRemoveError } = subjectsSlice.actions
export default subjectsSlice.reducer
