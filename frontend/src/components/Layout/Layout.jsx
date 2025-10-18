import { useState } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Upload,
  BarChart3,
  Lightbulb,
  Settings,
  LogOut,
  Menu,
  X,
  Shield,
} from 'lucide-react'
import { logout } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  // Different navigation items based on user role
  const navItems = user?.role === 'admin' 
    ? [
        { name: 'Admin Panel', path: '/app/admin', icon: Shield },
        { name: 'Settings', path: '/app/settings', icon: Settings },
      ]
    : [
        { name: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
        { name: 'Uploads', path: '/app/uploads', icon: Upload },
        { name: 'Charts', path: '/app/charts', icon: BarChart3 },
        { name: 'Insights', path: '/app/insights', icon: Lightbulb },
        { name: 'Settings', path: '/app/settings', icon: Settings },
      ]

  const handleLogout = () => {
    dispatch(logout())
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ type: 'spring', damping: 20 }}
            className="w-64 glass-dark border-r border-white/10 p-6 flex flex-col fixed h-screen z-50"
          >
            {/* Logo */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
                XCELTICS
              </h1>
              <p className="text-white/50 text-xs mt-1 uppercase tracking-wide">Smarter Data, Smarter Decisions</p>
            </div>

            {/* User Info */}
            <div className="glass rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {user?.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{user?.name}</p>
                  <p className="text-white/50 text-xs truncate">{user?.email}</p>
                </div>
              </div>
              {user?.role === 'admin' && (
                <div className="mt-2 inline-flex items-center px-2 py-1 bg-amber-500/20 rounded-full">
                  <Shield className="w-3 h-3 text-amber-400 mr-1" />
                  <span className="text-xs text-amber-400 font-medium">Admin</span>
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                )
              })}
            </nav>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/10 transition-all w-full"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="glass-dark border-b border-white/10 p-4 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-white/70">Welcome back,</p>
                <p className="font-semibold">{user?.name}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
