import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "../store/slices/authSlice";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const { data } = await api.post(
        "/auth/login",
        form,
      );
      dispatch(loginSuccess({ user: data.user, token: data.token }));
      toast.success(`Welcome back, ${data.user.name}!`);
      
      const role = data.user.role;
      if (role === "admin") navigate("/dashboard/admin");
      else if (role === "student") navigate("/dashboard/student");
      else navigate("/dashboard/overview");
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      dispatch(loginFailure(message));
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {/* Background blobs (subtle) */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-100 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/logo.jpg" alt="FIC Logo" className="h-20 w-auto object-contain bg-white rounded-xl p-2" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            Welcome back
          </h1>
          <p className="text-slate-500 mt-1">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-[32px] p-8 lg:p-10 shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none transition text-slate-900 placeholder-slate-400 font-medium"
                style={{ '--tw-ring-color': '#1A9FD4' }}
                onFocus={e => e.target.style.borderColor = '#1A9FD4'}
                onBlur={e => e.target.style.borderColor = 'transparent'}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none transition text-slate-900 placeholder-slate-400 font-medium pr-14"
                  onFocus={e => e.target.style.borderColor = '#1A9FD4'}
                  onBlur={e => e.target.style.borderColor = 'transparent'}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary-600 transition p-2"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              <div className="text-right mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm font-semibold text-primary-600 hover:text-primary-700"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #1A9FD4, #7c3aed)' }}
              className="w-full py-4 text-white font-bold rounded-2xl hover:brightness-110 transition-all duration-300 shadow-xl active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary-600 hover:text-primary-700 font-bold"
            >
              Register here
            </Link>
          </p>
        </div>

        {/* Quick Demo Access Helper */}
        <div className="mt-6 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-[28px] p-5 shadow-xl shadow-slate-200/30 text-center">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2 justify-center">
            ⚡ Quick Demo Access
          </h4>
          <div className="grid grid-cols-2 gap-3 text-left">
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:border-primary-100 hover:bg-white transition duration-200 group">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Student Dashboard</p>
              <p className="text-xs font-bold text-slate-800 mt-1 select-all group-hover:text-primary-600 transition">student@fic.com</p>
              <p className="text-[11px] text-slate-500 font-medium select-all mt-0.5">student123</p>
            </div>
            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl hover:border-primary-100 hover:bg-white transition duration-200 group">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Admin Dashboard</p>
              <p className="text-xs font-bold text-slate-800 mt-1 select-all group-hover:text-primary-600 transition">admin@fic.com</p>
              <p className="text-[11px] text-slate-500 font-medium select-all mt-0.5">admin123</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
