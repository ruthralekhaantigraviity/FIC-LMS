import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PlayCircle,
  FileText,
  Clock,
  CheckCircle,
  ChevronRight,
  Lock,
  Download,
  Share2,
  Smartphone
} from "lucide-react";
import axios from "axios";
export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState(null);
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/courses/${id}`,
        );
        setCourse(data.data);
        if (data.data.subjects?.length > 0) {
          setActiveSubject(data.data.subjects[0]);
        }
      } catch (err) {
        console.error("Error fetching course details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {" "}
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>{" "}
      </div>
    );
  if (!course)
    return <div className="text-center py-20">Course not found.</div>;
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-20">
      {" "}
      {/* Course Header */}{" "}
      <div className="relative h-[400px] rounded-3xl overflow-hidden group">
        {" "}
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
        />{" "}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent"></div>{" "}
        <div className="absolute bottom-10 left-10 right-10">
          {" "}
          <div className="flex flex-wrap gap-3 mb-4">
            {" "}
            <span className="px-3 py-1 bg-primary-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider">
              {" "}
              {course.category}{" "}
            </span>{" "}
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-lg text-xs font-bold uppercase tracking-wider">
              {" "}
              {course.level}{" "}
            </span>{" "}
          </div>{" "}
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
            {course.title}
          </h1>{" "}
          <div className="flex items-center gap-6 text-slate-300">
            {" "}
            <div className="flex items-center gap-2">
              {" "}
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
                {" "}
                <img
                  src={`https://ui-avatars.com/api/?name=${course.instructor?.name}`}
                  alt=""
                />{" "}
              </div>{" "}
              <span className="font-medium">
                {course.instructor?.name}
              </span>{" "}
            </div>{" "}
            <div className="flex items-center gap-2">
              {" "}
              <Clock size={18} /> <span>12 hours of content</span>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
        <button className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition">
          {" "}
          <Share2 size={20} />{" "}
        </button>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {" "}
        {/* Main Content (Curriculum) */}{" "}
        <div className="lg:col-span-2 space-y-8">
          {" "}
          <section className="bg-white p-8 rounded-3xl border border-slate-200">
            {" "}
            <h2 className="text-2xl font-bold mb-4">About this course</h2>{" "}
            <p className="text-slate-600 leading-relaxed whitespace-pre-line">
              {" "}
              {course.description}{" "}
            </p>{" "}
          </section>{" "}
          <section className="bg-white p-8 rounded-3xl border border-slate-200">
            {" "}
            <div className="flex items-center justify-between mb-8">
              {" "}
              <h2 className="text-2xl font-bold">Curriculum</h2>{" "}
              <span className="text-sm font-semibold text-slate-500">
                {course.subjects?.length || 0} Lessons
              </span>{" "}
            </div>{" "}
            <div className="space-y-4">
              {" "}
              {course.subjects?.map((subject, index) => (
                <div
                  key={subject._id}
                  onClick={() => setActiveSubject(subject)}
                  className={`flex items-center justify-between p-5 rounded-2xl border transition cursor-pointer ${activeSubject?._id === subject._id ? "bg-primary-50 border-primary-500 ring-1 ring-primary-500" : "bg-slate-50 border-slate-100 hover:border-primary-300"}`}
                >
                  {" "}
                  <div className="flex items-center gap-4">
                    {" "}
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition ${activeSubject?._id === subject._id ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30" : "bg-white text-slate-400"}`}
                    >
                      {" "}
                      {index === 0 ? (
                        <PlayCircle size={24} />
                      ) : (
                        <Lock size={20} />
                      )}{" "}
                    </div>{" "}
                    <div>
                      {" "}
                      <p
                        className={`font-bold text-sm ${activeSubject?._id === subject._id ? "text-primary-600 " : "text-slate-900 "}`}
                      >
                        {" "}
                        {index + 1}. {subject.title}{" "}
                      </p>{" "}
                      <p className="text-xs text-slate-500 mt-1">
                        Video • 15m 00s
                      </p>{" "}
                    </div>{" "}
                  </div>{" "}
                  {activeSubject?._id === subject._id && (
                    <motion.div
                      layoutId="play-indicator"
                      className="w-2 h-2 bg-primary-600 rounded-full"
                    />
                  )}{" "}
                </div>
              ))}{" "}
            </div>{" "}
          </section>{" "}
        </div>{" "}
        {/* Sidebar (Enrollment/Status) */}{" "}
        <div className="space-y-6">
          {" "}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl sticky top-28">
            {" "}
            <div className="mb-6">
              {" "}
              <span className="text-4xl font-display font-bold">Free</span>{" "}
              <p className="text-sm text-slate-500 mt-2">
                Lifetime access to all materials
              </p>{" "}
            </div>{" "}
            <Link
              to={`/dashboard/student/apply/${course._id}`}
              className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition shadow-lg shadow-primary-600/30 active:scale-95 mb-4 flex items-center justify-center"
            >
              {" "}
              Enroll Now{" "}
            </Link>{" "}
            <button className="w-full py-4 bg-slate-100 text-slate-900 font-bold rounded-2xl hover:bg-slate-200 transition">
              {" "}
              Add to Wishlist{" "}
            </button>{" "}
            <div className="mt-8 space-y-4">
              {" "}
              <div className="flex items-center gap-3 text-sm text-slate-600">
                {" "}
                <CheckCircle size={18} className="text-green-500" />{" "}
                <span>Certificate of Completion</span>{" "}
              </div>{" "}
              <div className="flex items-center gap-3 text-sm text-slate-600">
                {" "}
                <Download size={18} className="text-blue-500" />{" "}
                <span>12 Downloadable Resources</span>{" "}
              </div>{" "}
              <div className="flex items-center gap-3 text-sm text-slate-600">
                {" "}
                <Smartphone size={18} className="text-purple-500" />{" "}
                <span>Access on Mobile and TV</span>{" "}
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
