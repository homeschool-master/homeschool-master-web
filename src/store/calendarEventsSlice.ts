import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type {
  CalendarEvent,
  CalendarEventInput,
  CalendarEventRange,
  CalendarEventUpdateInput,
} from '../types'
import {
  createCalendarEventRequest,
  deleteCalendarEventRequest,
  fetchCalendarEventRequest,
  fetchCalendarEventsRequest,
  updateCalendarEventRequest,
} from '../services/calendarEvents'
import { apiErrorMessage, isNotFoundError } from '../services/apiError'
import { CALENDAR_CONTENT } from '../constants/calendar'

interface CalendarEventsState {
  items: CalendarEvent[]
  loading: boolean
  error: string | null
  creating: boolean
  createError: string | null
  /** The single event behind the detail and edit views. */
  current: CalendarEvent | null
  currentLoading: boolean
  currentError: string | null
  currentNotFound: boolean
  updating: boolean
  updateError: string | null
  deletingId: string | null
  deleteError: string | null
}

/** A rejected fetch by id separates a missing event from a failed request. */
interface FetchOneRejection {
  message: string
  notFound: boolean
}

const initialState: CalendarEventsState = {
  items: [],
  loading: false,
  error: null,
  creating: false,
  createError: null,
  current: null,
  currentLoading: false,
  currentError: null,
  currentNotFound: false,
  updating: false,
  updateError: null,
  deletingId: null,
  deleteError: null,
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

export const fetchCalendarEvent = createAsyncThunk(
  'calendarEvents/fetchCalendarEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      return await fetchCalendarEventRequest(id)
    } catch (error: unknown) {
      return rejectWithValue({
        message: apiErrorMessage(error, CALENDAR_CONTENT.errors.loadEvent),
        notFound: isNotFoundError(error),
      } satisfies FetchOneRejection)
    }
  }
)

export const updateCalendarEvent = createAsyncThunk(
  'calendarEvents/updateCalendarEvent',
  async (
    { id, input }: { id: string; input: CalendarEventUpdateInput },
    { rejectWithValue }
  ) => {
    try {
      return await updateCalendarEventRequest(id, input)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, CALENDAR_CONTENT.errors.updateEvent))
    }
  }
)

export const deleteCalendarEvent = createAsyncThunk(
  'calendarEvents/deleteCalendarEvent',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteCalendarEventRequest(id)
      return id
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, CALENDAR_CONTENT.errors.deleteEvent))
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
    clearUpdateError: (state) => {
      state.updateError = null
    },
    clearDeleteError: (state) => {
      state.deleteError = null
    },
    /** Dropped when leaving a detail view so the next one never flashes it. */
    clearCurrentEvent: (state) => {
      state.current = null
      state.currentError = null
      state.currentNotFound = false
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

      .addCase(fetchCalendarEvent.pending, (state) => {
        state.currentLoading = true
        state.currentError = null
        state.currentNotFound = false
      })
      .addCase(fetchCalendarEvent.fulfilled, (state, action) => {
        state.currentLoading = false
        state.current = action.payload
      })
      .addCase(fetchCalendarEvent.rejected, (state, action) => {
        const rejection = action.payload as FetchOneRejection
        state.currentLoading = false
        state.current = null
        state.currentError = rejection.message
        state.currentNotFound = rejection.notFound
      })

      .addCase(updateCalendarEvent.pending, (state) => {
        state.updating = true
        state.updateError = null
      })
      // The month grid holds the same event, so it is replaced in place: an
      // edit that moves the event to another month simply stops matching any
      // cell of the loaded one.
      .addCase(updateCalendarEvent.fulfilled, (state, action) => {
        state.updating = false
        state.current = action.payload
        state.items = state.items.map((event) =>
          event.id === action.payload.id ? action.payload : event
        )
      })
      .addCase(updateCalendarEvent.rejected, (state, action) => {
        state.updating = false
        state.updateError = action.payload as string
      })

      .addCase(deleteCalendarEvent.pending, (state, action) => {
        state.deletingId = action.meta.arg
        state.deleteError = null
      })
      .addCase(deleteCalendarEvent.fulfilled, (state, action) => {
        state.deletingId = null
        state.items = state.items.filter((event) => event.id !== action.payload)
        if (state.current?.id === action.payload) state.current = null
      })
      .addCase(deleteCalendarEvent.rejected, (state, action) => {
        state.deletingId = null
        state.deleteError = action.payload as string
      })
  },
})

export const {
  clearCreateError,
  clearUpdateError,
  clearDeleteError,
  clearCurrentEvent,
} = calendarEventsSlice.actions
export default calendarEventsSlice.reducer
