import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, BookOpen, Clock, User, Star } from "lucide-react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
export default function CourseCatalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Development", "Design", "Business", "Marketing"];
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/courses");
        setCourses(data.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  return (
    <div className="space-y-10 pb-16 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-200/60 dark:border-slate-800/60">
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white font-display tracking-tight">
            Explore Courses
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm md:text-base">
            Expand your knowledge with our professional curriculum.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none w-64 text-slate-950 dark:text-white text-sm transition-all"
            />
          </div>
          <button className="p-3 bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="flex flex-wrap gap-2.5">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
              selectedCategory === cat
                ? "bg-primary-600 text-white shadow-lg shadow-primary-600/25 scale-[1.02]"
                : "bg-white dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-[400px] bg-slate-100 dark:bg-slate-800/40 rounded-[24px] animate-pulse border border-slate-200/60 dark:border-slate-800/60"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -6 }}
              className="group bg-white dark:bg-[#1e293b]/50 rounded-[24px] border border-slate-200/80 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-primary-950/20 transition-all duration-300 flex flex-col h-full"
            >
              {/* Card Thumbnail */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800">
                <img
                  src={
                    course.thumbnail ||
                    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />

                {/* Category Tag */}
                <span className="absolute top-4 left-4 px-3 py-1 bg-primary-600/90 backdrop-blur-md text-[10px] font-extrabold text-white rounded-full shadow-sm uppercase tracking-wider">
                  {course.category}
                </span>

                {/* Level Tag */}
                <span className="absolute top-4 right-4 px-3 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[10px] font-extrabold text-slate-700 dark:text-slate-300 rounded-full shadow-sm uppercase tracking-wider">
                  {course.level || "Beginner"}
                </span>
              </div>

              {/* Card Body */}
              <div className="p-6 flex flex-col flex-1 justify-between space-y-4 bg-white dark:bg-[#111c30]">
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors duration-200 line-clamp-1 leading-snug">
                    {course.title}
                  </h3>

                  {/* Instructor */}
                  <div className="flex items-center gap-2 pt-1">
                    <img
                      src={`https://ui-avatars.com/api/?name=${
                        course.instructor?.name || "Instructor"
                      }&background=0ea5e9&color=fff&bold=true`}
                      alt={course.instructor?.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {course.instructor?.name || "Expert Trainer"}
                    </span>
                  </div>
                </div>

                {/* Info Badges */}
                <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400 text-xs border-t border-slate-100 dark:border-slate-800/60 pt-4">
                  <div className="flex items-center gap-1.5">
                    <BookOpen size={16} className="text-primary-500" />
                    <span className="font-semibold">
                      {course.subjects?.length || 0} Lessons
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock size={16} className="text-primary-500" />
                    <span className="font-semibold">
                      {course.duration || "Self-paced"}
                    </span>
                  </div>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-auto">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                      Course Fee
                    </span>
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      {course.price === 0
                        ? "Free"
                        : `₹${course.price?.toLocaleString()}`}
                    </span>
                  </div>

                  <Link
                    to={`/courses/${course._id}`}
                    className="px-4.5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-bold hover:shadow-lg hover:shadow-primary-600/20 active:scale-95 transition-all duration-200"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredCourses.length === 0 && (
        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-[32px] border border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Search size={28} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            No courses found
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      )}
    </div>
  );
}
