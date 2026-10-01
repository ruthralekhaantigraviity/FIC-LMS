import { motion } from 'framer-motion';
import { Award, Star, Users, BookOpen, CheckCircle2, TrendingUp, Trophy } from 'lucide-react';

const BRAND = "#1A9FD4";

const badges = [
  { id: 1, title: "Top Instructor", desc: "Maintained a 4.9+ rating for 3 consecutive months.", date: "May 2024", icon: Award, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
  { id: 2, title: "Course Master", desc: "Successfully published 10+ high-quality courses.", date: "April 2024", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-500/10" },
  { id: 3, title: "Student Favorite", desc: "Received 500+ positive student reviews.", date: "March 2024", icon: Star, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
  { id: 4, title: "Community Leader", desc: "Started 100+ helpful discussion threads.", date: "Feb 2024", icon: Users, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-500/10" },
];

export default function Achievements() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Achievements</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Your milestones and recognized contributions to the platform.</p>
        </div>
        <div className="px-6 py-3 bg-slate-900 dark:bg-[#020617] rounded-2xl flex items-center gap-3 shadow-xl">
          <Trophy className="text-amber-400" size={24} />
          <span className="text-white font-bold tracking-tight">Master Instructor Tier</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {badges.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-[#0f172a] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center text-center group hover:border-sky-500 transition-all duration-500"
          >
            <div className={`${badge.bg} ${badge.color} w-20 h-20 rounded-[32px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-current/10`}>
              <badge.icon size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{badge.title}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">{badge.desc}</p>
            <span className="mt-auto text-[10px] font-black uppercase tracking-widest text-slate-400">{badge.date}</span>
          </motion.div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#0f172a] p-10 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
        <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Next Milestone: <span className="text-sky-500">Legendary Educator</span></h2>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl">
              You are just 250 students away from reaching the Legendary Educator tier. 
              Achieving this will unlock a special profile badge and priority support.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-black uppercase text-slate-400 tracking-wider">
                <span>Progress</span>
                <span>750 / 1000 Students</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "75%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  style={{ background: BRAND }}
                  className="h-full rounded-full"
                />
              </div>
            </div>
          </div>
          <div className="w-48 h-48 bg-slate-50 dark:bg-slate-800/50 rounded-[40px] border border-slate-100 dark:border-slate-800 flex items-center justify-center shadow-inner">
            <Trophy size={80} className="text-slate-200 dark:text-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
}
