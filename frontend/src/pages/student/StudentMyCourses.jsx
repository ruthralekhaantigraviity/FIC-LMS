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
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course, index) => {
              // Array of dynamic styles for the cards to keep them colorful
              const styles = [
                { from: "from-cyan-400", to: "to-blue-500", borderHover: "hover:border-blue-200", btnHover: "group-hover:bg-blue-600 group-hover:border-blue-600", Icon: MonitorPlay },
                { from: "from-pink-500", to: "to-rose-500", borderHover: "hover:border-rose-200", btnHover: "group-hover:bg-rose-500 group-hover:border-rose-500", Icon: Code },
                { from: "from-indigo-400", to: "to-blue-600", borderHover: "hover:border-indigo-200", btnHover: "group-hover:bg-indigo-600 group-hover:border-indigo-600", Icon: Video },
                { from: "from-red-500", to: "to-pink-600", borderHover: "hover:border-red-200", btnHover: "group-hover:bg-red-500 group-hover:border-red-500", Icon: Code },
                { from: "from-purple-500", to: "to-indigo-600", borderHover: "hover:border-purple-200", btnHover: "group-hover:bg-purple-600 group-hover:border-purple-600", Icon: Award },
                { from: "from-emerald-400", to: "to-teal-500", borderHover: "hover:border-emerald-200", btnHover: "group-hover:bg-emerald-500 group-hover:border-emerald-500", Icon: Briefcase },
                { from: "from-orange-400", to: "to-rose-500", borderHover: "hover:border-orange-200", btnHover: "group-hover:bg-orange-500 group-hover:border-orange-500", Icon: FileText }
              ];
              
              const style = styles[index % styles.length];
              const Icon = style.Icon;

              return (
                <div key={course._id} className={`bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md ${style.borderHover} transition group flex flex-col h-full`}>
                  <div className={`h-20 rounded-xl bg-gradient-to-r ${style.from} ${style.to} mb-5 flex items-center justify-center text-white shadow-inner`}>
                    <Icon size={32} />
                  </div>
                  <h4 className="font-bold text-slate-800 mb-2 text-lg">{course.title}</h4>
                  <p className="text-sm text-slate-500 mb-6 flex-1 line-clamp-2">
                    {course.description || "Explore this module to enhance your technical skills."}
                  </p>
                  <Link to={`/dashboard/student/learn/${course._id}`} className={`block w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-center font-bold rounded-xl ${style.btnHover} group-hover:text-white transition shadow-sm`}>
                    Start Learning
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
