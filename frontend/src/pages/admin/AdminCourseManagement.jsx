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
      // Filter for trainers
      const trainersList = data.data.filter(u => u.role === 'trainer');
      setTrainers(trainersList);
    } catch (err) {
      console.error("Error fetching trainers:", err);
    }
  };

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
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-display">
            Manage Courses
          </h1>
          <p className="text-slate-500">
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
          className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition shadow-lg shadow-primary-600/20"
        >
          <Plus size={20} /> Create New Course
        </button>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm w-64 focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10">
                    Loading...
                  </td>
                </tr>
              ) : filteredCourses.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500">
                    No courses found matching your search.
                  </td>
                </tr>
              ) : (
                filteredCourses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={course.thumbnail}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-900 truncate">
                            {course.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {course.level}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-bold uppercase">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {course.price === 0 ? "Free" : `$${course.price}`}
                    </td>
                    <td className="px-6 py-4">
                      {course.isPublished ? (
                        <div className="flex items-center gap-1.5 text-green-500">
                          <CheckCircle size={14} />
                          <span className="text-xs font-bold uppercase">
                            Published
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-orange-500">
                          <XCircle size={14} />
                          <span className="text-xs font-bold uppercase">
                            Draft
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(course.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/courses/${course._id}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 text-slate-400 hover:text-primary-600 transition"
                        >
                          <Eye size={18} />
                        </a>
                        <button
                          onClick={() => handleEdit(course)}
                          className="p-2 text-slate-400 hover:text-primary-600 transition"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course._id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition"
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
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold">
                  {editingCourse ? "Edit Course" : "Create New Course"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Course Title
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="e.g. Master React in 30 Days"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
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
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                        placeholder="What will students learn in this course?"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                      >
                        <option>Development</option> <option>Design</option>
                        <option>Business</option> <option>Marketing</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Level
                      </label>
                      <select
                        value={formData.level}
                        onChange={(e) =>
                          setFormData({ ...formData, level: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                      >
                        <option>Beginner</option> <option>Intermediate</option>
                        <option>Advanced</option>
                      </select>
                    </div>
                     <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Course Price ($)
                      </label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: Number(e.target.value) })
                        }
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="e.g. 99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Duration
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="e.g. 8 Weeks"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Assign Trainer
                      </label>
                      <select
                        required
                        value={formData.instructor}
                        onChange={(e) =>
                          setFormData({ ...formData, instructor: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
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
                  <div className="flex items-center gap-2">
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
                      className="w-5 h-5 rounded-md text-primary-600 focus:ring-primary-500"
                    />
                    <label
                      htmlFor="isPublished"
                      className="text-sm font-bold text-slate-700"
                    >
                      Publish immediately
                    </label>
                  </div>
                </div>
                <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition shadow-lg shadow-primary-600/20"
                  >
                    {editingCourse ? "Save Changes" : "Create Course"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingCourse(null);
                    }}
                    className="flex-1 py-4 bg-white text-slate-900 border border-slate-200 font-bold rounded-2xl hover:bg-slate-50 transition"
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
