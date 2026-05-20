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
      // Fetch exact progress based on actual subjects in the course
      const coursesWithProgress = await Promise.all(data.data.map(async (course) => {
        try {
          const [progRes, subRes] = await Promise.all([
            api.get(`/progress/${course._id}`),
            api.get(`/subjects/course/${course._id}`)
          ]);
          
          const actualTotalLessons = subRes.data.data.length || course.totalLessons || 1;
          const completedCount = progRes.data.data.completedSubjects?.length || 0;
          const percentage = Math.round((completedCount / actualTotalLessons) * 100);
          
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

  const handleDownload = async (course) => {
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

    // Load and add company logo centered at the top
    try {
      const imgData = await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg'));
        };
        img.onerror = reject;
        img.src = '/logo.jpg';
      });
      // Center the logo at the top
      doc.addImage(imgData, 'JPEG', (pageWidth / 2) - 10, 11, 20, 20);
    } catch (e) {
      console.warn("Could not load logo for PDF", e);
    }

    // 3. Header Section (adjusted vertical coordinates to flow elegantly under the logo)
    doc.setFontSize(22);
    doc.setTextColor(26, 159, 212);
    doc.setFont("helvetica", "bold");
    doc.text("FORGE INDIA CONNECT", pageWidth / 2, 38, { align: "center" });

    doc.setFontSize(8);
    doc.setTextColor(160);
    doc.setFont("helvetica", "normal");
    doc.text("Empowering Future Professionals", pageWidth / 2, 43, { align: "center", charSpace: 0.5 });

    doc.setFontSize(9);
    doc.setTextColor(150);
    doc.setFont("helvetica", "normal");
    doc.text("CERTIFICATE OF EXCELLENCE", pageWidth / 2, 50, { align: "center", charSpace: 1.2 });

    // 4. Main Title
    doc.setFontSize(40);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFICATE", pageWidth / 2, 65, { align: "center" });

    doc.setFontSize(15);
    doc.setTextColor(100);
    doc.setFont("helvetica", "italic");
    doc.text("This is to proudly certify that", pageWidth / 2, 77, { align: "center" });

    // 5. Student Name
    doc.setFontSize(44);
    doc.setTextColor(26, 159, 212);
    doc.setFont("helvetica", "bold");
    doc.text((user?.name || "Student").toUpperCase(), pageWidth / 2, 100, { align: "center" });

    // 6. Course Details
    doc.setFontSize(13);
    doc.setTextColor(100);
    doc.setFont("helvetica", "normal");
    doc.text("has successfully completed the professional training program in", pageWidth / 2, 118, { align: "center" });

    doc.setFontSize(26);
    doc.setTextColor(30, 41, 59);
    doc.setFont("helvetica", "bold");
    doc.text(course.title, pageWidth / 2, 136, { align: "center" });

    // 7. Signatures and Seal
    const sigY = 168;
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
    doc.text("DIRECTOR, FORGE INDIA CONNECT", pageWidth - 70, sigY + 6, { align: "center" });

    doc.save(`Certificate_${course.title.replace(' ', '_')}.pdf`);
    toast.success('Downloading certificate...');
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">My Achievements</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and view your course completion certificates.</p>
        </div>
      </div>

      {/* Course Completion Certificates Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-lg shadow-green-600/20">
              <CheckCircle size={20} />
           </div>
           <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Completion Certificates</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1].map(i => <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-[32px]" />)}
          </div>
        ) : courses.filter(c => c.isCompleted).length === 0 ? (
          <div className="bg-white dark:bg-[#0f172a] rounded-[32px] border-2 border-dashed border-slate-200 dark:border-slate-800 p-16 text-center">
             <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-700">
                <Award size={32} />
             </div>
             <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Completion Certificates Locked</h3>
             <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">Finish your current domain modules to unlock your final professional certification.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {courses.filter(c => c.isCompleted).map((course) => (
               <motion.div
                 key={`comp-${course._id}`}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[32px] overflow-hidden shadow-2xl p-1"
               >
                  <div className="bg-white dark:bg-[#1e293b] rounded-[31px] p-8 space-y-6 h-full flex flex-col">
                     <div className="flex justify-between items-start">
                        <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-2xl flex items-center justify-center">
                           <Award size={32} />
                        </div>
                        <span className="px-3 py-1 bg-green-500 text-white rounded-full text-[10px] font-black uppercase tracking-tighter">VERIFIED</span>
                     </div>
                     
                     <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{course.title}</h3>
                        <p className="text-sm text-slate-500">Official completion certificate for professional training.</p>
                     </div>

                     <div className="flex gap-3 pt-4">
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
      </section>

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
                         <img src="/logo.jpg" alt="FIC Logo" className="h-12 md:h-16 mx-auto mb-4" />
                         <h3 className="text-xl md:text-2xl font-black tracking-tight text-[#1A9FD4] mb-1">FORGE INDIA CONNECT</h3>
                         <p className="text-[8px] md:text-[10px] font-bold text-slate-400 mb-6 uppercase tracking-[0.3em]">Empowering Future Professionals</p>
                         
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
