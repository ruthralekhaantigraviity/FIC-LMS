import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Book, 
  MonitorPlay, 
  Code, 
  Video, 
  Award, 
  Briefcase, 
  FileText,
  Search,
  Loader2
} from "lucide-react";
import api from "../../utils/api";

export default function StudentMyCourses() {
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

  // Use the first enrolled course for the links, or fallback to a catalog link
  const targetCourseId = courses.length > 0 ? courses[0]._id : null;
  const linkTarget = targetCourseId ? `/dashboard/student/learn/${targetCourseId}` : "/dashboard/courses";

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display flex items-center gap-3">
            <Book className="text-primary-600" /> My Enrolled Courses
          </h1>
          <p className="text-slate-500 mt-2">
            Continue your learning journey through the different phases.
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search modules..."
            className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none w-64 shadow-sm"
          />
        </div>
      </div>

      {courses.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl mb-6">
          <p className="font-semibold text-sm">
            You are not officially enrolled in any courses yet. The buttons below will take you to the course catalog.
          </p>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-10">
        
        {/* Dynamic Courses Grid */}
        <div>
          <h3 className="font-bold text-lg flex items-center gap-3 text-slate-800 mb-5 px-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shadow-sm">
              <Book size={16} />
            </div>
            Your Enrolled Programs & Topics
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="bg-white dark:bg-slate-800 rounded-[32px] overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 flex flex-col group border border-slate-100 dark:border-slate-800">
                {/* Thumbnail / Image Area */}
                <div className="aspect-[4/3] bg-purple-600 p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20" />
                  <div className="relative z-10">
                    <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mb-5 mx-auto backdrop-blur-md border border-white/30 shadow-2xl">
                      <Book className="text-white" size={40} />
                    </div>
                    <h4 className="text-white font-bold text-base tracking-[0.2em] uppercase leading-tight drop-shadow-md">
                      {course.title}<br />
                      <span className="text-white/80 text-xs tracking-widest">INTERNSHIP</span>
                    </h4>
                  </div>
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-slate-900 dark:text-white font-bold text-xl mb-6">{course.title}</h3>
                  
                  {/* Progress Area */}
                  <div className="mb-8">
                    <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
                      <div className="bg-[#22c55e] h-full w-[0%] rounded-full shadow-[0_0_12px_rgba(34,197,94,0.4)]"></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
                      <span className="text-[11px] font-bold text-slate-900 dark:text-slate-300">0 of {course.totalLessons || 12} complete</span>
                    </div>
                  </div>

                  <Link 
                    to={`/dashboard/student/learn/${course._id}`} 
                    className="w-full py-4 bg-[#3b82f6] hover:bg-blue-600 text-white text-sm font-bold rounded-2xl text-center transition-all shadow-xl shadow-blue-500/25 active:scale-[0.98] uppercase tracking-[0.1em]"
                  >
                    START
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
