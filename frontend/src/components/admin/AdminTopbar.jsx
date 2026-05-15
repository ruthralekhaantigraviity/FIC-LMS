import React, { useState } from 'react';
import { Search, Bell, User, Sun, Moon, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../../store/slices/uiSlice';
import { motion, AnimatePresence } from 'framer-motion';

const BRAND = '#1A9FD4';

const AdminTopbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'enrollment', title: "New Enrollment Request", message: "A new student Rahul Sharma applied for React Course", time: "5 mins ago", icon: TrendingUp, color: 'blue' },
    { id: 2, type: 'payment', title: "Payment Verified", message: "Successfully verified payment of ₹25,000", time: "1 hour ago", icon: CheckCircle2, color: 'green' },
    { id: 3, type: 'system', title: "System Alert", message: "Server maintenance scheduled for tonight at 2 AM", time: "3 hours ago", icon: AlertCircle, color: 'orange' },
  ]);

  const clearNotifications = () => setNotifications([]);

  return (
    <header className="h-16 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 flex items-center justify-between px-6 text-slate-600 dark:text-slate-300">
      <div className="flex items-center bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 w-80 transition-all focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20">
        <Search size={16} className="text-slate-400 flex-shrink-0" />
        <input 
          type="text" 
          placeholder="Search students, courses..." 
          className="bg-transparent border-none focus:ring-0 ml-3 text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none"
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle */}
        <button 
          onClick={() => dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'))}
          className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' 
            ? <Sun size={18} className="text-amber-400" /> 
            : <Moon size={18} className="text-slate-500" />
          }
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            <Bell size={18} className="text-slate-500 dark:text-slate-400" />
            {notifications.length > 0 && (
              <span 
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white dark:border-[#0f172a]"
                style={{ background: BRAND }}
              />
            )}
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 bg-white dark:bg-[#1e293b] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden"
              >
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
                  <h3 className="font-bold text-slate-900 dark:text-white">Admin Notifications</h3>
                  {notifications.length > 0 && (
                    <button 
                      onClick={clearNotifications}
                      className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-wider transition"
                    >
                      Clear All
                    </button>
                  )}
                </div>
                <div className="max-h-[420px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map((notif) => (
                      <div key={notif.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800/50 last:border-0 group">
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-${notif.color}-500/10 text-${notif.color}-500`} style={{ backgroundColor: notif.color === 'blue' ? 'rgba(59, 130, 246, 0.1)' : notif.color === 'green' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: notif.color === 'blue' ? '#3b82f6' : notif.color === 'green' ? '#10b981' : '#f59e0b' }}>
                            <notif.icon size={18} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{notif.title}</span>
                              <span className="text-[10px] text-slate-400">{notif.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{notif.message}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-12 text-center">
                      <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200 dark:border-slate-700">
                        <Bell size={24} className="text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">All caught up!</p>
                      <p className="text-xs text-slate-500 mt-1 px-4 leading-relaxed">You have no pending administrative alerts.</p>
                    </div>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button className="w-full py-4 text-[11px] font-bold text-blue-500 bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800 transition uppercase tracking-widest">
                    Open Admin Notification Center
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

        {/* User */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{user?.name || 'Admin User'}</p>
            <p className="text-[11px] text-slate-400 uppercase tracking-wider">{user?.role || 'Administrator'}</p>
          </div>
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-700 shadow-md text-white font-bold text-sm"
            style={{ background: `linear-gradient(135deg, ${BRAND}, #7c3aed)` }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
