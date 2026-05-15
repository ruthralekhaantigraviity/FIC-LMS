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

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
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
        "/auth/register",
        form,
      );
      // Registration successful, redirect to login
      toast.success(`Account created! Please log in to continue.`);
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
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
        className="relative w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img src="/logo.jpg" alt="FIC Logo" className="h-20 w-auto object-contain bg-white rounded-xl p-2" />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900">
            Create Account
          </h1>
          <p className="text-slate-500 mt-1">
            Start your learning journey today
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[32px] p-8 lg:p-10 shadow-2xl shadow-slate-200/50">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="John Doe"
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none transition text-slate-900 placeholder-slate-400 font-medium"
                onFocus={e => e.target.style.borderColor = '#1A9FD4'}
                onBlur={e => e.target.style.borderColor = 'transparent'}
              />
            </div>

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
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none transition text-slate-900 placeholder-slate-400 font-medium"
                onFocus={e => e.target.style.borderColor = '#1A9FD4'}
                onBlur={e => e.target.style.borderColor = 'transparent'}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Password
              </label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none transition text-slate-900 placeholder-slate-400 font-medium"
                onFocus={e => e.target.style.borderColor = '#1A9FD4'}
                onBlur={e => e.target.style.borderColor = 'transparent'}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                I am a
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-5 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none transition text-slate-900 font-medium"
                onFocus={e => e.target.style.borderColor = '#1A9FD4'}
                onBlur={e => e.target.style.borderColor = 'transparent'}
              >
                <option value="student">Student</option>
                <option value="trainer">Trainer</option>
                <option value="hr">HR Representative</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{ background: 'linear-gradient(135deg, #1A9FD4, #7c3aed)' }}
              className="w-full py-4 text-white font-bold rounded-2xl hover:brightness-110 transition-all duration-300 shadow-xl active:scale-[0.98] disabled:opacity-50 mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <p className="text-center text-slate-500 text-sm mt-8">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary-600 hover:text-primary-700 font-bold"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
