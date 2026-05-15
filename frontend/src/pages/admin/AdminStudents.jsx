import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit2, Trash2, Eye, 
  Mail, Phone, Calendar, UserCheck, UserX, Filter, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    try {
      const { data } = await api.get('/auth/users');
      setStudents(data.data.filter(u => u.role === 'student'));
    } catch (err) {
      toast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setFormData({ name: '', email: '', password: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setFormData({ name: student.name, email: student.email, password: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStudent) {
        await api.patch(`/auth/users/${editingStudent._id}`, { name: formData.name, email: formData.email });
        toast.success('Student updated successfully');
      } else {
        await api.post('/auth/register', { ...formData, role: 'student' });
        toast.success('Student added successfully');
      }
      setIsModalOpen(false);
      fetchStudents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving student');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await api.delete(`/auth/users/${id}`);
        fetchStudents();
        toast.success('Student removed successfully');
      } catch (err) {
        toast.error('Error removing student');
      }
    }
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Student Directory</h1>
          <p className="text-slate-500 mt-1">Manage and monitor all student profiles and their activities.</p>
        </div>
        <button 
          onClick={openAddModal}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
        >
          <Plus size={20} /> Add New Student
        </button>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-sm w-full md:w-80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Student</th>
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
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-slate-500 font-medium">Loading students...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-slate-500">No students found.</td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-slate-300 dark:border-slate-700">
                          <span className="text-blue-500 font-bold text-xs">{student.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{student.name}</p>
                          <p className="text-[11px] text-slate-500 uppercase tracking-tighter">ID: {student._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Mail size={12} className="text-blue-500" />{student.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Phone size={12} className="text-slate-500" />{student.phoneNumber || 'N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />{new Date(student.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {student.isActive !== false ? (
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
                        <button onClick={() => openEditModal(student)} className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all" title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(student._id)} className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Delete">
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
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">{editingStudent ? 'Edit Student' : 'Add New Student'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                    <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      placeholder="student@example.com"
                    />
                  </div>
                  {!editingStudent && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                      <input type="password" required value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                        placeholder="Minimum 6 characters"
                        minLength={6}
                      />
                    </div>
                  )}
                </div>
                <div className="p-6 pt-0 flex gap-3">
                  <button type="submit" className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20">
                    {editingStudent ? 'Save Changes' : 'Add Student'}
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

export default AdminStudents;
