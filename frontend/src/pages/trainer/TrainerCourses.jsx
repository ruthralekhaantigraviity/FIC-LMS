import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, Video, Edit, Search, Plus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/api";

export default function TrainerCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/subjects/my-courses");
        setCourses(data.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">
            My Assigned Courses
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage your course content, theory, and videos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search your courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-48 bg-white dark:bg-slate-800/50 rounded-2xl animate-pulse border border-slate-200 dark:border-slate-700"
            />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
            <BookOpen size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            No assigned courses yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            You will see your courses here once they are assigned by the admin.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-6 hover:shadow-xl transition-all duration-300"
            >
              <div className="w-full sm:w-40 h-32 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-sky-600 bg-sky-50 dark:bg-sky-500/10 px-2.5 py-0.5 rounded-md">
                      {course.category}
                    </span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {course.subjects?.length || 0} Lessons
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                    {course.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
                    {course.description}
                  </p>
                </div>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => navigate(`/dashboard/trainer/courses/${course._id}`, { state: { openAddModal: true } })}
                    className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 border border-sky-600 dark:border-sky-500 rounded-xl text-sm font-bold text-center hover:bg-sky-50 dark:hover:bg-sky-500/10 transition flex items-center justify-center gap-1.5"
                  >
                    <Plus size={16} /> Add Topic
                  </button>
                  <Link
                    to={`/dashboard/trainer/courses/${course._id}`}
                    style={{ background: '#1A9FD4' }}
                    className="flex-1 px-4 py-2 text-white rounded-xl text-sm font-bold text-center hover:brightness-110 transition flex items-center justify-center"
                  >
                    Manage Content
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
