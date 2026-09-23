import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  Search, 
  UserPlus, 
  Shield, 
  MoreVertical, 
  Mail, 
  ShieldCheck, 
  User as UserIcon,
  Filter,
  XCircle,
  Key,
  Lock,
  Edit2,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'trainer'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/auth/users');
      if (response.data && Array.isArray(response.data.data)) {
        setUsers(response.data.data);
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      toast.error('Failed to load user directory');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updateData = {
          name: formData.name,
          email: formData.email,
          role: formData.role
        };
        if (formData.password) {
          updateData.password = formData.password;
        }
        await api.patch(`/auth/users/${editingUser._id}`, updateData);
        toast.success('User updated successfully!');
      } else {
        await api.post('/auth/register', formData);
        toast.success('User created successfully!');
      }
      setIsModalOpen(false);
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'trainer' });
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving user');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      password: '' // Don't show password on edit
    });
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await api.delete(`/auth/users/${userId}`);
        fetchUsers();
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error('Error deleting user');
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.patch(`/auth/users/${userId}/role`, { role: newRole });
      fetchUsers();
      toast.success('Role updated successfully!');
    } catch (err) {
      toast.error('Error updating role');
    }
  };

  const filteredUsers = (users || []).filter(user => {
    if (!user || user.role === 'student') return false;
    const name = (user.name || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const role = (user.role || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    
    const matchesSearch = name.includes(search) || email.includes(search);
    const matchesRole = selectedRole === 'All' || role === selectedRole.toLowerCase();
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Staff Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Create credentials and manage platform access for HR and Trainers.</p>
        </div>
        <button 
          onClick={() => {
            setEditingUser(null);
            setFormData({ name: '', email: '', password: '', role: 'trainer' });
            setIsModalOpen(true);
          }}
          style={{ background: '#1A9FD4' }}
          className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-2xl hover:brightness-110 transition shadow-lg shadow-sky-600/20"
        >
          <UserPlus size={20} />
          Create Staff Account
        </button>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm w-full text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-sky-400/50"
            >
              <option value="All">All Roles</option>
              <option>Admin</option>
              <option>HR</option>
              <option>Trainer</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-6 py-5">User</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5 hidden md:table-cell">Joined</th>
                <th className="px-6 py-5 hidden lg:table-cell">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 animate-pulse text-slate-400">
                    Loading directory...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-slate-500">
                    No users match your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user?._id || Math.random()} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-600 font-bold overflow-hidden">
                          {user?.profileImage ? (
                            <img src={user.profileImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            user?.name?.charAt(0) || 'U'
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <Mail size={12} /> {user?.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user?.role === 'admin' ? (
                        <span className="px-3 py-1.5 rounded-lg text-xs font-bold uppercase bg-red-50 dark:bg-red-500/10 text-red-600">
                          {user?.role}
                        </span>
                      ) : (
                        <select 
                          value={user?.role || 'trainer'}
                          onChange={(e) => handleRoleChange(user?._id, e.target.value)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase border-none focus:ring-2 focus:ring-sky-400/50 outline-none transition cursor-pointer ${
                            user?.role === 'hr' ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-600' :
                            'bg-blue-50 dark:bg-blue-500/10 text-blue-600'
                          }`}
                        >
                          <option value="hr">HR</option>
                          <option value="trainer">Trainer</option>
                        </select>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="flex items-center gap-1.5 text-green-500 text-xs font-bold uppercase">
                        <ShieldCheck size={14} /> Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(user)}
                          className="p-2 text-slate-400 hover:text-primary-600 transition"
                          title="Edit User"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(user._id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition"
                          title="Delete User"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingUser ? 'Edit Staff Account' : 'Create Staff Account'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 transition">
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                  <div className="relative">
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="name@fic.com"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {editingUser ? 'New Password (Optional)' : 'Assign Password'}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder={editingUser ? "Leave blank to keep current" : "••••••••"}
                      required={!editingUser}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Role</label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select 
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none appearance-none"
                    >
                      <option value="trainer">Trainer</option>
                      <option value="hr">HR Manager</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="submit"
                    style={{ background: '#1A9FD4' }}
                    className="flex-1 py-4 text-white font-bold rounded-2xl hover:brightness-110 transition shadow-lg shadow-sky-600/20"
                  >
                    {editingUser ? 'Save Changes' : 'Generate Credentials'}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
