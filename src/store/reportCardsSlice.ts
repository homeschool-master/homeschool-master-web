import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { ReportCard, ReportCardInput } from '../types'
import {
  createReportCardRequest,
  fetchReportCardRequest,
  fetchReportCardVersionsRequest,
  fetchReportCardsRequest,
  issueReportCardRequest,
  refreshReportCardRequest,
  removeReportCardRequest,
  updateReportCardRequest,
} from '../services/reportCards'
import { apiErrorMessage } from '../services/apiError'
import { REPORT_CARDS_CONTENT } from '../constants/reportCards'

interface ReportCardsState {
  items: ReportCard[]
  loading: boolean
  loaded: boolean
  error: string | null
  /** The one card behind the detail view, in full. */
  current: ReportCard | null
  currentLoading: boolean
  currentError: string | null
  /** Every version of the current card, oldest first. */
  versions: ReportCard[]
  saving: boolean
  saveError: string | null
  removingId: string | null
  removeError: string | null
}

const initialState: ReportCardsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
  current: null,
  currentLoading: false,
  currentError: null,
  versions: [],
  saving: false,
  saveError: null,
  removingId: null,
  removeError: null,
}

export const fetchReportCards = createAsyncThunk(
  'reportCards/fetchReportCards',
  async (studentId: string | undefined, { rejectWithValue }) => {
    try {
      return await fetchReportCardsRequest(studentId)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, REPORT_CARDS_CONTENT.errors.load))
    }
  }
)

export const fetchReportCard = createAsyncThunk(
  'reportCards/fetchReportCard',
  async (id: string, { rejectWithValue }) => {
    try {
      return await fetchReportCardRequest(id)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, REPORT_CARDS_CONTENT.errors.loadOne))
    }
  }
)

export const fetchReportCardVersions = createAsyncThunk(
  'reportCards/fetchReportCardVersions',
  async (id: string, { rejectWithValue }) => {
    try {
      return await fetchReportCardVersionsRequest(id)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, REPORT_CARDS_CONTENT.errors.loadOne))
    }
  }
)

export const createReportCard = createAsyncThunk(
  'reportCards/createReportCard',
  async (input: ReportCardInput, { rejectWithValue }) => {
    try {
      return await createReportCardRequest(input)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, REPORT_CARDS_CONTENT.errors.create))
    }
  }
)

/**
 * Editing an issued card returns a different card: the next version. The
 * reducer replaces current with whatever came back rather than assuming it is
 * the one that was sent, and the page follows it by id.
 */
export const updateReportCard = createAsyncThunk(
  'reportCards/updateReportCard',
  async ({ id, input }: { id: string; input: ReportCardInput }, { rejectWithValue }) => {
    try {
      return await updateReportCardRequest(id, input)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, REPORT_CARDS_CONTENT.errors.update))
    }
  }
)

export const issueReportCard = createAsyncThunk(
  'reportCards/issueReportCard',
  async (id: string, { rejectWithValue }) => {
    try {
      return await issueReportCardRequest(id)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, REPORT_CARDS_CONTENT.errors.issue))
    }
  }
)

export const refreshReportCard = createAsyncThunk(
  'reportCards/refreshReportCard',
  async (id: string, { rejectWithValue }) => {
    try {
      return await refreshReportCardRequest(id)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, REPORT_CARDS_CONTENT.errors.refresh))
    }
  }
)

export const removeReportCard = createAsyncThunk(
  'reportCards/removeReportCard',
  async (id: string, { rejectWithValue }) => {
    try {
      await removeReportCardRequest(id)
      return id
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, REPORT_CARDS_CONTENT.errors.remove))
    }
  }
)

const reportCardsSlice = createSlice({
  name: 'reportCards',
  initialState,
  reducers: {
    clearSaveError: (state) => {
      state.saveError = null
    },
    clearRemoveError: (state) => {
      state.removeError = null
    },
    /** Dropped when leaving a card, so the next one never flashes it. */
    clearCurrentCard: (state) => {
      state.current = null
      state.currentError = null
      state.versions = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportCards.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchReportCards.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = action.payload
      })
      .addCase(fetchReportCards.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.error = action.payload as string
      })

      .addCase(fetchReportCard.pending, (state) => {
        state.currentLoading = true
        state.currentError = null
      })
      .addCase(fetchReportCard.fulfilled, (state, action) => {
        state.currentLoading = false
        state.current = action.payload
      })
      .addCase(fetchReportCard.rejected, (state, action) => {
        state.currentLoading = false
        state.current = null
        state.currentError = action.payload as string
      })

      .addCase(fetchReportCardVersions.fulfilled, (state, action) => {
        state.versions = action.payload
      })

      .addCase(createReportCard.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      .addCase(createReportCard.fulfilled, (state, action) => {
        state.saving = false
        state.current = action.payload
        state.items.unshift(action.payload)
      })
      .addCase(createReportCard.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      .addCase(updateReportCard.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      // What comes back may be a new version rather than the card that was
      // sent, so the list row for this group is replaced by id where it
      // matches and by group otherwise.
      .addCase(updateReportCard.fulfilled, (state, action) => {
        state.saving = false
        state.current = action.payload
        state.items = state.items.map((card) =>
          card.groupId === action.payload.groupId ? action.payload : card
        )
      })
      .addCase(updateReportCard.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      .addCase(issueReportCard.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      .addCase(issueReportCard.fulfilled, (state, action) => {
        state.saving = false
        state.current = action.payload
        state.items = state.items.map((card) =>
          card.id === action.payload.id ? action.payload : card
        )
      })
      .addCase(issueReportCard.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      .addCase(refreshReportCard.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      .addCase(refreshReportCard.fulfilled, (state, action) => {
        state.saving = false
        state.current = action.payload
      })
      .addCase(refreshReportCard.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      .addCase(removeReportCard.pending, (state, action) => {
        state.removingId = action.meta.arg
        state.removeError = null
      })
      .addCase(removeReportCard.fulfilled, (state, action) => {
        state.removingId = null
        state.items = state.items.filter((card) => card.id !== action.payload)
        if (state.current?.id === action.payload) state.current = null
      })
      .addCase(removeReportCard.rejected, (state, action) => {
        state.removingId = null
        state.removeError = action.payload as string
      })
  },
})

export const { clearSaveError, clearRemoveError, clearCurrentCard } = reportCardsSlice.actions
export default reportCardsSlice.reducer
