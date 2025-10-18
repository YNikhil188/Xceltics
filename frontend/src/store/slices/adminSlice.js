import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

const initialState = {
  users: [],
  stats: null,
  loading: false,
  error: null,
}

export const fetchUsers = createAsyncThunk('admin/fetchUsers', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/users')
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users')
  }
})

export const fetchPlatformStats = createAsyncThunk('admin/fetchStats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/admin/stats')
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch statistics')
  }
})

export const updateUser = createAsyncThunk('admin/updateUser', async ({ userId, updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/admin/users/${userId}`, updates)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update user')
  }
})

export const deleteUser = createAsyncThunk('admin/deleteUser', async (userId, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/users/${userId}`)
    return userId
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete user')
  }
})

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch Stats
      .addCase(fetchPlatformStats.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPlatformStats.fulfilled, (state, action) => {
        state.loading = false
        state.stats = action.payload
      })
      .addCase(fetchPlatformStats.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update User
      .addCase(updateUser.fulfilled, (state, action) => {
        state.users = state.users.map(user =>
          user._id === action.payload._id ? action.payload : user
        )
      })
      // Delete User
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload)
      })
  },
})

export const { clearError } = adminSlice.actions
export default adminSlice.reducer
