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
              <div className="relative h-48">
                {" "}
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />{" "}
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold text-primary-600">
                  {" "}
                  {course.category}{" "}
                </div>{" "}
              </div>{" "}
              <div className="p-6">
                {" "}
                <div className="flex items-center gap-2 mb-3">
                  {" "}
                  <div className="flex text-yellow-400">
                    {" "}
                    <Star size={14} fill="currentColor" />{" "}
                    <Star size={14} fill="currentColor" />{" "}
                    <Star size={14} fill="currentColor" />{" "}
                    <Star size={14} fill="currentColor" />{" "}
                    <Star size={14} fill="currentColor" />{" "}
                  </div>{" "}
                  <span className="text-xs text-slate-400 font-medium">
                    (4.8)
                  </span>{" "}
                </div>{" "}
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1">
                  {course.title}
                </h3>{" "}
                <div className="flex items-center gap-4 text-slate-500 text-sm mb-6">
                  {" "}
                  <div className="flex items-center gap-1.5">
                    {" "}
                    <BookOpen size={16} /> <span>12 Lessons</span>{" "}
                  </div>{" "}
                  <div className="flex items-center gap-1.5">
                    {" "}
                    <Clock size={16} /> <span>10h 30m</span>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  {" "}
                  <div className="flex items-center gap-2">
                    {" "}
                    <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden">
                      {" "}
                      <img
                        src={`https://ui-avatars.com/api/?name=${course.instructor?.name}`}
                        alt=""
                      />{" "}
                    </div>{" "}
                    <span className="text-sm font-medium text-slate-700">
                      {course.instructor?.name}
                    </span>{" "}
                  </div>{" "}
                  <Link
                    to={`/courses/${course._id}`}
                    className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-bold hover:bg-primary-600 hover:text-white transition"
                  >
                    {" "}
                    View Course{" "}
                  </Link>{" "}
                </div>{" "}
              </div>{" "}
            </motion.div>
          ))}{" "}
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
