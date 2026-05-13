import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Filter, BookOpen, Clock, User, Star } from "lucide-react";
import axios from "axios";
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
        const { data } = await axios.get("http://localhost:5000/api/courses");
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
    <div className="space-y-8">
      {" "}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-bold text-slate-900 font-display">
            Explore Courses
          </h1>{" "}
          <p className="text-slate-500">
            Expand your knowledge with our professional curriculum.
          </p>{" "}
        </div>{" "}
        <div className="flex items-center gap-3">
          {" "}
          <div className="relative">
            {" "}
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />{" "}
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none w-64"
            />{" "}
          </div>{" "}
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition">
            {" "}
            <Filter size={20} />{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      {/* Categories */}{" "}
      <div className="flex flex-wrap gap-2">
        {" "}
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition ${selectedCategory === cat ? "bg-primary-600 text-white shadow-lg shadow-primary-600/20" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}
          >
            {" "}
            {cat}{" "}
          </button>
        ))}{" "}
      </div>{" "}
      {/* Course Grid */}{" "}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {" "}
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-96 bg-white rounded-2xl animate-pulse border border-slate-200"
            ></div>
          ))}{" "}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {" "}
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {" "}
          {filteredCourses.map((course, i) => (
            <motion.div
              key={course._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {" "}
              <div className="p-8">
                {" "}
                <div className="px-3 py-1 bg-primary-50 rounded-full text-[10px] font-bold text-primary-600 inline-block mb-4 uppercase tracking-wider">
                  {" "}
                  {course.category}{" "}
                </div>{" "}
                <h3 className="text-xl font-bold text-slate-900 mb-6 line-clamp-1">
                  {course.title}
                </h3>{" "}
                <div className="flex items-center gap-4 text-slate-500 text-sm mb-8">
                  {" "}
                  <div className="flex items-center gap-1.5">
                    {" "}
                    <BookOpen size={18} className="text-primary-600" /> <span>{course.subjects?.length || 0} Lessons</span>{" "}
                  </div>{" "}
                  <div className="flex items-center gap-1.5">
                    {" "}
                    <Clock size={18} className="text-primary-600" /> <span>{course.duration || "Self-paced"}</span>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  {" "}
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-400 font-medium uppercase tracking-tight">Course Fee</span>
                    <span className="text-2xl font-bold text-slate-900">
                      {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString()}`}
                    </span>{" "}
                  </div>
                  <Link
                    to={`/courses/${course._id}`}
                    className="px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition shadow-lg shadow-primary-600/20"
                  >
                    {" "}
                    Details{" "}
                  </Link>{" "}
                </div>{" "}
              </div>{" "}
            </motion.div>
          ))}
        </div>
      )}{" "}
      {!loading && filteredCourses.length === 0 && (
        <div className="text-center py-20">
          {" "}
          <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
            {" "}
            <Search size={32} />{" "}
          </div>{" "}
          <h3 className="text-xl font-bold text-slate-900">No courses found</h3>{" "}
          <p className="text-slate-500">
            Try adjusting your search or filters.
          </p>{" "}
        </div>
      )}{" "}
    </div>
  );
}
