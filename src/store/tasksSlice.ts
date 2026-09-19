import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { Task, TaskInput, TaskUpdateInput } from '../types'
import {
  createTaskRequest,
  fetchTasksRequest,
  removeTaskRequest,
  updateTaskRequest,
} from '../services/tasks'
import { apiErrorMessage } from '../services/apiError'
import { TASKS_CONTENT } from '../constants/tasks'

interface TasksState {
  items: Task[]
  loading: boolean
  loaded: boolean
  error: string | null
  saving: boolean
  saveError: string | null
  /** The task whose checkbox is mid flight, so only that row disables. */
  togglingId: string | null
  toggleError: string | null
  removingId: string | null
  removeError: string | null
}

const initialState: TasksState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
  saving: false,
  saveError: null,
  togglingId: null,
  toggleError: null,
  removingId: null,
  removeError: null,
}

export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (_arg, { rejectWithValue }) => {
    try {
      return await fetchTasksRequest()
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, TASKS_CONTENT.errors.load))
    }
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (input: TaskInput, { rejectWithValue }) => {
    try {
      return await createTaskRequest(input)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, TASKS_CONTENT.errors.create))
    }
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, input }: { id: string; input: TaskUpdateInput }, { rejectWithValue }) => {
    try {
      return await updateTaskRequest(id, input)
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, TASKS_CONTENT.errors.update))
    }
  }
)

/**
 * Ticking and unticking are the same call. Kept separate from updateTask so a
 * checkbox in flight disables only its own row, rather than the edit form's
 * saving flag standing in for both.
 */
export const toggleTask = createAsyncThunk(
  'tasks/toggleTask',
  async ({ id, completed }: { id: string; completed: boolean }, { rejectWithValue }) => {
    try {
      return await updateTaskRequest(id, { completed })
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, TASKS_CONTENT.errors.toggle))
    }
  }
)

export const removeTask = createAsyncThunk(
  'tasks/removeTask',
  async (id: string, { rejectWithValue }) => {
    try {
      await removeTaskRequest(id)
      return id
    } catch (error: unknown) {
      return rejectWithValue(apiErrorMessage(error, TASKS_CONTENT.errors.remove))
    }
  }
)

/**
 * The server returns due date ascending with undated last, and every write
 * returns the saved row. Rather than guess where a changed task belongs, the
 * reducer replaces in place and the views sort what they render, so one
 * ordering rule lives in one place.
 */
const replaceTask = (items: Task[], task: Task): Task[] =>
  items.map((item) => (item.id === task.id ? task : item))

const tasksSlice = createSlice({
  name: 'tasks',
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
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.loaded = true
        state.items = action.payload
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.loaded = true
        state.error = action.payload as string
      })

      .addCase(createTask.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.saving = false
        state.items.push(action.payload)
      })
      .addCase(createTask.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      .addCase(updateTask.pending, (state) => {
        state.saving = true
        state.saveError = null
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.saving = false
        state.items = replaceTask(state.items, action.payload)
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.saving = false
        state.saveError = action.payload as string
      })

      .addCase(toggleTask.pending, (state, action) => {
        state.togglingId = action.meta.arg.id
        state.toggleError = null
      })
      .addCase(toggleTask.fulfilled, (state, action) => {
        state.togglingId = null
        state.items = replaceTask(state.items, action.payload)
      })
      .addCase(toggleTask.rejected, (state, action) => {
        state.togglingId = null
        state.toggleError = action.payload as string
      })

      .addCase(removeTask.pending, (state, action) => {
        state.removingId = action.meta.arg
        state.removeError = null
      })
      .addCase(removeTask.fulfilled, (state, action) => {
        state.removingId = null
        state.items = state.items.filter((task) => task.id !== action.payload)
      })
      .addCase(removeTask.rejected, (state, action) => {
        state.removingId = null
        state.removeError = action.payload as string
      })
  },
})

export const { clearSaveError, clearRemoveError } = tasksSlice.actions
export default tasksSlice.reducer
