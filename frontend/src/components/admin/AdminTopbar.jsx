import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Sun, Moon, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../../store/slices/uiSlice';
import api from '../../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

const BRAND = '#1A9FD4';

const AdminTopbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Poll every minute
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data.data);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const clearNotifications = async () => {
    try {
      await api.post('/notifications/clear-all');
      setNotifications([]);
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.filter(n => n._id !== id));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'enrollment': return TrendingUp;
      case 'payment': return CheckCircle2;
      case 'enquiry': return User;
      default: return AlertCircle;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'enrollment': return 'blue';
      case 'payment': return 'green';
      case 'enquiry': return 'purple';
      default: return 'orange';
    }
  };

  return (
    <header className="h-16 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 flex items-center justify-between px-6 text-slate-600 dark:text-slate-300">
      {/* Detail Notification Modal */}
      <AnimatePresence>
        {selectedNotification && createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#1e293b] rounded-[32px] p-8 shadow-2xl border border-slate-200 dark:border-slate-800"
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto bg-${getColor(selectedNotification.type)}-500/10 text-${getColor(selectedNotification.type)}-500`} style={{ 
                backgroundColor: getColor(selectedNotification.type) === 'blue' ? 'rgba(59, 130, 246, 0.1)' : getColor(selectedNotification.type) === 'green' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                color: getColor(selectedNotification.type) === 'blue' ? '#3b82f6' : getColor(selectedNotification.type) === 'green' ? '#10b981' : '#f59e0b' 
              }}>
                {React.createElement(getIcon(selectedNotification.type), { size: 32 })}
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white text-center mb-2">
                {selectedNotification.title}
              </h3>
              <p className="text-xs text-slate-400 text-center mb-6">{new Date(selectedNotification.createdAt).toLocaleString()}</p>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 mb-6">
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed text-center">
                  {selectedNotification.message}
                </p>
              </div>
              <button
                onClick={() => setSelectedNotification(null)}
                className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-2xl hover:opacity-90 transition shadow-lg"
              >
                Done
              </button>
            </motion.div>
          </div>,
          document.body
        )}
      </AnimatePresence>
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
                      <div 
                        key={notif._id} 
                        onClick={() => {
                          setSelectedNotification(notif);
                          setShowNotifications(false);
                          markAsRead(notif._id);
                        }}
                        className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800/50 last:border-0 group"
                      >
                        <div className="flex gap-4">
                          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 bg-${getColor(notif.type)}-500/10 text-${getColor(notif.type)}-500`} style={{ 
                            backgroundColor: getColor(notif.type) === 'blue' ? 'rgba(59, 130, 246, 0.1)' : getColor(notif.type) === 'green' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                            color: getColor(notif.type) === 'blue' ? '#3b82f6' : getColor(notif.type) === 'green' ? '#10b981' : '#f59e0b' 
                          }}>
                            {React.createElement(getIcon(notif.type), { size: 18 })}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">{notif.title}</span>
                              <span className="text-[10px] text-slate-400">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
