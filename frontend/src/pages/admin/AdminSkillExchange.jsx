import React, { useState, useEffect } from 'react';
import { 
  ArrowRightLeft, Users, BookOpen, Star, AlertTriangle, Eye, EyeOff, CheckCircle2, Search, Filter 
} from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function AdminSkillExchange() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    setLoading(true);
    try {
      const response = await api.get('/skill-exchange/admin/stats');
      setData(response.data);
    } catch (err) {
      console.error('Error fetching admin skill exchange stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSkillStatus = async (skillId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'flagged' : 'active';
    try {
      await api.patch(`/skill-exchange/admin/skills/${skillId}/status`, { status: newStatus });
      toast.success(`Skill status updated to ${newStatus}`);
      fetchAdminStats();
    } catch (err) {
      toast.error('Failed to update skill status');
    }
  };

  const stats = data?.stats || {
    totalUsers: 0,
    totalOffered: 0,
    totalWanted: 0,
    pendingRequests: 0,
    activeExchanges: 0,
    completedExchanges: 0,
    averageRating: 5.0
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Skill Exchange Management</h1>
        <p className="text-slate-500 mt-1">Monitor peer-to-peer skill listings, active exchanges, ratings, and content moderation.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Participating Students" value={stats.totalUsers} icon={Users} trend="up" color="blue" />
        <StatsCard title="Skills Offered" value={stats.totalOffered} icon={BookOpen} trend="up" color="purple" />
        <StatsCard title="Active Exchanges" value={stats.activeExchanges} icon={ArrowRightLeft} trend="up" color="green" />
        <StatsCard title="Avg Platform Rating" value={`⭐ ${stats.averageRating}`} icon={Star} trend="up" color="orange" />
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 gap-2 overflow-x-auto">
        {[
          { id: 'overview', label: 'Overview & Popular Skills' },
          { id: 'questions', label: 'Question Bank Bank 📝' },
          { id: 'assessment_stats', label: 'Assessment Analytics 📊' },
          { id: 'skills', label: 'Skill Listings Moderation' },
          { id: 'exchanges', label: 'All Exchanges' },
          { id: 'feedback', label: 'Ratings & Reviews' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-500/10 rounded-t-xl'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Most Offered Skills</h3>
            <div className="space-y-4">
              {data?.mostOffered?.length > 0 ? (
                data.mostOffered.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="font-bold text-sm text-slate-800 dark:text-white">{item._id}</span>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded-full">{item.count} offers</span>
                  </div>
                ))
              ) : <p className="text-xs text-slate-400 py-6 text-center">No skill offers registered yet.</p>}
            </div>
          </div>

          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Most Requested Skills</h3>
            <div className="space-y-4">
              {data?.mostRequested?.length > 0 ? (
                data.mostRequested.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <span className="font-bold text-sm text-slate-800 dark:text-white">{item._id}</span>
                    <span className="px-3 py-1 bg-sky-500/10 text-sky-500 text-xs font-bold rounded-full">{item.count} requests</span>
                  </div>
                ))
              ) : <p className="text-xs text-slate-400 py-6 text-center">No skill requests registered yet.</p>}
            </div>
          </div>
        </div>
      )}

      {/* TAB: QUESTION BANK */}
      {activeTab === 'questions' && (
        <QuestionBankManager />
      )}

      {/* TAB: ASSESSMENT ANALYTICS */}
      {activeTab === 'assessment_stats' && (
        <AssessmentAnalyticsView />
      )}

      {/* TAB 2: SKILL LISTINGS MODERATION */}
      {activeTab === 'skills' && (
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">All User Skill Listings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="py-4 px-6">User</th>
                  <th className="py-4 px-6">Type</th>
                  <th className="py-4 px-6">Skill</th>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-6">Level</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {data?.allSkills?.length > 0 ? (
                  data.allSkills.map(skill => (
                    <tr key={skill._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-4 px-6 font-semibold">{skill.user?.name || 'User'}</td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${skill.type === 'teach' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-sky-500/10 text-sky-500'}`}>
                          {skill.type}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold">{skill.skillName}</td>
                      <td className="py-4 px-6 text-slate-500">{skill.category}</td>
                      <td className="py-4 px-6 text-slate-500">{skill.level}</td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${skill.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                          {skill.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleToggleSkillStatus(skill._id, skill.status)}
                          className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold rounded-lg transition"
                        >
                          {skill.status === 'active' ? 'Flag / Disable' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="7" className="text-center py-12 text-slate-400">No skill listings found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: EXCHANGES */}
      {activeTab === 'exchanges' && (
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Exchange Requests & Status</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase">
                <tr>
                  <th className="py-4 px-6">Requester</th>
                  <th className="py-4 px-6">Receiver</th>
                  <th className="py-4 px-6">Skill Swap</th>
                  <th className="py-4 px-6">Date</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {data?.exchangesList?.length > 0 ? (
                  data.exchangesList.map(ex => (
                    <tr key={ex._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-4 px-6 font-semibold">{ex.requester?.name}</td>
                      <td className="py-4 px-6 font-semibold">{ex.receiver?.name}</td>
                      <td className="py-4 px-6 font-bold text-sky-600">{ex.skillToLearn} ↔ {ex.skillToTeach}</td>
                      <td className="py-4 px-6 text-slate-500 text-xs">{new Date(ex.createdAt).toLocaleDateString()}</td>
                      <td className="py-4 px-6">
                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          ex.status === 'completed' ? 'bg-purple-500/10 text-purple-500' :
                          ex.status === 'accepted' ? 'bg-emerald-500/10 text-emerald-500' :
                          ex.status === 'pending' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {ex.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="5" className="text-center py-12 text-slate-400">No exchange records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: FEEDBACK */}
      {activeTab === 'feedback' && (
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Partner Ratings & Reviews</h3>
          </div>
          <div className="p-6 space-y-4">
            {data?.feedbackList?.length > 0 ? (
              data.feedbackList.map(fb => (
                <div key={fb._id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      From <strong>{fb.fromUser?.name}</strong> to <strong>{fb.toUser?.name}</strong>
                    </p>
                    {fb.comment && <p className="text-xs text-slate-600 dark:text-slate-300 italic mt-1">"{fb.comment}"</p>}
                  </div>
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                    <Star size={14} fill="currentColor" /> {fb.rating} / 5
                  </span>
                </div>
              ))
            ) : <p className="text-center py-12 text-slate-400 text-xs">No feedback submitted yet.</p>}
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT: QUESTION BANK MANAGER ---
function QuestionBankManager() {
  const [skills, setSkills] = useState([]);
  const [summary, setSummary] = useState([]);
  const [selectedSkillId, setSelectedSkillId] = useState('All');
  const [filterMissing, setFilterMissing] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    skillId: '',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficulty: 'Basic'
  });

  useEffect(() => {
    fetchSkillsAndSummary();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [selectedSkillId]);

  const fetchSkillsAndSummary = async () => {
    try {
      const [skillsRes, summaryRes] = await Promise.all([
        api.get('/skill-exchange/master-skills'),
        api.get('/skill-assessment/admin/question-bank-summary')
      ]);
      setSkills(skillsRes.data.data || []);
      setSummary(summaryRes.data.data || []);
      if (skillsRes.data.data?.length > 0 && !form.skillId) {
        setForm(prev => ({ ...prev, skillId: skillsRes.data.data[0]._id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/skill-assessment/admin/questions', {
        params: { skillId: selectedSkillId }
      });
      setQuestions(data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.post('/skill-assessment/admin/questions', form);
      toast.success('Question added to Question Bank!');
      setShowModal(false);
      setForm({
        skillId: form.skillId || (skills[0]?._id || ''),
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        difficulty: 'Basic'
      });
      fetchQuestions();
      fetchSkillsAndSummary();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add question');
    }
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await api.delete(`/skill-assessment/admin/questions/${id}`);
      toast.success('Question deleted');
      fetchQuestions();
      fetchSkillsAndSummary();
    } catch (err) {
      toast.error('Failed to delete question');
    }
  };

  const displayedSummary = filterMissing 
    ? summary.filter(s => s.activeQuestions < 10) 
    : summary;

  return (
    <div className="space-y-6">
      {/* Question Bank Status Table */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Admin Question Bank Status Summary</h3>
            <p className="text-xs text-slate-500">Every teaching skill requires at least 10 active questions before verification quiz can start.</p>
          </div>
          <button
            onClick={() => setFilterMissing(!filterMissing)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
              filterMissing 
                ? 'bg-amber-500 text-white border-amber-600' 
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
            }`}
          >
            {filterMissing ? '⚡ Showing Skills Missing Questions (<10)' : '🔍 Filter: Skills Missing Question Banks'}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold text-slate-500 uppercase">
              <tr>
                <th className="py-3 px-4">Skill</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Active Questions</th>
                <th className="py-3 px-4 text-center">Inactive Questions</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {displayedSummary.map(s => (
                <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{s.name}</td>
                  <td className="py-3 px-4 text-slate-500">{s.category}</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-800 dark:text-slate-200">{s.activeQuestions}</td>
                  <td className="py-3 px-4 text-center text-slate-400">{s.inactiveQuestions}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full ${
                      s.status === 'Ready'
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Questions Inventory</h3>
          <p className="text-xs text-slate-500">Inspect and add questions dynamically for master skills.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={selectedSkillId}
            onChange={e => {
              setSelectedSkillId(e.target.value);
            }}
            className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-white outline-none"
          >
            <option value="All">All Skills</option>
            {skills.map(s => <option key={s._id} value={s._id}>{s.name} ({s.category})</option>)}
          </select>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md whitespace-nowrap"
          >
            + Add Question
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        {questions.length > 0 ? (
          questions.map((q, idx) => (
            <div key={q._id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 dark:text-white">{idx + 1}. {q.question}</span>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">{q.skillName} • {q.difficulty}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                {q.options?.map((opt, oIdx) => (
                  <span key={oIdx} className={`p-2 rounded-lg border ${opt === q.correctAnswer ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 text-emerald-700 font-bold' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'}`}>
                    {String.fromCharCode(65 + oIdx)}. {opt} {opt === q.correctAnswer && '✓'}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center pt-2 text-[10px] text-slate-400">
                <span>Explanation: {q.explanation || 'None provided'}</span>
                <button onClick={() => handleDeleteQuestion(q._id)} className="text-red-500 hover:underline font-bold">Delete</button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center py-12 text-slate-400 text-xs">No questions found for the selected skill filter.</p>
        )}
      </div>


      {/* ADD QUESTION MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-3xl p-6 w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Add New Assessment Question</h4>
            <form onSubmit={handleAddQuestion} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-500 mb-1">Target Skill *</label>
                <select
                  value={form.skillId}
                  onChange={e => setForm({ ...form, skillId: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                  required
                >
                  {skills.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Question Text *</label>
                <input
                  type="text" required value={form.question} onChange={e => setForm({ ...form, question: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl" placeholder="Enter question..."
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                {form.options.map((opt, i) => (
                  <div key={i}>
                    <label className="block font-bold text-slate-500 mb-0.5">Option {String.fromCharCode(65 + i)} *</label>
                    <input
                      type="text" required value={opt} onChange={e => {
                        const opts = [...form.options];
                        opts[i] = e.target.value;
                        setForm({ ...form, options: opts });
                      }}
                      className="w-full p-2 bg-slate-50 dark:bg-slate-800 border rounded-xl"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Correct Answer (Exact Match) *</label>
                <input
                  type="text" required value={form.correctAnswer} onChange={e => setForm({ ...form, correctAnswer: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl" placeholder="Must match one of the options"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-500 mb-1">Explanation</label>
                <input
                  type="text" value={form.explanation} onChange={e => setForm({ ...form, explanation: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl" placeholder="Explanation for correct answer"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl">Save Question</button>
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2.5 bg-slate-200 text-slate-700 font-bold rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// --- SUB-COMPONENT: ASSESSMENT ANALYTICS VIEW ---
function AssessmentAnalyticsView() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/skill-assessment/admin/stats').then(res => setStats(res.data)).catch(console.error);
  }, []);

  const data = stats?.stats || {
    totalAssessments: 0,
    verifiedSkills: 0,
    failedAssessments: 0,
    averageScore: 0,
    totalQuestions: 0,
    activeQuestions: 0
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard title="Total Quiz Assessments" value={data.totalAssessments} icon={BookOpen} trend="up" color="blue" />
        <StatsCard title="Verified Skills Passed" value={data.verifiedSkills} icon={CheckCircle2} trend="up" color="green" />
        <StatsCard title="Avg Assessment Score" value={`${data.averageScore} / 10`} icon={Star} trend="up" color="orange" />
      </div>

      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Most Assessed Skills</h3>
        <div className="space-y-3">
          {stats?.mostAssessed?.length > 0 ? (
            stats.mostAssessed.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs font-bold">
                <span>{item._id}</span>
                <span className="px-3 py-1 bg-sky-500/10 text-sky-500 rounded-full">{item.count} attempts</span>
              </div>
            ))
          ) : <p className="text-xs text-slate-400 py-6 text-center">No assessments recorded yet.</p>}
        </div>
      </div>
    </div>
  );
}
