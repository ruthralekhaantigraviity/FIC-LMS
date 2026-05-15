import React, { useState, useEffect } from 'react';
import { 
  Search, Eye, CheckCircle, XCircle, Clock, 
  GraduationCap, Calendar, Filter, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const AdminEnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const { data } = await api.get('/admissions/all');
      setEnrollments(data.data);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      toast.error("Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/admissions/${id}/status`, { status });
      fetchEnrollments();
      toast.success(`Enrollment marked as ${status}`);
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const deleteEnrollment = async (id) => {
    if (window.confirm("Are you sure you want to delete this enrollment? This action cannot be undone.")) {
      try {
        await api.delete(`/admissions/${id}`);
        fetchEnrollments();
        toast.success("Enrollment deleted successfully");
      } catch (err) {
        toast.error("Error deleting enrollment");
      }
    }
  };

  const filteredEnrollments = enrollments.filter(
    (enrollment) =>
      enrollment.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (enrollment.course?.title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-bold uppercase px-2 py-1 bg-emerald-500/10 rounded-lg w-fit border border-emerald-500/20"><CheckCircle size={12} /> Enrolled</span>;
      case 'pending':
        return <span className="flex items-center gap-1.5 text-orange-500 text-[10px] font-bold uppercase px-2 py-1 bg-orange-500/10 rounded-lg w-fit border border-orange-500/20"><Clock size={12} /> Pending</span>;
      case 'reviewed':
        return <span className="flex items-center gap-1.5 text-blue-500 text-[10px] font-bold uppercase px-2 py-1 bg-blue-500/10 rounded-lg w-fit border border-blue-500/20"><Eye size={12} /> Under Review</span>;
      case 'rejected':
        return <span className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase px-2 py-1 bg-red-500/10 rounded-lg w-fit border border-red-500/20"><XCircle size={12} /> Rejected</span>;
      default:
        return <span className="text-slate-500 text-[10px] uppercase">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Course Enrollments</h1>
          <p className="text-slate-500 mt-1">Review and manage student applications and course enrollments.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              type="text"
              placeholder="Search by student or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-sm w-full md:w-80 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
             <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-700 transition-all">
              <Filter size={16} /> All Statuses
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Applicant</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Applied On</th>
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
                       <span className="text-slate-500 font-medium">Loading enrollments...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredEnrollments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-20 text-slate-500">
                    No enrollments found matching your search.
                  </td>
                </tr>
              ) : (
                filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment._id} className="hover:bg-slate-50 dark:bg-slate-800/20 transition-colors group">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{enrollment.fullName}</p>
                        <p className="text-xs text-slate-500">{enrollment.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center">
                           <GraduationCap size={16} className="text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-600 dark:text-slate-300">{enrollment.course?.title || 'Unknown Course'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        {new Date(enrollment.appliedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(enrollment.status)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => toast.success('Application details view coming soon!')}
                          className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all" title="View Application"
                        >
                          <Eye size={18} />
                        </button>
                        {enrollment.status === 'pending' && (
                           <>
                             <button 
                               onClick={() => updateStatus(enrollment._id, 'completed')}
                               className="p-2 text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-lg transition-all" title="Approve"
                             >
                               <CheckCircle size={18} />
                             </button>
                             <button 
                               onClick={() => updateStatus(enrollment._id, 'rejected')}
                               className="p-2 text-slate-500 hover:text-orange-500 hover:bg-orange-500/10 rounded-lg transition-all" title="Reject"
                             >
                               <XCircle size={18} />
                             </button>
                           </>
                        )}
                        <button 
                          onClick={() => deleteEnrollment(enrollment._id)}
                          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Delete"
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
    </div>
  );
};

export default AdminEnrollments;
