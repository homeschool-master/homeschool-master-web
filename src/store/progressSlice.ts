import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { ProgressRange, StudentProgress } from '../types'
import { fetchStudentProgressRequest } from '../services/progress'
import { apiErrorMessage } from '../services/apiError'
import { GRADES_CONTENT } from '../constants/grades'

interface ProgressState {
  /** The roll up currently on screen, or null before the first one lands. */
  report: StudentProgress | null
  loading: boolean
  error: string | null
}

const initialState: ProgressState = {
  report: null,
  loading: false,
  error: null,
}

export const fetchStudentProgress = createAsyncThunk(
  'progress/fetchStudentProgress',
  async (
    { studentId, range }: { studentId: string; range: ProgressRange },
    { rejectWithValue }
  ) => {
    try {
      return await fetchStudentProgressRequest(studentId, range)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, GRADES_CONTENT.errors.progress))
    }
  }
)

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentProgress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudentProgress.fulfilled, (state, action) => {
        state.loading = false
        state.report = action.payload
      })
      // The stale report is dropped on a failure: showing one student's
      // figures under another student's name is worse than showing none.
      .addCase(fetchStudentProgress.rejected, (state, action) => {
        state.loading = false
        state.report = null
        state.error = action.payload as string
      })
  },
})

export default progressSlice.reducer
