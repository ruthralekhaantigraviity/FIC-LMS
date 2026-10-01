import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, ArrowLeft, ArrowRight, Loader2, Award, Sparkles, HelpCircle, ShieldCheck } from 'lucide-react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function SkillAssessment() {
  const { skillId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [skill, setSkill] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchQuiz();
  }, [skillId]);

  const fetchQuiz = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const { data } = await api.get(`/skill-assessment/${skillId}/questions`);
      setSkill(data.skill);
      setQuestions(data.questions || []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to load assessment quiz.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (qId, option) => {
    setUserAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const handleSubmit = async () => {
    const totalAnswered = Object.keys(userAnswers).length;
    if (totalAnswered < questions.length) {
      const confirmSubmit = window.confirm(`You have answered ${totalAnswered} of ${questions.length} questions. Are you sure you want to submit?`);
      if (!confirmSubmit) return;
    }

    setSubmitting(true);
    try {
      const formattedAnswers = questions.map(q => ({
        questionId: q._id,
        answer: userAnswers[q._id] || ''
      }));

      const { data } = await api.post(`/skill-assessment/${skillId}/submit`, {
        answers: formattedAnswers
      });

      setResult(data.data);
      if (data.data.verified) {
        toast.success(`Congratulations! You passed and earned ${data.data.level} verification.`);
      } else {
        toast.error(`Score: ${data.data.score}/10. Verification not passed.`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-sky-500 mb-3" />
        <p className="text-sm font-semibold text-slate-500">Loading Skill Assessment Quiz...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="max-w-xl mx-auto py-12 px-6 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 text-center shadow-lg space-y-5">
        <div className="w-16 h-16 bg-amber-500/10 text-amber-500 rounded-2xl flex items-center justify-center mx-auto">
          <HelpCircle size={32} />
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Assessment Unavailable</h3>
        <p className="text-sm text-slate-600 dark:text-slate-400">{errorMessage}</p>
        <button
          onClick={() => navigate('/dashboard/student/skill-exchange')}
          className="px-6 py-3 bg-sky-600 text-white font-bold rounded-xl text-xs hover:bg-sky-700 transition"
        >
          Return to Skill Exchange
        </button>
      </div>
    );
  }

  // Result View
  if (result) {
    return (
      <div className="max-w-xl mx-auto py-10 px-6 bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-scaleIn">
        <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${
          result.verified ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
        }`}>
          {result.verified ? <ShieldCheck size={44} /> : <XCircle size={44} />}
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Skill Verification Result</span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{result.skillName}</h2>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Score</span>
            <p className="text-lg font-black text-slate-800 dark:text-white">{result.score}/{result.totalQuestions}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Percentage</span>
            <p className="text-lg font-black text-sky-500">{result.percentage}%</p>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Level</span>
            <p className={`text-lg font-black ${result.verified ? 'text-emerald-500' : 'text-amber-500'}`}>{result.level}</p>
          </div>
        </div>

        {result.verified ? (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl text-xs text-emerald-800 dark:text-emerald-300">
            🎉 <strong>Verification Complete!</strong> {result.skillName} has been added to your <strong>Verified Skills I Can Teach</strong> list.
          </div>
        ) : (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl text-xs text-amber-800 dark:text-amber-300">
            ⚠️ <strong>Verification Not Passed:</strong> Minimum score required is 5/10. You can still add {result.skillName} to "Skills I Want to Learn" or retake the assessment.
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {!result.verified && (
            <button
              onClick={() => { setResult(null); fetchQuiz(); }}
              className="flex-1 py-3.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl transition"
            >
              Try Again
            </button>
          )}
          <button
            onClick={() => navigate('/dashboard/student/skill-exchange')}
            className="flex-1 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition shadow-md"
          >
            Back to Skill Exchange
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const isSelected = (opt) => userAnswers[currentQ?._id] === opt;

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-500 flex items-center gap-1">
            <Sparkles size={12} /> Skill Verification Quiz
          </span>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">{skill?.name} Assessment</h2>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-slate-400">Question</span>
          <p className="text-lg font-black text-sky-600">{currentIndex + 1} / {questions.length}</p>
        </div>
      </div>

      {/* Question Box */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 md:p-8 rounded-3xl shadow-md space-y-6">
        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
          {currentIndex + 1}. {currentQ?.question}
        </h3>

        <div className="space-y-3">
          {currentQ?.options?.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectOption(currentQ._id, opt)}
              className={`w-full p-4 rounded-2xl border text-left text-xs md:text-sm font-semibold transition-all flex items-center justify-between ${
                isSelected(opt)
                  ? 'border-sky-500 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 shadow-sm ring-1 ring-sky-500'
                  : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full border text-xs flex items-center justify-center ${
                  isSelected(opt) ? 'border-sky-500 bg-sky-500 text-white' : 'border-slate-300 text-slate-400'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span>{opt}</span>
              </div>
              {isSelected(opt) && <CheckCircle2 size={18} className="text-sky-500" />}
            </button>
          ))}
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition flex items-center gap-1"
          >
            <ArrowLeft size={16} /> Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => Math.min(questions.length - 1, prev + 1))}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl transition flex items-center gap-1 shadow-md"
            >
              Next <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-2.5 bg-[#F3A68C] hover:bg-[#e89578] text-[#321E38] font-extrabold text-xs rounded-xl transition flex items-center gap-2 shadow-md shadow-peach-500/20 disabled:opacity-50"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />} Submit Assessment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
