import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Student } from '../types'
import { fetchStudentsRequest } from '../services/students'
import { apiErrorMessage } from '../services/apiError'
import { CALENDAR_CONTENT } from '../constants/calendar'

interface StudentsState {
  items: Student[]
  loading: boolean
  error: string | null
}

const initialState: StudentsState = {
  items: [],
  loading: false,
  error: null,
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

const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export default studentsSlice.reducer
