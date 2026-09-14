import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import calendarEventsReducer from './calendarEventsSlice'
import studentsReducer from './studentsSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    calendarEvents: calendarEventsReducer,
    students: studentsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
