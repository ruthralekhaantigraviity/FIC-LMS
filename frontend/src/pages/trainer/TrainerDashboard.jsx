import { useState } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
  Video
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const BRAND = "#1A9FD4";

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [stats] = useState({ totalStudents: 45, activeCourses: 3, upcomingClasses: 2, completionRate: 88 });

  const upcomingClasses = [
    { id: 1, title: "MERN Stack - Advanced React",      time: "10:00 AM", students: 15, date: "Today" },
    { id: 2, title: "Backend Development with Node.js", time: "02:30 PM", students: 22, date: "Today" },
  ];

  const recentSubmissions = [
    { id: 1, student: "Emma Wilson",  assignment: "Redux State Management", time: "2h ago" },
    { id: 2, student: "James Miller", assignment: "API Integration",         time: "4h ago" },
    { id: 3, student: "Sophia Chen",  assignment: "Database Schema Design",  time: "5h ago" },
  ];

  const statCards = [
    { label: "Total Students",   value: stats.totalStudents,        icon: Users,      color: "text-blue-500",   bg: "bg-blue-50 dark:bg-blue-500/10" },
    { label: "Active Courses",   value: stats.activeCourses,        icon: BookOpen,   color: "text-sky-500",    bg: "bg-sky-50 dark:bg-sky-500/10",   clickable: true },
    { label: "Upcoming Classes", value: stats.upcomingClasses,      icon: Calendar,   color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-500/10" },
    { label: "Completion Rate",  value: `${stats.completionRate}%`, icon: TrendingUp, color: "text-green-500",  bg: "bg-green-50 dark:bg-green-500/10" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Trainer Overview 👋</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user?.name}. Here's what's happening with your classes.</p>
        </div>
        <button onClick={() => navigate("/dashboard/trainer/courses")} style={{ background: BRAND }}
          className="flex items-center gap-2 px-5 py-2.5 text-white font-bold rounded-xl hover:brightness-110 transition shadow-lg">
          <Video size={18} /> Start Session
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            onClick={() => card.clickable && navigate("/dashboard/trainer/courses")}
            className={`bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none ${card.clickable ? "cursor-pointer hover:border-sky-300 dark:hover:border-sky-700 transition-colors" : ""}`}>
            <div className={`${card.bg} ${card.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
              <card.icon size={24} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{card.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schedule */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-[#0f172a] p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Today's Schedule</h2>
              <button style={{ color: BRAND }} className="text-sm font-semibold hover:underline">View Calendar</button>
            </div>
            <div className="space-y-4">
              {upcomingClasses.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-700 transition group">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-white dark:bg-slate-900 rounded-2xl flex flex-col items-center justify-center border border-slate-200 dark:border-slate-700 shadow-sm flex-shrink-0">
                      <span className="text-[10px] font-bold uppercase" style={{ color: BRAND }}>{item.date}</span>
                      <span className="text-lg font-bold text-slate-900 dark:text-white">{item.time.split(':')[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition">{item.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1"><Clock size={14} /> {item.time}</span>
                        <span className="flex items-center gap-1"><Users size={14} /> {item.students} Students</span>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => navigate("/dashboard/trainer/courses")}
                    className="px-5 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 transition text-sm"
                    onMouseEnter={e => { e.currentTarget.style.background = BRAND; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = BRAND; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; }}>
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0f172a] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-none">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Recent Submissions</h2>
            <div className="space-y-5">
              {recentSubmissions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-sky-50 dark:group-hover:bg-sky-500/10 group-hover:text-sky-500 transition">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{sub.student}</p>
                      <p className="text-[11px] text-slate-500">{sub.assignment}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">{sub.time}</span>
                </div>
              ))}
            </div>
            <button onClick={() => navigate("/dashboard/assignments")}
              style={{ color: BRAND, background: `${BRAND}14` }}
              className="w-full mt-6 py-3 font-bold rounded-xl transition hover:brightness-95 text-sm">
              Review All
            </button>
          </div>

          <div className="bg-slate-900 dark:bg-[#020617] p-6 rounded-3xl border border-slate-800 text-white shadow-xl">
            <h2 className="text-base font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate("/dashboard/trainer/courses")} className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition border border-white/10 text-center">
                <BookOpen size={20} style={{ color: BRAND }} /><span className="text-xs font-medium">My Courses</span>
              </button>
              <button onClick={() => navigate("/dashboard/assignments")} className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition border border-white/10 text-center">
                <FileText size={20} className="text-orange-400" /><span className="text-xs font-medium">Assignments</span>
              </button>
              <button onClick={() => navigate("/dashboard/attendance")} className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition border border-white/10 text-center">
                <Users size={20} className="text-green-400" /><span className="text-xs font-medium">Attendance</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl transition border border-white/10 text-center opacity-40 cursor-not-allowed">
                <Clock size={20} className="text-purple-400" /><span className="text-xs font-medium">History</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
