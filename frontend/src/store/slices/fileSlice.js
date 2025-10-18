import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/api'

const initialState = {
  files: [],
  currentFile: null,
  stats: null,
  loading: false,
  uploading: false,
  error: null,
}

export const uploadFile = createAsyncThunk('files/upload', async (formData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Upload failed')
  }
})

export const fetchFiles = createAsyncThunk('files/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/files')
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Fetch failed')
  }
})

export const fetchFile = createAsyncThunk('files/fetchOne', async (fileId, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/files/${fileId}`)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Fetch failed')
  }
})

export const deleteFile = createAsyncThunk('files/delete', async (fileId, { rejectWithValue }) => {
  try {
    await api.delete(`/files/${fileId}`)
    return fileId
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Delete failed')
  }
})

export const fetchFileStats = createAsyncThunk('files/stats', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/files/stats/summary')
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Fetch failed')
  }
})

const fileSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    clearCurrentFile: (state) => {
      state.currentFile = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Upload
      .addCase(uploadFile.pending, (state) => {
        state.uploading = true
        state.error = null
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.uploading = false
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.uploading = false
        state.error = action.payload
      })
      // Fetch All
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false
        state.files = action.payload
      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Fetch One
      .addCase(fetchFile.fulfilled, (state, action) => {
        state.currentFile = action.payload
      })
      // Delete
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(file => file._id !== action.payload)
      })
      // Stats
      .addCase(fetchFileStats.fulfilled, (state, action) => {
        state.stats = action.payload
      })
  },
})

export const { clearCurrentFile, clearError } = fileSlice.actions
export default fileSlice.reducer
