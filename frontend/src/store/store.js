import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import fileReducer from './slices/fileSlice'
import chartReducer from './slices/chartSlice'
import insightReducer from './slices/insightSlice'
import adminReducer from './slices/adminSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    files: fileReducer,
    charts: chartReducer,
    insights: insightReducer,
    admin: adminReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})
