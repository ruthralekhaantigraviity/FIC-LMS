import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import {
  ChevronRight,
  Play,
  Users,
  Award,
  BookOpen,
  Star,
  CheckCircle,
  Zap,
  Globe,
  Shield,
  Clock,
  ArrowRight,
  Mail,
  Phone,
  MessageSquare,
  Send,
} from "lucide-react";
import Footer from "../components/layout/Footer";
import aboutImg from "../assets/about.png";
export default function Home() {
  const stats = [
    { label: "Active Students", value: "10,000+", icon: Users },
    { label: "Expert Trainers", value: "500+", icon: Star },
    { label: "Total Courses", value: "200+", icon: BookOpen },
    { label: "Certifications", value: "15,000+", icon: Award },
  ];
  const features = [
    {
      title: "Personalized Learning",
      description:
        "Adaptive learning paths tailored to your specific goals and progress speed.",
      icon: Zap,
      color: "bg-amber-100 text-amber-600",
    },
    {
      title: "Industry Experts",
      description:
        "Learn from top-tier professionals with years of experience in leading tech companies.",
      icon: Globe,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Flexible Schedule",
      description:
        "Access your courses anytime, anywhere. Learn at your own pace on any device.",
      icon: Clock,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Verified Certificates",
      description:
        "Earn industry-recognized certificates to showcase your skills to employers.",
      icon: Shield,
      color: "bg-green-100 text-green-600",
    },
  ];
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enquiryForm, setEnquiryForm] = useState({ fullName: '', email: '', phoneNumber: '', courseInterest: '', message: '' });
  const [enquiryLoading, setEnquiryLoading] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);

  const handleEnquiryChange = (e) => setEnquiryForm({ ...enquiryForm, [e.target.name]: e.target.value });

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryLoading(true);
    try {
      await api.post('/enquiries', enquiryForm);
      setEnquirySuccess(true);
      setEnquiryForm({ fullName: '', email: '', phoneNumber: '', courseInterest: '', message: '' });
      toast.success('Enquiry submitted! We will contact you soon.');
      setTimeout(() => setEnquirySuccess(false), 5000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setEnquiryLoading(false);
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/courses");
        // Show only published courses and limit to 4
        const activeCourses = data.data.filter(c => c.isPublished).slice(0, 4);
        setCourses(activeCourses);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <div className="min-h-screen bg-white">
      {" "}
      {/* Navbar */}{" "}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        {" "}
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {" "}
          <a
            href="#"
            onClick={e => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img src="/logo.jpg" alt="FIC Logo" className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" />
            <span className="font-bold text-lg tracking-tight">
              <span style={{ color: '#1A9FD4' }}>Forge</span>{" "}
              <span className="text-slate-700">India</span>{" "}
              <span style={{ color: '#7c3aed' }}>Connect</span>
            </span>
          </a>{" "}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {" "}
            <a href="#courses" className="transition-all hover:scale-105" style={{ color: '#1A9FD4' }}>
              Courses
            </a>{" "}
            <a href="#features" className="transition-all hover:scale-105" style={{ color: '#7c3aed' }}>
              Features
            </a>{" "}
            <a href="#about" className="transition-all hover:scale-105" style={{ color: '#10b981' }}>
              About
            </a>{" "}
            <a href="#enquiry" className="transition-all hover:scale-105 px-4 py-2 rounded-xl text-white font-bold shadow-md hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #1A9FD4, #7c3aed)' }}>
              Enquire Now
            </a>{" "}
          </div>{" "}
          <div className="flex items-center gap-4">
            {" "}
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-700 hover:text-primary-600 transition"
            >
              Log in
            </Link>{" "}
            <Link
              to="/enroll"
              className="px-5 py-2.5 bg-primary-600 text-white text-sm font-semibold rounded-xl hover:bg-primary-700 transition shadow-lg"
            >
              {" "}
              Apply Now{" "}
            </Link>{" "}
          </div>{" "}
        </div>{" "}
      </nav>{" "}
      {/* Hero Section */}{" "}
      <section className="pt-32 pb-20 px-6 overflow-hidden">
        {" "}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {" "}
          <div className="flex-1 text-center lg:text-left">
            {" "}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full text-primary-600 text-sm font-medium mb-6"
            >
              {" "}
              <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse"></span>{" "}
              The Future of Enterprise Learning{" "}
            </motion.div>{" "}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-tight mb-6"
            >
              {" "}
              Master New Skills with{" "}
              <span className="text-primary-600">FIC</span>{" "}
            </motion.h1>{" "}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              {" "}
              Enterprise-level learning management system designed for modern
              students and organizations. Scalable, secure, and intuitive.{" "}
            </motion.p>{" "}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-4"
            >
              {" "}
              <Link
                to="/enroll"
                className="px-8 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition flex items-center gap-2 shadow-xl"
              >
                {" "}
                Apply Now <ChevronRight size={20} />{" "}
              </Link>{" "}
              <Link
                to="/courses"
                className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl hover:bg-slate-50 transition flex items-center gap-2"
              >
                {" "}
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                  {" "}
                  <Play size={16} fill="currentColor" />{" "}
                </div>{" "}
                Browse Courses{" "}
              </Link>{" "}
            </motion.div>{" "}
          </div>{" "}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 relative"
          >
            {" "}
            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              {" "}
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1471&q=80"
                alt="Students learning"
                className="w-full h-auto"
              />{" "}
            </div>{" "}
          </motion.div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Stats Section */}{" "}
      <section className="py-12 bg-slate-50/50 border-y border-slate-100">
        {" "}
        <div className="max-w-7xl mx-auto px-6">
          {" "}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {" "}
            {stats.map((stat, i) => (
              <div key={i} className="text-center group">
                {" "}
                <p className="text-4xl font-bold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                  {stat.value}
                </p>{" "}
                <p className="text-sm text-slate-500 font-medium tracking-wide uppercase">
                  {stat.label}
                </p>{" "}
              </div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Features Section */}{" "}
      <section id="features" className="py-24 px-6 relative overflow-hidden">
        {" "}
        <div className="max-w-7xl mx-auto">
          {" "}
          <div className="text-center mb-16">
            {" "}
            <h2 className="text-base font-bold text-primary-600 uppercase tracking-widest mb-3">
              Core Features
            </h2>{" "}
            <h3 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-4">
              Everything You Need to Succeed
            </h3>{" "}
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our platform combines powerful features with an intuitive
              interface to provide the best learning experience.
            </p>{" "}
          </div>{" "}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {" "}
            {features.map((feature, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="p-8 rounded-3xl bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                {" "}
                <div
                  className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}
                >
                  {" "}
                  <feature.icon size={28} />{" "}
                </div>{" "}
                <h4 className="text-xl font-bold text-slate-900 mb-3">
                  {feature.title}
                </h4>{" "}
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.description}
                </p>{" "}
              </motion.div>
            ))}{" "}
          </motion.div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Courses Grid Section */}{" "}
      <section id="courses" className="py-24 px-6 bg-slate-50">
        {" "}
        <div className="max-w-7xl mx-auto">
          {" "}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            {" "}
            <div>
              {" "}
              <h2 className="text-base font-bold text-primary-600 uppercase tracking-widest mb-3">
                Popular Courses
              </h2>{" "}
              <h3 className="text-3xl md:text-5xl font-display font-bold text-slate-900">
                Start Your Career Journey
              </h3>{" "}
            </div>{" "}
            <Link
              to="/courses"
              className="text-primary-600 font-bold flex items-center gap-2 hover:text-primary-700 transition-all"
            >
              {" "}
              Explore All Courses <ArrowRight size={20} />{" "}
            </Link>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-3xl border border-slate-200"></div>
            ))
          ) : courses.map((course, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {" "}
                <div className="p-8">
                  {" "}
                  <div className="px-3 py-1 bg-primary-50 rounded-full text-[10px] font-bold text-primary-600 inline-block mb-4 uppercase tracking-wider">
                    {" "}
                    {course.category}{" "}
                  </div>{" "}
                  <h4 className="text-xl font-bold text-slate-900 mb-6 group-hover:text-primary-600 transition-colors line-clamp-2 h-14">
                    {" "}
                    {course.title}{" "}
                  </h4>{" "}
                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    {" "}
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-tight">Course Fee</span>
                      <span className="text-2xl font-bold text-slate-900">
                        {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString()}`}
                      </span>{" "}
                    </div>
                    <Link to={`/courses/${course._id}`} className="p-3 bg-slate-50 text-primary-600 rounded-xl group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                      {" "}
                      <ArrowRight size={20} />{" "}
                    </Link>{" "}
                  </div>{" "}
                </div>{" "}
              </motion.div>
            ))}{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* About Us Section */}{" "}
      <section id="about" className="py-24 px-6">
        {" "}
        <div className="max-w-7xl mx-auto">
          {" "}
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {" "}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1 relative"
            >
              {" "}
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                {" "}
                <img
                  src={aboutImg}
                  alt="About FIC"
                  className="w-full h-auto"
                />{" "}
              </div>{" "}
            </motion.div>{" "}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              {" "}
              <h2 className="text-base font-bold text-primary-600 uppercase tracking-widest mb-3">
                About FIC
              </h2>{" "}
              <h3 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6">
                Transforming Education through Innovation
              </h3>{" "}
              <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                {" "}
                FIC is more than just a platform; it's a global community
                dedicated to making high-quality education accessible to
                everyone.{" "}
              </p>{" "}
              <div className="space-y-4 mb-10">
                {" "}
                {[
                  "World-class curriculum updated weekly",
                  "Dedicated career support and placement assistance",
                  "Active community of 50k+ learners and alumni",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    {" "}
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      {" "}
                      <CheckCircle size={14} />{" "}
                    </div>{" "}
                    <span className="font-medium text-slate-700">
                      {item}
                    </span>{" "}
                  </div>
                ))}{" "}
              </div>{" "}
              <Link
                to="/enroll"
                className="inline-flex items-center gap-2 text-primary-600 font-bold hover:text-primary-700 transition-all"
              >
                {" "}
                Learn More About Our Mission <ArrowRight size={20} />{" "}
              </Link>{" "}
            </motion.div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* CTA Section */}{" "}
      <section className="py-20 px-6">
        {" "}
        <div className="max-w-7xl mx-auto">
          {" "}
          <div className="bg-primary-600 rounded-3xl p-12 md:p-20 text-center text-white relative overflow-hidden">
            {" "}
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
              Ready to Start Learning?
            </h2>{" "}
            <p className="text-primary-100 text-lg mb-10 max-w-2xl mx-auto">
              {" "}
              Join thousands of students who are already transforming their
              lives with FIC.{" "}
            </p>{" "}
            <div className="flex flex-wrap justify-center gap-4">
              {" "}
              <Link
                to="/enroll"
                className="px-10 py-5 bg-white text-primary-600 font-bold rounded-2xl hover:bg-primary-50 transition-all shadow-xl"
              >
                {" "}
                Apply Now{" "}
              </Link>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </section>{" "}
      {/* Enquiry Section */}
      <section id="enquiry" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Left — Info */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-base font-bold uppercase tracking-widest mb-3" style={{ color: '#1A9FD4' }}>Get In Touch</h2>
              <h3 className="text-3xl md:text-5xl font-display font-bold text-slate-900 mb-6 leading-tight">
                Have Questions? <br />We're Here to Help.
              </h3>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                Fill in the form and our team will reach out within 24 hours. Whether you want to know more about a course, fees, or career support — we've got you covered.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0" style={{ background: '#1A9FD4' }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Call Us</p>
                    <p className="text-slate-800 font-bold text-lg">+91 98765 43210</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0" style={{ background: '#1A9FD4' }}>
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Email Us</p>
                    <p className="text-slate-800 font-bold text-lg">info@forgeindia.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white flex-shrink-0" style={{ background: '#1A9FD4' }}>
                    <MessageSquare size={22} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Response Time</p>
                    <p className="text-slate-800 font-bold text-lg">Within 24 Hours</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-8 lg:p-10"
            >
              {enquirySuccess ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-2">Enquiry Sent!</h4>
                  <p className="text-slate-500">Our team will get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleEnquirySubmit} className="space-y-5">
                  <div>
                    <h4 className="text-xl font-bold text-slate-900 mb-1">Send an Enquiry</h4>
                    <p className="text-sm text-slate-500 mb-6">All fields marked * are required.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name *</label>
                      <input
                        type="text" name="fullName" required
                        value={enquiryForm.fullName} onChange={handleEnquiryChange}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number *</label>
                      <input
                        type="tel" name="phoneNumber" required
                        value={enquiryForm.phoneNumber} onChange={handleEnquiryChange}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address *</label>
                    <input
                      type="email" name="email" required
                      value={enquiryForm.email} onChange={handleEnquiryChange}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Course Interest</label>
                    <select
                      name="courseInterest"
                      value={enquiryForm.courseInterest} onChange={handleEnquiryChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all"
                    >
                      <option value="">Select a course domain...</option>
                      <option>MERN Stack Development</option>
                      <option>Python &amp; Data Science</option>
                      <option>UI/UX Design</option>
                      <option>Digital Marketing</option>
                      <option>Cyber Security</option>
                      <option>Cloud Computing</option>
                      <option>Mobile App Development</option>
                      <option>Java Full Stack</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                    <textarea
                      name="message" rows={4}
                      value={enquiryForm.message} onChange={handleEnquiryChange}
                      placeholder="Tell us about your goals, experience level, or any questions..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/20 transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={enquiryLoading}
                    className="w-full py-4 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:brightness-110 transition-all shadow-xl disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #1A9FD4, #7c3aed)' }}
                  >
                    {enquiryLoading ? (
                      <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Submitting...</>
                    ) : (
                      <><Send size={18} /> Submit Enquiry</>
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />{" "}

    </div>
  );
}
