import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  User, Shield, CheckCircle, MonitorPlay, 
  Clock, PlayCircle, Loader2, FileText 
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import PendingApproval from "./PendingApproval";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [coursesRes, appsRes] = await Promise.all([
          api.get("/admissions/my-courses"),
          api.get("/admissions/my-applications")
        ]);
        setCourses(coursesRes.data.data);
        setApplications(appsRes.data.data);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show Pending Approval screen if no courses enrolled but there's an application
  if (courses.length === 0 && applications.length > 0) {
    const latestApp = applications[0]; // Assuming most recent is the one to track
    return <PendingApproval application={latestApp} />;
  }

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
        {/* My Courses Section - Visible only when enrolled */}
        {courses.length > 0 && (
          <div className="bg-[#f5f3ff] dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-3xl p-8 shadow-sm">
            <h2 className="font-bold text-slate-800 dark:text-white text-xl mb-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/20">
                <MonitorPlay size={20} />
              </span>
              My Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.map((course) => (
                <div key={course._id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group border border-slate-100 dark:border-slate-700">
                  {/* Thumbnail / Image Area */}
                  <div className="aspect-[4/3] bg-purple-600 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 opacity-50" />
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto backdrop-blur-sm border border-white/30">
                        <MonitorPlay className="text-white" size={32} />
                      </div>
                      <h4 className="text-white font-bold text-sm tracking-widest uppercase leading-tight">
                        {course.title}<br />INTERNSHIP
                      </h4>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4">{course.title}</h3>
                    
                    {/* Dynamic Media Badges */}
                    {(course.hasVideos || course.hasPdfs) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.hasVideos && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-purple-100/55 dark:border-purple-900/30">
                            <MonitorPlay size={11} /> Video Lessons
                          </span>
                        )}
                        {course.hasPdfs && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-blue-100/55 dark:border-blue-900/30">
                            <FileText size={11} /> PDF Notes
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progress Area */}
                    <div className="mb-6">
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                        <div className="bg-green-500 h-full w-[0%] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                      </div>
                      <span className="text-xs font-bold text-slate-400">0 of {course.totalLessons || 12} complete</span>
                    </div>

                    <Link 
                      to={`/dashboard/student/learn/${course._id}`} 
                      className="w-full py-3 bg-[#3b82f6] hover:bg-blue-600 text-white text-sm font-bold rounded-xl text-center transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] uppercase tracking-wider"
                    >
                      START
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
