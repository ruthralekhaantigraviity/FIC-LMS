import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User as UserIcon,
  ChevronRight,
  ClipboardList,
  UserCheck
} from "lucide-react";
import { logout } from "../../store/slices/authSlice";

export default function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const menuItems = [
    { name: "Overview", path: "/dashboard/overview", icon: LayoutDashboard },
    { 
      name: "All Bookings", 
      path: "/dashboard/admin/bookings", 
      icon: ClipboardList, 
      role: ["admin", "hr"] 
    },
    {
      name: user?.role === "admin" ? "Manage Courses" : "My Courses",
      path: user?.role === "admin" ? "/dashboard/admin/courses" : user?.role === "trainer" ? "/dashboard/trainer/courses" : "/dashboard/student/courses",
      icon: BookOpen,
      role: ["admin", "trainer", "student"]
    },
    { name: "Attendance", path: "/dashboard/attendance", icon: Calendar, role: ["trainer", "hr"] },
    { name: "Assignments", path: "/dashboard/assignments", icon: FileText, role: ["trainer", "hr"] },
    {
      name: "Manage Staff",
      path: "/dashboard/admin/users",
      icon: UserCheck,
      role: ["admin"],
    },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  const filteredMenuItems = menuItems.filter(
    (item) => !item.role || item.role.includes(user?.role),
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0`}
      >
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-purple rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">F</span>
            </div>
            <span className="text-2xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-purple">
              FIC
            </span>
          </div>

          <nav className="flex-1 space-y-2">
            {filteredMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }}
                className={`sidebar-link ${location.pathname === item.path ? "sidebar-link-active" : ""}`}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="active-indicator"
                    className="ml-auto w-1.5 h-1.5 bg-primary-600 rounded-full"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-200">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 w-full text-slate-600 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 text-slate-600"
          >
            <Menu size={24} />
          </button>

          <div className="hidden md:flex items-center bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 w-96">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none focus:ring-0 ml-2 text-sm w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3 pl-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user?.name || "User"}</p>
                <p className="text-xs text-slate-500 capitalize">
                  {user?.role || "Student"}
                </p>
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
