import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { 
  Download, 
  Info, 
  AlertTriangle, 
  MonitorPlay,
  CheckCircle,
  Book,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import PendingApproval from "./PendingApproval";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const { data } = await api.get("/admissions/my-courses");
        setCourses(data.data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (courses.length === 0) {
    return <PendingApproval />;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      {/* Profile Header section */}
      <div className="flex flex-col items-center text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800 font-display">Welcome {user?.name || "Student"}</h1>
        <p className="text-slate-500 font-medium tracking-wide">Student ID: {user?.studentId || "FIC20260001"}</p>
      </div>

      {/* Alerts Section */}
      <div className="space-y-4">
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-green-500 text-white p-4 rounded-xl flex items-start gap-3 shadow-md"
        >
          <CheckCircle className="mt-0.5 flex-shrink-0" size={20} />
          <p className="font-semibold text-sm">
            We have successfully enabled your account, kindly start your courses!!
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-purple-600 text-white p-4 rounded-xl flex items-start gap-3 shadow-md"
        >
          <Info className="mt-0.5 flex-shrink-0" size={20} />
          <p className="font-semibold text-sm leading-relaxed">
            Hello {user?.name || "Student"}, our company provides 100% placement support. We request you to complete all your learning courses. Once learning is completed, you will be shifted to project development, then interview preparation, and finally resume building. Have a great learning experience.
          </p>
        </motion.div>

        <motion.button 
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          style={{ background: '#1A9FD4' }}
          className="w-full text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 transition hover:brightness-110"
        >
          <Download size={18} /> CLICK HERE TO DOWNLOAD OUR PLACEMENT BROCHURE
        </motion.button>
      </div>

      {/* Info Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 mb-3">
            <AlertTriangle size={20} />
            <h3 className="font-bold text-lg">Important Note</h3>
          </div>
          <ul className="space-y-2 text-sm text-amber-800 list-disc list-inside">
            <li>Strictly stick to the rules and regulations.</li>
            <li>Attend classes and exams on time.</li>
            <li>Participate in all learning activities.</li>
            <li>Maintain discipline throughout the program.</li>
            <li>Follow trainer instructions carefully.</li>
            <li>Use the learning platform responsibly.</li>
            <li>Keep track of important deadlines.</li>
            <li>Any violation will be strictly dealt with.</li>
          </ul>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 mb-3">
            <CheckCircle size={20} />
            <h3 className="font-bold text-lg">Rules & Regulations</h3>
          </div>
          <ul className="space-y-2 text-sm text-emerald-800 list-disc list-inside">
            <li>You must have a laptop/desktop with a proper internet connection.</li>
            <li>Complete daily assessments without fail.</li>
            <li>Keep your profile updated.</li>
            <li>You can clear your doubts using the chat section.</li>
            <li>Be respectful to your mentors and peers.</li>
            <li>Do not share your login credentials.</li>
            <li>Complete your learning milestones regularly.</li>
            <li>Reach out to support for any technical issues.</li>
          </ul>
        </div>
      </div>

      {/* My Enrolled Courses */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Book size={24} className="text-primary-600" /> My Enrolled Courses
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, i) => {
            const gradients = [
              "from-purple-600 to-indigo-700",
              "from-cyan-500 to-blue-600",
              "from-pink-500 to-rose-600",
              "from-emerald-500 to-teal-600",
              "from-orange-500 to-red-600",
              "from-violet-500 to-purple-700",
            ];
            const gradient = gradients[i % gradients.length];

            return (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between min-h-[200px] hover:scale-[1.02] transition duration-300`}
              >
                <div>
                  <MonitorPlay className="mb-3 opacity-80" size={32} />
                  <h4 className="font-bold text-lg mb-1">{course.title}</h4>
                  <p className="text-white/70 text-xs">{course.category} • {course.level || "All Levels"}</p>
                  {course.instructor && (
                    <p className="text-white/60 text-xs mt-1">By {course.instructor.name}</p>
                  )}
                </div>
                <Link 
                  to={`/dashboard/student/learn/${course._id}`} 
                  className="mt-4 bg-white/20 hover:bg-white/30 text-white text-sm font-bold py-2.5 px-4 rounded-xl text-center transition backdrop-blur-sm block"
                >
                  Go to Course →
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
