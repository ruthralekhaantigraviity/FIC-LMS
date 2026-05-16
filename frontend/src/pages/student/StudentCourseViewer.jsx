import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PlayCircle, CheckCircle, Circle, ArrowLeft, Loader2, Video, ChevronRight, ChevronLeft, FileText, Download, MonitorPlay } from "lucide-react";
import toast from "react-hot-toast";
import api from "../../utils/api";

export default function StudentCourseViewer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubjectId, setActiveSubjectId] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [activeTab, setActiveTab] = useState("content");
  const [completedSubjects, setCompletedSubjects] = useState([]);

  useEffect(() => {
    const fetchCourseAndSubjects = async () => {
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
        
        // Fetch progress
        const progressRes = await api.get(`/progress/${id}`);
        setCompletedSubjects(progressRes.data.data.completedSubjects || []);
        
        if (subjectsRes.data.data.length > 0) {
          setActiveSubjectId(subjectsRes.data.data[0]._id);
        }
      } catch (err) {
        console.error("Error loading course content", err);
        toast.error("Failed to load course content");
      } finally {
        setLoading(false);
      }
    };
    fetchCourseAndSubjects();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const activeIndex = subjects.findIndex(s => s._id === activeSubjectId);
  const activeSubject = subjects.find(s => s._id === activeSubjectId);

  const handleMarkComplete = async () => {
    if (!activeSubjectId) return;
    
    try {
      await api.post('/progress/mark-complete', {
        courseId: id,
        subjectId: activeSubjectId
      });
      
      if (!completedSubjects.includes(activeSubjectId)) {
        setCompletedSubjects([...completedSubjects, activeSubjectId]);
      }
      
      // Move to next subject if available
      const nextSubject = subjects[activeIndex + 1];
      if (nextSubject) {
        setActiveSubjectId(nextSubject._id);
        toast.success("Lesson marked as complete!");
      } else {
        toast.success("Course completed! Great job!");
        // Redirect to certifications page after a short delay
        setTimeout(() => {
          navigate("/dashboard/student/certificates");
        }, 1500);
      }
    } catch (err) {
      toast.error("Failed to update progress");
    }
  };

  // Calculate dynamic progress percentage
  const progressPercentage = subjects.length > 0 
    ? Math.round((completedSubjects.length / subjects.length) * 100) 
    : 0;

  // Function to convert YouTube URLs to embed URLs
  const getEmbedUrl = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col md:flex-row gap-0 -m-2 bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
      
      {/* Sidebar - Lesson List */}
      <div className="w-full md:w-80 flex-shrink-0 border-r border-slate-200 flex flex-col h-full bg-slate-50">
        <div className="p-5 bg-blue-500 text-white">
          <button 
            onClick={() => navigate("/dashboard/student/courses")}
            className="flex items-center gap-2 text-sm text-blue-100 hover:text-white transition mb-3 font-medium"
          >
            <ArrowLeft size={14} /> Back to My Courses
          </button>
          <h2 className="font-bold text-xl">{course?.title}</h2>
          
          {/* Progress Bar (Dynamic) */}
          <div className="mt-4">
            <div className="flex justify-between text-xs font-medium mb-1">
              <span>Course Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <div className="w-full h-1.5 bg-blue-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          {modules.map((module) => (
            <div key={module._id} className="space-y-1">
              <div className="px-5 py-2 bg-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {module.title}
              </div>
              {subjects.filter(s => (s.module?._id || s.module) === module._id).map((subject) => {
                const isActive = activeSubjectId === subject._id;
                const index = subjects.findIndex(s => s._id === subject._id);
                return (
                  <button
                    key={subject._id}
                    onClick={() => {
                      setActiveSubjectId(subject._id);
                      setActiveTab('content');
                    }}
                    className={`w-full text-left px-5 py-3 border-b border-slate-50 flex gap-3 items-center transition ${
                      isActive 
                        ? "bg-blue-50 text-blue-700 font-semibold" 
                        : "hover:bg-white text-slate-700"
                    }`}
                  >
                    {isActive ? (
                      <Circle size={14} className="text-orange-500 fill-orange-50 flex-shrink-0" />
                    ) : completedSubjects.includes(subject._id) ? (
                      <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle size={14} className="text-slate-300 flex-shrink-0" />
                    )}
                    
                    <div className="min-w-0">
                      <p className="text-[13px] line-clamp-2 leading-tight">
                        {subject.title}
                      </p>
                      {subject.duration && <p className="text-[10px] text-slate-400 mt-0.5">{subject.duration}</p>}
                    </div>
                    
                    {subject.videoUrl && !isActive && (
                      <Video size={12} className="ml-auto flex-shrink-0 text-slate-400" />
                    )}
                  </button>
                )
              })}
            </div>
          ))}

          {modules.length === 0 && subjects.length > 0 && subjects.map((subject, index) => {
            const isActive = activeSubjectId === subject._id;
            return (
              <button
                key={subject._id}
                onClick={() => {
                  setActiveSubjectId(subject._id);
                  setActiveTab('content');
                }}
                className={`w-full text-left px-5 py-3 border-b border-slate-100 flex gap-3 items-center transition ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 font-semibold" 
                    : "hover:bg-white text-slate-700"
                }`}
              >
                {isActive ? (
                  <Circle size={18} className="text-orange-500 fill-orange-50 flex-shrink-0" />
                ) : index < activeIndex ? (
                  <CheckCircle size={18} className="text-blue-500 flex-shrink-0" />
                ) : (
                  <Circle size={18} className="text-slate-300 flex-shrink-0" />
                )}
                
                <span className="text-sm line-clamp-2 leading-tight">
                  {subject.title}
                </span>
              </button>
            )
          })}

          {subjects.length === 0 && (
             <div className="p-5 text-sm text-slate-500 italic text-center">
               No content available yet.
             </div>
          )}

          <div className="px-5 py-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => setActiveTab('assignments')}
              className={`w-full text-left px-4 py-3 rounded-xl flex gap-3 items-center transition ${
                activeTab === 'assignments' 
                  ? "bg-purple-600 text-white shadow-lg" 
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <FileText size={18} />
              <span className="text-sm font-bold">Assignments</span>
              <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold ${activeTab === 'assignments' ? 'bg-white/20' : 'bg-purple-100 text-purple-600'}`}>
                {assignments.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-white overflow-hidden flex flex-col h-full relative">
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'assignments' ? (
            <div className="p-8 lg:p-12 max-w-4xl mx-auto space-y-8">
              <h1 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-4 mb-6">Course Assignments</h1>
              {assignments.length === 0 ? (
                <div className="text-center py-20 text-slate-500 italic">No assignments for this course yet.</div>
              ) : (
                <div className="space-y-6">
                  {assignments.map(assign => (
                    <div key={assign._id} className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900">{assign.title}</h3>
                          <p className="text-xs text-orange-600 font-bold mt-1">Due Date: {new Date(assign.dueDate).toLocaleDateString()}</p>
                        </div>
                        <span className="px-3 py-1 bg-white border border-slate-200 text-[10px] font-bold rounded-full uppercase">Pending</span>
                      </div>
                      <p className="text-sm text-slate-600">{assign.description}</p>
                      <button className="w-full py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-sm">Submit Assignment</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeSubject ? (
            <>
              {activeSubject.videoUrl && (
                <div className="w-full aspect-video bg-slate-900 border-b border-slate-200">
                  <iframe
                    src={getEmbedUrl(activeSubject.videoUrl)}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={activeSubject.title}
                  ></iframe>
                </div>
              )}
              
              <div className="p-8 lg:p-12 max-w-4xl mx-auto space-y-6 text-slate-800">
                <div className="flex justify-between items-start border-b border-slate-200 pb-4 mb-6">
                  <h1 className="text-2xl font-bold text-slate-900">
                    {activeSubject.title}
                  </h1>
                  {activeSubject.resources?.length > 0 && (
                    <a 
                      href={activeSubject.resources[0].url} 
                      target="_blank" 
                      rel="noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition text-sm"
                    >
                      <Download size={16} /> Download Notes
                    </a>
                  )}
                </div>
                
                <div className="prose prose-slate max-w-none text-slate-600 text-sm leading-relaxed">
                  {activeSubject.content?.split('\n').map((paragraph, i) => (
                    <p key={i} className="mb-4">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center h-full p-8 text-center text-slate-500">
               <p>Select a lesson from the sidebar to start learning.</p>
            </div>
          )}
        </div>

        {/* Navigation Footer */}
        {activeSubject && (
          <div className="p-4 border-t border-slate-100 bg-white flex items-center justify-between shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
            <button
              onClick={() => setActiveSubjectId(subjects[activeIndex - 1]?._id)}
              disabled={activeIndex <= 0}
              className="flex items-center gap-2 px-4 py-2 font-semibold text-slate-600 hover:text-blue-600 disabled:opacity-50 transition"
            >
              <ChevronLeft size={18} /> Previous Lesson
            </button>
            
            <button
              onClick={handleMarkComplete}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-md active:scale-95"
            >
              {activeIndex >= subjects.length - 1 ? "Finish Course" : "Mark as Complete & Next"} <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
