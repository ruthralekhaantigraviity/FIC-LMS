import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Video, FileText, ArrowLeft, Loader2, Clock } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";

export default function TrainerCourseManager() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    videoUrl: "",
    pdfUrl: "",
    duration: "",
    order: 0,
    module: "",
  });
  const [activeTab, setActiveTab] = useState("lessons");
  const [assignments, setAssignments] = useState([]);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [assignmentFormData, setAssignmentFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCourseData = async () => {
    try {
      const [courseRes, modulesRes, subjectsRes, assignmentsRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/modules/course/${id}`),
        api.get(`/subjects/course/${id}`),
        api.get(`/assignments/course/${id}`)
      ]);
      setCourse(courseRes.data.data);
      setModules(modulesRes.data.data);
      setSubjects(subjectsRes.data.data);
      setAssignments(assignmentsRes.data.data);
    } catch (err) {
      console.error("Error fetching course data:", err);
      toast.error("Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
    
    // Auto-open modal if requested from navigation state
    if (location.state?.openAddModal) {
      setTimeout(() => handleOpenModal(), 500);
      // Clear state so it doesn't re-open on refresh
      window.history.replaceState({}, document.title);
    }
  }, [id]);

  const handleOpenModal = (subject = null) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({
        title: subject.title,
        content: subject.content,
        videoUrl: subject.videoUrl || "",
        pdfUrl: subject.pdfUrl || subject.resources?.[0]?.url || "",
        duration: subject.duration || "",
        order: subject.order || 0,
        module: subject.module?._id || subject.module || "",
      });
    } else {
      setEditingSubject(null);
      setFormData({
        title: "",
        content: "",
        videoUrl: "",
        pdfUrl: "",
        duration: "",
        order: subjects.length + 1,
        module: modules[0]?._id || "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingSubject) {
        const payload = { 
          ...formData, 
          course: id,
          resources: formData.pdfUrl ? [{ name: "Lesson PDF", url: formData.pdfUrl }] : [] 
        };
        await api.patch(`/subjects/${editingSubject._id}`, payload);
        toast.success("Topic updated successfully");
      } else {
        const payload = { 
          ...formData, 
          course: id,
          resources: formData.pdfUrl ? [{ name: "Lesson PDF", url: formData.pdfUrl }] : [] 
        };
        await api.post("/subjects", payload);
        toast.success("Topic created successfully");
      }
      fetchCourseData();
      handleCloseModal();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (subjectId) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      try {
        await api.delete(`/subjects/${subjectId}`);
        toast.success("Lesson deleted");
        fetchCourseData();
      } catch (err) {
        toast.error("Failed to delete lesson");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <button 
        onClick={() => navigate("/dashboard/trainer/courses")}
        className="flex items-center gap-2 text-slate-500 hover:text-primary-600 transition"
      >
        <ArrowLeft size={16} /> Back to My Courses
      </button>

      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{course?.title}</h1>
            <p className="text-slate-500 text-sm mt-1">Manage course lessons, videos, and assignments</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsModuleModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition"
            >
              <Plus size={18} /> Add Module
            </button>
            <button 
              onClick={() => activeTab === 'lessons' ? handleOpenModal() : setIsAssignmentModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition"
            >
              <Plus size={18} /> {activeTab === 'lessons' ? 'Add Topic' : 'Add Assignment'}
            </button>
          </div>
        </div>

        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('lessons')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'lessons' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Modules & Topics ({subjects.length})
          </button>
          <button 
            onClick={() => setActiveTab('assignments')}
            className={`px-6 py-3 text-sm font-bold border-b-2 transition ${activeTab === 'assignments' ? 'border-primary-600 text-primary-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            Assignments ({assignments.length})
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {activeTab === 'lessons' ? (
          modules.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No modules yet</h3>
              <p className="text-slate-500 mt-1 mb-4">Create modules to organize your topics.</p>
              <button 
                onClick={() => setIsModuleModalOpen(true)}
                className="text-primary-600 font-semibold hover:underline"
              >
                + Create First Module
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {modules.map((module) => (
                <div key={module._id} className="space-y-4">
                  <div className="flex items-center justify-between px-2">
                    <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs">M</div>
                      {module.title}
                    </h2>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingSubject(null);
                          setFormData({ ...formData, module: module._id, order: subjects.filter(s => (s.module?._id || s.module) === module._id).length + 1 });
                          setIsModalOpen(true);
                        }}
                        className="text-xs font-bold text-primary-600 hover:underline"
                      >
                        + Add Topic
                      </button>
                      <button 
                        onClick={async () => {
                          if(confirm('Delete module and all topics?')) {
                            await api.delete(`/modules/${module._id}`);
                            fetchCourseData();
                          }
                        }}
                        className="text-xs font-bold text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid gap-3">
                    {subjects.filter(s => (s.module?._id || s.module) === module._id).length === 0 ? (
                      <p className="text-xs text-slate-400 italic px-4 py-3 bg-white rounded-2xl border border-slate-100">No topics in this module yet.</p>
                    ) : (
                      subjects.filter(s => (s.module?._id || s.module) === module._id).map((subject, index) => (
                        <motion.div
                          key={subject._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center group hover:border-primary-200 transition"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-xs font-bold text-slate-400">#{subject.order}</span>
                              <h3 className="font-bold text-slate-900">{subject.title}</h3>
                              {subject.duration && <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded text-slate-500">{subject.duration}</span>}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-[11px]">
                              {subject.videoUrl && <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded flex items-center gap-1"><Video size={10}/> Video</span>}
                              {subject.pdfUrl && <span className="text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded flex items-center gap-1"><FileText size={10}/> PDF</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleOpenModal(subject)} className="p-1.5 text-slate-400 hover:text-primary-600"><Edit size={16} /></button>
                            <button onClick={() => handleDelete(subject._id)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Assignments View */
          assignments.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 border-dashed">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <FileText size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No assignments yet</h3>
              <p className="text-slate-500 mt-1 mb-4">Create assignments for your students.</p>
              <button 
                onClick={() => setIsAssignmentModalOpen(true)}
                className="text-primary-600 font-semibold hover:underline"
              >
                + Create First Assignment
              </button>
            </div>
          ) : (
            assignments.map((assignment, index) => (
              <motion.div
                key={assignment._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-start md:items-center group hover:border-primary-200 transition"
              >
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-lg">{assignment.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-1">{assignment.description}</p>
                  <div className="mt-2 text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-md inline-flex">
                    Due: {new Date(assignment.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button 
                    className="px-4 py-2 text-primary-600 bg-primary-50 font-bold rounded-lg hover:bg-primary-100 transition"
                  >
                    View Submissions
                  </button>
                </div>
              </motion.div>
            ))
          )
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-slate-900">
                {editingSubject ? "Edit Topic" : "Add New Topic"}
              </h2>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Module *</label>
                  {modules.length === 0 ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
                      <p className="font-bold mb-2">No modules found!</p>
                      <p className="mb-3">You need to create at least one module (e.g. "Basics") before adding topics.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setIsModuleModalOpen(true);
                        }}
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg font-bold text-xs"
                      >
                        + Create Module Now
                      </button>
                    </div>
                  ) : (
                    <select
                      required
                      value={formData.module}
                      onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="">Select a Module</option>
                      {modules.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                    </select>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Topic Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="e.g. What is UI Design"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Duration</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="e.g. 15 mins"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Order Number</label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-5">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Video URL</label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="e.g. https://youtube.com/..."
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">PDF Upload / URL</label>
                  <input
                    type="url"
                    value={formData.pdfUrl}
                    onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="e.g. https://drive.google.com/..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Theory / Content *</label>
                <textarea
                  required
                  rows="6"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-y"
                  placeholder="Write the theoretical content here..."
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save Topic"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Assignment Modal */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Create Assignment</h2>
              <button onClick={() => setIsAssignmentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                &times;
              </button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                await api.post("/assignments", { ...assignmentFormData, course: id });
                toast.success("Assignment created!");
                setIsAssignmentModalOpen(false);
                fetchCourseData();
              } catch (err) {
                toast.error("Failed to create assignment");
              }
            }} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={assignmentFormData.title}
                  onChange={(e) => setAssignmentFormData({ ...assignmentFormData, title: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Due Date</label>
                <input
                  type="date"
                  required
                  value={assignmentFormData.dueDate}
                  onChange={(e) => setAssignmentFormData({ ...assignmentFormData, dueDate: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description / Instructions</label>
                <textarea
                  required
                  rows="4"
                  value={assignmentFormData.description}
                  onChange={(e) => setAssignmentFormData({ ...assignmentFormData, description: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsAssignmentModalOpen(false)} className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition">Create Assignment</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
      {/* Module Modal */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-3xl w-full max-w-md shadow-2xl p-6">
            <h2 className="text-xl font-bold mb-4">Add New Module</h2>
            <input 
              type="text" 
              value={moduleTitle} 
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="e.g. Introduction"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none mb-4"
            />
            <div className="flex justify-end gap-3">
              <button onClick={() => setIsModuleModalOpen(false)} className="px-4 py-2 text-slate-500 font-bold">Cancel</button>
              <button 
                onClick={async () => {
                  try {
                    await api.post('/modules', { title: moduleTitle, course: id });
                    toast.success('Module created!');
                    setIsModuleModalOpen(false);
                    setModuleTitle("");
                    fetchCourseData();
                  } catch (err) {
                    toast.error('Failed to create module');
                  }
                }}
                className="px-6 py-2 bg-primary-600 text-white font-bold rounded-xl"
              >
                Create
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
