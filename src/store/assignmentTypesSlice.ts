import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { AssignmentType, AssignmentTypeInput } from '../types'
import {
  createAssignmentTypeRequest,
  fetchAssignmentTypesRequest,
  removeAssignmentTypeRequest,
  updateAssignmentTypeRequest,
} from '../services/assignmentTypes'
import { apiErrorMessage, hasFieldError } from '../services/apiError'
import { ASSIGNMENT_TYPES_CONTENT } from '../constants/assignmentTypes'

interface AssignmentTypesState {
  items: AssignmentType[]
  loading: boolean
  loaded: boolean
  error: string | null
  saving: boolean
  saveError: string | null
  removingId: string | null
  removeError: string | null
  /**
   * How many assignments the last default weight change moved. Held rather
   * than shown and forgotten, because it is the only way a teacher can tell
   * which of the three modes actually took effect.
   */
  lastUpdatedCount: number | null
}

const initialState: AssignmentTypesState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
  saving: false,
  saveError: null,
  removingId: null,
  removeError: null,
  lastUpdatedCount: null,
}

/** The one rule a teacher will actually hit, said in the app's own words. */
const saveErrorMessage = (error: unknown, fallback: string): string =>
  hasFieldError(error, 'name', 'has already been taken')
    ? ASSIGNMENT_TYPES_CONTENT.errors.duplicateName
    : apiErrorMessage(error, fallback)

export const fetchAssignmentTypes = createAsyncThunk(
  'assignmentTypes/fetchAssignmentTypes',
  async (_arg, { rejectWithValue }) => {
    try {
      return await fetchAssignmentTypesRequest()
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, ASSIGNMENT_TYPES_CONTENT.errors.load))
    }
  }
)

export const createAssignmentType = createAsyncThunk(
  'assignmentTypes/createAssignmentType',
  async (input: AssignmentTypeInput, { rejectWithValue }) => {
    try {
      return await createAssignmentTypeRequest(input)
    } catch (error: unknown) {
      return rejectWithValue(saveErrorMessage(error, ASSIGNMENT_TYPES_CONTENT.errors.create))
    }
  }
)

export const updateAssignmentType = createAsyncThunk(
  'assignmentTypes/updateAssignmentType',
  async ({ id, input }: { id: string; input: AssignmentTypeInput }, { rejectWithValue }) => {
    try {
      return await updateAssignmentTypeRequest(id, input)
    } catch (error: unknown) {
      return rejectWithValue(saveErrorMessage(error, ASSIGNMENT_TYPES_CONTENT.errors.update))
    }
  }
)

export const removeAssignmentType = createAsyncThunk(
  'assignmentTypes/removeAssignmentType',
  async (id: string, { rejectWithValue }) => {
    try {
      await removeAssignmentTypeRequest(id)
      return id
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, ASSIGNMENT_TYPES_CONTENT.errors.remove))
    }
  }
)

const assignmentTypesSlice = createSlice({
  name: 'assignmentTypes',
  initialState,
  reducers: {
    clearSaveError: (state) => {
      state.saveError = null
    },
    clearRemoveError: (state) => {
      state.removeError = null
    },
    /** Dropped when the panel closes, so the next change starts with no tally. */
    clearUpdatedCount: (state) => {
      state.lastUpdatedCount = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignmentTypes.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAssignmentTypes.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = action.payload
      })
      .addCase(fetchAssignmentTypes.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.error = action.payload as string
      })

      .addCase(createAssignmentType.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      // Appended rather than refetched, then sorted by the view: built in
      // types come first and a new custom one belongs among the others by name.
      .addCase(createAssignmentType.fulfilled, (state, action) => {
        state.saving = false
        state.items.push(action.payload)
      })
      .addCase(createAssignmentType.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      .addCase(updateAssignmentType.pending, (state) => {
        state.saving = true
        state.saveError = null
        state.lastUpdatedCount = null
      })
      .addCase(updateAssignmentType.fulfilled, (state, action) => {
        state.saving = false
        state.lastUpdatedCount = action.payload.updatedCount ?? null
        state.items = state.items.map((type) =>
          type.id === action.payload.id ? action.payload : type
        )
      })
      .addCase(updateAssignmentType.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      // A soft delete server side: the row stays so assignments already typed
      // keep reading, and it simply stops being offered.
      .addCase(removeAssignmentType.pending, (state, action) => {
        state.removingId = action.meta.arg
        state.removeError = null
      })
      .addCase(removeAssignmentType.fulfilled, (state, action) => {
        state.removingId = null
        state.items = state.items.filter((type) => type.id !== action.payload)
      })
      .addCase(removeAssignmentType.rejected, (state, action) => {
        state.removingId = null
        state.removeError = action.payload as string
      })
  },
})

export const { clearSaveError, clearRemoveError, clearUpdatedCount } =
  assignmentTypesSlice.actions
export default assignmentTypesSlice.reducer
