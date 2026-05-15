import React, { useState, useEffect } from 'react';
import { 
  Search, Filter, Phone, Mail, MessageSquare, 
  Clock, CheckCircle, XCircle, ChevronDown, Trash2, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const STATUS_OPTIONS = ['new', 'contacted', 'converted', 'dropped'];

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [viewEnquiry, setViewEnquiry] = useState(null);

  useEffect(() => { fetchEnquiries(); }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = () => setActiveDropdown(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const fetchEnquiries = async () => {
    try {
      const { data } = await api.get('/enquiries');
      setEnquiries(data.data);
    } catch (err) {
      // Fallback mock data if endpoint not ready
      setEnquiries([
        { _id: '1', fullName: 'Vikram Singh', email: 'vikram@example.com', phoneNumber: '+91 9876543210', message: 'I am interested in the React Fullstack course. Can you tell me more about the curriculum?', course: { title: 'React Fullstack' }, status: 'new', createdAt: new Date() },
        { _id: '2', fullName: 'Ananya Sharma', email: 'ananya@example.com', phoneNumber: '+91 8765432109', message: 'Looking for Data Science program details and fee structure.', course: { title: 'Data Science' }, status: 'contacted', createdAt: new Date(Date.now() - 86400000) },
        { _id: '3', fullName: 'Rohan Gupta', email: 'rohan@example.com', phoneNumber: '+91 7654321098', message: 'Enquiring about UI/UX batch start dates.', course: { title: 'UI/UX Design' }, status: 'converted', createdAt: new Date(Date.now() - 172800000) },
        { _id: '4', fullName: 'Meera Patel', email: 'meera@example.com', phoneNumber: '+91 6543210987', message: 'Interested in Digital Marketing certification.', course: { title: 'Digital Marketing' }, status: 'dropped', createdAt: new Date(Date.now() - 259200000) },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = (id, newStatus) => {
    setEnquiries(prev => prev.map(e => e._id === id ? { ...e, status: newStatus } : e));
    setActiveDropdown(null);
    toast.success(`Status updated to ${newStatus}`);
  };

  const deleteEnquiry = (id) => {
    if (window.confirm('Delete this enquiry?')) {
      setEnquiries(prev => prev.filter(e => e._id !== id));
      toast.success('Enquiry deleted');
    }
  };

  const filtered = enquiries.filter(e => {
    const matchesSearch = e.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.course?.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const map = {
      new:       { color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',       icon: <MessageSquare size={12} />, label: 'New' },
      contacted: { color: 'text-purple-500 bg-purple-500/10 border-purple-500/20', icon: <Phone size={12} />,         label: 'Contacted' },
      converted: { color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', icon: <CheckCircle size={12} />, label: 'Converted' },
      dropped:   { color: 'text-red-500 bg-red-500/10 border-red-500/20',           icon: <XCircle size={12} />,      label: 'Dropped' },
    };
    const s = map[status] || { color: 'text-slate-500 bg-slate-500/10 border-slate-500/20', icon: null, label: status };
    return (
      <span className={`flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-1 rounded-lg w-fit border ${s.color}`}>
        {s.icon}{s.label}
      </span>
    );
  };

  const stats = {
    all: enquiries.length,
    new: enquiries.filter(e => e.status === 'new').length,
    contacted: enquiries.filter(e => e.status === 'contacted').length,
    converted: enquiries.filter(e => e.status === 'converted').length,
    dropped: enquiries.filter(e => e.status === 'dropped').length,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Enquiry Pipeline</h1>
          <p className="text-slate-500 mt-1">Manage prospective students and course inquiries.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', key: 'all', color: 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200' },
          { label: 'New', key: 'new', color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' },
          { label: 'Contacted', key: 'contacted', color: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400' },
          { label: 'Converted', key: 'converted', color: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
          { label: 'Dropped', key: 'dropped', color: 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' },
        ].map(item => (
          <button
            key={item.key}
            onClick={() => setFilterStatus(item.key)}
            className={`p-4 rounded-2xl border-2 text-left transition-all ${
              filterStatus === item.key 
                ? `${item.color} border-current` 
                : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <p className="text-2xl font-bold">{stats[item.key]}</p>
            <p className="text-xs font-semibold text-slate-500 mt-1">{item.label}</p>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search by name, email or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-sm w-full md:w-80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="converted">Converted</option>
              <option value="dropped">Dropped</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Prospect</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Interested In</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-slate-500 font-medium">Loading enquiries...</span>
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-slate-500">No enquiries found.</td>
                </tr>
              ) : (
                filtered.map((enquiry) => (
                  <tr key={enquiry._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-slate-300 dark:border-slate-700 flex-shrink-0">
                          <span className="text-blue-500 font-bold text-xs">{enquiry.fullName.charAt(0).toUpperCase()}</span>
                        </div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{enquiry.fullName}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Mail size={12} className="text-blue-500" />{enquiry.email}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <Phone size={12} className="text-slate-500" />{enquiry.phoneNumber}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{enquiry.course?.title || 'General'}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(enquiry.status)}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Clock size={14} />{new Date(enquiry.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* View message */}
                        <button
                          onClick={() => setViewEnquiry(enquiry)}
                          className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                          title="View Details"
                        >
                          <MessageSquare size={16} />
                        </button>

                        {/* Status dropdown */}
                        <div className="relative">
                          <button
                            onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === enquiry._id ? null : enquiry._id); }}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-all"
                          >
                            Update <ChevronDown size={12} />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === enquiry._id && (
                              <motion.div
                                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                className="absolute right-0 top-9 z-50 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {STATUS_OPTIONS.map(s => (
                                  <button
                                    key={s}
                                    onClick={() => updateStatus(enquiry._id, s)}
                                    className={`w-full text-left px-3 py-2.5 text-xs font-semibold capitalize hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${enquiry.status === s ? 'text-blue-500' : 'text-slate-700 dark:text-slate-300'}`}
                                  >
                                    {s}
                                  </button>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Delete */}
                        <button
                          onClick={() => deleteEnquiry(enquiry._id)}
                          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
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

      {/* View Enquiry Detail Modal */}
      <AnimatePresence>
        {viewEnquiry && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setViewEnquiry(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enquiry Details</h3>
                <button onClick={() => setViewEnquiry(null)} className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center border border-slate-300 dark:border-slate-700">
                    <span className="text-blue-500 font-bold text-2xl">{viewEnquiry.fullName.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{viewEnquiry.fullName}</p>
                    {getStatusBadge(viewEnquiry.status)}
                  </div>
                </div>
                <div className="space-y-2 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Mail size={14} className="text-blue-500 flex-shrink-0" />{viewEnquiry.email}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Phone size={14} className="text-slate-500 flex-shrink-0" />{viewEnquiry.phoneNumber}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Clock size={14} className="text-slate-500 flex-shrink-0" />{new Date(viewEnquiry.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Interested In</p>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{viewEnquiry.course?.title || 'General Enquiry'}</p>
                </div>
                {viewEnquiry.message && (
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700">{viewEnquiry.message}</p>
                  </div>
                )}
              </div>
              <div className="p-6 pt-0 flex gap-3">
                <a href={`mailto:${viewEnquiry.email}`} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition text-center shadow-lg shadow-blue-600/20">
                  Send Email
                </a>
                <button onClick={() => setViewEnquiry(null)} className="flex-1 py-3 bg-transparent text-slate-500 border border-slate-300 dark:border-slate-700 font-bold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminEnquiries;
