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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchCourseData = async () => {
    try {
      const [courseRes, modulesRes, subjectsRes] = await Promise.all([
        api.get(`/courses/${id}`),
        api.get(`/modules/course/${id}`),
        api.get(`/subjects/course/${id}`)
      ]);
      setCourse(courseRes.data.data);
      setModules(modulesRes.data.data);
      setSubjects(subjectsRes.data.data);
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
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 transition font-medium"
      >
        <ArrowLeft size={16} /> Back to My Courses
      </button>

      <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-start sm:items-center justify-between gap-4 flex-col sm:flex-row mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display tracking-tight">{course?.title}</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">Manage course lessons, videos, and study materials</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsModuleModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
            >
              <Plus size={20} /> Add Module
            </button>
            <button 
              onClick={() => handleOpenModal()}
              style={{ background: '#1A9FD4' }}
              className="flex items-center gap-2 px-6 py-3 text-white font-bold rounded-2xl hover:brightness-110 transition shadow-lg shadow-sky-600/20"
            >
              <Plus size={20} /> Add Topic
            </button>
          </div>
        </div>

        <div className="flex border-b border-slate-100 dark:border-slate-800">
          <button 
            onClick={() => setActiveTab('lessons')}
            className={`px-8 py-4 text-sm font-bold border-b-2 transition-all ${activeTab === 'lessons' ? 'border-sky-500 text-sky-500' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-white'}`}
          >
            Modules & Topics ({subjects.length})
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'lessons' ? (
          modules.length === 0 ? (
            <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-[40px] border border-slate-200 dark:border-slate-800 border-dashed">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300 dark:text-slate-600">
                <FileText size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No modules yet</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 mb-6 max-w-sm mx-auto">Create modules to organize your topics into a structured learning path.</p>
              <button 
                onClick={() => setIsModuleModalOpen(true)}
                className="text-sky-500 font-bold hover:underline"
              >
                + Create First Module
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              {modules.map((module) => (
                <div key={module._id} className="space-y-6">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 dark:bg-sky-500 text-white flex items-center justify-center text-sm font-black shadow-lg shadow-sky-500/20">M</div>
                      {module.title}
                    </h2>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => {
                          setEditingSubject(null);
                          setFormData({ ...formData, module: module._id, order: subjects.filter(s => (s.module?._id || s.module) === module._id).length + 1 });
                          setIsModalOpen(true);
                        }}
                        className="text-sm font-bold text-sky-500 hover:underline"
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
                        className="text-sm font-bold text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    {subjects.filter(s => (s.module?._id || s.module) === module._id).length === 0 ? (
                      <p className="text-sm text-slate-400 dark:text-slate-500 italic px-8 py-6 bg-white dark:bg-slate-800/30 rounded-[32px] border border-slate-100 dark:border-slate-800">No topics in this module yet.</p>
                    ) : (
                      subjects.filter(s => (s.module?._id || s.module) === module._id).map((subject, index) => (
                        <motion.div
                          key={subject._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-white dark:bg-[#1e293b] p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-6 justify-between items-start md:items-center group hover:border-sky-500 transition-all duration-300"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Topic #{subject.order}</span>
                              <h3 className="font-bold text-slate-900 dark:text-white text-lg">{subject.title}</h3>
                              {subject.duration && <span className="text-[10px] font-black bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md text-slate-500 uppercase tracking-wider">{subject.duration}</span>}
                            </div>
                            <div className="flex items-center gap-3 mt-1 text-[11px] font-bold uppercase tracking-wider">
                              {subject.videoUrl && <span className="text-sky-600 bg-sky-50 dark:bg-sky-500/10 px-2.5 py-1 rounded-md flex items-center gap-1.5"><Video size={14}/> Video Lesson</span>}
                              {subject.pdfUrl && <span className="text-purple-600 bg-purple-50 dark:bg-purple-500/10 px-2.5 py-1 rounded-md flex items-center gap-1.5"><FileText size={14}/> PDF Notes</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleOpenModal(subject)} className="p-3 text-slate-400 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-500/10 rounded-xl transition"><Edit size={18} /></button>
                            <button onClick={() => handleDelete(subject._id)} className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition"><Trash2 size={18} /></button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          )

      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white dark:bg-[#1e293b] rounded-[40px] w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 dark:border-slate-800"
          >
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center sticky top-0 bg-white dark:bg-[#1e293b] z-10">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                {editingSubject ? "Edit Topic" : "Create New Topic"}
              </h2>
              <button 
                onClick={handleCloseModal} 
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition"
              >
                <Plus size={24} className="rotate-45" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest text-[10px]">Learning Module *</label>
                  {modules.length === 0 ? (
                    <div className="p-6 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-2xl text-amber-800 dark:text-amber-400 text-sm">
                      <p className="font-bold mb-2">No modules found!</p>
                      <p className="mb-4">You need to create at least one module before adding topics.</p>
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setIsModuleModalOpen(true);
                        }}
                        className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-amber-600/20"
                      >
                        + Create Module Now
                      </button>
                    </div>
                  ) : (
                    <select
                      required
                      value={formData.module}
                      onChange={(e) => setFormData({ ...formData, module: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none appearance-none font-medium"
                    >
                      <option value="">Select a Module</option>
                      {modules.map(m => <option key={m._id} value={m._id}>{m.title}</option>)}
                    </select>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest text-[10px]">Topic Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none font-medium"
                      placeholder="e.g. Introduction to React Hooks"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest text-[10px]">Est. Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none font-medium"
                      placeholder="e.g. 25 mins"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest text-[10px]">Display Order</label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest text-[10px] flex items-center gap-2">
                      <Video size={14} className="text-sky-500" /> Video URL
                    </label>
                    <input
                      type="url"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none font-medium"
                      placeholder="YouTube / Vimeo / CDN URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest text-[10px] flex items-center gap-2">
                      <FileText size={14} className="text-purple-500" /> PDF Resource URL
                    </label>
                    <input
                      type="url"
                      value={formData.pdfUrl}
                      onChange={(e) => setFormData({ ...formData, pdfUrl: e.target.value })}
                      className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none font-medium"
                      placeholder="Google Drive / Dropbox / Direct Link"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase tracking-widest text-[10px]">Notes & Theory Content *</label>
                  <textarea
                    required
                    rows="8"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[24px] text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none resize-none font-medium leading-relaxed"
                    placeholder="Enter the detailed theoretical notes for this topic..."
                  ></textarea>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-8 py-3.5 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ background: '#1A9FD4' }}
                  className="px-10 py-3.5 text-white font-bold rounded-2xl hover:brightness-110 transition disabled:opacity-50 shadow-lg shadow-sky-600/20"
                >
                  {isSubmitting ? "Saving..." : editingSubject ? "Update Topic" : "Create Topic"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}


      {/* Module Modal */}
      {isModuleModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            className="bg-white dark:bg-[#1e293b] rounded-[40px] w-full max-w-md shadow-2xl p-10 border border-slate-200 dark:border-slate-800"
          >
            <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white font-display">New Module</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">Group your topics into modules for better organization.</p>
            <input 
              type="text" 
              value={moduleTitle} 
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="e.g. Module 1: Introduction"
              className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-500/50 outline-none font-medium mb-8"
            />
            <div className="flex justify-end gap-4">
              <button onClick={() => setIsModuleModalOpen(false)} className="px-6 py-3 text-slate-500 dark:text-slate-400 font-bold">Cancel</button>
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
                style={{ background: '#1A9FD4' }}
                className="px-8 py-3 text-white font-bold rounded-2xl hover:brightness-110 transition shadow-lg shadow-sky-600/20"
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
