import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

const initialState = {
  charts: [],
  currentChart: null,
  loading: false,
  generating: false,
  error: null,
}

export const generateChart = createAsyncThunk('charts/generate', async (chartData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/charts/generate', chartData)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Generation failed')
  }
})

export const fetchCharts = createAsyncThunk('charts/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/charts')
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Fetch failed')
  }
})

export const fetchChart = createAsyncThunk('charts/fetchOne', async (chartId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/charts/${chartId}`)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Fetch failed')
  }
})

export const deleteChart = createAsyncThunk('charts/delete', async (chartId, { rejectWithValue }) => {
  try {
    await api.delete(`/charts/${chartId}`)
    return chartId
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Delete failed')
  }
})

const chartSlice = createSlice({
  name: 'charts',
  initialState,
  reducers: {
    clearCurrentChart: (state) => {
      state.currentChart = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate
      .addCase(generateChart.pending, (state) => {
        state.generating = true
        state.error = null
      })
      .addCase(generateChart.fulfilled, (state, action) => {
        state.generating = false
        state.currentChart = action.payload
      })
      .addCase(generateChart.rejected, (state, action) => {
        state.generating = false
        state.error = action.payload
      })
      // Fetch All
      .addCase(fetchCharts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchCharts.fulfilled, (state, action) => {
        state.loading = false
        state.charts = action.payload
      })
      .addCase(fetchCharts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch One
      .addCase(fetchChart.fulfilled, (state, action) => {
        state.currentChart = action.payload
      })
      // Delete
      .addCase(deleteChart.fulfilled, (state, action) => {
        state.charts = state.charts.filter(chart => chart._id !== action.payload)
      })
  },
})

export const { clearCurrentChart, clearError } = chartSlice.actions
export default chartSlice.reducer
