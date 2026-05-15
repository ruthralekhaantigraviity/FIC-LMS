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

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. Double Border Design
    doc.setDrawColor(26, 159, 212); // Brand Blue
    doc.setLineWidth(2);
    doc.rect(5, 5, pageWidth - 10, pageHeight - 10, 'S');
    
    doc.setDrawColor(30, 41, 59); // Slate
    doc.setLineWidth(0.5);
    doc.rect(7, 7, pageWidth - 14, pageHeight - 14, 'S');

    // 2. Brand Blue Top & Bottom Bars
    doc.setFillColor(26, 159, 212);
    doc.rect(0, 0, pageWidth, 4, 'F');
    doc.rect(0, pageHeight - 4, pageWidth, 4, 'F');

    // 3. Header Section
    doc.setFontSize(22);
    doc.setTextColor(26, 159, 212);
    doc.setFont("helvetica", "bold");
    doc.text("FORGE INDIA", pageWidth / 2, 25, { align: "center" });

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.setFont("helvetica", "normal");
    doc.text("CERTIFICATE OF EXCELLENCE", pageWidth / 2, 35, { align: "center", charSpace: 1 });

    // 4. Main Title
    doc.setFontSize(44);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFICATE", pageWidth / 2, 55, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(100);
    doc.setFont("helvetica", "italic");
    doc.text("This is to proudly certify that", pageWidth / 2, 70, { align: "center" });

    // 5. Student Name
    doc.setFontSize(50);
    doc.setTextColor(26, 159, 212);
    doc.setFont("helvetica", "bold");
    doc.text(cert.studentName.toUpperCase(), pageWidth / 2, 95, { align: "center" });

    // 6. Course Details
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("has successfully completed the professional training program in", pageWidth / 2, 115, { align: "center" });

    doc.setFontSize(28);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text(cert.course, pageWidth / 2, 135, { align: "center" });

    // 7. Signatures and Seal (Moved UP for visibility)
    const sigY = 165;
    
    // Left Signature
    doc.setDrawColor(200);
    doc.setLineWidth(0.2);
    doc.line(40, sigY, 100, sigY);
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text("PROGRAM COORDINATOR", 70, sigY + 6, { align: "center" });

    // Middle Seal
    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(0.8);
    doc.circle(pageWidth / 2, sigY - 5, 10, 'S');
    doc.setFontSize(12);
    doc.setTextColor(251, 191, 36);
    doc.text("★", pageWidth / 2, sigY - 3, { align: "center" });

    // Right Signature
    doc.setDrawColor(200);
    doc.setLineWidth(0.2);
    doc.line(pageWidth - 100, sigY, pageWidth - 40, sigY);
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text("DIRECTOR, FORGE INDIA", pageWidth - 70, sigY + 6, { align: "center" });

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
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-xl p-4 md:p-8">
             <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full max-w-6xl max-h-full bg-white rounded-[32px] shadow-2xl overflow-y-auto"
            >
              <div className="p-1 md:p-10 flex flex-col items-center">
                <button 
                  onClick={() => setPreviewCert(null)} 
                  className="absolute top-6 right-6 p-2 bg-slate-100 hover:bg-red-500 hover:text-white rounded-xl transition-all z-20"
                >
                  <X size={20} />
                </button>
                
                <div className="w-full bg-white border-[12px] md:border-[24px] border-slate-50 relative p-8 md:p-16 shadow-inner flex flex-col justify-between min-h-[600px]">
                   {/* Design Elements */}
                   <div className="absolute top-0 left-0 w-full h-4 bg-sky-600" />
                   <div className="absolute bottom-0 left-0 w-full h-4 bg-sky-600" />
                   
                   <div className="text-center py-10">
                      <img src="/logo.jpg" alt="FIC Logo" className="h-16 md:h-20 mx-auto mb-6" />
                      <h4 className="text-[10px] md:text-xs font-bold tracking-[0.4em] text-slate-400 uppercase mb-6 md:mb-10">Certificate of Excellence</h4>
                      
                      <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 md:mb-8 font-display">CERTIFICATE</h2>
                      <p className="text-lg md:text-xl text-slate-500 mb-6 md:mb-8 italic">This is to proudly certify that</p>
                      
                      <h1 className="text-5xl md:text-7xl font-black text-sky-600 mb-8 md:mb-12 tracking-tight">{previewCert.studentName.toUpperCase()}</h1>
                      
                      <p className="text-sm md:text-lg text-slate-600 mb-2">has successfully completed the professional training program in</p>
                      <h3 className="text-2xl md:text-4xl font-bold text-slate-900 mb-10 md:mb-16">{previewCert.course}</h3>
                   </div>
                   
                   <div className="flex flex-col md:flex-row justify-between items-center md:items-end px-4 md:px-12 gap-8 md:gap-0 mt-auto">
                      <div className="text-center">
                         <div className="w-40 md:w-56 h-px bg-slate-300 mb-4" />
                         <p className="text-[10px] md:text-xs font-bold text-slate-900 uppercase">Program Coordinator</p>
                      </div>
                      <div className="relative">
                         <div className="w-20 h-20 md:w-28 md:h-28 bg-amber-400/10 rounded-full flex items-center justify-center border-4 border-amber-400/20">
                            <Award size={40} className="text-amber-500" />
                         </div>
                      </div>
                      <div className="text-center">
                         <div className="w-40 md:w-56 h-px bg-slate-300 mb-4" />
                         <p className="text-[10px] md:text-xs font-bold text-slate-900 uppercase">Director, Forge India</p>
                      </div>
                   </div>
                </div>

                <div className="w-full flex justify-center gap-4 py-8 bg-slate-50 border-t border-slate-100 mt-6 rounded-b-[32px]">
                   <button 
                     onClick={() => handleDownload(previewCert)}
                     className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition shadow-lg shadow-sky-600/20 text-sm"
                   >
                     <Download size={18} /> Download PDF
                   </button>
                   <button 
                     onClick={() => setPreviewCert(null)}
                     className="px-6 py-3 bg-white text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition border border-slate-200 text-sm"
                   >
                     Close Preview
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HRCertificates;
