import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, Users, FileText, BarChart3, TrendingUp, 
  UserCheck, UserX, Edit2, Trash2, X, Check 
} from 'lucide-react'
import toast from 'react-hot-toast'
import { fetchUsers, fetchPlatformStats, updateUser, deleteUser } from '../store/slices/adminSlice'

const AdminPanel = () => {
  const dispatch = useDispatch()
  const { users, stats, loading } = useSelector((state) => state.admin)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({ isActive: true, role: 'user' })

  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchPlatformStats())
  }, [dispatch])

  const handleEditUser = (user) => {
    setSelectedUser(user)
    setEditForm({ isActive: user.isActive, role: user.role })
    setEditModalOpen(true)
  }

  const handleUpdateUser = async () => {
    const result = await dispatch(updateUser({ 
      userId: selectedUser._id, 
      updates: editForm 
    }))
    if (updateUser.fulfilled.match(result)) {
      toast.success('User updated successfully')
      setEditModalOpen(false)
      dispatch(fetchPlatformStats())
    } else {
      toast.error(result.payload || 'Failed to update user')
    }
  }

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure? This will delete all user data including files and charts.')) {
      const result = await dispatch(deleteUser(userId))
      if (deleteUser.fulfilled.match(result)) {
        toast.success('User deleted successfully')
        dispatch(fetchPlatformStats())
      } else {
        toast.error(result.payload || 'Failed to delete user')
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
        <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
        <p className="text-white/70">Manage users and monitor platform activity</p>
      </motion.div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Total Users</p>
                <h3 className="text-3xl font-bold">{stats.statistics?.totalUsers || 0}</h3>
              </div>
              <Users className="w-12 h-12 text-orange-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Active Users</p>
                <h3 className="text-3xl font-bold">{stats.statistics?.activeUsers || 0}</h3>
              </div>
              <UserCheck className="w-12 h-12 text-green-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Total Files</p>
                <h3 className="text-3xl font-bold">{stats.statistics?.totalFiles || 0}</h3>
              </div>
              <FileText className="w-12 h-12 text-red-400" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Total Charts</p>
                <h3 className="text-3xl font-bold">{stats.statistics?.totalCharts || 0}</h3>
              </div>
              <BarChart3 className="w-12 h-12 text-orange-400" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">User Management</h2>
          <span className="text-white/50 text-sm">{users?.length || 0} users</span>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="loading-spinner w-8 h-8 mx-auto"></div>
            <p className="text-white/50 mt-3">Loading users...</p>
          </div>
        ) : users && users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-4 text-white/70 font-medium">User</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Email</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Role</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Status</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Files</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Charts</th>
                  <th className="text-left py-3 px-4 text-white/70 font-medium">Joined</th>
                  <th className="text-right py-3 px-4 text-white/70 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center">
                          <span className="text-sm font-bold">{user.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-white/70">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        user.role === 'admin' 
                          ? 'bg-amber-500/20 text-amber-400' 
                          : 'bg-orange-500/20 text-orange-400'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        user.isActive 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white/70">{user.stats?.fileCount || 0}</td>
                    <td className="py-3 px-4 text-white/70">{user.stats?.chartCount || 0}</td>
                    <td className="py-3 px-4 text-white/70 text-sm">{formatDate(user.createdAt)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-2 hover:bg-orange-500/20 rounded-lg transition-colors"
                          title="Edit User"
                        >
                          <Edit2 className="w-4 h-4 text-orange-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                          title="Delete User"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-3 text-white/30" />
            <p className="text-white/50">No users found</p>
          </div>
        )}
      </motion.div>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass rounded-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Edit User</h3>
                <button
                  onClick={() => setEditModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-white/70 text-sm mb-1">User</p>
                  <p className="font-medium">{selectedUser.name}</p>
                  <p className="text-white/50 text-sm">{selectedUser.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <select
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="input-glass"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={editForm.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.value === 'true' })}
                    className="input-glass"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                  <button onClick={() => setEditModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button onClick={handleUpdateUser} className="btn-primary">
                    Update User
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdminPanel
