import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Search,
  Filter,
  User,
  Mail,
  MoreVertical,
  ChevronRight,
  MessageCircle,
  Bell,
  ArrowRight,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";
export default function HRDashboard() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  useEffect(() => {
    fetchAdmissions();
  }, []);
  const fetchAdmissions = async () => {
    try {
      const { data } = await api.get("/admissions/all");
      setAdmissions(data.data);
    } catch (err) {
      console.error("Error fetching admissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const pendingCount = admissions.filter(a => a.status === 'pending').length;

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/admissions/${id}/status`, { status, reviewNotes });
      setSelectedAdmission(null);
      setReviewNotes("");
      fetchAdmissions();
      toast.success(`Application ${status === 'completed' ? 'Completed' : status} successfully!`);
    } catch (err) {
      toast.error("Error updating status");
    }
  };
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-600 border-red-200";
      case "reviewed":
        return "bg-blue-100 text-blue-600 border-blue-200";
      default:
        return "bg-orange-100 text-orange-600 border-orange-200";
    }
  };
  return (
    <div className="space-y-8">
      {" "}
      <div>
        {" "}
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">
          Admissions Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Review and approve new student applications.
        </p>
      </div>{" "}
      {/* Pending Notification Banner */}
      {pendingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white relative">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            </div>
            <div>
              <p className="font-bold text-slate-900">{pendingCount} Pending Enrollment{pendingCount > 1 ? 's' : ''}</p>
              <p className="text-sm text-slate-500">Review and approve student applications below.</p>
            </div>
          </div>
        </motion.div>
      )}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none">
        {" "}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {" "}
          <div className="relative">
            {" "}
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />{" "}
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-64 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none"
            />{" "}
          </div>{" "}
          <div className="flex gap-2">
            {" "}
            <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase border border-slate-100">
              {" "}
              Pending First{" "}
            </button>{" "}
            <button className="p-2 bg-slate-50 text-slate-600 rounded-xl border border-slate-100">
              {" "}
              <Filter size={18} />{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full text-left">
            {" "}
            <thead>
              {" "}
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
                {" "}
                <th className="px-6 py-4">Applicant</th>{" "}
                <th className="px-6 py-4">Course</th>{" "}
                <th className="px-6 py-4">Applied Date</th>{" "}
                <th className="px-6 py-4">Status</th>{" "}
                <th className="px-6 py-4 text-right">Actions</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {" "}
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10">
                    Loading...
                  </td>
                </tr>
              ) : admissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-500">
                    No applications found.
                  </td>
                </tr>
              ) : (
                admissions.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                    {" "}
                    <td className="px-6 py-4">
                      {" "}
                      <div className="flex items-center gap-3">
                        {" "}
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: '#1A9FD4' }}>
                          {" "}
                          {app.fullName.charAt(0)}{" "}
                        </div>{" "}
                        <div>
                          {" "}
                           <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {app.fullName}
                          </p>{" "}
                          <p className="text-xs text-slate-500">
                            {app.email}
                          </p>{" "}
                        </div>{" "}
                      </div>{" "}
                    </td>{" "}
                    <td className="px-6 py-4">
                      {" "}
                      <span className="text-sm font-medium">
                        {app.course?.title}
                      </span>{" "}
                    </td>{" "}
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {" "}
                      {new Date(app.appliedAt).toLocaleDateString()}{" "}
                    </td>{" "}
                    <td className="px-6 py-4">
                      {" "}
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(app.status)}`}
                      >
                        {" "}
                        {app.status}{" "}
                      </span>{" "}
                    </td>{" "}
                    <td className="px-6 py-4 text-right">
                      {" "}
                      <button
                        onClick={() => setSelectedAdmission(app)}
                        className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:text-white transition"
                        style={{}} 
                        onMouseEnter={e => { e.currentTarget.style.background='#1A9FD4'; e.currentTarget.style.color='white'; }}
                        onMouseLeave={e => { e.currentTarget.style.background=''; e.currentTarget.style.color=''; }}
                      >
                        {" "}
                        <Eye size={18} />{" "}
                      </button>{" "}
                    </td>{" "}
                  </tr>
                ))
              )}{" "}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
      </div>{" "}
      {/* Review Modal */}{" "}
      <AnimatePresence>
        {" "}
        {selectedAdmission && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {" "}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAdmission(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />{" "}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {" "}
              <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                {" "}
                <div className="flex items-center gap-4">
                  {" "}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold" style={{ background: '#1A9FD4' }}>
                    {" "}
                    {selectedAdmission.fullName.charAt(0)}{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h3 className="text-xl font-bold">
                      Application Review
                    </h3>{" "}
                    <p className="text-sm text-slate-500">
                      Submitted on{" "}
                      {new Date(
                        selectedAdmission.appliedAt,
                      ).toLocaleDateString()}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(selectedAdmission.status)}`}
                >
                  {" "}
                  {selectedAdmission.status}{" "}
                </span>{" "}
              </div>{" "}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {" "}
                <div className="space-y-6">
                  {" "}
                  <div>
                    {" "}
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Applicant Information
                    </h4>{" "}
                    <div className="space-y-3">
                      {" "}
                      <div className="flex items-center gap-3 text-slate-600">
                        {" "}
                        <User size={16} />{" "}
                        <span className="text-sm font-medium">
                          {selectedAdmission.fullName}
                        </span>{" "}
                      </div>{" "}
                      <div className="flex items-center gap-3 text-slate-600">
                        {" "}
                        <Mail size={16} />{" "}
                        <span className="text-sm font-medium">
                          {selectedAdmission.email}
                        </span>{" "}
                      </div>{" "}
                      <div className="flex items-center gap-3 text-slate-600">
                        {" "}
                        <MessageCircle size={16} />{" "}
                        <span className="text-sm font-medium">
                          {selectedAdmission.phoneNumber}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Education & Course
                    </h4>{" "}
                    <p className="text-sm font-medium">
                      {selectedAdmission.previousEducation}
                    </p>{" "}
                    <p className="text-sm text-slate-500 mt-1">
                      Applying for:{" "}
                      <span className="text-primary-600">
                        {selectedAdmission.course?.title}
                      </span>
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="space-y-6">
                  {" "}
                  <div>
                    {" "}
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      HR Review Notes
                    </h4>{" "}
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add notes for this application..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none text-sm h-32 resize-none"
                    ></textarea>{" "}
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="p-8 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex gap-4">
                {" "}
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedAdmission._id, "completed")
                  }
                  className="flex-1 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                >
                  {" "}
                  <CheckCircle size={20} /> Mark as Completed{" "}
                </button>{" "}
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedAdmission._id, "rejected")
                  }
                  className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  {" "}
                  <XCircle size={20} /> Reject{" "}
                </button>{" "}
              </div>{" "}
            </motion.div>{" "}
          </div>
        )}{" "}
      </AnimatePresence>{" "}
    </div>
  );
}
