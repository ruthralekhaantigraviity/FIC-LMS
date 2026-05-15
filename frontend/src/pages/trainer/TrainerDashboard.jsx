import { useState } from "react";
import {
  Users,
  BookOpen,
  Calendar,
  Clock,
  TrendingUp,
  FileText,
  Video,
  Plus,
  Award,
  MessageCircle,
  ChevronRight,
  Play,
  MoreHorizontal,
  Circle,
  Star
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";

const BRAND = "#1A9FD4";

const chartData = [
  { name: 'Mon', engagement: 400, students: 240 },
  { name: 'Tue', engagement: 300, students: 139 },
  { name: 'Wed', engagement: 200, students: 980 },
  { name: 'Thu', engagement: 278, students: 390 },
  { name: 'Fri', engagement: 189, students: 480 },
  { name: 'Sat', engagement: 239, students: 380 },
  { name: 'Sun', engagement: 349, students: 430 },
];

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [activeTimeframe, setActiveTimeframe] = useState("Weekly");

  const featuredCourses = [
    {
      id: 1,
      title: "Advanced React Patterns",
      instructor: "You",
      duration: "12h 45m",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 2,
      title: "Node.js Architecture",
      instructor: "You",
      duration: "08h 30m",
      thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=800&auto=format&fit=crop&q=60"
    },
    {
      id: 3,
      title: "UI/UX Design Masterclass",
      instructor: "You",
      duration: "15h 20m",
      thumbnail: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?w=800&auto=format&fit=crop&q=60"
    }
  ];

  const myCourses = [
    { name: "Full Stack Development", lessons: 48, progress: 75, students: 124 },
    { name: "Python for Data Science", lessons: 32, progress: 40, students: 86 },
    { name: "Mobile App with Flutter", lessons: 24, progress: 92, students: 54 },
  ];

  const messages = [
    { id: 1, name: "Alex Rivera", msg: "Can you review my last PR?", time: "2m ago", avatar: "https://i.pravatar.cc/150?u=alex" },
    { id: 2, name: "Sarah Jenkins", msg: "The lesson 4 video is great!", time: "15m ago", avatar: "https://i.pravatar.cc/150?u=sarah" },
    { id: 3, name: "Mike Ross", msg: "When is the next live session?", time: "1h ago", avatar: "https://i.pravatar.cc/150?u=mike" },
  ];

  return (
    <div className="flex flex-col xl:flex-row gap-8 min-h-screen">
      {/* Main Content */}
      <div className="flex-1 space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display tracking-tight">
              Welcome Back, {user?.name?.split(' ')[0] || 'Instructor'} 👋
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
              You have 3 active courses and 2 new student messages.
            </p>
          </div>
          <div className="flex items-center gap-3">

            <button 
              onClick={() => navigate("/dashboard/trainer/courses")}
              style={{ background: BRAND }}
              className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-2xl hover:brightness-110 transition shadow-lg shadow-sky-600/20"
            >
              <Plus size={20} />
              Add New Course
            </button>
          </div>
        </div>

        {/* Featured Courses Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCourses.map((course, i) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative bg-white dark:bg-[#1e293b] rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="aspect-[16/10] overflow-hidden relative">
                <img src={course.thumbnail} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-all duration-300">
                    <Play size={24} fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition line-clamp-1">
                  {course.title}
                </h3>
                <div className="flex items-center justify-between mt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px]">Y</div>
                    {course.instructor}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} />
                    {course.duration}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* My Courses Section */}
        <div className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Courses</h2>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition">
              <MoreHorizontal size={20} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/30">
                  <th className="px-8 py-4">Course Name</th>
                  <th className="px-8 py-4">Lessons</th>
                  <th className="px-8 py-4">Students</th>
                  <th className="px-8 py-4">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {myCourses.map((course, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group">
                    <td className="px-8 py-6 font-bold text-slate-900 dark:text-white">{course.name}</td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">{course.lessons} Units</td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">{course.students} Learners</td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1, delay: i * 0.2 }}
                            style={{ background: BRAND }}
                            className="h-full rounded-full"
                          />
                        </div>
                        <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{course.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Course Overview Chart */}
        <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Course Overview</h2>
              <p className="text-xs font-medium text-slate-500 mt-1">Student engagement over the week</p>
            </div>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {["Weekly", "Monthly"].map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveTimeframe(t)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${activeTimeframe === t ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={BRAND} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={BRAND} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} 
                  dy={10}
                />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    border: 'none', 
                    borderRadius: '16px', 
                    color: '#fff',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)'
                  }}
                  itemStyle={{ color: BRAND }}
                />
                <Area 
                  type="monotone" 
                  dataKey="engagement" 
                  stroke={BRAND} 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorEngagement)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recent Discussions */}
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Discussions</h2>
              <button className="text-xs font-bold text-sky-500 hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {[
                { name: "Rahul S.", topic: "React Hooks doubt", time: "10m ago", color: "bg-amber-100 text-amber-600" },
                { name: "Priya M.", topic: "Backend Auth issue", time: "2h ago", color: "bg-sky-100 text-sky-600" },
                { name: "Arjun K.", topic: "Deployment error", time: "5h ago", color: "bg-emerald-100 text-emerald-600" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer p-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-2xl transition">
                  <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center font-bold text-xs`}>
                    {item.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{item.topic}</p>
                    <p className="text-xs text-slate-500">Started by {item.name}</p>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Reviews</h2>
              <button className="text-xs font-bold text-sky-500 hover:underline">View All</button>
            </div>
            <div className="space-y-6">
              {[
                { name: "Emma Wilson", stars: 5, comment: "Amazing teaching style!", time: "Today" },
                { name: "James Miller", stars: 4, comment: "Very helpful content.", time: "Yesterday" },
                { name: "Sophia Chen", stars: 5, comment: "Best course on the platform.", time: "2 days ago" },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex text-amber-400">
                        {[...Array(item.stars)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.name}</span>
                    </div>
                    <span className="text-[10px] font-medium text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1 italic">"{item.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Latest Achievements */}
        <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Latest Achievements</h2>
            <button className="text-xs font-bold text-sky-500 hover:underline">View Badge Gallery</button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Top Instructor", date: "May 2024", icon: Award, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
              { label: "1000+ Students", date: "April 2024", icon: Users, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-500/10" },
              { label: "High Rating", date: "March 2024", icon: Star, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
              { label: "Course Master", date: "Feb 2024", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
            ].map((badge, i) => (
              <div key={i} className="flex flex-col items-center text-center p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700">
                <div className={`${badge.bg} ${badge.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-3`}>
                  <badge.icon size={24} />
                </div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">{badge.label}</p>
                <p className="text-[10px] text-slate-500 font-medium mt-1">{badge.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-full xl:w-80 space-y-8">
        {/* Messages Panel */}
        <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Messages</h2>
            <button className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-500 hover:text-sky-500 transition">
              <MessageCircle size={18} />
            </button>
          </div>
          <div className="space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-4 group cursor-pointer">
                <img src={msg.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover ring-2 ring-transparent group-hover:ring-sky-500/20 transition-all" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{msg.name}</p>
                    <span className="text-[10px] font-medium text-slate-400">{msg.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate leading-relaxed">{msg.msg}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 text-xs font-bold text-slate-500 hover:text-sky-500 flex items-center justify-center gap-2 transition group">
            View all messages
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Progress Section (Circular Stats) */}
        <div className="bg-slate-900 dark:bg-[#020617] p-8 rounded-[32px] border border-slate-800 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-[60px] -mr-16 -mt-16" />
          
          <h2 className="text-lg font-bold mb-8 relative z-10">Overall Progress</h2>
          
          <div className="space-y-8 relative z-10">
            {[
              { label: "Course Completion", val: 82, color: "text-sky-400" },
              { label: "Student Engagement", val: 65, color: "text-emerald-400" },
              { label: "Performance", val: 94, color: "text-amber-400" },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-5">
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle 
                      cx="28" cy="28" r="24" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      className="text-white/5" 
                    />
                    <motion.circle 
                      cx="28" cy="28" r="24" 
                      fill="transparent" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      strokeDasharray="150"
                      initial={{ strokeDashoffset: 150 }}
                      animate={{ strokeDashoffset: 150 - (150 * stat.val) / 100 }}
                      transition={{ duration: 1.5, delay: i * 0.3 }}
                      strokeLinecap="round"
                      className={stat.color}
                    />
                  </svg>
                  <span className="absolute text-[10px] font-black">{stat.val}%</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{stat.label}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp size={10} className="text-emerald-400" />
                    <span className="text-[10px] font-bold text-emerald-400">+12% this month</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
