import React, { useState } from 'react';
import { Search, Award, Eye, Download, CheckCircle, Clock, FileText, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';

const HRCertificates = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewCert, setPreviewCert] = useState(null);
  
  const [certificates, setCertificates] = useState([
    { id: 1, studentName: "Rahul Sharma", course: "MERN Stack", completionDate: "2024-05-10", status: "Issued" },
    { id: 2, studentName: "Sneha Patil", course: "UI/UX Design", completionDate: "2024-05-12", status: "Pending" },
    { id: 3, studentName: "Amit Verma", course: "Data Science", completionDate: "2024-05-15", status: "Issued" },
  ]);

  const handleIssue = (id) => {
    setCertificates(certificates.map(c => c.id === id ? { ...c, status: 'Issued' } : c));
    toast.success('Certificate issued successfully!');
  };

  const handleDownload = (cert) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    // Branded Background
    doc.setFillColor(26, 159, 212); // Brand Blue
    doc.rect(0, 0, 297, 20, 'F');
    
    // Certificate Title
    doc.setFontSize(40);
    doc.setTextColor(26, 159, 212);
    doc.text("CERTIFICATE OF COMPLETION", 148, 60, { align: "center" });

    doc.setFontSize(20);
    doc.setTextColor(100);
    doc.text("This is to certify that", 148, 80, { align: "center" });

    doc.setFontSize(32);
    doc.setTextColor(0);
    doc.text(cert.studentName.toUpperCase(), 148, 100, { align: "center" });

    doc.setFontSize(20);
    doc.setTextColor(100);
    doc.text("has successfully completed the course", 148, 120, { align: "center" });

    doc.setFontSize(28);
    doc.setTextColor(26, 159, 212);
    doc.text(cert.course, 148, 140, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.text(`Issued on: ${cert.completionDate}`, 148, 160, { align: "center" });

    // Footer
    doc.setDrawColor(200);
    doc.line(40, 180, 100, 180);
    doc.line(197, 180, 257, 180);
    
    doc.setFontSize(12);
    doc.text("Course Instructor", 70, 190, { align: "center" });
    doc.text("Director, Forge India", 227, 190, { align: "center" });

    doc.save(`Certificate_${cert.studentName.replace(' ', '_')}.pdf`);
    toast.success('Downloading certificate...');
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
                       <button onClick={() => setPreviewCert(cert)} className="p-2 text-slate-400 hover:text-sky-600 transition" title="Preview"><Eye size={18} /></button>
                       <button onClick={() => handleDownload(cert)} className="p-2 text-slate-400 hover:text-sky-600 transition" title="Download PDF"><Download size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {previewCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 md:p-10">
             <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full h-full bg-white rounded-[40px] overflow-hidden shadow-2xl flex flex-col items-center justify-center"
            >
              <button 
                onClick={() => setPreviewCert(null)} 
                className="absolute top-8 right-8 p-3 bg-slate-100 hover:bg-red-500 hover:text-white rounded-2xl transition-all z-10"
              >
                <X size={24} />
              </button>
              
              <div className="w-full max-w-5xl aspect-[1.414/1] bg-white border-[24px] border-slate-50 relative p-16 shadow-inner flex flex-col justify-between">
                 {/* Design Elements */}
                 <div className="absolute top-0 left-0 w-full h-6 bg-sky-600" />
                 <div className="absolute bottom-0 left-0 w-full h-6 bg-sky-600" />
                 <div className="absolute top-0 left-0 w-6 h-full bg-sky-600/10" />
                 <div className="absolute top-0 right-0 w-6 h-full bg-sky-600/10" />

                 <div className="text-center">
                    <img src="/logo.jpg" alt="FIC Logo" className="h-20 mx-auto mb-6" />
                    <h4 className="text-sm font-bold tracking-[0.4em] text-slate-400 uppercase mb-10">Certificate of Excellence</h4>
                    
                    <h2 className="text-6xl font-black text-slate-900 mb-8 font-display">CERTIFICATE</h2>
                    <p className="text-2xl text-slate-500 mb-10 italic">This is to proudly certify that</p>
                    
                    <h1 className="text-7xl font-black text-sky-600 mb-12 tracking-tight">{previewCert.studentName.toUpperCase()}</h1>
                    
                    <p className="text-xl text-slate-600 mb-4">has successfully completed the professional training program in</p>
                    <h3 className="text-4xl font-bold text-slate-900 mb-12">{previewCert.course}</h3>
                 </div>
                 
                 <div className="flex justify-between items-end px-12">
                    <div className="text-center">
                       <div className="w-56 h-px bg-slate-300 mb-4" />
                       <p className="text-sm font-bold text-slate-900 uppercase">Program Coordinator</p>
                    </div>
                    <div className="relative">
                       <div className="w-32 h-32 bg-amber-400/10 rounded-full flex items-center justify-center border-4 border-amber-400/20 rotate-12">
                          <Award size={64} className="text-amber-500" />
                       </div>
                    </div>
                    <div className="text-center">
                       <div className="w-56 h-px bg-slate-300 mb-4" />
                       <p className="text-sm font-bold text-slate-900 uppercase">Director, Forge India</p>
                    </div>
                 </div>
              </div>

              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
                 <button 
                   onClick={() => handleDownload(previewCert)}
                   className="flex items-center gap-2 px-8 py-4 bg-sky-600 text-white rounded-2xl font-bold hover:bg-sky-700 transition shadow-xl shadow-sky-600/20"
                 >
                   <Download size={20} /> Download PDF
                 </button>
                 <button 
                   onClick={() => setPreviewCert(null)}
                   className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition"
                 >
                   Close Preview
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HRCertificates;
