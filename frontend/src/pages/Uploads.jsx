import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Trash2, Eye, BarChart3, AlertCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { uploadFile, fetchFiles, deleteFile } from '../store/slices/fileSlice'
import ChartModal from '../components/ChartModal'

const Uploads = () => {
  const dispatch = useDispatch()
  const { files, uploading } = useSelector((state) => state.files)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [chartModalOpen, setChartModalOpen] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState(null)
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)

  useEffect(() => {
    dispatch(fetchFiles())
  }, [dispatch])

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0]
    
    if (!file) {
      toast.error('Please select a file')
      return
    }

    // Check file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    
    const extension = file.name.split('.').pop().toLowerCase()
    const validExtensions = ['xls', 'xlsx']

    if (!validTypes.includes(file.type) && !validExtensions.includes(extension)) {
      toast.error('Please upload only Excel files (.xls, .xlsx)')
      return
    }

    // Check file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return
    }

    const formData = new FormData()
    formData.append('file', file)

    setUploadProgress(0)
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + 10
      })
    }, 200)

    const result = await dispatch(uploadFile(formData))
    clearInterval(progressInterval)
    setUploadProgress(100)

    if (uploadFile.fulfilled.match(result)) {
      toast.success('File uploaded successfully!')
      dispatch(fetchFiles())
      setTimeout(() => setUploadProgress(0), 1000)
    } else {
      setUploadProgress(0)
    }
  }, [dispatch])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    disabled: uploading
  })

  const handleDelete = async (fileId) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      const result = await dispatch(deleteFile(fileId))
      if (deleteFile.fulfilled.match(result)) {
        toast.success('File deleted successfully')
      }
    }
  }

  const handleGenerateChart = (fileId) => {
    setSelectedFileId(fileId)
    setChartModalOpen(true)
  }

  const handleViewDetails = (file) => {
    setSelectedFile(file)
    setViewDetailsOpen(true)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">File Uploads</h1>
        <p className="text-white/70">Upload and manage your Excel files</p>
      </motion.div>

      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-8"
      >
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-orange-500 bg-orange-500/10'
              : 'border-white/20 hover:border-white/40 hover:bg-white/5'
          } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <input {...getInputProps()} />
          
          <Upload className={`w-16 h-16 mx-auto mb-4 ${
            isDragActive ? 'text-orange-400' : 'text-white/70'
          }`} />
          
          {uploading ? (
            <div>
              <h3 className="text-xl font-bold mb-2">Uploading...</h3>
              <div className="w-full bg-white/10 rounded-full h-2 mb-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-orange-500 to-red-600 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-white/50 text-sm">{uploadProgress}%</p>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-bold mb-2">
                {isDragActive ? 'Drop your file here' : 'Drag & drop your Excel file here'}
              </h3>
              <p className="text-white/70 mb-4">or click to browse</p>
              <button className="btn-primary">
                Choose File
              </button>
              <p className="text-white/50 text-sm mt-4">
                Supports .xls and .xlsx files (Max 10MB)
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Files List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Uploaded Files</h2>
          <span className="text-white/50 text-sm">{files?.length || 0} files</span>
        </div>

        {files && files.length > 0 ? (
          <div className="space-y-3">
            <AnimatePresence>
              {files.map((file, index) => (
                <motion.div
                  key={file._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{file.originalName}</h3>
                        <div className="flex items-center space-x-3 text-sm text-white/50">
                          <span>{formatFileSize(file.fileSize)}</span>
                          <span>•</span>
                          <span>{file.rowCount} rows × {file.columnCount} columns</span>
                          <span>•</span>
                          <span>{formatDate(file.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewDetails(file)}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleGenerateChart(file._id)}
                        className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
                        title="Generate Chart"
                      >
                        <BarChart3 className="w-5 h-5 text-orange-400" />
                      </button>
                      <button
                        onClick={() => handleDelete(file._id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5 text-red-400" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 mx-auto mb-3 text-white/30" />
            <p className="text-white/50">No files uploaded yet</p>
            <p className="text-white/30 text-sm mt-1">Upload your first Excel file to get started</p>
          </div>
        )}
      </motion.div>

      {/* Chart Modal */}
      <ChartModal
        isOpen={chartModalOpen}
        onClose={() => {
          setChartModalOpen(false)
          setSelectedFileId(null)
        }}
        fileId={selectedFileId}
      />

      {/* File Details Modal */}
      <AnimatePresence>
        {viewDetailsOpen && selectedFile && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
            >
              {/* Header */}
              <div className="glass-dark border-b border-white/10 p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedFile.originalName}</h2>
                  <p className="text-white/70 text-sm mt-1">
                    {formatFileSize(selectedFile.fileSize)} • {selectedFile.rowCount} rows × {selectedFile.columnCount} columns
                  </p>
                </div>
                <button
                  onClick={() => {
                    setViewDetailsOpen(false)
                    setSelectedFile(null)
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto">
                {/* File Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="glass rounded-lg p-4">
                    <p className="text-white/50 text-sm mb-1">Uploaded</p>
                    <p className="font-semibold">{formatDate(selectedFile.createdAt)}</p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <p className="text-white/50 text-sm mb-1">File Size</p>
                    <p className="font-semibold">{formatFileSize(selectedFile.fileSize)}</p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <p className="text-white/50 text-sm mb-1">Rows</p>
                    <p className="font-semibold">{selectedFile.rowCount}</p>
                  </div>
                  <div className="glass rounded-lg p-4">
                    <p className="text-white/50 text-sm mb-1">Columns</p>
                    <p className="font-semibold">{selectedFile.columnCount}</p>
                  </div>
                </div>

                {/* Headers */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3">Column Headers</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedFile.headers?.map((header, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-orange-500/20 text-orange-400 rounded-full text-sm font-medium"
                      >
                        {header}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Data Preview */}
                <div>
                  <h3 className="text-lg font-bold mb-3">Data Preview (First 10 rows)</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-white/10">
                          {selectedFile.headers?.map((header, index) => (
                            <th key={index} className="text-left py-3 px-4 text-white/70 font-medium whitespace-nowrap">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedFile.parsedData?.slice(0, 10).map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b border-white/5 hover:bg-white/5">
                            {selectedFile.headers?.map((header, colIndex) => (
                              <td key={colIndex} className="py-3 px-4 text-white/90 whitespace-nowrap">
                                {row[header]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  {selectedFile.rowCount > 10 && (
                    <p className="text-white/50 text-sm mt-3 text-center">
                      Showing 10 of {selectedFile.rowCount} rows
                    </p>
                  )}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="glass-dark border-t border-white/10 p-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setViewDetailsOpen(false)
                    setSelectedFile(null)
                  }}
                  className="btn-secondary"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setViewDetailsOpen(false)
                    handleGenerateChart(selectedFile._id)
                  }}
                  className="btn-primary flex items-center space-x-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Generate Chart</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Uploads
