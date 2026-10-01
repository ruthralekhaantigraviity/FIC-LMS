import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Star, Sparkles, Send, CheckCircle2, Clock, XCircle, 
  Trash2, Filter, Calendar, Video, MessageSquare, Award, ArrowRightLeft,
  UserCheck, RefreshCw, Check
} from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const BRAND = '#1A9FD4';
const CATEGORIES = ['Development', 'Data & AI', 'Design', 'Marketing', 'Cybersecurity', 'Cloud & DevOps', 'Business & Management', 'Other'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

export default function SkillExchangeHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('skills');

  // State
  const [teachSkills, setTeachSkills] = useState([]);
  const [learnSkills, setLearnSkills] = useState([]);
  const [browseStudents, setBrowseStudents] = useState([]);
  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [myExchanges, setMyExchanges] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({ rating: 5.0, ratingCount: 0, completedExchanges: 0 });
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [teachForm, setTeachForm] = useState({ skillName: '', category: 'Development', level: 'Intermediate', description: '' });
  const [learnForm, setLearnForm] = useState({ skillName: '', category: 'Development', level: 'Beginner', description: '' });
  const [showTeachModal, setShowTeachModal] = useState(false);
  const [showLearnModal, setShowLearnModal] = useState(false);

  // Request modal
  const [selectedPartner, setSelectedPartner] = useState(null);
  const [requestForm, setRequestForm] = useState({ skillToLearn: '', skillToTeach: '', message: '' });
  const [showRequestModal, setShowRequestModal] = useState(false);

  // Session modal
  const [selectedExchange, setSelectedExchange] = useState(null);
  const [sessionForm, setSessionForm] = useState({ skill: '', date: '', time: '', mode: 'Online', meetingLink: '', notes: '' });
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [exchangeSessions, setExchangeSessions] = useState([]);

  // Feedback modal
  const [feedbackForm, setFeedbackForm] = useState({ exchangeId: '', rating: 5, teachingRating: 5, communicationRating: 5, comment: '' });
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState('All');

  useEffect(() => {
    fetchMySkills();
    fetchRequests();
    fetchExchanges();
    fetchFeedback();
  }, []);

  useEffect(() => {
    if (activeTab === 'browse') fetchBrowse();
    if (activeTab === 'matches') fetchMatches();
  }, [activeTab, searchQuery, categoryFilter, levelFilter]);

  // Fetch functions
  const fetchMySkills = async () => {
    try {
      const [tRes, lRes] = await Promise.all([
        api.get('/skill-exchange/my-teach-skills'),
        api.get('/skill-exchange/my-learn-skills')
      ]);
      setTeachSkills(tRes.data.data || []);
      setLearnSkills(lRes.data.data || []);
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  const fetchBrowse = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/skill-exchange/browse', {
        params: { search: searchQuery, category: categoryFilter, level: levelFilter }
      });
      setBrowseStudents(data.data || []);
    } catch (err) {
      console.error('Error fetching browse students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/skill-exchange/matches');
      setMatches(data.data || []);
    } catch (err) {
      console.error('Error fetching matches:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/skill-exchange/requests');
      setRequests(data.data || { received: [], sent: [] });
    } catch (err) {
      console.error('Error fetching requests:', err);
    }
  };

  const fetchExchanges = async () => {
    try {
      const { data } = await api.get('/skill-exchange/my-exchanges');
      setMyExchanges(data.data || []);
    } catch (err) {
      console.error('Error fetching exchanges:', err);
    }
  };

  const fetchFeedback = async () => {
    try {
      const { data } = await api.get('/skill-exchange/feedback');
      setFeedbackStats(data.stats || { rating: 5.0, ratingCount: 0, completedExchanges: 0 });
      setUserFeedbacks(data.data || []);
    } catch (err) {
      console.error('Error fetching feedback:', err);
    }
  };

  const [masterCatalog, setMasterCatalog] = useState([]);

  useEffect(() => {
    fetchMySkills();
    fetchRequests();
    fetchExchanges();
    fetchFeedback();
    fetchMasterCatalog();
  }, []);

  const fetchMasterCatalog = async () => {
    try {
      const { data } = await api.get('/skill-exchange/master-skills');
      setMasterCatalog(data.data || []);
    } catch (err) {
      console.error('Error fetching catalog:', err);
    }
  };

  // Handlers
  const handleAddTeachSkill = async (e) => {
    e.preventDefault();
    if (!teachForm.skillName) return;

    let catalog = masterCatalog;
    if (!catalog || catalog.length === 0) {
      try {
        const { data } = await api.get('/skill-exchange/master-skills');
        catalog = data.data || [];
        setMasterCatalog(catalog);
      } catch (err) {}
    }

    const normalize = (str) => (str || '').toLowerCase().replace(/\.js\b/g, '').replace(/[^a-z0-9]/g, '');
    const targetNorm = normalize(teachForm.skillName);

    // 1. Exact or normalized match
    let matchedSkill = catalog.find(s => {
      const sNorm = normalize(s.name);
      return s.name.toLowerCase() === teachForm.skillName.toLowerCase() ||
             (targetNorm.length > 0 && sNorm === targetNorm) ||
             sNorm.includes(targetNorm) ||
             targetNorm.includes(sNorm);
    });

    if (!matchedSkill) {
      toast.error(`Please select a valid skill from the master catalog or ask admin to add ${teachForm.skillName}.`);
      return;
    }

    setShowTeachModal(false);
    toast.loading(`Redirecting to ${matchedSkill.name} verification assessment...`, { duration: 1500 });
    setTimeout(() => {
      navigate(`/dashboard/student/skill-exchange/assessment/${matchedSkill._id}`);
    }, 800);
  };


  const handleDeleteTeachSkill = async (id) => {
    try {
      await api.delete(`/skill-exchange/my-teach-skills/${id}`);
      toast.success('Skill removed');
      fetchMySkills();
    } catch (err) {
      toast.error('Failed to delete skill');
    }
  };

  const handleAddLearnSkill = async (e) => {
    e.preventDefault();
    try {
      await api.post('/skill-exchange/my-learn-skills', learnForm);
      toast.success('Skill added to Learn list!');
      setLearnForm({ skillName: '', category: 'Development', level: 'Beginner', description: '' });
      setShowLearnModal(false);
      fetchMySkills();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add skill');
    }
  };

  const handleDeleteLearnSkill = async (id) => {
    try {
      await api.delete(`/skill-exchange/my-learn-skills/${id}`);
      toast.success('Skill removed');
      fetchMySkills();
    } catch (err) {
      toast.error('Failed to delete skill');
    }
  };

  const openRequestModal = (student, defaultLearn = '', defaultTeach = '') => {
    setSelectedPartner(student);
    setRequestForm({
      skillToLearn: defaultLearn || (student.teachSkills?.[0]?.skillName || ''),
      skillToTeach: defaultTeach || (teachSkills?.[0]?.skillName || ''),
      message: ''
    });
    setShowRequestModal(true);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    try {
      await api.post('/skill-exchange/requests', {
        receiverId: selectedPartner._id || selectedPartner.id || selectedPartner.user?._id,
        ...requestForm
      });
      toast.success('Skill Exchange Request sent!');
      setShowRequestModal(false);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send request');
    }
  };

  const handleRespondRequest = async (id, action) => {
    try {
      await api.patch(`/skill-exchange/requests/${id}/respond`, { action });
      toast.success(`Request ${action}ed!`);
      fetchRequests();
      fetchExchanges();
    } catch (err) {
      toast.error('Failed to respond to request');
    }
  };

  const handleCompleteExchange = async (id) => {
    try {
      await api.patch(`/skill-exchange/exchanges/${id}/complete`);
      toast.success('Exchange marked as Completed! Please leave feedback.');
      fetchExchanges();
      fetchFeedback();
    } catch (err) {
      toast.error('Failed to complete exchange');
    }
  };

  const openSessionModal = async (exchange) => {
    setSelectedExchange(exchange);
    setSessionForm({
      skill: exchange.skillToLearn,
      date: new Date().toISOString().split('T')[0],
      time: '17:00',
      mode: 'Online',
      meetingLink: '',
      notes: ''
    });
    setShowSessionModal(true);
    try {
      const { data } = await api.get(`/skill-exchange/sessions/${exchange._id}`);
      setExchangeSessions(data.data || []);
    } catch (err) {
      console.error('Error fetching sessions:', err);
    }
  };

  const handleScheduleSession = async (e) => {
    e.preventDefault();
    try {
      await api.post('/skill-exchange/sessions', {
        exchangeId: selectedExchange._id,
        ...sessionForm
      });
      toast.success('Learning session scheduled!');
      const { data } = await api.get(`/skill-exchange/sessions/${selectedExchange._id}`);
      setExchangeSessions(data.data || []);
      setSessionForm({ skill: selectedExchange.skillToLearn, date: '', time: '', mode: 'Online', meetingLink: '', notes: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule session');
    }
  };

  const openFeedbackModal = (exchange) => {
    setSelectedExchange(exchange);
    setFeedbackForm({ exchangeId: exchange._id, rating: 5, teachingRating: 5, communicationRating: 5, comment: '' });
    setShowFeedbackModal(true);
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    try {
      await api.post('/skill-exchange/feedback', feedbackForm);
      toast.success('Rating & Feedback submitted! Thank you.');
      setShowFeedbackModal(false);
      fetchFeedback();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit feedback');
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Header */}
      <div className="bg-gradient-to-r from-[#321E38] via-[#4d3053] to-[#654568] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} /> Peer-To-Peer Learning
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Collaborative Skill Exchange
          </h1>
          <p className="text-amber-100/90 text-sm md:text-base leading-relaxed">
            Teach what you know, learn what you need. Swap skills with fellow students directly inside the LMS!
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto gap-2">
        {[
          { id: 'skills', label: 'My Skills', count: teachSkills.length + learnSkills.length },
          { id: 'browse', label: 'Find Skills' },
          { id: 'matches', label: 'Skill Matches 🤝', highlight: true },
          { id: 'requests', label: 'Exchange Requests', count: requests.received.filter(r => r.status === 'pending').length },
          { id: 'exchanges', label: 'My Exchanges', count: myExchanges.filter(e => e.status === 'accepted').length },
          { id: 'feedback', label: 'Ratings & Feedback' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-[#654568] text-[#654568] dark:text-[#F3A68C] bg-[#654568]/10 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${activeTab === tab.id ? 'bg-[#654568] text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: MY SKILLS */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Skills I Can Teach */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" /> Skills I Can Teach
                </h3>
                <p className="text-xs text-slate-500">Skills you are offering to teach other students.</p>
              </div>
              <button
                onClick={() => setShowTeachModal(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md"
              >
                <Plus size={16} /> Add Skill
              </button>
            </div>

            <div className="space-y-3">
              {teachSkills.length > 0 ? (
                teachSkills.map(skill => (
                  <div key={skill._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{skill.skillName}</span>
                        {skill.verified ? (
                          <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#E8D8A8] text-[#321E38] flex items-center gap-1 shadow-sm border border-[#321E38]/10">
                            ✓ Verified ({skill.level})
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600">Unverified</span>
                            <button
                              onClick={() => navigate(`/student/skill-assessment?skillId=${skill._id}&skillName=${encodeURIComponent(skill.skillName)}`)}
                              className="text-[11px] font-extrabold px-3 py-1 rounded-xl bg-[#F3A68C] text-[#321E38] hover:bg-[#e89578] transition shadow-sm flex items-center gap-1"
                            >
                              Start Assessment
                            </button>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {skill.category} {skill.assessmentScore > 0 && `• Assessment Score: ${skill.assessmentScore}/10`} {skill.description && `• ${skill.description}`}
                      </p>
                    </div>
                    <button onClick={() => handleDeleteTeachSkill(skill._id)} className="p-2 text-slate-400 hover:text-red-500 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <p className="text-sm font-semibold text-slate-500">No skills added yet.</p>
                  <p className="text-xs text-slate-400 mt-1">Add skills you can share with peers.</p>
                </div>
              )}
            </div>
          </div>

          {/* Skills I Want to Learn */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-sky-500 inline-block" /> Skills I Want to Learn
                </h3>
                <p className="text-xs text-slate-500">Skills you are looking to learn from a partner.</p>
              </div>
              <button
                onClick={() => setShowLearnModal(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-md"
              >
                <Plus size={16} /> Add Skill
              </button>
            </div>

            <div className="space-y-3">
              {learnSkills.length > 0 ? (
                learnSkills.map(skill => (
                  <div key={skill._id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{skill.skillName}</span>
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-500">{skill.level}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{skill.category} • {skill.description || 'No description added'}</p>
                    </div>
                    <button onClick={() => handleDeleteLearnSkill(skill._id)} className="p-2 text-slate-400 hover:text-red-500 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                  <p className="text-sm font-semibold text-slate-500">No skills added yet.</p>
                  <p className="text-xs text-slate-400 mt-1">List skills you want to learn.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FIND SKILLS / BROWSE */}
      {activeTab === 'browse' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
            <div className="relative flex-1 w-full">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search skill (e.g. React, Python, UI/UX)..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-sky-500"
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="All">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={levelFilter}
                onChange={e => setLevelFilter(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none"
              >
                <option value="All">All Levels</option>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>

          {/* Students Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {browseStudents.length > 0 ? (
              browseStudents.map(studentCard => (
                <div key={studentCard.user?._id} className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 text-white font-bold flex items-center justify-center text-lg shadow-md">
                        {studentCard.user?.name?.charAt(0) || 'S'}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">{studentCard.user?.name}</h4>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs text-slate-400">{studentCard.user?.courseDomain || 'Student'}</span>
                          <span className="text-xs font-bold text-amber-500 flex items-center gap-0.5">
                            <Star size={12} fill="currentColor" /> {studentCard.rating} ({studentCard.ratingCount})
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1.5">Can Teach:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {studentCard.teachSkills.map(ts => (
                            <span key={ts._id} className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold rounded-lg">
                              {ts.skillName} ({ts.level})
                            </span>
                          ))}
                        </div>
                      </div>

                      {studentCard.learnSkills.length > 0 && (
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400 block mb-1.5">Wants To Learn:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {studentCard.learnSkills.map(ls => (
                              <span key={ls._id} className="px-2.5 py-1 bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-semibold rounded-lg">
                                {ls.skillName}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => openRequestModal(studentCard.user)}
                    className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
                  >
                    <Send size={14} /> Request Skill Exchange
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800">
                <Search size={32} className="mx-auto text-slate-300 mb-3" />
                <h4 className="text-base font-bold text-slate-800 dark:text-white">No Skills Found</h4>
                <p className="text-xs text-slate-500 mt-1">Try searching for different keywords or category filters.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: SKILL MATCHES 🤝 */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-800 rounded-2xl p-4 flex items-center justify-between">
            <p className="text-xs text-sky-800 dark:text-sky-200 font-medium">
              🤝 <strong>Smart Reciprocal Matching:</strong> These students can teach skills you want to learn AND want skills you can teach!
            </p>
            <button onClick={fetchMatches} className="p-1.5 text-sky-600 hover:bg-sky-100 rounded-lg transition">
              <RefreshCw size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.length > 0 ? (
              matches.map((m, idx) => (
                <div key={idx} className="bg-white dark:bg-[#0f172a] border-2 border-indigo-100 dark:border-indigo-900/50 rounded-3xl p-6 shadow-md relative overflow-hidden">
                  <div className="absolute top-4 right-4 px-3 py-1 bg-indigo-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                    <Sparkles size={10} /> Perfect Match
                  </div>

                  <div className="flex items-center gap-3.5 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white font-bold flex items-center justify-center text-lg">
                      {m.partner?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{m.partner?.name}</h4>
                      <p className="text-xs text-slate-400">⭐ {m.rating} Rating • {m.completedExchanges} Exchanges</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl p-4 mb-6 grid grid-cols-2 gap-4 border border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">They Can Teach:</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-1">
                        <Check size={14} /> {m.youLearn}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">You Can Teach:</span>
                      <span className="font-bold text-sky-600 dark:text-sky-400 text-sm flex items-center gap-1">
                        <Check size={14} /> {m.youTeach}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => openRequestModal(m.partner, m.youLearn, m.youTeach)}
                    className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 text-white text-xs font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
                  >
                    <ArrowRightLeft size={16} /> Request Skill Exchange
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-16 text-center bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800">
                <ArrowRightLeft size={36} className="mx-auto text-indigo-400 mb-3" />
                <h4 className="text-base font-bold text-slate-800 dark:text-white">No Reciprocal Matches Yet</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">Add more skills under "My Skills" to enable smart reciprocal matching with peers.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: EXCHANGE REQUESTS */}
      {activeTab === 'requests' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Received Requests */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Received Requests</h3>
            <div className="space-y-4">
              {requests.received.length > 0 ? (
                requests.received.map(req => (
                  <div key={req._id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-sky-500 text-white font-bold flex items-center justify-center">
                          {req.requester?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 dark:text-white text-sm">{req.requester?.name}</h5>
                          <span className="text-[10px] text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        req.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                        req.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p><strong className="text-slate-500">Wants to Learn:</strong> <span className="font-bold text-sky-600">{req.skillToLearn}</span></p>
                      <p><strong className="text-slate-500">Can Teach You:</strong> <span className="font-bold text-emerald-600">{req.skillToTeach}</span></p>
                      {req.message && <p className="text-slate-400 italic mt-1">"{req.message}"</p>}
                    </div>

                    {req.status === 'pending' && (
                      <div className="flex gap-2 pt-1">
                        <button
                          onClick={() => handleRespondRequest(req._id, 'accept')}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespondRequest(req._id, 'reject')}
                          className="flex-1 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center py-10 text-slate-400 text-xs">No received requests.</p>
              )}
            </div>
          </div>

          {/* Sent Requests */}
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Sent Requests</h3>
            <div className="space-y-4">
              {requests.sent.length > 0 ? (
                requests.sent.map(req => (
                  <div key={req._id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-500 text-white font-bold flex items-center justify-center">
                          {req.receiver?.name?.charAt(0) || 'S'}
                        </div>
                        <div>
                          <h5 className="font-bold text-slate-900 dark:text-white text-sm">To: {req.receiver?.name}</h5>
                          <span className="text-[10px] text-slate-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                        req.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                        req.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'
                      }`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                      <p><strong className="text-slate-500">You Learn:</strong> <span className="font-bold text-sky-600">{req.skillToLearn}</span></p>
                      <p><strong className="text-slate-500">You Teach:</strong> <span className="font-bold text-emerald-600">{req.skillToTeach}</span></p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-10 text-slate-400 text-xs">No sent requests.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MY EXCHANGES */}
      {activeTab === 'exchanges' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myExchanges.length > 0 ? (
              myExchanges.map(ex => {
                const partner = ex.requester?._id === ex.receiver?._id ? ex.receiver : (ex.requester?._id ? (ex.requester._id === selectedPartner ? ex.receiver : ex.requester) : ex.receiver);
                return (
                  <div key={ex._id} className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-sky-500 text-white font-bold flex items-center justify-center text-lg">
                          {ex.requester?.name?.charAt(0) || 'P'}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 dark:text-white text-base">
                            {ex.requester?.name} ↔ {ex.receiver?.name}
                          </h4>
                          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${ex.status === 'completed' ? 'bg-purple-500/10 text-purple-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                            {ex.status}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Skill 1</span>
                        <span className="font-bold text-sky-600">{ex.skillToLearn}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold uppercase tracking-wider text-[10px]">Skill 2</span>
                        <span className="font-bold text-emerald-600">{ex.skillToTeach}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {ex.status === 'accepted' && (
                        <>
                          <button
                            onClick={() => openSessionModal(ex)}
                            className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                          >
                            <Calendar size={14} /> Schedule Session
                          </button>
                          <button
                            onClick={() => handleCompleteExchange(ex._id)}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                          >
                            <CheckCircle2 size={14} /> Complete
                          </button>
                        </>
                      )}
                      {ex.status === 'completed' && (
                        <button
                          onClick={() => openFeedbackModal(ex)}
                          className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                        >
                          <Star size={14} /> Leave Rating & Feedback
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-16 text-center bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800">
                <CheckCircle2 size={36} className="mx-auto text-slate-300 mb-3" />
                <h4 className="text-base font-bold text-slate-800 dark:text-white">No Active Exchanges</h4>
                <p className="text-xs text-slate-500 mt-1">Accept or send exchange requests to get started.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: RATINGS & FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 text-amber-500 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold">{feedbackStats.rating}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider">Rating</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Your Skill Exchange Reputation</h3>
              <p className="text-xs text-slate-500 mt-1">Based on {feedbackStats.ratingCount} reviews from completed peer exchanges.</p>
            </div>
          </div>

          <div className="space-y-4">
            {userFeedbacks.length > 0 ? (
              userFeedbacks.map(fb => (
                <div key={fb._id} className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500 text-white font-bold flex items-center justify-center">
                        {fb.fromUser?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white text-sm">{fb.fromUser?.name}</h5>
                        <span className="text-[10px] text-slate-400">{new Date(fb.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(fb.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                  </div>
                  {fb.comment && <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{fb.comment}"</p>}
                </div>
              ))
            ) : (
              <p className="text-center py-12 text-slate-400 text-xs">No feedback received yet.</p>
            )}
          </div>
        </div>
      )}

      {/* MODAL 1: ADD TEACH SKILL */}
      {showTeachModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Skill You Can Teach</h3>
            <form onSubmit={handleAddTeachSkill} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Select Catalog Skill *</label>
                <select
                  value={teachForm.skillName}
                  onChange={e => setTeachForm({ ...teachForm, skillName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white outline-none font-bold mb-2"
                >
                  <option value="">-- Select Skill from Catalog --</option>
                  {masterCatalog.map(s => (
                    <option key={s._id} value={s.name}>{s.name} ({s.category})</option>
                  ))}
                </select>
                <div className="text-[10px] text-slate-400 mb-1">Or type custom name:</div>
                <input
                  type="text" placeholder="e.g. React, Python, Java"
                  value={teachForm.skillName} onChange={e => setTeachForm({ ...teachForm, skillName: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={teachForm.category} onChange={e => setTeachForm({ ...teachForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Level</label>
                  <select
                    value={teachForm.level} onChange={e => setTeachForm({ ...teachForm, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white outline-none"
                  >
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Description / Experience</label>
                <textarea
                  rows={3} placeholder="Briefly describe your experience..."
                  value={teachForm.description} onChange={e => setTeachForm({ ...teachForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">Add Skill</button>
                <button type="button" onClick={() => setShowTeachModal(false)} className="px-4 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD LEARN SKILL */}
      {showLearnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Skill You Want to Learn</h3>
            <form onSubmit={handleAddLearnSkill} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Skill Name *</label>
                <input
                  type="text" required placeholder="e.g. Node.js, UI/UX Design"
                  value={learnForm.skillName} onChange={e => setLearnForm({ ...learnForm, skillName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Category</label>
                  <select
                    value={learnForm.category} onChange={e => setLearnForm({ ...learnForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Target Level</label>
                  <select
                    value={learnForm.level} onChange={e => setLearnForm({ ...learnForm, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white outline-none"
                  >
                    {LEVELS.map(l => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl">Add Skill</button>
                <button type="button" onClick={() => setShowLearnModal(false)} className="px-4 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: REQUEST SKILL EXCHANGE */}
      {showRequestModal && selectedPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Request Skill Exchange</h3>
            <p className="text-xs text-slate-500">Sending request to <strong>{selectedPartner.name || selectedPartner.user?.name}</strong></p>
            <form onSubmit={handleSendRequest} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Skill You Want to Learn *</label>
                <input
                  type="text" required placeholder="Skill they teach"
                  value={requestForm.skillToLearn} onChange={e => setRequestForm({ ...requestForm, skillToLearn: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Skill You Can Teach Them *</label>
                <input
                  type="text" required placeholder="Skill you offer"
                  value={requestForm.skillToTeach} onChange={e => setRequestForm({ ...requestForm, skillToTeach: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Short Message</label>
                <textarea
                  rows={3} placeholder="Write a brief intro message..."
                  value={requestForm.message} onChange={e => setRequestForm({ ...requestForm, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-slate-900 dark:text-white outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold rounded-xl">Send Request</button>
                <button type="button" onClick={() => setShowRequestModal(false)} className="px-4 py-3 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: SESSION SCHEDULING */}
      {showSessionModal && selectedExchange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Schedule Learning Session</h3>
            <form onSubmit={handleScheduleSession} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Date *</label>
                  <input
                    type="date" required
                    value={sessionForm.date} onChange={e => setSessionForm({ ...sessionForm, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Time *</label>
                  <input
                    type="time" required
                    value={sessionForm.time} onChange={e => setSessionForm({ ...sessionForm, time: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Meeting Link (Google Meet / Zoom)</label>
                <input
                  type="url" placeholder="https://meet.google.com/xyz"
                  value={sessionForm.meetingLink} onChange={e => setSessionForm({ ...sessionForm, meetingLink: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 py-3 bg-sky-600 text-white font-bold rounded-xl">Save Session</button>
                <button type="button" onClick={() => setShowSessionModal(false)} className="px-4 py-3 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl">Close</button>
              </div>
            </form>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
              <h4 className="font-bold text-slate-800 dark:text-white text-xs mb-3">Scheduled Sessions</h4>
              <div className="space-y-2 max-h-36 overflow-y-auto text-xs">
                {exchangeSessions.length > 0 ? (
                  exchangeSessions.map(s => (
                    <div key={s._id} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl flex justify-between items-center">
                      <div>
                        <p className="font-bold">{s.date} at {s.time}</p>
                        {s.meetingLink && <a href={s.meetingLink} target="_blank" rel="noreferrer" className="text-sky-500 underline text-[10px]">Open Link</a>}
                      </div>
                      <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-md">{s.status}</span>
                    </div>
                  ))
                ) : <p className="text-slate-400 text-center text-[11px]">No sessions scheduled yet.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: FEEDBACK */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Rate Skill Exchange Partner</h3>
            <form onSubmit={handleSubmitFeedback} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-2">Overall Rating (1 to 5 Stars)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star} type="button"
                      onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                      className={`p-2 rounded-xl transition ${feedbackForm.rating >= star ? 'text-amber-500 bg-amber-50 dark:bg-amber-500/10' : 'text-slate-300'}`}
                    >
                      <Star size={24} fill="currentColor" />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-bold text-slate-500 uppercase tracking-wider mb-1">Feedback Comment</label>
                <textarea
                  rows={3} required placeholder="How clear was their teaching and communication?"
                  value={feedbackForm.comment} onChange={e => setFeedbackForm({ ...feedbackForm, comment: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl outline-none"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl">Submit Feedback</button>
                <button type="button" onClick={() => setShowFeedbackModal(false)} className="px-4 py-3 bg-slate-200 dark:bg-slate-800 font-bold rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
