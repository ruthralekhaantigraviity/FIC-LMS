import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Filter, Mail, MessageSquare, MoreVertical, CheckCircle2, Clock } from 'lucide-react';

const students = [
  { id: 1, name: "Rahul Sharma", course: "Full Stack Development", progress: 75, status: "Active", joined: "Oct 2023", avatar: "https://i.pravatar.cc/150?u=rahul" },
  { id: 2, name: "Priya Patel", course: "Python for Data Science", progress: 40, status: "Active", joined: "Nov 2023", avatar: "https://i.pravatar.cc/150?u=priya" },
  { id: 3, name: "Amit Kumar", course: "Mobile App with Flutter", progress: 92, status: "Completed", joined: "Sept 2023", avatar: "https://i.pravatar.cc/150?u=amit" },
  { id: 4, name: "Sneha Reddy", course: "Full Stack Development", progress: 15, status: "At Risk", joined: "Dec 2023", avatar: "https://i.pravatar.cc/150?u=sneha" },
];

export default function TrainerStudents() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">My Students</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track your students across all assigned courses.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-slate-800 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
            <span className="text-2xl font-black text-sky-500">124</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Learners</span>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search students by name or course..."
              className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm w-full text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
            <Filter size={18} />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/50 dark:bg-slate-800/30">
                <th className="px-8 py-4">Student</th>
                <th className="px-8 py-4">Assigned Course</th>
                <th className="px-8 py-4">Progress</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4">Joined</th>
                <th className="px-8 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {students.map((student, i) => (
                <motion.tr 
                  key={student.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <img src={student.avatar} alt="" className="w-10 h-10 rounded-xl object-cover" />
                      <span className="font-bold text-slate-900 dark:text-white">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-500/10 px-2 py-1 rounded-md">
                      {student.course}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3 w-32">
                      <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full" style={{ width: `${student.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-black text-slate-600 dark:text-slate-400">{student.progress}%</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium">
                    <span className={`flex items-center gap-1.5 ${
                      student.status === "Completed" ? "text-emerald-500" : 
                      student.status === "At Risk" ? "text-rose-500" : "text-sky-500"
                    }`}>
                      {student.status === "Completed" ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                      {student.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-xs text-slate-500 font-medium">{student.joined}</td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-lg transition">
                        <Mail size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-lg transition">
                        <MessageSquare size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
