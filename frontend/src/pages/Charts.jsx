import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2'
import Plot from 'react-plotly.js'
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
import { BarChart3, Trash2, Download, Calendar, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchCharts, deleteChart } from '../store/slices/chartSlice'
import { fetchFiles } from '../store/slices/fileSlice'
import ChartModal from '../components/ChartModal'

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

const Charts = () => {
  const dispatch = useDispatch()
  const { charts, loading } = useSelector((state) => state.charts)
  const { files } = useSelector((state) => state.files)
  const [selectedChart, setSelectedChart] = useState(null)
  const [chartModalOpen, setChartModalOpen] = useState(false)
  const [selectedFileId, setSelectedFileId] = useState(null)
  const plotRef = useRef(null)

  useEffect(() => {
    dispatch(fetchCharts())
    dispatch(fetchFiles())
  }, [dispatch])

  const handleGenerateChart = (fileId = null) => {
    setSelectedFileId(fileId)
    setChartModalOpen(true)
  }

  const handleDelete = async (chartId) => {
    if (window.confirm('Are you sure you want to delete this chart?')) {
      const result = await dispatch(deleteChart(chartId))
      if (deleteChart.fulfilled.match(result)) {
        toast.success('Chart deleted successfully')
        if (selectedChart?._id === chartId) {
          setSelectedChart(null)
        }
      }
    }
  }

  const handleExport = () => {
    if (!selectedChart) return

    try {
      const filename = `${selectedChart.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${Date.now()}`

      // For 3D charts (Plotly), instruct user to use toolbar camera icon
      if (selectedChart.chartType === 'scatter3d' || selectedChart.chartType === 'bar3d') {
        toast('Please use the camera icon 📷 in the chart toolbar (top-right) to download', {
          duration: 5000,
          icon: 'ℹ️',
        })
        return
      }

      // For Chart.js charts (2D), convert canvas to image
      const canvas = document.querySelector('canvas')
      if (!canvas) {
        toast.error('Chart canvas not found')
        return
      }

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error('Failed to export chart')
          return
        }

        // Create download link
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${filename}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)

        toast.success('Chart exported successfully!')
      }, 'image/png')
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Failed to export chart')
    }
  }

  const getChartComponent = (chart) => {
    // Handle 3D charts with Plotly
    if (chart.chartType === 'scatter3d' || chart.chartType === 'bar3d') {
      console.log('Full chart object:', chart)
      console.log('Chart data structure:', chart.chartData)
      
      // Create mutable copies of layout and data
      let layoutData = JSON.parse(JSON.stringify(chart.chartData?.layout || {}))
      let plotData = JSON.parse(JSON.stringify(chart.chartData?.data || []))
      
      // Ensure plotData is an array and has valid data
      if (!Array.isArray(plotData) || plotData.length === 0) {
        console.error('Invalid plotData:', plotData)
        console.error('ChartData:', chart.chartData)
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/50">No data available for this chart</p>
            <p className="text-white/30 text-xs mt-2">Check console for details</p>
          </div>
        )
      }
      
      // Verify the first plot item has required properties
      const firstPlot = plotData[0]
      if (!firstPlot || !firstPlot.x || !firstPlot.y || !firstPlot.z) {
        console.error('Invalid plot structure:', firstPlot)
        console.error('Full plotData:', plotData)
        return (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/50">Invalid chart data structure</p>
            <p className="text-white/30 text-xs mt-2">Missing x, y, or z data</p>
          </div>
        )
      }
      
      // Convert string values to numeric for 3D plotting
      const processedPlotData = plotData.map(trace => {
        const processedTrace = { ...trace }
        
        // Check if x values are strings and convert to numeric indices
        if (trace.x && trace.x.length > 0 && typeof trace.x[0] === 'string') {
          const uniqueX = [...new Set(trace.x)]
          const xMapping = Object.fromEntries(uniqueX.map((val, idx) => [val, idx]))
          processedTrace.x = trace.x.map(val => xMapping[val])
          processedTrace.text = trace.text || trace.x.map((val, i) => 
            `X: ${val}<br>Y: ${trace.y[i]}<br>Z: ${trace.z[i]}`
          )
          // Store original labels for axis
          if (!layoutData.scene) layoutData.scene = {}
          layoutData.scene.xaxis = {
            ...(layoutData.scene.xaxis || {}),
            ticktext: uniqueX,
            tickvals: uniqueX.map((_, idx) => idx),
            tickmode: 'array'
          }
        }
        
        // Check if y values are strings and convert to numeric indices
        if (trace.y && trace.y.length > 0 && typeof trace.y[0] === 'string') {
          const uniqueY = [...new Set(trace.y)]
          const yMapping = Object.fromEntries(uniqueY.map((val, idx) => [val, idx]))
          processedTrace.y = trace.y.map(val => yMapping[val])
          if (!layoutData.scene) layoutData.scene = {}
          layoutData.scene.yaxis = {
            ...(layoutData.scene.yaxis || {}),
            ticktext: uniqueY,
            tickvals: uniqueY.map((_, idx) => idx),
            tickmode: 'array'
          }
        }
        
        return processedTrace
      })
      
      console.log('3D Chart Data:', { 
        chartType: chart.chartType,
        dataPointsCount: firstPlot.x?.length || 0,
        hasX: !!firstPlot.x,
        hasY: !!firstPlot.y,
        hasZ: !!firstPlot.z,
        plotType: firstPlot.type,
        originalXSample: firstPlot.x?.slice(0, 5),
        processedXSample: processedPlotData[0].x?.slice(0, 5),
        ySample: firstPlot.y?.slice(0, 5),
        zSample: firstPlot.z?.slice(0, 5)
      })
      
      try {
        return (
          <div style={{ width: '100%', height: '100%', minHeight: '500px', position: 'relative' }}>
            <Plot
              ref={plotRef}
              data={processedPlotData}
              layout={{
                autosize: true,
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font: { color: 'white', size: 12 },
                margin: { l: 50, r: 50, t: 50, b: 50 },
                scene: {
                  xaxis: { 
                    title: layoutData.scene?.xaxis?.title || 'X',
                    gridcolor: 'rgba(255,255,255,0.1)', 
                    color: 'white',
                    backgroundcolor: 'rgba(0,0,0,0)',
                    ...(layoutData.scene?.xaxis || {})
                  },
                  yaxis: { 
                    title: layoutData.scene?.yaxis?.title || 'Y',
                    gridcolor: 'rgba(255,255,255,0.1)', 
                    color: 'white',
                    backgroundcolor: 'rgba(0,0,0,0)',
                    ...(layoutData.scene?.yaxis || {})
                  },
                  zaxis: { 
                    title: layoutData.scene?.zaxis?.title || 'Z',
                    gridcolor: 'rgba(255,255,255,0.1)', 
                    color: 'white',
                    backgroundcolor: 'rgba(0,0,0,0)',
                    ...(layoutData.scene?.zaxis || {})
                  },
                  bgcolor: 'rgba(0,0,0,0)',
                  camera: {
                    eye: { x: 1.5, y: 1.5, z: 1.5 }
                  }
                },
              }}
              config={{ 
                responsive: true, 
                displayModeBar: true,
                displaylogo: false,
                modeBarButtonsToRemove: ['pan3d', 'lasso3d', 'select3d'],
                toImageButtonOptions: {
                  format: 'png',
                  filename: chart.title || 'chart',
                  height: 1080,
                  width: 1920,
                  scale: 1
                }
              }}
              style={{ width: '100%', height: '100%', minHeight: '500px' }}
              useResizeHandler={true}
              onInitialized={(figure) => console.log('Plot initialized:', figure)}
              onUpdate={(figure) => console.log('Plot updated:', figure)}
              onError={(error) => console.error('Plot error:', error)}
            />
          </div>
        )
      } catch (error) {
        console.error('Error rendering 3D chart:', error)
        console.error('Error stack:', error.stack)
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-400 mb-2">Error rendering 3D chart</p>
              <p className="text-white/50 text-sm">{error.message}</p>
              <button 
                onClick={() => console.log('Chart data:', { chart, processedPlotData, layoutData })}
                className="mt-4 px-4 py-2 bg-white/10 rounded text-sm"
              >
                Log Debug Info
              </button>
            </div>
          </div>
        )
      }
    }

    // Handle 2D charts with Chart.js
    const options = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: 'white' },
        },
        title: {
          display: true,
          text: chart.title,
          color: 'white',
          font: { size: 16 },
        },
      },
      scales:
        chart.chartType === 'pie' || chart.chartType === 'doughnut'
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

    switch (chart.chartType) {
      case 'bar':
        return <Bar data={chart.chartData} options={options} />
      case 'line':
        return <Line data={chart.chartData} options={options} />
      case 'pie':
        return <Pie data={chart.chartData} options={options} />
      case 'doughnut':
        return <Doughnut data={chart.chartData} options={options} />
      default:
        return null
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
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-4xl font-bold mb-2">Generated Charts</h1>
          <p className="text-white/70">View and manage your chart visualizations</p>
        </div>
        <button
          onClick={() => handleGenerateChart()}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Generate New Chart</span>
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1 glass rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Your Charts</h2>
            <span className="text-white/50 text-sm">{charts?.length || 0} charts</span>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="loading-spinner w-8 h-8 mx-auto"></div>
              <p className="text-white/50 mt-3">Loading charts...</p>
            </div>
          ) : charts && charts.length > 0 ? (
            <div className="space-y-2 max-h-[calc(100vh-300px)] overflow-y-auto">
              <AnimatePresence>
                {charts.map((chart, index) => (
                  <motion.div
                    key={chart._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => setSelectedChart(chart)}
                    className={`w-full text-left p-4 rounded-lg transition-all cursor-pointer ${
                      selectedChart?._id === chart._id
                        ? 'bg-orange-500/20 border-2 border-orange-500'
                        : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{chart.title}</h3>
                        <div className="flex items-center space-x-2 mt-2 text-xs text-white/50">
                          <BarChart3 className="w-3 h-3" />
                          <span className="capitalize">{chart.chartType}</span>
                          <span>•</span>
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(chart.createdAt)}</span>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(chart._id)
                        }}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-white/30" />
              <p className="text-white/50">No charts generated yet</p>
              <p className="text-white/30 text-sm mt-1">
                Upload files and generate charts to see them here
              </p>
            </div>
          )}
        </motion.div>

        {/* Chart Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 glass rounded-2xl p-6"
        >
          {selectedChart ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedChart.title}</h2>
                  <p className="text-white/70 text-sm mt-1">
                    {selectedChart.description || 'No description'}
                  </p>
                  <div className="flex items-center space-x-4 mt-3 text-sm text-white/50">
                    <span>Type: {selectedChart.chartType}</span>
                    <span>•</span>
                    <span>X: {selectedChart.chartConfig.xAxis}</span>
                    <span>•</span>
                    <span>Y: {selectedChart.chartConfig.yAxis}</span>
                    {selectedChart.chartConfig.zAxis && (
                      <>
                        <span>•</span>
                        <span>Z: {selectedChart.chartConfig.zAxis}</span>
                      </>
                    )}
                    {selectedChart.chartConfig.aggregation !== 'none' && (
                      <>
                        <span>•</span>
                        <span>Aggregation: {selectedChart.chartConfig.aggregation}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleExport}
                  className="btn-secondary flex items-center space-x-2"
                  title="Download Chart"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </button>
              </div>

              <div className="glass-dark rounded-xl p-6">
                <div style={{ height: '500px', width: '100%' }}>
                  {getChartComponent(selectedChart)}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full min-h-[400px]">
              <div className="text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-white/30" />
                <h3 className="text-xl font-semibold mb-2">No Chart Selected</h3>
                <p className="text-white/50">
                  Select a chart from the list to view it here
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Chart Modal */}
      <ChartModal
        isOpen={chartModalOpen}
        onClose={() => {
          setChartModalOpen(false)
          setSelectedFileId(null)
        }}
        fileId={selectedFileId}
      />
    </div>
  )
}

export default Charts
