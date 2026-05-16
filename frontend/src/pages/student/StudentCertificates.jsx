import React, { useState, useEffect } from 'react';
import { Award, Download, Eye, FileText, CheckCircle, Clock, Search, BookOpen, User, Calendar, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import api from '../../utils/api';
import { useSelector } from 'react-redux';

const StudentCertificates = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewCert, setPreviewCert] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    fetchCompletedCourses();
  }, []);

  const fetchCompletedCourses = async () => {
    try {
      const { data } = await api.get('/admissions/my-courses');
      // For demonstration, we'll also fetch progress for each course
      // In a real app, we might have a dedicated certificates endpoint
      const coursesWithProgress = await Promise.all(data.data.map(async (course) => {
        try {
          const progRes = await api.get(`/progress/${course._id}`);
          const totalLessons = course.totalLessons || 12;
          const completedCount = progRes.data.data.completedSubjects?.length || 0;
          const percentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
          
          return {
            ...course,
            percentage,
            isCompleted: percentage >= 100
          };
        } catch (err) {
          return { ...course, percentage: 0, isCompleted: false };
        }
      }));
      
      setCourses(coursesWithProgress);
    } catch (err) {
      toast.error('Failed to load certificates data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (course) => {
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
    doc.text((user?.name || "Student").toUpperCase(), pageWidth / 2, 95, { align: "center" });

    // 6. Course Details
    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("has successfully completed the professional training program in", pageWidth / 2, 115, { align: "center" });

    doc.setFontSize(28);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text(course.title, pageWidth / 2, 135, { align: "center" });

    // 7. Signatures and Seal
    const sigY = 165;
    doc.setDrawColor(200);
    doc.setLineWidth(0.2);
    doc.line(40, sigY, 100, sigY);
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text("PROGRAM COORDINATOR", 70, sigY + 6, { align: "center" });

    doc.setDrawColor(251, 191, 36);
    doc.setLineWidth(0.8);
    doc.circle(pageWidth / 2, sigY - 5, 10, 'S');
    doc.setFontSize(12);
    doc.setTextColor(251, 191, 36);
    doc.text("★", pageWidth / 2, sigY - 3, { align: "center" });

    doc.line(pageWidth - 100, sigY, pageWidth - 40, sigY);
    doc.setFontSize(9);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text("DIRECTOR, FORGE INDIA", pageWidth - 70, sigY + 6, { align: "center" });

    doc.save(`Certificate_${course.title.replace(' ', '_')}.pdf`);
    toast.success('Downloading certificate...');
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">My Certifications</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Download and share your achievements.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[1, 2].map(i => <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl" />)}
        </div>
      ) : courses.filter(c => c.isCompleted).length === 0 ? (
        <div className="bg-white dark:bg-[#0f172a] rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800 p-20 text-center">
           <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-700">
              <Award size={40} />
           </div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No certificates earned yet</h3>
           <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Complete all topics and lessons in your enrolled courses to unlock your professional certification.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {courses.filter(c => c.isCompleted).map((course) => (
             <motion.div
               key={course._id}
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/20 group hover:shadow-2xl transition-all duration-500"
             >
                <div className="h-32 bg-gradient-to-br from-sky-500 to-indigo-600 p-8 flex items-end relative">
                   <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:scale-110 transition-transform duration-500">
                      <Award size={80} className="text-white" />
                   </div>
                   <h3 className="text-white font-bold text-xl leading-tight relative z-10">{course.title}</h3>
                </div>
                
                <div className="p-8 space-y-6">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                         <CheckCircle size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</p>
                         <p className="text-sm font-bold text-slate-900 dark:text-white">Completed & Verified</p>
                      </div>
                   </div>
                   
                   <div className="flex gap-3">
                      <button 
                        onClick={() => setPreviewCert(course)}
                        className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl hover:bg-slate-100 transition flex items-center justify-center gap-2 text-xs uppercase"
                      >
                         <Eye size={16} /> Preview
                      </button>
                      <button 
                        onClick={() => handleDownload(course)}
                        className="flex-1 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition shadow-lg shadow-sky-600/20 flex items-center justify-center gap-2 text-xs uppercase"
                      >
                         <Download size={16} /> Download
                      </button>
                   </div>
                </div>
             </motion.div>
           ))}
        </div>
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {previewCert && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md p-4 overflow-y-auto">
             <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 20 }}
               className="relative w-full max-w-5xl bg-white rounded-[32px] shadow-2xl overflow-hidden my-8"
             >
                <div className="p-4 md:p-12">
                   {/* Certificate Design Container */}
                   <div className="aspect-[1.414/1] w-full bg-white border-[16px] border-slate-50 relative p-8 md:p-16 flex flex-col justify-between shadow-inner">
                      <div className="absolute top-0 left-0 w-full h-3 bg-sky-600" />
                      <div className="absolute bottom-0 left-0 w-full h-3 bg-sky-600" />
                      
                      <div className="text-center">
                         <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 font-display">CERTIFICATE</h2>
                         <p className="text-sm md:text-lg text-slate-500 italic mb-6">This is to proudly certify that</p>
                         
                         <h1 className="text-4xl md:text-6xl font-black text-sky-600 mb-6 tracking-tight">{user?.name?.toUpperCase()}</h1>
                         
                         <p className="text-xs md:text-base text-slate-600 mb-2">has successfully completed the professional training program in</p>
                         <h3 className="text-xl md:text-3xl font-bold text-slate-900">{previewCert.title}</h3>
                      </div>
                      
                      <div className="flex justify-between items-end px-4 md:px-8">
                         <div className="text-center">
                            <div className="w-32 md:w-48 h-px bg-slate-300 mb-3" />
                            <p className="text-[8px] md:text-[10px] font-bold text-slate-900 uppercase">Program Coordinator</p>
                         </div>
                         <div className="w-16 h-16 md:w-24 md:h-24 bg-amber-400/10 rounded-full flex items-center justify-center border-2 border-amber-400/20">
                            <Award size={32} className="text-amber-500" />
                         </div>
                         <div className="text-center">
                            <div className="w-32 md:w-48 h-px bg-slate-300 mb-3" />
                            <p className="text-[8px] md:text-[10px] font-bold text-slate-900 uppercase">Director, Forge India</p>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-center gap-4">
                   <button 
                     onClick={() => handleDownload(previewCert)}
                     className="px-8 py-3 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition shadow-lg shadow-sky-600/20 text-sm flex items-center gap-2"
                   >
                     <Download size={18} /> Download PDF
                   </button>
                   <button 
                     onClick={() => setPreviewCert(null)}
                     className="px-8 py-3 bg-white text-slate-600 rounded-xl font-bold hover:bg-slate-100 transition border border-slate-200 text-sm"
                   >
                     Close
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StudentCertificates;
