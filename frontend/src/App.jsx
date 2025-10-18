import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Uploads from './pages/Uploads'
import Charts from './pages/Charts'
import Insights from './pages/Insights'
import AdminPanel from './pages/AdminPanel'
import Settings from './pages/Settings'

// Layout
import Layout from './components/Layout/Layout'

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, token } = useSelector((state) => state.auth)

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/app/dashboard" replace />
  }

  return children
}

function App() {
  const { token, user } = useSelector((state) => state.auth)
  
  // Redirect path based on user role
  const defaultPath = user?.role === 'admin' ? '/app/admin' : '/app/dashboard'

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={token ? <Navigate to={defaultPath} replace /> : <Landing />} 
        />
        <Route 
          path="/login" 
          element={token ? <Navigate to={defaultPath} replace /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={token ? <Navigate to={defaultPath} replace /> : <Register />} 
        />

        {/* Protected Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={user?.role === 'admin' ? <Navigate to="/app/admin" replace /> : <Dashboard />} />
          <Route path="uploads" element={<Uploads />} />
          <Route path="charts" element={<Charts />} />
          <Route path="insights" element={<Insights />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Admin Only */}
          <Route
            path="admin"
            element={
              <ProtectedRoute adminOnly>
                <AdminPanel />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(0, 0, 0, 0.8)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      />
    </>
  )
}

export default App
