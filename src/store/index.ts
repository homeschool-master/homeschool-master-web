import { configureStore } from '@reduxjs/toolkit'
import assignmentsReducer from './assignmentsSlice'
import authReducer from './authSlice'
import calendarEventsReducer from './calendarEventsSlice'
import progressReducer from './progressSlice'
import studentsReducer from './studentsSlice'
import subjectsReducer from './subjectsSlice'
import tasksReducer from './tasksSlice'

export const store = configureStore({
  reducer: {
    assignments: assignmentsReducer,
    auth: authReducer,
    calendarEvents: calendarEventsReducer,
    progress: progressReducer,
    students: studentsReducer,
    subjects: subjectsReducer,
    tasks: tasksReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
