import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  User, Shield, CheckCircle, MonitorPlay, 
  Clock, PlayCircle, Loader2, FileText,
  Ticket, MessageSquare, Send, X, ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import PendingApproval from "./PendingApproval";
import toast from "react-hot-toast";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Profile & Ticket States
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [submittingTicket, setSubmittingTicket] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const [coursesRes, appsRes, ticketsRes] = await Promise.all([
        api.get("/admissions/my-courses"),
        api.get("/admissions/my-applications"),
        api.get("/tickets/my-tickets").catch(err => {
          console.error("Error fetching tickets:", err);
          return { data: { data: [] } };
        })
      ]);
      setCourses(coursesRes.data.data);
      setApplications(appsRes.data.data);
      setTickets(ticketsRes.data.data);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRaiseTicket = async (e) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmittingTicket(true);
    try {
      const { data } = await api.post("/tickets", {
        subject: newSubject,
        message: newMessage
      });
      toast.success("Query ticket raised successfully!");
      setNewSubject("");
      setNewMessage("");
      setTickets([data.data, ...tickets]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to raise ticket");
    } finally {
      setSubmittingTicket(false);
    }
  };

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;
    try {
      const { data } = await api.post(`/tickets/${selectedTicket._id}/reply`, {
        message: replyText
      });
      toast.success("Reply sent!");
      setReplyText("");
      setSelectedTicket(data.data);
      setTickets(tickets.map(t => t._id === selectedTicket._id ? data.data : t));
    } catch (err) {
      toast.error("Failed to send reply");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show Pending Approval screen if no courses enrolled but there's an application
  if (courses.length === 0 && applications.length > 0) {
    const latestApp = applications[0]; // Assuming most recent is the one to track
    return <PendingApproval application={latestApp} />;
  }

  // Find if there is any unread/new reply in tickets from a trainer/staff
  const latestTicketWithReply = tickets.find(t => 
    t.replies && t.replies.length > 0 && t.replies[t.replies.length - 1].sender?.role !== 'student'
  );

  const latestReply = latestTicketWithReply 
    ? latestTicketWithReply.replies[latestTicketWithReply.replies.length - 1]
    : null;

  return (
    <div className="max-w-6xl mx-auto pb-12 font-sans bg-[#fdfdfd] dark:bg-transparent">
      {/* Profile Avatar Section */}
      <div className="flex flex-col items-center justify-center py-6">
        <div 
          onClick={() => setIsProfileExpanded(!isProfileExpanded)}
          className="w-32 h-32 bg-[#76A8F8] dark:bg-blue-600 rounded-full flex items-center justify-center text-white shadow-sm border-[6px] border-white dark:border-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 cursor-pointer hover:opacity-90 transition-all transform hover:scale-105"
        >
          <User size={64} />
        </div>
        <div className="flex gap-4 mt-3 text-sm text-[#2563EB] dark:text-blue-400 font-bold">
          <button onClick={() => setIsProfileExpanded(!isProfileExpanded)} className="hover:underline">
            {isProfileExpanded ? "Hide Profile Options" : "View Profile Options"}
          </button>
          <button className="hover:underline">Update Profile Image</button>
        </div>

        {/* Profile Dropdown / Expanded Area */}
        {isProfileExpanded && (
          <div className="w-full max-w-md mt-6 p-6 bg-white dark:bg-[#0f172a] rounded-[24px] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center gap-4 animate-fadeIn">
            <h3 className="font-bold text-slate-800 dark:text-white text-lg">Student Profile Settings</h3>
            <div className="w-full space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between border-b pb-1 dark:border-slate-700">
                <span className="font-medium text-slate-400">Name:</span>
                <span className="font-bold">{user?.name}</span>
              </div>
              <div className="flex justify-between border-b pb-1 dark:border-slate-700">
                <span className="font-medium text-slate-400">Email:</span>
                <span className="font-bold">{user?.email}</span>
              </div>
              {user?.studentId && (
                <div className="flex justify-between border-b pb-1 dark:border-slate-700">
                  <span className="font-medium text-slate-400">Reg No:</span>
                  <span className="font-bold">{user.studentId}</span>
                </div>
              )}
              {user?.courseDomain && (
                <div className="flex justify-between border-b pb-1 dark:border-slate-700">
                  <span className="font-medium text-slate-400">Branch:</span>
                  <span className="font-bold">{user.courseDomain}</span>
                </div>
              )}
            </div>

            {/* Golden Support Ticket Button */}
            <div className="w-full flex flex-col items-center mt-2">
              <button
                onClick={() => setShowTicketModal(true)}
                style={{ 
                  background: 'linear-gradient(135deg, #F59E0B, #D97706)',
                  boxShadow: '0 8px 20px -4px rgba(245, 158, 11, 0.4)'
                }}
                className="w-full py-3.5 px-6 text-white font-bold rounded-2xl hover:brightness-110 transition active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Ticket size={18} />
                Ask Queries & Doubts (Ticket)
              </button>

              {/* Show Latest Reply Preview inside profile dropdown */}
              {latestReply && (
                <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-xl w-full text-xs text-amber-800 dark:text-amber-300">
                  <p className="font-bold mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    New Reply from Trainer ({latestReply.sender?.name}):
                  </p>
                  <p className="italic line-clamp-2">"{latestReply.message}"</p>
                  <button 
                    onClick={() => {
                      setSelectedTicket(latestTicketWithReply);
                      setShowTicketModal(true);
                    }}
                    className="mt-2 text-[#2563EB] dark:text-blue-400 font-bold hover:underline"
                  >
                    View Thread
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="px-4 max-w-4xl mx-auto space-y-6">
        {/* Welcome Text and Badges */}
        <div className="text-center pt-2">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Welcome {user?.name || "Student"}</h1>
          <div className="flex flex-wrap justify-center gap-2">
            {user?.studentId && (
              <span className="px-3 py-1 bg-[#e2e8f0] dark:bg-slate-800 border border-[#cbd5e1] dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded">
                Reg No: {user.studentId}
              </span>
            )}
            {user?.courseDomain && (
              <span className="px-3 py-1 bg-[#22c55e] text-white text-xs font-bold rounded">
                Branch: {user.courseDomain}
              </span>
            )}
            <span className="px-3 py-1 bg-[#3b82f6] text-white text-xs font-bold rounded">
              Designation: Student
            </span>
          </div>
        </div>

        {/* Instructions Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#fffbeb] dark:bg-amber-900/20 border border-[#fde68a] dark:border-amber-800/50 p-6 rounded-xl">
            <h3 className="font-bold text-slate-800 dark:text-amber-100 text-sm mb-3">Important instructions & Test details</h3>
            <ul className="list-disc list-inside text-xs space-y-2 text-slate-700 dark:text-amber-200/70 font-medium">
              <li>It is strictly advised to complete your assignments and assessments within the given timeframe.</li>
              <li>Please keep track of your progress on a weekly basis.</li>
              <li>For any technical issues during an assessment, take a screenshot immediately.</li>
              <li>Make sure you have an active internet connection before starting any live test.</li>
              <li>Plagiarism in assignments will lead to strict disciplinary actions.</li>
            </ul>
          </div>
          <div className="bg-[#f0fdf4] dark:bg-emerald-900/20 border border-[#bbf7d0] dark:border-emerald-800/50 p-6 rounded-xl">
            <h3 className="font-bold text-slate-800 dark:text-emerald-100 text-sm mb-3">Test details and instructions</h3>
            <ul className="list-disc list-inside text-xs space-y-2 text-slate-700 dark:text-emerald-200/70 font-medium">
              <li>Do not refresh the page while attempting an online assessment.</li>
              <li>Clicking out of the exam window will be counted as a violation.</li>
              <li>Keep your webcam active if proctoring is enabled.</li>
              <li>Ensure your system time is accurate to prevent auto-submission errors.</li>
              <li>Submit your answers before the countdown timer hits zero.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 space-y-10">
        {/* My Courses Section - Visible only when enrolled */}
        {courses.length > 0 && (
          <div className="bg-[#f5f3ff] dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 rounded-3xl p-8 shadow-sm">
            <h2 className="font-bold text-slate-800 dark:text-white text-xl mb-8 flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/20">
                <MonitorPlay size={20} />
              </span>
              My Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {courses.map((course) => (
                <div key={course._id} className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group border border-slate-100 dark:border-slate-700">
                  {/* Thumbnail / Image Area */}
                  <div className="aspect-[4/3] bg-purple-600 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/10 opacity-50" />
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 mx-auto backdrop-blur-sm border border-white/30">
                        <MonitorPlay className="text-white" size={32} />
                      </div>
                      <h4 className="text-white font-bold text-sm tracking-widest uppercase leading-tight">
                        {course.title}<br />INTERNSHIP
                      </h4>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-slate-900 dark:text-white font-bold text-lg mb-4">{course.title}</h3>
                    
                    {/* Dynamic Media Badges */}
                    {(course.hasVideos || course.hasPdfs) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.hasVideos && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-400 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-purple-100/55 dark:border-purple-900/30">
                            <MonitorPlay size={11} /> Video Lessons
                          </span>
                        )}
                        {course.hasPdfs && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold rounded-lg uppercase tracking-wider border border-blue-100/55 dark:border-blue-900/30">
                            <FileText size={11} /> PDF Notes
                          </span>
                        )}
                      </div>
                    )}

                    {/* Progress Area */}
                    <div className="mb-6">
                      <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-2">
                        <div className="bg-green-500 h-full w-[0%] rounded-full shadow-[0_0_8px_rgba(34,197,94,0.4)]"></div>
                      </div>
                      <span className="text-xs font-bold text-slate-400">0 of {course.totalLessons || 12} complete</span>
                    </div>

                    <Link 
                      to={`/dashboard/student/learn/${course._id}`} 
                      className="w-full py-3 bg-[#3b82f6] hover:bg-blue-600 text-white text-sm font-bold rounded-xl text-center transition-all shadow-lg shadow-blue-500/25 active:scale-[0.98] uppercase tracking-wider"
                    >
                      START
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Support Ticket Modal Dialog */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowTicketModal(false)} />
          <div className="relative w-full max-w-3xl bg-white dark:bg-[#0f172a] rounded-[32px] shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[85vh] animate-scaleIn">
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Ticket className="text-amber-500" />
                  FIC Queries / Doubts Ticket System
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Ask questions directly to your trainers and see their replies.</p>
              </div>
              <button onClick={() => { setShowTicketModal(false); setSelectedTicket(null); }} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Left sidebar: list of previous queries */}
              <div className="w-1/3 border-r border-slate-200 dark:border-slate-800 overflow-y-auto p-4 space-y-3 bg-slate-50/50 dark:bg-slate-800/10">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">My Ticket History</h4>
                {tickets.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No tickets raised yet.</p>
                ) : (
                  tickets.map((t) => (
                    <div 
                      key={t._id} 
                      onClick={() => setSelectedTicket(t)}
                      className={`p-3 rounded-xl border cursor-pointer transition ${
                        selectedTicket?._id === t._id 
                          ? "bg-amber-50/60 dark:bg-amber-950/20 border-amber-400" 
                          : "bg-white dark:bg-[#1e293b] border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate flex-1">{t.subject}</p>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                          t.status === 'Open' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-1">{t.message}</p>
                      <span className="text-[8px] text-slate-500 block mt-2">{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>

              {/* Right content: raise new or chat detail */}
              <div className="w-2/3 flex flex-col overflow-hidden bg-white dark:bg-[#0f172a]">
                {selectedTicket ? (
                  // Ticket Chat Detail view
                  <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-slate-150 dark:border-slate-800 flex items-center justify-between bg-slate-50/30 dark:bg-slate-800/10">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{selectedTicket.subject}</h4>
                        <span className={`text-[10px] inline-block font-bold uppercase px-2 py-0.5 mt-1 rounded ${
                          selectedTicket.status === 'Open' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                        }`}>
                          Status: {selectedTicket.status}
                        </span>
                      </div>
                      <button onClick={() => setSelectedTicket(null)} className="text-xs font-bold text-slate-400 hover:text-slate-600">Back to New</button>
                    </div>

                    {/* Replies Chat Messages list */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/20 dark:bg-slate-900/10">
                      {/* Original Student Query message */}
                      <div className="bg-slate-100 dark:bg-slate-800/60 p-3.5 rounded-2xl max-w-[85%] border border-slate-200 dark:border-slate-700">
                        <p className="font-bold text-[9px] text-[#2563EB] dark:text-blue-400 uppercase tracking-wider mb-1">
                          You (Original Doubt)
                        </p>
                        <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{selectedTicket.message}</p>
                        <span className="text-[8px] text-slate-400 block mt-1.5">{new Date(selectedTicket.createdAt).toLocaleString()}</span>
                      </div>

                      {/* Replies */}
                      {selectedTicket.replies && selectedTicket.replies.map((rep, idx) => {
                        const isTrainer = rep.sender?.role !== 'student';
                        return (
                          <div 
                            key={rep._id || idx}
                            className={`p-3.5 rounded-2xl max-w-[85%] border ${
                              isTrainer
                                ? "bg-amber-50 dark:bg-amber-950/25 border-amber-200 dark:border-amber-900/40 ml-auto"
                                : "bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 mr-auto"
                            }`}
                          >
                            <p className={`font-bold text-[9px] uppercase tracking-wider mb-1 ${
                              isTrainer ? "text-amber-600 dark:text-amber-400" : "text-[#2563EB]"
                            }`}>
                              {isTrainer ? `${rep.sender?.name} (Trainer)` : "You"}
                            </p>
                            <p className="text-xs text-slate-800 dark:text-slate-200 whitespace-pre-wrap">{rep.message}</p>
                            <span className="text-[8px] text-slate-400 block mt-1.5">{new Date(rep.createdAt).toLocaleString()}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Chat reply box */}
                    {selectedTicket.status === 'Open' ? (
                      <form onSubmit={handleSendReply} className="p-4 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                        <input
                          type="text"
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Type your message to trainer..."
                          className="flex-1 px-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-slate-100"
                        />
                        <button 
                          type="submit" 
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                        >
                          <Send size={12} /> Send
                        </button>
                      </form>
                    ) : (
                      <div className="p-4 bg-green-50 dark:bg-green-950/10 text-center text-xs font-bold text-green-600 dark:text-green-400 border-t border-slate-200 dark:border-slate-800">
                        This query ticket has been resolved.
                      </div>
                    )}
                  </div>
                ) : (
                  // Raise New Query/Ticket form
                  <form onSubmit={handleRaiseTicket} className="p-6 space-y-4 flex flex-col justify-between h-full">
                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">Raise a New Query / Doubt Ticket</h4>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Subject / Area of Doubt</label>
                        <input
                          type="text"
                          value={newSubject}
                          onChange={(e) => setNewSubject(e.target.value)}
                          placeholder="e.g. MERN module 4 assessment issue, React deployment error"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-amber-400/50 text-slate-800 dark:text-slate-100"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wider">Explain your Query / Doubt</label>
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Describe your issue or question in detail so our trainers can assist you."
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs h-36 outline-none focus:ring-2 focus:ring-amber-400/50 resize-none text-slate-800 dark:text-slate-100"
                        />
                      </div>
                    </div>

                    <button 
                      type="submit" 
                      disabled={submittingTicket}
                      style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
                      className="w-full py-3.5 text-white font-bold rounded-2xl hover:brightness-110 transition active:scale-[0.98] disabled:opacity-50 text-xs flex items-center justify-center gap-2"
                    >
                      {submittingTicket ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Raise Support Ticket
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
