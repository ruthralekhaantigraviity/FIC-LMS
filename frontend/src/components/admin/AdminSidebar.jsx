import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  UserSquare2, 
  ClipboardList, 
  CreditCard, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';

const BRAND = '#1A9FD4';

const AdminSidebar = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard',    path: '/dashboard/admin' },
    { icon: Users,           label: 'Students',     path: '/dashboard/admin/students' },
    { icon: BookOpen,        label: 'Courses',      path: '/dashboard/admin/courses' },
    { icon: UserSquare2,     label: 'Manage Staff', path: '/dashboard/admin/users' },
    { icon: ClipboardList,   label: 'Enrollments',  path: '/dashboard/admin/enrollments' },
    { icon: CreditCard,      label: 'Fees / Payments', path: '/dashboard/admin/payments' },
    { icon: MessageSquare,   label: 'Enquiries',    path: '/dashboard/admin/enquiries' },
    { icon: BarChart3,       label: 'Reports',      path: '/dashboard/admin/reports' },
    { icon: Settings,        label: 'Settings',     path: '/dashboard/admin/settings' },
  ];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside className={`fixed top-0 left-0 h-full bg-white dark:bg-[#0f172a] text-slate-600 dark:text-slate-300 transition-all duration-300 z-50 border-r border-slate-200 dark:border-slate-800 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Logo */}
      <div className="flex items-center justify-between p-5">
        <div className={`flex items-center gap-3 ${!isOpen && 'hidden'}`}>
          <img src="/logo.jpg" alt="FIC Logo" className="h-8 w-auto object-contain bg-white rounded p-1" />
        </div>
        <button 
          onClick={toggleSidebar} 
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
        >
          {isOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="mt-4 px-3 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard/admin'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'font-bold shadow-sm'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`
            }
            style={({ isActive }) =>
              isActive
                ? { background: `${BRAND}18`, color: BRAND }
                : {}
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={20}
                  style={isActive ? { color: BRAND } : {}}
                />
                {isOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {isOpen && isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: BRAND }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-6 left-0 w-full px-3">
        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 transition-all"
        >
          <LogOut size={20} />
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
