import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
import api from "../../utils/api";
import toast from "react-hot-toast";
export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSubject, setActiveSubject] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem("token");

  const handleEnrollClick = async (e) => {
    e.preventDefault();
    
    // If not logged in or not a student, go to public enrollment
    if (!token || user?.role !== "student") {
      navigate(`/enroll?courseId=${id}`);
      return;
    }

    // If logged in and course is free, enroll directly
    if (course.price === 0 || !course.price) {
      setEnrolling(true);
      try {
        const response = await api.post("/admissions/apply", {
          course: id,
          // Sending dummy data to pass validation since it's a free auto-enrollment
          fullName: user.name || "Student",
          email: user.email || "student@example.com",
          phoneNumber: "0000000000",
          dateOfBirth: "2000-01-01",
          address: "Auto Enrolled",
          previousEducation: "Auto Enrolled",
          targetDomain: course.category || "Auto Enrolled"
        });
        
        if (response.data?.data?.status === 'completed') {
           toast.success("Enrollment successful! You have been auto-enrolled.");
           navigate("/dashboard/student");
        } else {
           toast.error("Auto-enrollment failed, please apply manually.");
           navigate(`/dashboard/student/apply/${id}`);
        }
      } catch (err) {
         toast.error(err.response?.data?.message || "Failed to enroll");
         navigate(`/dashboard/student/apply/${id}`);
      } finally {
         setEnrolling(false);
      }
      return;
    }

    // If logged in and course is paid, go to admission form
    navigate(`/dashboard/student/apply/${id}`);
  };

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const { data } = await api.get(
          `/courses/${id}`,
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
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 rounded-[40px] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-20%] right-[-10%] w-[300px] h-[300px] bg-white rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-wrap gap-3 mb-6">
            {" "}
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-xl text-xs font-bold uppercase tracking-wider">
              {" "}
              {course.category}{" "}
            </span>{" "}
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white rounded-xl text-xs font-bold uppercase tracking-wider">
              {" "}
              {course.level}{" "}
            </span>{" "}
          </div>{" "}
          <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6 leading-tight max-w-3xl">
            {course.title}
          </h1>{" "}
          <div className="flex flex-wrap items-center gap-8 text-primary-100">
            {" "}
            <div className="flex items-center gap-3">
              {" "}
              <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white/20">
                {" "}
                <img
                  src={`https://ui-avatars.com/api/?name=${course.instructor?.name}`}
                  alt=""
                />{" "}
              </div>{" "}
              <div>
                <p className="text-xs text-primary-200 font-bold uppercase tracking-wider">Instructor</p>
                <p className="font-bold text-white">{course.instructor?.name}</p>
              </div>
            </div>{" "}
            <div className="h-10 w-px bg-white/10 hidden md:block" />
            <div className="flex items-center gap-3">
              {" "}
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Clock size={20} /> 
              </div>
              <div>
                <p className="text-xs text-primary-200 font-bold uppercase tracking-wider">Duration</p>
                <p className="font-bold text-white">{course.duration || "12 Weeks"}</p>
              </div>
            </div>{" "}
          </div>{" "}
        </div>{" "}
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
              <span className="text-4xl font-display font-bold">
                {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString()}`}
              </span>{" "}
              <p className="text-sm text-slate-500 mt-2">
                Lifetime access to all materials
              </p>{" "}
            </div>{" "}
            <button
              onClick={handleEnrollClick}
              disabled={enrolling}
              className={`w-full py-4 font-bold rounded-2xl transition shadow-lg shadow-primary-600/30 flex items-center justify-center ${
                enrolling 
                  ? "bg-primary-400 text-white cursor-not-allowed"
                  : "bg-primary-600 text-white hover:bg-primary-700 active:scale-95"
              } mb-4`}
            >
              {enrolling ? "Enrolling..." : "Enroll Now"}
            </button>

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
