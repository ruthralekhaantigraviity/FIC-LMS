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
  const [notificationPrefs, setNotificationPrefs] = useState({
    courseUpdates: true,
    accountActivity: true,
    newMessages: false,
    placementNews: true
  });
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
      const { data } = await api.patch('/auth/updateMe', {
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

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error("New passwords don't match!");
    }
    
    setLoading(true);
    try {
      await api.patch('/auth/updateMyPassword', {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      toast.success('Password updated successfully!');
      setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating password');
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

                  <form onSubmit={handleUpdatePassword} className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Current Password</label>
                        <input 
                          type="password"
                          required
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">New Password</label>
                        <input 
                          type="password"
                          required
                          value={formData.newPassword}
                          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Confirm New Password</label>
                        <input 
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none" 
                        />
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
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
                    { key: "courseUpdates", title: "Course Updates", desc: "Get notified when new content is added to your courses." },
                    { key: "accountActivity", title: "Account Activity", desc: "Security alerts and sign-in notifications." },
                    { key: "newMessages", title: "New Messages", desc: "Direct messages from trainers or support." },
                    { key: "placementNews", title: "Placement News", desc: "Latest job openings and placement drives." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200">{item.title}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                      <div 
                        onClick={() => setNotificationPrefs(prev => ({ ...prev, [item.key]: !prev[item.key] }))}
                        className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-200 ${
                          notificationPrefs[item.key] ? "bg-primary-600" : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${
                          notificationPrefs[item.key] ? "right-1" : "left-1"
                        }`}></div>
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
