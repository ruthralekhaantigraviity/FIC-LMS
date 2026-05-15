import { motion } from 'framer-motion';
import { Star, Filter, TrendingUp, ThumbsUp, User } from 'lucide-react';

const BRAND = "#1A9FD4";

const reviews = [
  { id: 1, user: "Emma Wilson", stars: 5, course: "Advanced React Patterns", comment: "Amazing teaching style! The concepts were explained clearly with real-world examples.", time: "Today" },
  { id: 2, user: "James Miller", stars: 4, course: "Node.js Architecture", comment: "Very helpful content, though I wish there were more exercises on performance tuning.", time: "Yesterday" },
  { id: 3, user: "Sophia Chen", stars: 5, course: "UI/UX Design Masterclass", comment: "Best course on the platform. The feedback from the instructor was invaluable.", time: "2 days ago" },
];

export default function Reviews() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Student Reviews</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track student feedback and course ratings.</p>
        </div>
        <div className="flex bg-sky-50 dark:bg-sky-500/10 px-6 py-3 rounded-2xl border border-sky-100 dark:border-sky-500/20">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-sky-600">4.9</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
            </div>
            <span className="text-xs font-bold text-sky-600/60 uppercase ml-2">Average Rating</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Reviews", value: "1,240", icon: ThumbsUp, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-500/10" },
          { label: "5-Star Ratings", value: "1,102", icon: Star, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { label: "Growth", value: "+12.4%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#0f172a] p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white">Recent Feedback</h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400">
            <Filter size={16} /> Filters
          </button>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {reviews.map((rev, i) => (
            <motion.div 
              key={rev.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-8 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                    <User size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{rev.user}</h4>
                    <p className="text-xs text-sky-500 font-bold">{rev.course}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < rev.stars ? "currentColor" : "none"} className={i < rev.stars ? "" : "text-slate-300"} />
                    ))}
                  </div>
                  <span className="text-[10px] font-medium text-slate-400">{rev.time}</span>
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "{rev.comment}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
