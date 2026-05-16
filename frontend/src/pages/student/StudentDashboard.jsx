import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  User, Shield, CheckCircle, MonitorPlay, 
  Clock, PlayCircle, Loader2 
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import PendingApproval from "./PendingApproval";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const { data } = await api.get("/admissions/my-courses");
        setCourses(data.data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Students no longer require admin approval or existing courses to view dashboard.
  // Removed PendingApproval redirection.

  return (
    <div className="max-w-6xl mx-auto pb-12 font-sans bg-[#fdfdfd] dark:bg-transparent">
      {/* Profile Avatar Section */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-32 h-32 bg-[#76A8F8] dark:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm border-[6px] border-white dark:border-slate-800 ring-1 ring-slate-200 dark:ring-slate-700">
          <User size={64} />
        </div>
        <div className="flex gap-4 mt-3 text-sm text-[#2563EB] dark:text-blue-400 font-bold">
          <button className="hover:underline">Update Profile</button>
          <button className="hover:underline">Update Profile Image</button>
        </div>
      </div>

      <div className="px-4 max-w-4xl mx-auto space-y-6">


        {/* Welcome Text and Badges */}
        <div className="text-center pt-2">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Welcome {user?.name || "Student"}</h1>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-[#e2e8f0] dark:bg-slate-800 border border-[#cbd5e1] dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded">
              Reg No: {user?.studentId || "1210411032"}
            </span>
            <span className="px-3 py-1 bg-[#22c55e] text-white text-xs font-bold rounded">
              Branch: {user?.courseDomain || "IT"}
            </span>
            <span className="px-3 py-1 bg-[#3b82f6] text-white text-xs font-bold rounded">
              Designation: Student
            </span>
          </div>
        </div>



        {/* Instructions Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#fffbeb] dark:bg-amber-900/20 border border-[#fde68a] dark:border-amber-800/50 p-6 rounded-xl">
            <h3 className="font-bold text-slate-800 dark:text-amber-100 text-sm mb-3">Important instructions & Test details</h3>
            <ul className="list-disc list-inside text-xs space-y-2 text-slate-700 dark:text-amber-200/70 font-medium">
              <li>It is strictly advised to complete your assignments and assessments within the given timeframe.</li>
              <li>Please keep track of your progress on a weekly basis.</li>
              <li>For any technical issues during an assessment, take a screenshot immediately.</li>
              <li>Make sure you have an active internet connection before starting any live test.</li>
              <li>Plagiarism in assignments will lead to strict disciplinary actions.</li>
            </ul>
          </div>
          <div className="bg-[#f0fdf4] dark:bg-emerald-900/20 border border-[#bbf7d0] dark:border-emerald-800/50 p-6 rounded-xl">
            <h3 className="font-bold text-slate-800 dark:text-emerald-100 text-sm mb-3">Test details and instructions</h3>
            <ul className="list-disc list-inside text-xs space-y-2 text-slate-700 dark:text-emerald-200/70 font-medium">
              <li>Do not refresh the page while attempting an online assessment.</li>
              <li>Clicking out of the exam window will be counted as a violation.</li>
              <li>Keep your webcam active if proctoring is enabled.</li>
              <li>Ensure your system time is accurate to prevent auto-submission errors.</li>
              <li>Submit your answers before the countdown timer hits zero.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 space-y-10">
        






      </div>



    </div>
  );
}
