import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, BookOpen, 
  Mail, Phone, Calendar, UserCheck, UserX, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const AdminTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => { fetchTrainers(); }, []);

  const fetchTrainers = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setTrainers(data.data.filter(u => u.role === 'trainer'));
    } catch (err) {
      toast.error('Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingTrainer(null);
    setFormData({ name: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (trainer) => {
    setEditingTrainer(trainer);
    setFormData({ name: trainer.name, email: trainer.email, password: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTrainer) {
        await api.patch(`/auth/users/${editingTrainer._id}`, { name: formData.name, email: formData.email });
        toast.success('Trainer updated successfully');
      } else {
        await api.post('/auth/register', { ...formData, role: 'trainer' });
        toast.success('Trainer added successfully');
      }
      setIsModalOpen(false);
      fetchTrainers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving trainer');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this trainer?')) {
      try {
        await api.delete(`/auth/users/${id}`);
        fetchTrainers();
        toast.success('Trainer removed successfully');
      } catch (err) {
        toast.error('Error removing trainer');
      }
    }
  };

  const filteredTrainers = trainers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Trainer Directory</h1>
          <p className="text-slate-500 mt-1">Manage instructors, assign courses, and view performance.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-600/20"
        >
          <Plus size={20} /> Add New Trainer
        </button>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search trainers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-sm w-72 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Trainer</th>
                <th className="px-6 py-4">Contact Info</th>
                <th className="px-6 py-4">Joined Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-slate-500 font-medium">Loading trainers...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredTrainers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-slate-500">No trainers found.</td>
                </tr>
              ) : (
                filteredTrainers.map((trainer) => (
                  <tr key={trainer._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center border border-slate-300 dark:border-slate-700 overflow-hidden">
                          {trainer.profileImage && trainer.profileImage !== 'https://res.cloudinary.com/demo/image/upload/v1622543210/sample.jpg' ? (
                            <img src={trainer.profileImage} alt={trainer.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-purple-500 font-bold text-lg">{trainer.name.charAt(0).toUpperCase()}</span>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{trainer.name}</p>
                          <p className="text-[11px] text-slate-500 font-medium">Instructor</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Mail size={12} className="text-purple-500" />{trainer.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Phone size={12} className="text-slate-500" />{trainer.phoneNumber || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />{new Date(trainer.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {trainer.isActive !== false ? (
                        <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase px-2 py-1 bg-emerald-500/10 rounded-lg w-fit border border-emerald-500/20">
                          <UserCheck size={12} /> Active
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase px-2 py-1 bg-red-500/10 rounded-lg w-fit border border-red-500/20">
                          <UserX size={12} /> Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => toast.success('View assigned courses coming soon!')} className="p-2 text-slate-500 hover:text-purple-500 hover:bg-purple-500/10 rounded-lg transition-all" title="View Assigned Courses">
                          <BookOpen size={18} />
                        </button>
                        <button onClick={() => openEditModal(trainer)} className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all" title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(trainer._id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                      placeholder="e.g. Priya Nair"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                      placeholder="trainer@example.com"
                    />
                  </div>
                  {!editingTrainer && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                      <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                        placeholder="Minimum 6 characters"
                        minLength={6}
                      />
                    </div>
                  )}
                </div>
                <div className="p-6 pt-0 flex gap-3">
                  <button type="submit" className="flex-1 py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition shadow-lg shadow-purple-600/20">
                    {editingTrainer ? 'Save Changes' : 'Add Trainer'}
                  </button>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 bg-transparent text-slate-500 border border-slate-300 dark:border-slate-700 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
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
};

export default AdminTrainers;
