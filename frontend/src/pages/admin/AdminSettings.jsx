import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Lock, Bell, Monitor, Save, Shield, CheckCircle
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { updateUser } from '../../store/slices/authSlice';
import api from '../../utils/api';

export default function AdminSettings() {
  const { user } = useSelector(state => state.auth);
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
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Account Settings</h1>
        <p className="text-slate-500 mt-1">Manage your admin profile, security, and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-4 font-bold rounded-2xl transition-all duration-200 ${
                activeTab === item.id 
                  ? "bg-blue-600/10 text-blue-500 border border-blue-500/20 shadow-[0_0_20px_rgba(37,99,235,0.05)]" 
                  : "bg-white dark:bg-[#0f172a] text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none"
              >
                <div className="p-8 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Profile Information</h3>
                  <p className="text-sm text-slate-500 mt-1">Update your account personal details.</p>
                </div>

                <form onSubmit={handleUpdateProfile} className="p-8 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                      <input 
                        type="email" 
                        disabled
                        value={formData.email}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800/30 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 outline-none cursor-not-allowed" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                      <input 
                        type="tel" 
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600" 
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={loading}
                      className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
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
                <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none">
                  <div className="p-8 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Change Password</h3>
                    <p className="text-sm text-slate-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
                  </div>

                  <form onSubmit={handleUpdatePassword} className="p-8 space-y-6">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                        <input 
                          type="password"
                          required
                          value={formData.currentPassword}
                          onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                        <input 
                          type="password"
                          required
                          value={formData.newPassword}
                          onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                        <input 
                          type="password"
                          required
                          value={formData.confirmPassword}
                          onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all" 
                        />
                      </div>
                    </div>
                    <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex justify-end">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-slate-900 dark:text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20 disabled:opacity-50"
                      >
                        {loading ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>

                <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 rounded-3xl p-8 border border-blue-500/20 relative overflow-hidden shadow-xl">
                  <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <Shield size={24} className="text-blue-400" />
                        Two-Factor Authentication
                      </h3>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">Add additional security to your account using two-factor authentication.</p>
                    </div>
                    <button className="px-6 py-3 bg-white/10 hover:bg-white/20 transition-all rounded-xl text-sm font-bold text-slate-900 dark:text-white border border-white/10 backdrop-blur-md w-fit">
                      Enable 2FA
                    </button>
                  </div>
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none"
              >
                <div className="p-8 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Notification Preferences</h3>
                  <p className="text-sm text-slate-500 mt-1">Manage how you receive updates and alerts.</p>
                </div>
                <div className="p-8 space-y-6">
                  {[
                    { title: "New Enrollments", desc: "Get notified when a new student enrolls." },
                    { title: "Payment Alerts", desc: "Notifications for successful or failed payments." },
                    { title: "System Alerts", desc: "Critical system and security notifications." },
                    { title: "Daily Reports", desc: "Receive a summary of daily activities." }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-800/50 last:border-0">
                      <div>
                        <h4 className="font-bold text-slate-600 dark:text-slate-300">{item.title}</h4>
                        <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                      </div>
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative cursor-pointer shadow-inner shadow-black/20">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm dark:shadow-none"></div>
                      </div>
                    </div>
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
