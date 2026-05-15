import React from 'react';
import { Search, Bell, User, Sun, Moon } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { setTheme } from '../../store/slices/uiSlice';

const BRAND = '#1A9FD4';

const AdminTopbar = () => {
  const { user } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.ui);
  const dispatch = useDispatch();

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
        <button className="relative p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
          <Bell size={18} className="text-slate-500 dark:text-slate-400" />
          <span 
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2 border-white dark:border-[#0f172a]"
            style={{ background: BRAND }}
          />
        </button>

        <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />

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
