import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { FileText, BarChart3, Lightbulb, TrendingUp, Upload } from 'lucide-react'
import { fetchFileStats } from '../store/slices/fileSlice'
import { fetchCharts } from '../store/slices/chartSlice'
import { fetchInsights } from '../store/slices/insightSlice'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { stats } = useSelector((state) => state.files)
  const { charts } = useSelector((state) => state.charts)
  const { insights } = useSelector((state) => state.insights)

  useEffect(() => {
    dispatch(fetchFileStats())
    dispatch(fetchCharts())
    dispatch(fetchInsights())
  }, [dispatch])

  const statsCards = [
    {
      title: 'Total Uploads',
      value: stats?.totalFiles || 0,
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-500/10',
    },
    {
      title: 'Charts Generated',
      value: charts?.length || 0,
      icon: BarChart3,
      color: 'from-red-500 to-red-600',
      bgColor: 'bg-red-500/10',
    },
    {
      title: 'AI Insights',
      value: insights?.length || 0,
      icon: Lightbulb,
      color: 'from-yellow-500 to-orange-600',
      bgColor: 'bg-yellow-500/10',
    },
    {
      title: 'Total Size',
      value: stats?.totalSize ? `${(stats.totalSize / (1024 * 1024)).toFixed(2)} MB` : '0 MB',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-white/70">Welcome to your analytics dashboard</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card-glass"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/70 text-sm mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
        
        {stats?.recentFile ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="font-medium">{stats.recentFile.originalName}</p>
                  <p className="text-sm text-white/50">
                    Uploaded {new Date(stats.recentFile.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-white/50">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recent activity</p>
            <p className="text-sm mt-1">Upload your first Excel file to get started</p>
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6"
      >
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/app/uploads"
            className="p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20 rounded-lg hover:scale-105 transition-transform"
          >
            <Upload className="w-8 h-8 text-orange-400 mb-2" />
            <h3 className="font-semibold mb-1">Upload File</h3>
            <p className="text-sm text-white/70">Upload and analyze Excel files</p>
          </a>
          
          <a
            href="/app/uploads"
            className="p-4 bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-lg hover:scale-105 transition-transform"
          >
            <BarChart3 className="w-8 h-8 text-red-400 mb-2" />
            <h3 className="font-semibold mb-1">Generate Chart</h3>
            <p className="text-sm text-white/70">Create visualizations</p>
          </a>
          
          <a
            href="/app/insights"
            className="p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-lg hover:scale-105 transition-transform"
          >
            <Lightbulb className="w-8 h-8 text-yellow-400 mb-2" />
            <h3 className="font-semibold mb-1">AI Insights</h3>
            <p className="text-sm text-white/70">Get AI-powered analysis</p>
          </a>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
