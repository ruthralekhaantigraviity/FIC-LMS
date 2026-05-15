import React, { useState } from 'react';
import { Search, Award, Eye, Download, CheckCircle, Clock, FileText, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const HRCertificates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  const [certificates, setCertificates] = useState([
    { id: 1, studentName: "Rahul Sharma", course: "MERN Stack", completionDate: "2024-05-10", status: "Issued" },
    { id: 2, studentName: "Sneha Patil", course: "UI/UX Design", completionDate: "2024-05-12", status: "Pending" },
    { id: 3, studentName: "Amit Verma", course: "Data Science", completionDate: "2024-05-15", status: "Issued" },
  ]);

  const handleIssue = (id) => {
    setCertificates(certificates.map(c => c.id === id ? { ...c, status: 'Issued' } : c));
    toast.success('Certificate issued successfully!');
  };

  const filteredCerts = certificates.filter(c => 
    c.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Certificates Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Issue and manage student completion certificates.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search by student or course..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-full md:w-80 outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-100 dark:border-slate-700 text-xs font-bold uppercase">
             <Filter size={16} /> Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <th className="px-6 py-4">Student Name</th>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Completion Date</th>
                <th className="px-6 py-4">Certificate Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {filteredCerts.map((cert) => (
                <tr key={cert.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs">
                        {cert.studentName.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{cert.studentName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium">{cert.course}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {cert.completionDate}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                      cert.status === 'Issued' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-orange-50 text-orange-600 border-orange-200'
                    }`}>
                      {cert.status === 'Issued' ? <CheckCircle size={10} className="inline mr-1" /> : <Clock size={10} className="inline mr-1" />}
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       {cert.status === 'Pending' && (
                         <button 
                           onClick={() => handleIssue(cert.id)}
                           className="flex items-center gap-2 px-4 py-2 bg-sky-600 text-white rounded-xl text-xs font-bold hover:bg-sky-700 transition shadow-lg shadow-sky-600/20"
                         >
                           🎓 Issue Certificate
                         </button>
                       )}
                       <button className="p-2 text-slate-400 hover:text-sky-600 transition" title="Preview"><Eye size={18} /></button>
                       <button className="p-2 text-slate-400 hover:text-sky-600 transition" title="Download PDF"><Download size={18} /></button>
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

export default HRCertificates;
