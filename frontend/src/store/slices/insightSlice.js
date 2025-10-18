import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

const initialState = {
  insights: [],
  currentInsight: null,
  loading: false,
  generating: false,
  error: null,
}

export const generateInsight = createAsyncThunk('insights/generate', async (fileId, { rejectWithValue }) => {
  try {
    const { data } = await api.post(`/insights/${fileId}`)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Generation failed')
  }
})

export const fetchInsights = createAsyncThunk('insights/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/insights')
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Fetch failed')
  }
})

export const fetchInsight = createAsyncThunk('insights/fetchOne', async (fileId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/insights/${fileId}`)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Fetch failed')
  }
})

const insightSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    clearCurrentInsight: (state) => {
      state.currentInsight = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate
      .addCase(generateInsight.pending, (state) => {
        state.generating = true
        state.error = null
      })
      .addCase(generateInsight.fulfilled, (state, action) => {
        state.generating = false
        state.currentInsight = action.payload
      })
      .addCase(generateInsight.rejected, (state, action) => {
        state.generating = false
        state.error = action.payload
      })
      // Fetch All
      .addCase(fetchInsights.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchInsights.fulfilled, (state, action) => {
        state.loading = false
        state.insights = action.payload
      })
      .addCase(fetchInsights.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch One
      .addCase(fetchInsight.fulfilled, (state, action) => {
        state.currentInsight = action.payload
      })
  },
})

export const { clearCurrentInsight, clearError } = insightSlice.actions
export default insightSlice.reducer
