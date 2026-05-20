import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  UserCheck,
  ClipboardList,
  Sun,
  Moon,
  MessageSquare,
  Users,
  Star,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  User
} from "lucide-react";
import { logout } from "../../store/slices/authSlice";
import { setTheme } from "../../store/slices/uiSlice";
import api from "../../utils/api";

const BRAND = "#1A9FD4";

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);

  const menuItems = [
    { name: "Dashboard", path: "/dashboard/overview", icon: LayoutDashboard },
    { 
      name: "Students", 
      path: "/dashboard/hr/students", 
      icon: Users, 
      role: ["hr"] 
    },
    { 
      name: "Admissions", 
      path: "/dashboard/bookings", 
      icon: ClipboardList, 
      role: ["admin", "hr"] 
    },
    { 
      name: "Course Enrollment", 
      path: "/dashboard/hr/enrollments", 
      icon: BookOpen, 
      role: ["hr"] 
    },
    { 
      name: "Attendance",   
      path: "/dashboard/attendance",   
      icon: Calendar,      
      role: ["admin"] 
    },
    { 
      name: "Certificates", 
      path: "/dashboard/hr/certificates", 
      icon: Award, 
      role: ["hr"] 
    },
    { 
      name: "Support / Queries", 
      path: "/dashboard/hr/support", 
      icon: MessageSquare, 
      role: ["hr"] 
    },
    { 
      name: "Support / Queries", 
      path: "/dashboard/trainer/support", 
      icon: MessageSquare, 
      role: ["trainer"] 
    },
    { 
      name: "Enquiries", 
      path: "/dashboard/hr/enquiries", 
      icon: User,
      role: ["hr"] 
    },
    { 
      name: "Reports", 
      path: "/dashboard/hr/reports", 
      icon: FileText, 
      role: ["hr"] 
    },
    {
      name: "Reviews",
      path: "/dashboard/reviews",
      icon: Star,
      role: ["trainer"]
    },
    {
      name: "Certifications",
      path: "/dashboard/student/certificates",
      icon: Award,
      role: ["student"]
    },
    {
      name: user?.role === "admin" ? "Manage Courses" : user?.role === "student" ? (user?.courseDomain || "My Courses") : "My Courses",
      path:
        user?.role === "admin"
          ? "/dashboard/admin/courses"
          : user?.role === "trainer"
          ? "/dashboard/trainer/courses"
          : "/dashboard/student/courses",
      icon: BookOpen,
      role: ["admin", "trainer", "student"],
    },
    {
      name: "Manage Staff",
      path: "/dashboard/admin/users",
      icon: UserCheck,
      role: ["admin"]
    },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.role || item.role.includes(user?.role)
  );

  const isActive = (path) => location.pathname === path;

  const [notifications, setNotifications] = useState([]);

  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showAllNotificationsModal, setShowAllNotificationsModal] = useState(false);

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

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">
          {/* Detail Notification Modal */}
          <AnimatePresence>
            {selectedNotification && (
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
                    className="w-full py-4 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-bold rounded-2xl hover:opacity-90 transition"
                  >
                    Close
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* All Notifications Modal */}
          <AnimatePresence>
            {showAllNotificationsModal && (
              <div className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-slate-950">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">All Notifications</h2>
                    <p className="text-sm text-slate-500">View and manage all your notifications.</p>
                  </div>
                  <div className="flex gap-4">
                    {notifications.length > 0 && (
                      <button 
                        onClick={clearNotifications}
                        className="px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition"
                      >
                        Clear All
                      </button>
                    )}
                    <button 
                      onClick={() => setShowAllNotificationsModal(false)}
                      className="p-2 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="max-w-4xl mx-auto space-y-4">
                    {notifications.length > 0 ? (
                      notifications.map((notif) => (
                        <div 
                          key={notif._id} 
                          onClick={() => {
                            setSelectedNotification(notif);
                            markAsRead(notif._id);
                          }}
                          className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 cursor-pointer hover:border-blue-500 transition-colors"
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-${getColor(notif.type)}-500/10 text-${getColor(notif.type)}-500`} style={{ 
                            backgroundColor: getColor(notif.type) === 'blue' ? 'rgba(59, 130, 246, 0.1)' : getColor(notif.type) === 'green' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                            color: getColor(notif.type) === 'blue' ? '#3b82f6' : getColor(notif.type) === 'green' ? '#10b981' : '#f59e0b' 
                          }}>
                            {React.createElement(getIcon(notif.type), { size: 20 })}
                          </div>
                          <div className="flex-1 min-w-0 pt-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                              <span className="text-xs text-slate-400">{new Date(notif.createdAt).toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{notif.message}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-20 text-center">
                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Bell size={24} className="text-slate-300" />
                        </div>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">All caught up!</p>
                        <p className="text-slate-500 mt-2">No new notifications at the moment.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 flex flex-col`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <img src="/logo.jpg" alt="FIC Logo" className="h-8 w-auto object-contain bg-white rounded p-1" />
            <span className="font-bold text-sm tracking-tight text-slate-800 dark:text-white whitespace-nowrap">
              <span style={{ color: BRAND }}>Forge</span> India <span className="text-slate-400">Connect</span>
            </span>
          </div>
          <button
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {filteredMenuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                  active
                    ? "font-bold"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white"
                }`}
                style={active ? { background: `${BRAND}18`, color: BRAND } : {}}
              >
                <item.icon size={19} style={active ? { color: BRAND } : {}} />
                <span>{item.name}</span>
                {active && (
                  <motion.div
                    layoutId="dash-active-dot"
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: BRAND }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 rounded-xl transition-all text-sm font-medium"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-16 bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-5 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              <Menu size={20} />
            </button>
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 w-72 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-400/20 transition-all">
              <Search size={16} className="text-slate-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Search anything..."
                className="bg-transparent border-none focus:ring-0 ml-2 text-sm w-full text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => dispatch(setTheme(theme === "dark" ? "light" : "dark"))}
              className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            >
              {theme === "dark"
                ? <Sun size={18} className="text-amber-400" />
                : <Moon size={18} className="text-slate-500" />
              }
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <Bell size={18} />
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
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1e293b] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <h3 className="font-bold text-slate-900 dark:text-white">Notifications</h3>
                      {notifications.length > 0 && (
                        <button 
                          onClick={clearNotifications}
                          className="text-[10px] font-bold text-slate-400 hover:text-red-500 uppercase tracking-wider transition"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => (
                          <div 
                            key={notif._id} 
                            onClick={() => {
                              setSelectedNotification(notif);
                              setShowNotifications(false);
                              markAsRead(notif._id);
                            }}
                            className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer border-b border-slate-50 dark:border-slate-800/50 last:border-0"
                          >
                            <div className="flex gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-${getColor(notif.type)}-500/10 text-${getColor(notif.type)}-500`} style={{ 
                                backgroundColor: getColor(notif.type) === 'blue' ? 'rgba(59, 130, 246, 0.1)' : getColor(notif.type) === 'green' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                                color: getColor(notif.type) === 'blue' ? '#3b82f6' : getColor(notif.type) === 'green' ? '#10b981' : '#f59e0b' 
                              }}>
                                {React.createElement(getIcon(notif.type), { size: 14 })}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="text-xs font-bold text-slate-900 dark:text-white truncate pr-2">{notif.title}</span>
                                  <span className="text-[10px] text-slate-400 whitespace-nowrap">{new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{notif.message}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-12 text-center">
                          <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Bell size={20} className="text-slate-300" />
                          </div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">All caught up!</p>
                          <p className="text-xs text-slate-500 mt-1">No new notifications at the moment.</p>
                        </div>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button 
                        onClick={() => {
                          setShowAllNotificationsModal(true);
                          setShowNotifications(false);
                        }}
                        className="w-full py-3 text-xs font-bold text-blue-500 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        View All Notifications
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

            {/* Avatar */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-800 dark:text-white leading-tight">{user?.name || "User"}</p>
                <p className="text-[11px] text-slate-400 capitalize">{user?.role || "Student"}</p>
              </div>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md"
                style={{ background: `linear-gradient(135deg, ${BRAND}, #7c3aed)` }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
