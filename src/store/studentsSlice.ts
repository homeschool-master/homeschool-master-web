import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Student, StudentInput } from '../types'
import {
  createStudentRequest,
  fetchStudentsRequest,
  removeStudentRequest,
  updateStudentRequest,
} from '../services/students'
import { apiErrorMessage } from '../services/apiError'
import { CALENDAR_CONTENT } from '../constants/calendar'
import { STUDENTS_CONTENT } from '../constants/students'

interface StudentsState {
  items: Student[]
  loading: boolean
  /**
   * Whether the roster has come back at least once. An empty items array means
   * two different things before and after that, and telling a teacher their
   * selected student is not on the roster is only honest once it has.
   */
  loaded: boolean
  error: string | null
  saving: boolean
  saveError: string | null
  removingId: string | null
  removeError: string | null
}

const initialState: StudentsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
  saving: false,
  saveError: null,
  removingId: null,
  removeError: null,
}

export const fetchStudents = createAsyncThunk(
  'students/fetchStudents',
  async (_arg, { rejectWithValue }) => {
    try {
      return await fetchStudentsRequest()
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, CALENDAR_CONTENT.errors.loadStudents))
    }
  }
)

export const createStudent = createAsyncThunk(
  'students/createStudent',
  async (input: StudentInput, { rejectWithValue }) => {
    try {
      return await createStudentRequest(input)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, STUDENTS_CONTENT.errors.create))
    }
  }
)

export const updateStudent = createAsyncThunk(
  'students/updateStudent',
  async ({ id, input }: { id: string; input: StudentInput }, { rejectWithValue }) => {
    try {
      return await updateStudentRequest(id, input)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, STUDENTS_CONTENT.errors.update))
    }
  }
)

export const removeStudent = createAsyncThunk(
  'students/removeStudent',
  async (id: string, { rejectWithValue }) => {
    try {
      await removeStudentRequest(id)
      return id
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, STUDENTS_CONTENT.errors.remove))
    }
  }
)

const studentsSlice = createSlice({
  name: 'students',
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
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = action.payload
      })
      // A failed load is settled too: what it is not is an empty roster, so the
      // flag says the request finished and the error says it did not work.
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.error = action.payload as string
      })

      .addCase(createStudent.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      // The roster is ordered by created_at, so a new student belongs at the
      // end: the list stays correct without refetching.
      .addCase(createStudent.fulfilled, (state, action) => {
        state.saving = false
        state.items.push(action.payload)
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      .addCase(updateStudent.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.saving = false
        state.items = state.items.map((student) =>
          student.id === action.payload.id ? action.payload : student
        )
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      // Removal is a soft delete server side: the student drops out of the
      // roster while their events and grades stay attached to the record.
      .addCase(removeStudent.pending, (state, action) => {
        state.removingId = action.meta.arg
        state.removeError = null
      })
      .addCase(removeStudent.fulfilled, (state, action) => {
        state.removingId = null
        state.items = state.items.filter((student) => student.id !== action.payload)
      })
      .addCase(removeStudent.rejected, (state, action) => {
        state.removingId = null
        state.removeError = action.payload as string
      })
  },
})

export const { clearSaveError, clearRemoveError } = studentsSlice.actions
export default studentsSlice.reducer
