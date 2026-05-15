import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Save, 
  Moon, 
  Sun, 
  Monitor,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { updateUser } from '../../store/slices/authSlice';
import { setTheme } from '../../store/slices/uiSlice';
import api from '../../utils/api';

function ShieldCheck({ size, className }) {
  return <Shield size={size} className={className} />;
}

export default function Settings() {
  const { user } = useSelector(state => state.auth);
  const { theme } = useSelector(state => state.ui);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.patch(`/auth/users/${user.id}/role`, {
        name: formData.name,
        phoneNumber: formData.phoneNumber
      });
      dispatch(updateUser(data.data));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'profile', name: "Profile Information", icon: User },
    { id: 'security', name: "Security & Password", icon: Lock },
    { id: 'notifications', name: "Notifications", icon: Bell },
    { id: 'theme', name: "Display Theme", icon: Monitor },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Account Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your profile, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 font-bold rounded-2xl transition-all duration-200 ${
                activeTab === item.id 
                  ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" 
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xl font-bold dark:text-white">Profile Information</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Update your account personal details.</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email Address</label>
                      <input 
                        type="email" 
                        disabled
                        value={formData.email}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 rounded-xl text-slate-400 dark:text-slate-500 outline-none cursor-not-allowed" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-600/20 disabled:opacity-50"
                    >
                      <Save size={18} />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xl font-bold dark:text-white">Change Password</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Ensure your account is using a long, random password to stay secure.</p>
                  </div>

                  <form className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                        <input 
                          type="password"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                        <input 
                          type="password"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                        <input 
                          type="password"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button type="button" className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition">
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-slate-900 dark:bg-[#0f172a] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl border border-white/5">
                  <div className="relative z-10 flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                        <ShieldCheck size={24} className="text-primary-400" />
                        Two-Factor Authentication
                      </h3>
                      <p className="text-slate-400 text-sm">Add additional security to your account using two-factor authentication.</p>
                    </div>
                    <button className="px-6 py-2 bg-white/10 hover:bg-white/20 transition rounded-xl text-sm font-bold border border-white/20 backdrop-blur-md">
                      Enable
                    </button>
                  </div>
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-600/20 rounded-full blur-3xl"></div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xl font-bold dark:text-white">Notification Preferences</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Manage how you receive updates and alerts.</p>
                </div>
                <div className="p-8 space-y-6">
                  {[
                    { title: "Course Updates", desc: "Get notified when new content is added to your courses." },
                    { title: "Account Activity", desc: "Security alerts and sign-in notifications." },
                    { title: "New Messages", desc: "Direct messages from trainers or support." },
                    { title: "Placement News", desc: "Latest job openings and placement drives." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                      <div className="w-12 h-6 bg-primary-600 rounded-full relative cursor-pointer">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'theme' && (
              <motion.div
                key="theme"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm"
              >
                <div className="p-8 border-b border-slate-100 dark:border-slate-800">
                  <h3 className="text-xl font-bold dark:text-white">Display Preferences</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Customize the appearance of your dashboard.</p>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    { id: 'light', name: 'Light Mode', icon: Sun },
                    { id: 'dark', name: 'Dark Mode', icon: Moon },
                    { id: 'system', name: 'System Default', icon: Monitor }
                  ].map((t) => (
                    <button 
                      key={t.id}
                      onClick={() => dispatch(setTheme(t.id))}
                      className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all ${
                        theme === t.id 
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-600 shadow-sm' 
                          : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      <t.icon size={32} />
                      <span className="font-bold text-sm">{t.name}</span>
                      {theme === t.id && <CheckCircle size={16} className="text-primary-600" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
