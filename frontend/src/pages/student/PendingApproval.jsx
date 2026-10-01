import React from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, ArrowRight, LogOut, Mail, Phone, XCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

export default function PendingApproval({ application }) {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const status = application?.status || 'pending';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-white rounded-[32px] shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden"
      >
        <div className="bg-primary-600 p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          </div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative z-10"
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
              {status === 'rejected' ? <XCircle size={40} className="text-white" /> : <Clock size={40} className="text-white" />}
            </div>
            <h1 className="text-3xl font-display font-bold mb-3">
              {status === 'rejected' ? 'Application Rejected' : 'Application Under Review'}
            </h1>
            <p className="text-primary-100">Welcome to FIC, {user?.name}! Your enrollment for {application?.course?.title || 'your selected course'} is being processed.</p>
          </motion.div>
        </div>

        <div className="p-10 lg:p-12 space-y-8">
          <div className="space-y-6">
            {/* Step 1: Received - Always Done if we have an application */}
            <div className="flex gap-4 p-5 bg-green-50 rounded-2xl border border-green-100">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle className="text-green-500" size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Step 1: Application Received</h3>
                <p className="text-sm text-slate-600 mt-1">We've received your enrollment details and domain selection.</p>
              </div>
            </div>

            {/* Step 2: Admin Verification - Dynamic */}
            <div className={`flex gap-4 p-5 rounded-2xl border transition-all ${
              status === 'completed' 
                ? 'bg-green-50 border-green-100' 
                : status === 'rejected'
                ? 'bg-red-50 border-red-100'
                : 'bg-orange-50 border-orange-100 animate-pulse'
            }`}>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                {status === 'completed' ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : status === 'rejected' ? (
                  <XCircle className="text-red-500" size={20} />
                ) : (
                  <Clock className="text-orange-500" size={20} />
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Step 2: Admin Verification</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {status === 'completed' 
                    ? 'Your documents and details have been verified successfully.' 
                    : status === 'rejected'
                    ? 'There was an issue with your verification. Please contact support.'
                    : 'Our HR team is currently verifying your documents and details.'}
                </p>
              </div>
            </div>

            {/* Step 3: Dashboard Access - Dynamic */}
            <div className={`flex gap-4 p-5 rounded-2xl border transition-all ${
              status === 'completed' 
                ? 'bg-blue-50 border-blue-100' 
                : 'opacity-50 border border-dashed border-slate-200'
            }`}>
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0 shadow-sm">
                {status === 'completed' ? (
                  <ArrowRight className="text-primary-600" size={20} />
                ) : (
                  <ArrowRight className="text-slate-400" size={20} />
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Step 3: Dashboard Access</h3>
                <p className="text-sm text-slate-600 mt-1">
                  {status === 'completed' 
                    ? 'Redirecting to your dashboard...' 
                    : 'Once approved, your full student dashboard will be unlocked.'}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Need Help?</p>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1.5"><Mail size={14} /> support@fic.com</span>
                <span className="flex items-center gap-1.5"><Phone size={14} /> +91 98765 43210</span>
              </div>
            </div>
            
            <button 
              onClick={handleLogout}
              className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition flex items-center gap-2 shadow-lg"
            >
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
