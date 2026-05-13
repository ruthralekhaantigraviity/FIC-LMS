import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
  const courses = [
    {
      title: "Full-Stack Web Development",
      category: "Development",
      rating: 4.9,
      students: "2.5k",
      price: "$89.99",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Data Science & AI Masterclass",
      category: "Data Science",
      rating: 4.8,
      students: "1.8k",
      price: "$94.99",
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "UI/UX Design Essentials",
      category: "Design",
      rating: 4.7,
      students: "3.2k",
      price: "$79.99",
      image:
        "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Cloud Architecture (AWS/Azure)",
      category: "Cloud",
      rating: 4.9,
      students: "1.2k",
      price: "$99.99",
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    },
  ];
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
          <div className="flex items-center gap-2">
            {" "}
            <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
              {" "}
              <span className="text-white font-bold">F</span>{" "}
            </div>{" "}
            <span className="text-xl font-display font-bold text-slate-900">
              FIC
            </span>{" "}
          </div>{" "}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            {" "}
            <a href="#courses" className="hover:text-primary-600 transition">
              Courses
            </a>{" "}
            <a href="#features" className="hover:text-primary-600 transition">
              Features
            </a>{" "}
            <a href="#about" className="hover:text-primary-600 transition">
              About
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
              to="/enroll"
              className="text-primary-600 font-bold flex items-center gap-2 hover:text-primary-700 transition-all"
            >
              {" "}
              Explore All Courses <ArrowRight size={20} />{" "}
            </Link>{" "}
          </div>{" "}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {" "}
            {courses.map((course, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                {" "}
                <div className="relative h-48 overflow-hidden">
                  {" "}
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />{" "}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold text-primary-600">
                    {" "}
                    {course.category}{" "}
                  </div>{" "}
                </div>{" "}
                <div className="p-6">
                  {" "}
                  <div className="flex items-center gap-1 text-amber-500 mb-2">
                    {" "}
                    <Star size={14} fill="currentColor" />{" "}
                    <span className="text-xs font-bold text-slate-900">
                      {course.rating}
                    </span>{" "}
                    <span className="text-xs text-slate-400">
                      ({course.students})
                    </span>{" "}
                  </div>{" "}
                  <h4 className="font-bold text-slate-900 mb-4 group-hover:text-primary-600 transition-colors line-clamp-2 h-12">
                    {" "}
                    {course.title}{" "}
                  </h4>{" "}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    {" "}
                    <span className="text-lg font-bold text-slate-900">
                      {course.price}
                    </span>{" "}
                    <button className="p-2 bg-slate-50 text-primary-600 rounded-lg group-hover:bg-primary-600 group-hover:text-white transition-all">
                      {" "}
                      <ArrowRight size={18} />{" "}
                    </button>{" "}
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
      <Footer />{" "}
    </div>
  );
}
