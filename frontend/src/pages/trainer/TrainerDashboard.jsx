import { useState, useEffect } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  ChevronRight,
  TrendingUp,
  FileText,
  Video
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import api from "../../utils/api";

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [stats, setStats] = useState({
    totalStudents: 45,
    activeCourses: 3,
    upcomingClasses: 2,
    completionRate: 88,
  });

  const upcomingClasses = [
    {
      id: 1,
      title: "MERN Stack - Advanced React",
      time: "10:00 AM",
      students: 15,
      date: "Today",
    },
    {
      id: 2,
      title: "Backend Development with Node.js",
      time: "02:30 PM",
      students: 22,
      date: "Today",
    },
  ];

  const recentSubmissions = [
    { id: 1, student: "Emma Wilson", assignment: "Redux State Management", time: "2h ago" },
    { id: 2, student: "James Miller", assignment: "API Integration", time: "4h ago" },
    { id: 3, student: "Sophia Chen", assignment: "Database Schema Design", time: "5h ago" },
  ];

  const statCards = [
    { label: "Total Students", value: stats.totalStudents, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Courses", value: stats.activeCourses, icon: BookOpen, color: "text-primary-600", bg: "bg-primary-50" },
    { label: "Upcoming Classes", value: stats.upcomingClasses, icon: Calendar, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Completion Rate", value: `${stats.completionRate}%`, icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">
            Trainer Overview 👋
          </h1>
          <p className="text-slate-500">
            Welcome back, {user?.name}. Here's what's happening with your classes.
          </p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate("/dashboard/trainer/courses")}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-600/20"
          >
            <Video size={18} /> Start Session
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => card.label === "Active Courses" && navigate("/dashboard/trainer/courses")}
            className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-sm ${card.label === "Active Courses" ? "cursor-pointer hover:border-primary-300 transition-colors" : ""}`}
          >
            <div className={`${card.bg} ${card.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
              <card.icon size={24} />
            </div>
            <p className="text-slate-500 text-sm font-medium">{card.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{card.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold">Today's Schedule</h2>
              <button className="text-primary-600 text-sm font-semibold hover:underline">View Calendar</button>
            </div>
            <div className="space-y-6">
              {upcomingClasses.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-primary-200 transition group">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex flex-col items-center justify-center border border-slate-100 shadow-sm">
                      <span className="text-xs font-bold text-primary-600 uppercase">{item.date}</span>
                      <span className="text-lg font-bold text-slate-900">{item.time.split(':')[0]}</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition">{item.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Clock size={14} /> {item.time}</span>
                        <span className="flex items-center gap-1"><Users size={14} /> {item.students} Students</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate("/dashboard/trainer/courses")}
                    className="px-6 py-2.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition"
                  >
                    Manage
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Recent Submissions */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold mb-6">Recent Submissions</h2>
            <div className="space-y-6">
              {recentSubmissions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 group-hover:bg-primary-50 group-hover:text-primary-600 transition">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{sub.student}</p>
                      <p className="text-[11px] text-slate-500">{sub.assignment}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">{sub.time}</span>
                </div>
              ))}
            </div>
            <button 
              onClick={() => navigate("/dashboard/assignments")}
              className="w-full mt-8 py-3 text-primary-600 bg-primary-50 font-bold rounded-xl hover:bg-primary-100 transition"
            >
              Review All
            </button>
          </div>

          {/* Quick Actions */}
          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-900/20">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate("/dashboard/trainer/courses")}
                className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition border border-white/10 text-center"
              >
                <BookOpen size={20} className="text-primary-400" />
                <span className="text-xs font-medium">My Courses</span>
              </button>
              <button 
                onClick={() => navigate("/dashboard/assignments")}
                className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition border border-white/10 text-center"
              >
                <FileText size={20} className="text-orange-400" />
                <span className="text-xs font-medium">Assignments</span>
              </button>
              <button 
                onClick={() => navigate("/dashboard/attendance")}
                className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition border border-white/10 text-center"
              >
                <Users size={20} className="text-blue-400" />
                <span className="text-xs font-medium">Attendance</span>
              </button>
              <button 
                className="flex flex-col items-center gap-2 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition border border-white/10 text-center opacity-50 cursor-not-allowed"
              >
                <Clock size={20} className="text-green-400" />
                <span className="text-xs font-medium">History</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
