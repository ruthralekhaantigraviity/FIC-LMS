import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  MoreVertical,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Video,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";

export default function AdminCourseManagement() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [trainers, setTrainers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Development",
    level: "Beginner",
    price: 0,
    duration: "8 Weeks",
    instructor: "",
    isPublished: false,
  });

  useEffect(() => {
    fetchCourses();
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const { data } = await api.get("/auth/users");
      const trainersList = data.data.filter(u => u.role === 'trainer');
      setTrainers(trainersList);
    } catch (err) {
      console.error("Error fetching trainers:", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const { data } = await api.get("/courses?all=true");
      setCourses(data.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCourse) {
        await api.patch(`/courses/${editingCourse._id}`, formData);
      } else {
        await api.post("/courses", formData);
      }
      setIsModalOpen(false);
      setEditingCourse(null);
      setFormData({
        title: "",
        description: "",
        category: "Development",
        level: "Beginner",
        price: 0,
        duration: "8 Weeks",
        instructor: "",
        isPublished: false,
      });
      fetchCourses();
      toast.success(editingCourse ? "Course updated!" : "Course created!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving course");
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      level: course.level,
      price: course.price,
      duration: course.duration || "8 Weeks",
      instructor: course.instructor?._id || course.instructor || "",
      isPublished: course.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.delete(`/courses/${id}`);
        fetchCourses();
        toast.success("Course deleted successfully");
      } catch (err) {
        toast.error("Error deleting course");
      }
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Manage Courses
          </h1>
          <p className="text-slate-500 mt-1">
            Create, edit, and monitor your course catalog.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCourse(null);
            setFormData({
              title: "",
              description: "",
              category: "Development",
              level: "Beginner",
              price: 0,
              duration: "8 Weeks",
              instructor: "",
              isPublished: false,
            });
            setIsModalOpen(true);
          }}
          style={{ background: '#1A9FD4' }}
          className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl hover:brightness-110 transition shadow-lg"
        >
          <Plus size={20} /> Create New Course
        </button>
      </div>

      {/* Courses Table */}
      <div className="bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-sm w-72 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4 hidden md:table-cell">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 hidden lg:table-cell">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-20">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                       <span className="text-slate-500 font-medium">Loading courses...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-20 text-slate-500">
                    No courses found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 border border-slate-300 dark:border-slate-700">
                          <img
                            src={course.thumbnail}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                            {course.title}
                          </p>
                          <p className="text-xs text-slate-500 font-medium">
                            {course.level}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg text-[10px] font-bold uppercase border border-slate-300 dark:border-slate-700">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-400">
                      {course.price === 0 ? "Free" : `₹${course.price?.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-4">
                      {course.isPublished ? (
                        <div className="flex items-center gap-1.5 text-emerald-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                          <span className="text-[11px] font-bold uppercase">
                            Published
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div>
                          <span className="text-[11px] font-bold uppercase">
                            Draft
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 hidden lg:table-cell">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(course)}
                          className="p-2 text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Course Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingCourse ? "Edit Course" : "Create New Course"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-500 hover:text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Course Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                        placeholder="e.g. Master React in 30 Days"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Description
                      </label>
                      <textarea
                        required
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        rows="3"
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none placeholder:text-slate-600"
                        placeholder="What will students learn in this course?"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      >
                        <option value="Development">Development</option>
                        <option value="Design">Design</option>
                        <option value="Business">Business</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Level
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) =>
                          setFormData({ ...formData, level: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                     <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Course Price (₹)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: Number(e.target.value) })
                        }
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                        Assign Trainer
                      </label>
                      <select
                        required
                        value={formData.instructor}
                        onChange={(e) =>
                          setFormData({ ...formData, instructor: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800/50 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all"
                      >
                        <option value="">Select a Trainer</option>
                        {trainers.map(trainer => (
                          <option key={trainer._id} value={trainer._id}>
                            {trainer.name} ({trainer.email})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-blue-600/5 border border-blue-600/10 rounded-2xl">
                    <input
                      type="checkbox"
                      id="isPublished"
                      checked={formData.isPublished}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isPublished: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-blue-600 focus:ring-blue-500/50"
                    />
                    <label
                      htmlFor="isPublished"
                      className="text-sm font-semibold text-slate-600 dark:text-slate-300 cursor-pointer"
                    >
                      Publish this course immediately for student enrollment
                    </label>
                  </div>
                </div>
                <div className="p-8 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex gap-4">
                  <button
                    type="submit"
                    style={{ background: '#1A9FD4' }}
                    className="flex-1 py-4 text-white font-bold rounded-2xl hover:brightness-110 transition shadow-lg"
                  >
                    {editingCourse ? "Save Changes" : "Create Course"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingCourse(null);
                    }}
                    className="flex-1 py-4 bg-transparent text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700 font-bold rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:text-white transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

