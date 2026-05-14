import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Mail,
  User as UserIcon,
  Edit2,
  BookOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function AllBookings() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  useEffect(() => {
    fetchAdmissions();
  }, []);

  const fetchAdmissions = async () => {
    try {
      const { data } = await api.get('/admissions/all');
      setAdmissions(data.data);
    } catch (err) {
      console.error('Error fetching admissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/admissions/${id}/status`, { status, reviewNotes });
      fetchAdmissions();
      setIsModalOpen(false);
      setSelectedAdmission(null);
      setReviewNotes('');
      toast.success(`Admission ${status === 'completed' ? 'Completed' : status} successfully!`);
    } catch (err) {
      toast.error('Error updating admission status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-50 text-green-600 border-green-100';
      case 'rejected': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-orange-50 text-orange-600 border-orange-100';
    }
  };

  const filteredAdmissions = admissions.filter(app => {
    const matchesSearch = 
      app.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 font-display">All Bookings</h1>
        <p className="text-slate-500">Manage student enrollment applications and status.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by student or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm w-full focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option>All</option>
              <option>Pending</option>
              <option>Completed</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                <th className="px-6 py-5">Student</th>
                <th className="px-6 py-5">Course</th>
                <th className="px-6 py-5">Domain</th>
                <th className="px-6 py-5">Date</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-slate-400 animate-pulse">
                    Loading applications...
                  </td>
                </tr>
              ) : filteredAdmissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-slate-500">
                    No bookings found.
                  </td>
                </tr>
              ) : (
                filteredAdmissions.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                          {(app.fullName || app.student?.name || 'U').charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{app.fullName || app.student?.name}</p>
                          <p className="text-xs text-slate-500">{app.email || app.student?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-slate-400" />
                        <span className="text-sm font-medium">{app.course?.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-0.5 rounded uppercase">
                        {app.targetDomain || 'General'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedAdmission(app);
                            setReviewNotes(app.reviewNotes || '');
                            setIsModalOpen(true);
                          }}
                          className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition"
                          title="View Details"
                        >
                          <Eye size={18} />
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

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && selectedAdmission && (
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
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-xl font-bold">
                    {(selectedAdmission.fullName || selectedAdmission.student?.name || 'U').charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Application Review</h3>
                    <p className="text-sm text-slate-500">
                      Submitted on {new Date(selectedAdmission.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(selectedAdmission.status)}`}>
                  {selectedAdmission.status}
                </span>
              </div>

              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Applicant Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-slate-600">
                        <UserIcon size={16} />
                        <span className="text-sm font-medium">{selectedAdmission.fullName || selectedAdmission.student?.name}</span>
                      </div>
                      <div className="flex items-center gap-3 text-slate-600">
                        <Mail size={16} />
                        <span className="text-sm font-medium">{selectedAdmission.email || selectedAdmission.student?.email}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Education & Course</h4>
                    <p className="text-sm font-medium">{selectedAdmission.previousEducation || 'Not specified'}</p>
                    <p className="text-sm text-slate-500 mt-1">
                      Applying for: <span className="text-primary-600 font-bold">{selectedAdmission.course?.title}</span>
                    </p>
                    <p className="text-sm text-slate-500 mt-1">
                      Domain: <span className="text-primary-600 font-bold uppercase">{selectedAdmission.targetDomain}</span>
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Admin Review Notes</h4>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add notes for this application..."
                      className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-sm h-32 resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button
                  onClick={() => handleUpdateStatus(selectedAdmission._id, 'completed')}
                  className="flex-1 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle size={20} /> Mark Completed
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedAdmission._id, 'rejected')}
                  className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  <XCircle size={20} /> Reject
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
