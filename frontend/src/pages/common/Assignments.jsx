import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  Calendar,
  Clock,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink,
  Search,
} from "lucide-react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../../utils/api";
export default function Assignments() {
  const { user } = useSelector((state) => state.auth);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionUrl, setSubmissionUrl] = useState("");
  useEffect(() => {
    fetchAssignments();
  }, []);
  const fetchAssignments = async () => {
    try {
      const { data } = await api.get("/assignments");
      setAssignments(data.data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/assignments/${selectedAssignment._id}/submit`, {
        fileUrl: submissionUrl,
      });
      setIsModalOpen(false);
      setSubmissionUrl("");
      fetchAssignments();
      toast.success("Assignment submitted successfully!");
    } catch (err) {
      toast.error("Error submitting assignment");
    }
  };
  return (
    <div className="space-y-8">
      {" "}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-bold text-slate-900 font-display">
            Assignments
          </h1>{" "}
          <p className="text-slate-500">
            Track your tasks, deadlines, and submissions.
          </p>{" "}
        </div>{" "}
        {user?.role !== "student" && (
          <button className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition shadow-lg shadow-primary-600/20">
            {" "}
            <Plus size={20} /> Create Assignment{" "}
          </button>
        )}{" "}
      </div>{" "}
      <div className="grid grid-cols-1 gap-6">
        {" "}
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-white rounded-2xl animate-pulse border border-slate-200"
            ></div>
          ))
        ) : assignments.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-3xl border border-slate-200 shadow-sm">
            {" "}
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              {" "}
              <FileText size={40} />{" "}
            </div>{" "}
            <h3 className="text-xl font-bold text-slate-900">
              No assignments found
            </h3>{" "}
            <p className="text-slate-500 mt-2">
              You're all caught up! Check back later for new tasks.
            </p>{" "}
          </div>
        ) : (
          assignments.map((assignment) => {
            const mySubmission = assignment.submissions?.find(
              (s) => s.student === user?.id,
            );
            const isLate =
              new Date(assignment.dueDate) < new Date() && !mySubmission;
            return (
              <motion.div
                key={assignment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col md:flex-row"
              >
                {" "}
                <div className="p-6 flex-1">
                  {" "}
                  <div className="flex items-center gap-2 mb-2">
                    {" "}
                    <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-[10px] font-bold uppercase tracking-wider">
                      {" "}
                      {assignment.course?.title}{" "}
                    </span>{" "}
                    {isLate && (
                      <span className="flex items-center gap-1 text-red-500 text-[10px] font-bold uppercase">
                        {" "}
                        <AlertCircle size={12} /> Overdue{" "}
                      </span>
                    )}{" "}
                  </div>{" "}
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {assignment.title}
                  </h3>{" "}
                  <p className="text-sm text-slate-500 mb-6 line-clamp-2">
                    {assignment.description}
                  </p>{" "}
                  <div className="flex flex-wrap gap-6 text-sm">
                    {" "}
                    <div className="flex items-center gap-2 text-slate-500">
                      {" "}
                      <Calendar size={16} />{" "}
                      <span>
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>{" "}
                    </div>{" "}
                    <div className="flex items-center gap-2 text-slate-500">
                      {" "}
                      <Clock size={16} />{" "}
                      <span>By: {assignment.trainer?.name}</span>{" "}
                    </div>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="bg-slate-50 p-6 flex items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 min-w-[240px]">
                  {" "}
                  {mySubmission ? (
                    <div className="text-center">
                      {" "}
                      <div className="flex items-center justify-center gap-2 text-green-500 font-bold mb-3">
                        {" "}
                        <CheckCircle size={20} /> Submitted{" "}
                      </div>{" "}
                      <a
                        href={mySubmission.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-primary-600 hover:underline flex items-center gap-1 justify-center"
                      >
                        {" "}
                        View Submission <ExternalLink size={12} />{" "}
                      </a>{" "}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setIsModalOpen(true);
                      }}
                      className="px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-600/20 flex items-center gap-2"
                    >
                      {" "}
                      <Upload size={18} /> Submit Now{" "}
                    </button>
                  )}{" "}
                </div>{" "}
              </motion.div>
            );
          })
        )}{" "}
      </div>{" "}
      {/* Submission Modal */}{" "}
      <AnimatePresence>
        {" "}
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {" "}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />{" "}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              {" "}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                {" "}
                <h3 className="text-xl font-bold">Submit Assignment</h3>{" "}
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition"
                >
                  {" "}
                  <XCircle size={24} />{" "}
                </button>{" "}
              </div>{" "}
              <form onSubmit={handleSubmitAssignment} className="p-8 space-y-6">
                {" "}
                <div>
                  {" "}
                  <p className="text-sm font-bold text-slate-700 mb-2">
                    Assignment
                  </p>{" "}
                  <p className="text-lg font-bold text-primary-600">
                    {selectedAssignment?.title}
                  </p>{" "}
                </div>{" "}
                <div>
                  {" "}
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Submission Link (Google Drive/Github)
                  </label>{" "}
                  <input
                    type="url"
                    required
                    value={submissionUrl}
                    onChange={(e) => setSubmissionUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  />{" "}
                </div>{" "}
                <div className="flex gap-4 pt-4">
                  {" "}
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition shadow-lg shadow-primary-600/20"
                  >
                    {" "}
                    Confirm Submission{" "}
                  </button>{" "}
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-slate-100 text-slate-900 font-bold rounded-2xl hover:bg-slate-200 transition"
                  >
                    {" "}
                    Cancel{" "}
                  </button>{" "}
                </div>{" "}
              </form>{" "}
            </motion.div>{" "}
          </div>
        )}{" "}
      </AnimatePresence>{" "}
    </div>
  );
}
