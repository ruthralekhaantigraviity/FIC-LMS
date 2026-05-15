import React from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell, PieChart, Pie
} from 'recharts';
import { Download, FileText, TrendingUp, Users, BookOpen, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const HRReports = () => {
  const courseEnrollmentData = [
    { name: 'MERN Stack', count: 450, color: '#0ea5e9' },
    { name: 'UI/UX Design', count: 320, color: '#8b5cf6' },
    { name: 'Data Science', count: 280, color: '#10b981' },
    { name: 'Digital Marketing', count: 200, color: '#f59e0b' },
  ];

  const progressGrowthData = [
    { month: 'Jan', progress: 45 },
    { month: 'Feb', progress: 52 },
    { month: 'Mar', progress: 48 },
    { month: 'Apr', progress: 61 },
    { month: 'May', progress: 55 },
    { month: 'Jun', progress: 68 },
  ];

  const reportTypes = [
    { title: "Course-wise enrollment", description: "Detailed breakdown of students per course.", icon: BookOpen, color: "blue" },
    { title: "Student progress report", description: "Track individual and group academic progress.", icon: TrendingUp, color: "purple" },
    { title: "Completion report", description: "Analyze certification and completion rates.", icon: CheckCircle, color: "green" },
  ];

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Academic Reports</h1>
          <p className="text-slate-500 dark:text-slate-400">Analyze platform performance and student engagement.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-lg hover:opacity-90 transition">
          <Download size={18} /> Export All Data
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reportTypes.map((type, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-[#0f172a] p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-sky-400 transition cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 bg-slate-50 dark:bg-slate-800 text-slate-600 group-hover:bg-sky-500 group-hover:text-white transition`}>
              <type.icon size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{type.title}</h3>
            <p className="text-sm text-slate-500 mb-6">{type.description}</p>
            <button className="text-sky-600 text-sm font-bold flex items-center gap-2">
               Generate Report <FileText size={14} />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Popularity Bar Chart */}
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 font-display">Course Popularity</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseEnrollmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={50}>
                   {courseEnrollmentData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                   ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Growth Line Chart */}
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 font-display">Progress Growth Rate</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressGrowthData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="progress" stroke="#8b5cf6" strokeWidth={4} dot={{r: 6, fill: '#8b5cf6', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 8}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRReports;
