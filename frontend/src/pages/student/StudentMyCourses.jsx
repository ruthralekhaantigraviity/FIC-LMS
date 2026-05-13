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
        
        {/* Main Course */}
        <div>
          <h3 className="font-bold text-lg text-slate-700 mb-5 px-2 border-l-4 border-primary-500">
            Primary Course
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex flex-col justify-between h-48 transform hover:-translate-y-1 transition duration-300">
              <div>
                <MonitorPlay className="mb-3 opacity-90" size={32} />
                <h4 className="font-bold text-xl">{courses.length > 0 ? courses[0].title : "C / C++"}</h4>
                <p className="text-purple-100 text-sm mt-1">Core Programming</p>
              </div>
              <Link to={linkTarget} className="bg-white/20 hover:bg-white/30 text-white text-sm font-bold py-2.5 px-4 rounded-xl text-center transition backdrop-blur-sm">
                Resume Course
              </Link>
            </div>
          </div>
        </div>

        {/* Phase 1 */}
        <div>
          <h3 className="font-bold text-lg flex items-center gap-3 text-slate-800 mb-5 px-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold shadow-sm">1</div>
            Learning Phase 1 - General Software
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-blue-200 transition group flex flex-col h-full">
              <div className="h-20 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 mb-5 flex items-center justify-center text-white shadow-inner">
                <MonitorPlay size={32} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2 text-lg">Basic Programs</h4>
              <p className="text-sm text-slate-500 mb-6 flex-1">Foundational concepts and syntax overview.</p>
              <Link to={linkTarget} className="block w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-center font-bold rounded-xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition shadow-sm">
                Start Learning
              </Link>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-rose-200 transition group flex flex-col h-full">
              <div className="h-20 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 mb-5 flex items-center justify-center text-white shadow-inner">
                <Code size={32} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2 text-lg">Logic Building</h4>
              <p className="text-sm text-slate-500 mb-6 flex-1">Enhance your problem solving skills.</p>
              <Link to={linkTarget} className="block w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-center font-bold rounded-xl group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500 transition shadow-sm">
                Start Learning
              </Link>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-indigo-200 transition group flex flex-col h-full">
              <div className="h-20 rounded-xl bg-gradient-to-r from-indigo-400 to-blue-600 mb-5 flex items-center justify-center text-white shadow-inner">
                <Video size={32} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2 text-lg">Pattern Programs</h4>
              <p className="text-sm text-slate-500 mb-6 flex-1">Learn to construct complex visual patterns.</p>
              <Link to={linkTarget} className="block w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-center font-bold rounded-xl group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition shadow-sm">
                Start Learning
              </Link>
            </div>
          </div>
        </div>

        {/* Phase 2 */}
        <div>
          <h3 className="font-bold text-lg flex items-center gap-3 text-slate-800 mb-5 px-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm font-bold shadow-sm">2</div>
            Learning Phase 2 - Specialized Programming
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-red-200 transition group flex flex-col h-full">
              <div className="h-20 rounded-xl bg-gradient-to-r from-red-500 to-pink-600 mb-5 flex items-center justify-center text-white shadow-inner">
                <Code size={32} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2 text-lg">Data Structures</h4>
              <p className="text-sm text-slate-500 mb-6 flex-1">Arrays, Linked Lists, Trees, and Graphs.</p>
              <Link to={linkTarget} className="block w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-center font-bold rounded-xl group-hover:bg-red-500 group-hover:text-white group-hover:border-red-500 transition shadow-sm">
                Start Learning
              </Link>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-purple-200 transition group flex flex-col h-full">
              <div className="h-20 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 mb-5 flex items-center justify-center text-white shadow-inner">
                <Award size={32} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2 text-lg">Algorithms</h4>
              <p className="text-sm text-slate-500 mb-6 flex-1">Sorting, Searching, and Dynamic Programming.</p>
              <Link to={linkTarget} className="block w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-center font-bold rounded-xl group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition shadow-sm">
                Start Learning
              </Link>
            </div>
          </div>
        </div>

        {/* Phase 3 & 4 */}
        <div>
           <h3 className="font-bold text-lg flex items-center gap-3 text-slate-800 mb-5 px-2 border-b border-slate-100 pb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center text-sm font-bold shadow-sm">3</div>
            Learning Phase 3 - Projects & Interview Prep
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-emerald-200 transition group flex flex-col h-full">
              <div className="h-20 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 mb-5 flex items-center justify-center text-white shadow-inner">
                <Briefcase size={32} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2 text-lg">Mini Projects</h4>
              <p className="text-sm text-slate-500 mb-6 flex-1">Apply your knowledge to real-world scenarios.</p>
              <Link to={linkTarget} className="block w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-center font-bold rounded-xl group-hover:bg-emerald-500 group-hover:text-white group-hover:border-emerald-500 transition shadow-sm">
                Start Learning
              </Link>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 hover:shadow-md hover:border-orange-200 transition group flex flex-col h-full">
              <div className="h-20 rounded-xl bg-gradient-to-r from-orange-400 to-rose-500 mb-5 flex items-center justify-center text-white shadow-inner">
                <FileText size={32} />
              </div>
              <h4 className="font-bold text-slate-800 mb-2 text-lg">Resume Building</h4>
              <p className="text-sm text-slate-500 mb-6 flex-1">Crafting a professional profile for placements.</p>
              <Link to={linkTarget} className="block w-full py-2.5 bg-white border border-slate-200 text-slate-700 text-center font-bold rounded-xl group-hover:bg-orange-500 group-hover:text-white group-hover:border-orange-500 transition shadow-sm">
                Start Learning
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
