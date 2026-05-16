import React, { useState, useEffect } from 'react';
import { Search, Filter, BookOpen, User, Calendar, Trash2, Edit2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';

const HREnrollments = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [formData, setFormData] = useState({
    studentId: '',
    courseId: '',
    startDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersRes, coursesRes, admissionsRes] = await Promise.all([
        api.get('/auth/users'),
        api.get('/courses'),
        api.get('/admissions/all')
      ]);
      setStudents(usersRes.data.data.filter(u => u.role === 'student'));
      setCourses(coursesRes.data.data || []);
      
      // Map admissions to the format expected by the table
      const realEnrollments = admissionsRes.data.data
        .filter(adm => adm.status === 'completed')
        .map(adm => ({
          id: adm._id,
          studentName: adm.student?.name || 'Unknown',
          courseName: adm.course?.title || 'Unknown',
          startDate: new Date(adm.appliedAt).toISOString().split('T')[0],
          progress: 0 // Progress tracking can be added later
        }));
      
      setEnrollments(realEnrollments);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.courseId) {
       return toast.error('Please select both student and course');
    }
    
    try {
      await api.post('/admissions/assign', {
        studentId: formData.studentId,
        courseId: formData.courseId
      });
      
      toast.success('Student enrolled successfully!');
      setFormData({ ...formData, studentId: '', courseId: '' });
      fetchData(); // Refresh list
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to enroll student');
    }
  };

  const filteredEnrollments = enrollments.filter(e => 
    e.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Course Enrollment</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage student course assignments and track progress.</p>
        </div>
      </div>

      {/* Assign Section */}
      <div className="bg-white dark:bg-[#0f172a] rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Assign New Course</h3>
        <form onSubmit={handleEnroll} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Student</label>
            <select 
              value={formData.studentId}
              onChange={(e) => setFormData({...formData, studentId: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-sky-400/50 text-sm"
            >
              <option value="">Choose Student</option>
              {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.email})</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Select Course</label>
            <select 
              value={formData.courseId}
              onChange={(e) => setFormData({...formData, courseId: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-sky-400/50 text-sm"
            >
              <option value="">Choose Course</option>
              {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Start Date</label>
            <input 
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-sky-400/50 text-sm"
            />
          </div>
          <button 
            type="submit"
            className="w-full py-3.5 bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-600/20 hover:bg-sky-700 transition"
          >
            Assign Button
          </button>
        </form>
      </div>

      {/* Enrollment List */}
      <div className="bg-white dark:bg-[#0f172a] rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Enrollment List</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search enrollments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-full md:w-80 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Course Name</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">Progress %</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredEnrollments.map((enroll) => (
                <tr key={enroll.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold text-xs">
                        {enroll.studentName.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{enroll.studentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{enroll.courseName}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {enroll.startDate}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                         <div className="h-full bg-sky-500" style={{ width: `${enroll.progress}%` }} />
                       </div>
                       <span className="text-xs font-bold text-slate-600">{enroll.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-slate-400 hover:text-sky-600 transition"><Edit2 size={16} /></button>
                       <button className="p-2 text-slate-400 hover:text-red-600 transition"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HREnrollments;
