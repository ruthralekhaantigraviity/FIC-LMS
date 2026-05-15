import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Filter, Send, User } from 'lucide-react';

const BRAND = "#1A9FD4";

const discussions = [
  {
    id: 1,
    user: "Alex Rivera",
    role: "Student",
    topic: "React Hooks doubt",
    message: "I'm having trouble understanding how useEffect cleanup works. Can someone explain?",
    replies: 12,
    time: "10m ago",
    avatar: "https://i.pravatar.cc/150?u=alex"
  },
  {
    id: 2,
    user: "Sarah Jenkins",
    role: "Student",
    topic: "Backend Auth issue",
    message: "I'm getting a 401 error when trying to access the protected routes.",
    replies: 5,
    time: "2h ago",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  }
];

export default function Discussions() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Discussions</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Connect with your students and answer their queries.</p>
        </div>
        <button 
          style={{ background: BRAND }}
          className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-2xl hover:brightness-110 transition shadow-lg shadow-sky-600/20"
        >
          <MessageSquare size={20} />
          New Thread
        </button>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search discussions..."
              className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm w-full text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm text-slate-600 dark:text-slate-300">
            <Filter size={18} />
            Filters
          </button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {discussions.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition cursor-pointer group"
            >
              <div className="flex gap-6">
                <img src={item.avatar} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-sky-500 transition">{item.topic}</h3>
                      <p className="text-xs text-slate-500 font-medium">By {item.user} • {item.role}</p>
                    </div>
                    <span className="text-xs font-medium text-slate-400">{item.time}</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {item.message}
                  </p>
                  <div className="flex items-center gap-4 pt-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <MessageSquare size={14} />
                      {item.replies} Replies
                    </span>
                    <button className="ml-auto text-xs font-bold text-sky-500 opacity-0 group-hover:opacity-100 transition flex items-center gap-1">
                      Join Discussion <Send size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
