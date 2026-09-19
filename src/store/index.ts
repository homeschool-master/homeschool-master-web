import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import calendarEventsReducer from './calendarEventsSlice'
import studentsReducer from './studentsSlice'
import subjectsReducer from './subjectsSlice'
import tasksReducer from './tasksSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    calendarEvents: calendarEventsReducer,
    students: studentsReducer,
    subjects: subjectsReducer,
    tasks: tasksReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
