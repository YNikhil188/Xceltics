import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { X, BarChart3, LineChart, PieChart, Activity, Box, Layers } from 'lucide-react'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import toast from 'react-hot-toast'
import { generateChart } from '../store/slices/chartSlice'
import { fetchFile } from '../store/slices/fileSlice'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const ChartModal = ({ isOpen, onClose, fileId: propFileId }) => {
  const dispatch = useDispatch()
  const { currentFile, files } = useSelector((state) => state.files)
  const { generating, currentChart } = useSelector((state) => state.charts)

  const [selectedFileId, setSelectedFileId] = useState(propFileId || '')
  const [chartConfig, setChartConfig] = useState({
    chartType: 'bar',
    xAxis: '',
    yAxis: '',
    zAxis: '', // For 3D charts
    aggregation: 'none',
    title: '',
  })

  const [previewData, setPreviewData] = useState(null)

  useEffect(() => {
    if (isOpen) {
      // Set initial fileId if provided
      if (propFileId) {
        setSelectedFileId(propFileId)
      }
    }
  }, [isOpen, propFileId])

  useEffect(() => {
    if (selectedFileId) {
      dispatch(fetchFile(selectedFileId))
    }
  }, [selectedFileId, dispatch])

  useEffect(() => {
    if (currentChart) {
      setPreviewData(currentChart.chartData)
    }
  }, [currentChart])

  const chartTypes = [
    { value: 'bar', label: 'Bar Chart', icon: BarChart3, is3D: false },
    { value: 'line', label: 'Line Chart', icon: LineChart, is3D: false },
    { value: 'pie', label: 'Pie Chart', icon: PieChart, is3D: false },
    { value: 'doughnut', label: 'Doughnut', icon: Activity, is3D: false },
    { value: 'scatter3d', label: '3D Scatter', icon: Box, is3D: true },
    { value: 'bar3d', label: '3D Bar', icon: Layers, is3D: true },
  ]

  const aggregations = [
    { value: 'none', label: 'No Aggregation' },
    { value: 'sum', label: 'Sum' },
    { value: 'avg', label: 'Average' },
    { value: 'count', label: 'Count' },
    { value: 'min', label: 'Minimum' },
    { value: 'max', label: 'Maximum' },
  ]

  const handleGenerate = async () => {
    if (!chartConfig.xAxis || !chartConfig.yAxis) {
      toast.error('Please select both X and Y axes')
      return
    }

    // Check if Z-axis is required for 3D charts
    const is3DChart = chartTypes.find(t => t.value === chartConfig.chartType)?.is3D
    if (is3DChart && !chartConfig.zAxis) {
      toast.error('Please select Z-axis for 3D chart')
      return
    }

    if (!selectedFileId) {
      toast.error('Please select a file')
      return
    }

    const payload = {
      fileId: selectedFileId,
      ...chartConfig,
      title: chartConfig.title || (is3DChart 
        ? `${chartConfig.xAxis} vs ${chartConfig.yAxis} vs ${chartConfig.zAxis}`
        : `${chartConfig.yAxis} vs ${chartConfig.xAxis}`),
    }

    const result = await dispatch(generateChart(payload))
    if (generateChart.fulfilled.match(result)) {
      toast.success('Chart generated successfully!')
    } else if (result.payload) {
      toast.error(result.payload)
    }
  }

  const getChartComponent = () => {
    if (!previewData) return null

    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: 'white',
          },
        },
        title: {
          display: true,
          text: chartConfig.title || 'Chart Preview',
          color: 'white',
        },
      },
      scales:
        chartConfig.chartType === 'pie' || chartConfig.chartType === 'doughnut'
          ? {}
          : {
              x: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
              },
              y: {
                ticks: { color: 'white' },
                grid: { color: 'rgba(255, 255, 255, 0.1)' },
              },
            },
    }

    switch (chartConfig.chartType) {
      case 'bar':
        return <Bar data={previewData} options={options} />
      case 'line':
        return <Line data={previewData} options={options} />
      case 'pie':
        return <Pie data={previewData} options={options} />
      case 'doughnut':
        return <Doughnut data={previewData} options={options} />
      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="glass rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 glass-dark border-b border-white/10 p-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Generate Chart</h2>
              <p className="text-white/70 text-sm mt-1">
                {currentFile?.originalName || 'Loading...'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* File Selection (only if no fileId provided) */}
            {!propFileId && (
              <div>
                <label className="block text-sm font-medium mb-2">Select File</label>
                <select
                  value={selectedFileId}
                  onChange={(e) => {
                    setSelectedFileId(e.target.value)
                    // Reset config when file changes
                    setChartConfig({
                      chartType: 'bar',
                      xAxis: '',
                      yAxis: '',
                      zAxis: '',
                      aggregation: 'none',
                      title: '',
                    })
                  }}
                  className="input-glass"
                >
                  <option value="">Choose a file...</option>
                  {files?.map((file) => (
                    <option key={file._id} value={file._id}>
                      {file.originalName} ({file.rowCount} rows × {file.columnCount} columns)
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Chart Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-3">Chart Type</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {chartTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.value}
                      onClick={() =>
                        setChartConfig({ ...chartConfig, chartType: type.value })
                      }
                      className={`p-4 rounded-lg border-2 transition-all ${
                        chartConfig.chartType === type.value
                          ? 'border-orange-500 bg-orange-500/20'
                          : 'border-white/20 hover:border-white/40'
                      }`}
                    >
                      <Icon className="w-8 h-8 mx-auto mb-2" />
                      <p className="text-sm font-medium">{type.label}</p>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Axis Selection */}
            <div className={`grid grid-cols-1 ${chartTypes.find(t => t.value === chartConfig.chartType)?.is3D ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
              <div>
                <label className="block text-sm font-medium mb-2">X-Axis</label>
                <select
                  value={chartConfig.xAxis}
                  onChange={(e) =>
                    setChartConfig({ ...chartConfig, xAxis: e.target.value })
                  }
                  className="input-glass"
                >
                  <option value="">Select column...</option>
                  {currentFile?.headers?.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Y-Axis</label>
                <select
                  value={chartConfig.yAxis}
                  onChange={(e) =>
                    setChartConfig({ ...chartConfig, yAxis: e.target.value })
                  }
                  className="input-glass"
                >
                  <option value="">Select column...</option>
                  {currentFile?.headers?.map((header) => (
                    <option key={header} value={header}>
                      {header}
                    </option>
                  ))}
                </select>
              </div>

              {/* Z-Axis for 3D charts */}
              {chartTypes.find(t => t.value === chartConfig.chartType)?.is3D && (
                <div>
                  <label className="block text-sm font-medium mb-2">Z-Axis</label>
                  <select
                    value={chartConfig.zAxis}
                    onChange={(e) =>
                      setChartConfig({ ...chartConfig, zAxis: e.target.value })
                    }
                    className="input-glass"
                  >
                    <option value="">Select column...</option>
                    {currentFile?.headers?.map((header) => (
                      <option key={header} value={header}>
                        {header}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Aggregation */}
            <div>
              <label className="block text-sm font-medium mb-2">Aggregation</label>
              <select
                value={chartConfig.aggregation}
                onChange={(e) =>
                  setChartConfig({ ...chartConfig, aggregation: e.target.value })
                }
                className="input-glass"
              >
                {aggregations.map((agg) => (
                  <option key={agg.value} value={agg.value}>
                    {agg.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Chart Title (Optional)
              </label>
              <input
                type="text"
                value={chartConfig.title}
                onChange={(e) =>
                  setChartConfig({ ...chartConfig, title: e.target.value })
                }
                placeholder={`${chartConfig.yAxis || 'Y'} vs ${chartConfig.xAxis || 'X'}`}
                className="input-glass"
              />
            </div>

            {/* Preview */}
            {previewData && (
              <div className="glass-dark rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4">Preview</h3>
                <div className="h-80">{getChartComponent()}</div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
              <button onClick={onClose} className="btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={
                  generating || 
                  !chartConfig.xAxis || 
                  !chartConfig.yAxis || 
                  (chartTypes.find(t => t.value === chartConfig.chartType)?.is3D && !chartConfig.zAxis)
                }
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {generating ? (
                  <div className="flex items-center">
                    <div className="loading-spinner w-5 h-5 mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate Chart'
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

export default ChartModal
