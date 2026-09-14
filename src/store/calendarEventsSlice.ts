import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { CalendarEvent, CalendarEventInput, CalendarEventRange } from '../types'
import {
  createCalendarEventRequest,
  fetchCalendarEventsRequest,
} from '../services/calendarEvents'
import { apiErrorMessage } from '../services/apiError'
import { CALENDAR_CONTENT } from '../constants/calendar'

interface CalendarEventsState {
  items: CalendarEvent[]
  loading: boolean
  error: string | null
  creating: boolean
  createError: string | null
}

const initialState: CalendarEventsState = {
  items: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
}

export const fetchCalendarEvents = createAsyncThunk(
  'calendarEvents/fetchCalendarEvents',
  async (range: CalendarEventRange, { rejectWithValue }) => {
    try {
      return await fetchCalendarEventsRequest(range)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, CALENDAR_CONTENT.errors.loadEvents))
    }
  }
)

export const createCalendarEvent = createAsyncThunk(
  'calendarEvents/createCalendarEvent',
  async (input: CalendarEventInput, { rejectWithValue }) => {
    try {
      return await createCalendarEventRequest(input)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, CALENDAR_CONTENT.errors.createEvent))
    }
  }
)

const calendarEventsSlice = createSlice({
  name: 'calendarEvents',
  initialState,
  reducers: {
    clearCreateError: (state) => {
      state.createError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCalendarEvents.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchCalendarEvents.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchCalendarEvents.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(createCalendarEvent.pending, (state) => {
        state.creating = true
        state.createError = null
      })
      .addCase(createCalendarEvent.fulfilled, (state) => {
        state.creating = false
      })
      .addCase(createCalendarEvent.rejected, (state, action) => {
        state.creating = false
        state.createError = action.payload as string
      })
  },
})

export const { clearCreateError } = calendarEventsSlice.actions
export default calendarEventsSlice.reducer
