import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lightbulb, 
  Sparkles, 
  TrendingUp, 
  AlertCircle, 
  FileText,
  Brain,
  ChevronRight
} from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchFiles } from '../store/slices/fileSlice'
import { generateInsight, fetchInsights } from '../store/slices/insightSlice'

const Insights = () => {
  const dispatch = useDispatch()
  const { files } = useSelector((state) => state.files)
  const { insights, generating, currentInsight } = useSelector((state) => state.insights)
  const [selectedFile, setSelectedFile] = useState(null)
  const [selectedInsight, setSelectedInsight] = useState(null)

  useEffect(() => {
    dispatch(fetchFiles())
    dispatch(fetchInsights())
  }, [dispatch])

  const handleGenerateInsight = async (fileId) => {
    const result = await dispatch(generateInsight(fileId))
    if (generateInsight.fulfilled.match(result)) {
      toast.success('AI Insights generated successfully!')
      dispatch(fetchInsights())
      setSelectedInsight(result.payload)
    } else {
      const error = result.payload || 'Failed to generate insights'
      if (error.includes('not configured')) {
        toast.error('AI service not configured. Please add OpenAI API key to backend.')
      } else {
        toast.error(error)
      }
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">AI Insights</h1>
        <p className="text-white/70">AI-powered analytics and recommendations</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Files List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 glass rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold mb-4">Your Files</h2>
          
          {files && files.length > 0 ? (
            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              {files.map((file) => {
                const hasInsight = insights?.some(i => i.fileId?._id === file._id)
                return (
                  <motion.div
                    key={file._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                      selectedFile?._id === file._id
                        ? 'border-yellow-500 bg-yellow-500/10'
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                    onClick={() => setSelectedFile(file)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate flex items-center">
                          <FileText className="w-4 h-4 mr-2 flex-shrink-0" />
                          {file.originalName}
                        </h3>
                        <p className="text-xs text-white/50 mt-1">
                          {file.rowCount} rows × {file.columnCount} columns
                        </p>
                        {hasInsight && (
                          <div className="mt-2 inline-flex items-center px-2 py-1 bg-green-500/20 rounded-full">
                            <Sparkles className="w-3 h-3 text-green-400 mr-1" />
                            <span className="text-xs text-green-400">Has Insights</span>
                          </div>
                        )}
                      </div>
                      {!hasInsight && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleGenerateInsight(file._id)
                          }}
                          disabled={generating}
                          className="btn-secondary text-sm py-1 px-3 disabled:opacity-50"
                        >
                          {generating ? 'Generating...' : 'Generate'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 mx-auto mb-3 text-white/30" />
              <p className="text-white/50">No files uploaded</p>
              <p className="text-white/30 text-sm mt-1">Upload files to generate insights</p>
            </div>
          )}
        </motion.div>

        {/* Insights Display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 space-y-6"
        >
          {generating ? (
            <div className="glass rounded-2xl p-12 text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 text-amber-400 animate-pulse" />
              <h2 className="text-2xl font-bold mb-2">Analyzing Data...</h2>
              <p className="text-white/70 mb-6">
                AI is processing your data and generating insights
              </p>
              <div className="loading-spinner w-8 h-8 mx-auto"></div>
            </div>
          ) : selectedInsight || (insights && insights.length > 0) ? (
            <div className="space-y-6">
              {/* Summary Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass rounded-2xl p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center">
                      <TrendingUp className="w-5 h-5 mr-2 text-orange-400" />
                      AI Summary
                    </h2>
                    <p className="text-white/50 text-sm mt-1">
                      {(selectedInsight || insights[0])?.fileId?.originalName || 'Analysis'}
                    </p>
                  </div>
                  <div className="text-right text-sm text-white/50">
                    <p>Generated {formatDate((selectedInsight || insights[0])?.generatedAt)}</p>
                    <p className="text-xs">Model: {(selectedInsight || insights[0])?.aiModel}</p>
                  </div>
                </div>
                <p className="text-white/90 leading-relaxed">
                  {(selectedInsight || insights[0])?.summary}
                </p>
              </motion.div>

              {/* Key Findings */}
              {(selectedInsight || insights[0])?.keyFindings?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                    Key Findings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(selectedInsight || insights[0]).keyFindings.map((finding, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="bg-white/5 rounded-lg p-4 border border-white/10"
                      >
                        <div className="flex items-start">
                          <ChevronRight className="w-5 h-5 text-orange-400 mr-2 flex-shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-semibold mb-1">{finding.title}</h4>
                            {finding.value && (
                              <p className="text-2xl font-bold text-orange-400 mb-2">
                                {finding.value}
                              </p>
                            )}
                            <p className="text-sm text-white/70">{finding.description}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Trends */}
              {(selectedInsight || insights[0])?.trends?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                    Trends Identified
                  </h3>
                  <ul className="space-y-3">
                    {(selectedInsight || insights[0]).trends.map((trend, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start"
                      >
                        <ChevronRight className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                        <p className="text-white/80">{trend}</p>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Recommendations */}
              {(selectedInsight || insights[0])?.recommendations?.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass rounded-2xl p-6"
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
                    Recommendations
                  </h3>
                  <ul className="space-y-3">
                    {(selectedInsight || insights[0]).recommendations.map((rec, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="flex items-start bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/20"
                      >
                        <Lightbulb className="w-5 h-5 text-yellow-400 mr-3 flex-shrink-0 mt-0.5" />
                        <p className="text-white/80">{rec}</p>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>
          ) : (
            <div className="glass rounded-2xl p-12 text-center">
              <Lightbulb className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
              <h2 className="text-2xl font-bold mb-2">No Insights Yet</h2>
              <p className="text-white/70 mb-6">
                {files && files.length > 0
                  ? 'Select a file and click "Generate" to create AI insights'
                  : 'Upload Excel files to generate AI-powered insights'}
              </p>
              {files && files.length > 0 && (
                <div className="inline-flex items-center px-4 py-2 bg-orange-500/20 rounded-lg border border-orange-500/30">
                  <AlertCircle className="w-5 h-5 text-orange-400 mr-2" />
                  <p className="text-sm text-orange-400">
                    Note: AI insights require OpenAI API key in backend
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

export default Insights
