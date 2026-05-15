import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion } from "framer-motion";
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
  Award
} from "lucide-react";
import { logout } from "../../store/slices/authSlice";
import { setTheme } from "../../store/slices/uiSlice";

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
      name: "All Bookings", 
      path: "/dashboard/admin/bookings", 
      icon: ClipboardList, 
      role: ["admin", "hr"] 
    },
    {
      name: user?.role === "admin" ? "Manage Courses" : "Courses",
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
      name: "Reviews",
      path: "/dashboard/reviews",
      icon: Star,
      role: ["trainer"]
    },
    {
      name: "Achievements",
      path: "/dashboard/achievements",
      icon: Award,
      role: ["trainer"]
    },
    { name: "Attendance",   path: "/dashboard/attendance",   icon: Calendar,      role: ["hr"] },
    { name: "Assignments",  path: "/dashboard/assignments",  icon: FileText,      role: ["hr"] },
    { name: "Manage Staff", path: "/dashboard/admin/users",  icon: UserCheck,     role: ["admin"] },
    { name: "Settings",     path: "/dashboard/settings",     icon: Settings },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.role || item.role.includes(user?.role)
  );

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex">

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
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="FIC Logo" className="h-8 w-auto object-contain bg-white rounded p-1" />
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
            <button className="relative p-2.5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
              <Bell size={18} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white dark:border-[#0f172a]"
                style={{ background: BRAND }}
              />
            </button>

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
