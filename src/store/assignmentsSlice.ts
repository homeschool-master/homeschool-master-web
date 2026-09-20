import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Assignment, AssignmentGrade, AssignmentInput, ScoreInput } from '../types'
import {
  createAssignmentRequest,
  fetchAssignmentsRequest,
  recordScoreRequest,
  removeAssignmentRequest,
  updateAssignmentRequest,
} from '../services/assignments'
import { apiErrorMessage } from '../services/apiError'
import { GRADES_CONTENT } from '../constants/grades'
import { byDueDate } from '../utils/grades'

interface AssignmentsState {
  items: Assignment[]
  loading: boolean
  loaded: boolean
  error: string | null
  saving: boolean
  saveError: string | null
  removingId: string | null
  removeError: string | null
  /** The assignment whose scores are in flight, so only its panel is busy. */
  scoringId: string | null
  scoreError: string | null
}

const initialState: AssignmentsState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
  saving: false,
  saveError: null,
  removingId: null,
  removeError: null,
  scoringId: null,
  scoreError: null,
}

export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async (_arg, { rejectWithValue }) => {
    try {
      return await fetchAssignmentsRequest()
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, GRADES_CONTENT.errors.load))
    }
  }
)

export const createAssignment = createAsyncThunk(
  'assignments/createAssignment',
  async (input: AssignmentInput, { rejectWithValue }) => {
    try {
      return await createAssignmentRequest(input)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, GRADES_CONTENT.errors.create))
    }
  }
)

export const updateAssignment = createAsyncThunk(
  'assignments/updateAssignment',
  async ({ id, input }: { id: string; input: AssignmentInput }, { rejectWithValue }) => {
    try {
      return await updateAssignmentRequest(id, input)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, GRADES_CONTENT.errors.update))
    }
  }
)

export const removeAssignment = createAsyncThunk(
  'assignments/removeAssignment',
  async (id: string, { rejectWithValue }) => {
    try {
      await removeAssignmentRequest(id)
      return id
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, GRADES_CONTENT.errors.remove))
    }
  }
)

/** One student's mark on one assignment, as the endpoint takes them. */
export interface ScoreChange extends ScoreInput {
  gradeId: string
}

/**
 * Saves every mark the teacher changed in one action. The endpoint records one
 * grade row at a time, so this walks them in order and stops at the first
 * failure: the rows already saved keep their marks and come back in the
 * payload, so the panel reopens showing exactly what landed rather than
 * pretending the whole batch failed.
 */
export const recordScores = createAsyncThunk(
  'assignments/recordScores',
  async (
    { assignmentId, changes }: { assignmentId: string; changes: ScoreChange[] },
    { rejectWithValue }
  ) => {
    const saved: AssignmentGrade[] = []

    try {
      for (const change of changes) {
        saved.push(
          await recordScoreRequest(assignmentId, change.gradeId, {
            pointsEarned: change.pointsEarned,
          })
        )
      }
    } catch (error: unknown) {
      return rejectWithValue({
        assignmentId,
        saved,
        message: apiErrorMessage(error, GRADES_CONTENT.errors.score),
      })
    }

    return { assignmentId, saved }
  }
)

/** Replaces the grade rows a save came back with, leaving the rest alone. */
const mergeGrades = (assignment: Assignment, saved: AssignmentGrade[]): Assignment => {
  if (saved.length === 0) return assignment

  const byId = new Map(saved.map((grade) => [grade.id, grade]))

  return {
    ...assignment,
    grades: assignment.grades.map((grade) => byId.get(grade.id) ?? grade),
  }
}

const applyScores = (
  state: AssignmentsState,
  assignmentId: string,
  saved: AssignmentGrade[]
): void => {
  state.items = state.items.map((assignment) =>
    assignment.id === assignmentId ? mergeGrades(assignment, saved) : assignment
  )
}

const assignmentsSlice = createSlice({
  name: 'assignments',
  initialState,
  reducers: {
    clearSaveError: (state) => {
      state.saveError = null
    },
    clearRemoveError: (state) => {
      state.removeError = null
    },
    clearScoreError: (state) => {
      state.scoreError = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = action.payload
      })
      // A failed load is settled too: what it is not is an empty list.
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.error = action.payload as string
      })

      .addCase(createAssignment.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      // Resorted rather than appended: the list is ordered by due date, so a
      // new assignment rarely belongs at the end.
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.saving = false
        state.items = [...state.items, action.payload].sort(byDueDate)
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      .addCase(updateAssignment.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      // Editing the due date moves the row, so this resorts as well.
      .addCase(updateAssignment.fulfilled, (state, action) => {
        state.saving = false
        state.items = state.items
          .map((assignment) =>
            assignment.id === action.payload.id ? action.payload : assignment
          )
          .sort(byDueDate)
      })
      .addCase(updateAssignment.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      .addCase(removeAssignment.pending, (state, action) => {
        state.removingId = action.meta.arg
        state.removeError = null
      })
      // A hard delete server side, grade rows and all: the row is gone here too.
      .addCase(removeAssignment.fulfilled, (state, action) => {
        state.removingId = null
        state.items = state.items.filter((assignment) => assignment.id !== action.payload)
      })
      .addCase(removeAssignment.rejected, (state, action) => {
        state.removingId = null
        state.removeError = action.payload as string
      })

      .addCase(recordScores.pending, (state, action) => {
        state.scoringId = action.meta.arg.assignmentId
        state.scoreError = null
      })
      .addCase(recordScores.fulfilled, (state, action) => {
        state.scoringId = null
        applyScores(state, action.payload.assignmentId, action.payload.saved)
      })
      // Part of a batch can land before one fails, so the marks that did save
      // are kept: losing them here would send the teacher back to re-enter
      // work the server has already recorded.
      .addCase(recordScores.rejected, (state, action) => {
        const failure = action.payload as {
          assignmentId: string
          saved: AssignmentGrade[]
          message: string
        }

        state.scoringId = null
        state.scoreError = failure.message
        applyScores(state, failure.assignmentId, failure.saved)
      })
  },
})

export const { clearSaveError, clearRemoveError, clearScoreError } = assignmentsSlice.actions
export default assignmentsSlice.reducer
