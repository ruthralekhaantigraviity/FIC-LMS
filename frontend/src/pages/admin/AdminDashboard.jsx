import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, BookOpen, Clock, TrendingUp, Loader2, Bell, ArrowRight } from "lucide-react";
import api from "../../utils/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const data = [
  { name: "Jan", students: 400 },
  { name: "Feb", students: 300 },
  { name: "Mar", students: 600 },
  { name: "Apr", students: 800 },
  { name: "May", students: 700 },
  { name: "Jun", students: 900 },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [recentAdmissions, setRecentAdmissions] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentData = async () => {
      try {
        const { data } = await api.get('/admissions/all');
        // Get the last 4 admissions
        setRecentAdmissions(data.data.slice(0, 4));
        // Count pending admissions for notification
        const pending = data.data.filter(a => a.status === 'pending').length;
        setPendingCount(pending);
      } catch (err) {
        console.error("Error fetching recent admissions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentData();
  }, []);
  const stats = [
    {
      label: "Total Students",
      value: "1,284",
      icon: Users,
      color: "bg-blue-500",
      path: "/dashboard/admin/users"
    },
    {
      label: "Active Courses",
      value: "42",
      icon: BookOpen,
      color: "bg-purple-500",
      path: "/dashboard/admin/courses"
    },
    {
      label: "Avg. Attendance",
      value: "88%",
      icon: Clock,
      color: "bg-green-500",
      path: "/dashboard/attendance"
    },
    {
      label: "Monthly Revenue",
      value: "$12,400",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Admin Overview</h1>
        <p className="text-slate-500">
          Welcome back! Here's what's happening today.
        </p>
      </div>

      {/* Pending Enrollment Notification */}
      {pendingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/dashboard/admin/bookings')}
          className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:bg-orange-100 transition group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-slate-900 dark:text-white relative">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-slate-900 dark:text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            </div>
            <div>
              <p className="font-bold text-slate-900">{pendingCount} Pending Enrollment{pendingCount > 1 ? 's' : ''}</p>
              <p className="text-sm text-slate-500">New student applications are waiting for your approval.</p>
            </div>
          </div>
          <ArrowRight className="text-slate-500 dark:text-slate-400 group-hover:text-orange-600 transition" size={20} />
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => stat.path && navigate(stat.path)}
            className={`bg-white p-6 rounded-2xl border border-slate-200 shadow-sm dark:shadow-none hover:shadow-md transition ${stat.path ? 'cursor-pointer' : ''}`}
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${stat.color} text-slate-900 dark:text-white`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm dark:shadow-none">
          <h3 className="text-lg font-bold mb-6">Student Enrollment</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Bar dataKey="students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm dark:shadow-none">
          <h3 className="text-lg font-bold mb-6">Recent Activities</h3>
          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-primary-600" />
              </div>
            ) : recentAdmissions.length === 0 ? (
              <p className="text-center py-10 text-slate-500 text-sm">No recent activities.</p>
            ) : (
              recentAdmissions.map((app) => (
                <div key={app._id} className="flex gap-4">
                  <div className={`w-2 h-10 rounded-full ${
                    app.status === 'completed' ? 'bg-green-400' : 
                    app.status === 'rejected' ? 'bg-red-400' : 
                    'bg-orange-400'
                  }`}></div>
                  <div>
                    <p className="text-sm font-semibold">
                      New Application: {app.fullName || app.student?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      Applied for {app.course?.title}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                      {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
