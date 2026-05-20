import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  Search,
  Filter,
  User,
  Mail,
  MoreVertical,
  ChevronRight,
  MessageCircle,
  Bell,
  ArrowRight,
  BookOpen,
  Users,
  IndianRupee,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import toast from "react-hot-toast";
import api from "../../utils/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function HRDashboard() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [feesDetails, setFeesDetails] = useState({
    totalAmount: '',
    amountPaid: '',
    paymentMethod: ''
  });
  const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  useEffect(() => {
    fetchAdmissions();
  }, []);
  const fetchAdmissions = async () => {
    try {
      const { data } = await api.get("/admissions/all");
      setAdmissions(data.data);
    } catch (err) {
      console.error("Error fetching admissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    if (admissions.length === 0) {
      toast.error("No admissions data available to generate report!");
      return;
    }
    setIsGenerating(true);
    const toastId = toast.loading("Generating PDF Report...");
    
    try {
      const doc = new jsPDF();
      
      // Attempt to load the logo
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = '/logo.jpg';
        await new Promise((resolve) => {
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            const imgData = canvas.toDataURL('image/jpeg');
            doc.addImage(imgData, 'JPEG', 14, 12, 12, 12);
            resolve();
          };
          img.onerror = () => resolve(); // Ignore logo on error
        });
      } catch (e) {
        console.warn("Could not load logo for PDF");
      }

      doc.setFontSize(20);
      doc.setTextColor(26, 159, 212);
      doc.text("Forge India Connect - HR Admissions Report", 30, 20);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
      doc.text("---------------------------------------------------------------------------------------------------", 14, 35);

      // Summary Section
      doc.setFontSize(14);
      doc.setTextColor(33);
      doc.text("Executive Summary", 14, 45);

      const totalAdmissions = admissions.length;
      const completedAdmissions = admissions.filter(a => a.status === 'completed').length;
      const pendingAdmissions = admissions.filter(a => a.status === 'pending').length;
      const rejectedAdmissions = admissions.filter(a => a.status === 'rejected').length;

      autoTable(doc, {
        startY: 50,
        head: [["Metric", "Count / Value"]],
        body: [
          ["Total Applications Received", totalAdmissions.toString()],
          ["Approved Admissions", completedAdmissions.toString()],
          ["Pending Admissions", pendingAdmissions.toString()],
          ["Rejected Admissions", rejectedAdmissions.toString()]
        ],
        theme: 'grid',
        headStyles: { fillColor: [26, 159, 212] }
      });

      // Course Wise Summary
      const courseCounts = {};
      admissions.forEach(a => {
        const courseTitle = a.course?.title || 'Unknown Course';
        courseCounts[courseTitle] = (courseCounts[courseTitle] || 0) + 1;
      });

      doc.setFontSize(14);
      doc.setTextColor(33);
      doc.text("Course-wise Application Distribution", 14, doc.lastAutoTable.finalY + 15);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [["Course Title", "Total Applications"]],
        body: Object.entries(courseCounts).map(([title, count]) => [title, count.toString()]),
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246] }
      });

      // List of Applicants Detail Table
      doc.setFontSize(14);
      doc.setTextColor(33);
      doc.text("Detailed Applicants List", 14, doc.lastAutoTable.finalY + 15);

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 20,
        head: [["Applicant Name", "Email", "Course Name", "Status", "Applied Date"]],
        body: admissions.map(a => [
          a.fullName || 'N/A',
          a.email || 'N/A',
          a.course?.title || 'N/A',
          a.status === 'completed' ? 'Approved' : a.status === 'pending' ? 'Pending' : 'Rejected',
          new Date(a.appliedAt).toLocaleDateString()
        ]),
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] }
      });

      doc.save(`FIC_HR_Admissions_Report_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success("HR Report downloaded successfully!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate report PDF", { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  const pendingCount = admissions.filter(a => a.status === 'pending').length;

  const handleUpdateStatus = async (id, status) => {
    try {
      const payload = { status, reviewNotes };
      
      // Only include feesDetails if it was actually opened and modified
      if (selectedAdmission && feesDetails && feesDetails.totalAmount !== '') {
        const remainingAmount = (Number(feesDetails.totalAmount) || 0) - (Number(feesDetails.amountPaid) || 0);
        payload.feesDetails = { ...feesDetails, remainingAmount };
      }

      await api.patch(`/admissions/${id}/status`, payload);
      setSelectedAdmission(null);
      setReviewNotes("");
      setFeesDetails({ totalAmount: '', amountPaid: '', paymentMethod: '' });
      fetchAdmissions();
      toast.success(`Application ${status === 'completed' ? 'Completed' : status} successfully!`);
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  const handleSaveFees = async (id) => {
    try {
      const remainingAmount = (Number(feesDetails.totalAmount) || 0) - (Number(feesDetails.amountPaid) || 0);
      await api.patch(`/admissions/${id}/status`, { 
        status: selectedAdmission.status, 
        reviewNotes: selectedAdmission.reviewNotes, 
        feesDetails: { ...feesDetails, remainingAmount } 
      });
      setIsFeesModalOpen(false);
      setSelectedAdmission(null);
      setFeesDetails({ totalAmount: '', amountPaid: '', paymentMethod: '' });
      fetchAdmissions();
      toast.success('Fees updated successfully!');
    } catch (err) {
      toast.error('Error updating fees');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-600 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-600 border-red-200";
      case "reviewed":
        return "bg-blue-100 text-blue-600 border-blue-200";
      default:
        return "bg-orange-100 text-orange-600 border-orange-200";
    }
  };
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">
            HR Dashboard
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Monitor admissions and platform performance.
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={handleGenerateReport}
             disabled={isGenerating}
             className="px-5 py-2.5 bg-sky-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-sky-600/20 hover:bg-sky-700 transition disabled:opacity-50"
           >
             {isGenerating ? "Generating..." : "Generate Report"}
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Students", value: "1,245", icon: User, color: "blue" },
          { label: "Active Courses", value: "12", icon: BookOpen, color: "green" },
          { label: "New Admissions (Week)", value: "85", icon: Users, color: "purple" },
          { label: "Completion Rate", value: "68%", icon: CheckCircle, color: "amber" },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-[#1e293b] p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center`} style={{ backgroundColor: stat.color === 'blue' ? 'rgba(59,130,246,0.1)' : stat.color === 'green' ? 'rgba(16,185,129,0.1)' : stat.color === 'purple' ? 'rgba(139,92,246,0.1)' : 'rgba(245,158,11,0.1)', color: stat.color === 'blue' ? '#3b82f6' : stat.color === 'green' ? '#10b981' : stat.color === 'purple' ? '#8b5cf6' : '#f59e0b' }}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
             <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Student Enrollment Growth</h3>
               <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-xs font-bold px-4 py-2 outline-none">
                 <option>Monthly</option>
                 <option>Yearly</option>
               </select>
             </div>
             <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={[
                   { name: 'Jan', value: 400 },
                   { name: 'Feb', value: 300 },
                   { name: 'Mar', value: 600 },
                   { name: 'Apr', value: 800 },
                   { name: 'May', value: 500 },
                   { name: 'Jun', value: 900 },
                 ]}>
                   <defs>
                     <linearGradient id="colorEnroll" x1="0" y1="0" x2="0" y2="1">
                       <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3}/>
                       <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0}/>
                     </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                   <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                   <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                   <Area type="monotone" dataKey="value" stroke="#0EA5E9" strokeWidth={4} fillOpacity={1} fill="url(#colorEnroll)" />
                 </AreaChart>
               </ResponsiveContainer>
             </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Course Completion Progress</h3>
                <div className="space-y-6">
                  {[
                    { label: "MERN Stack", value: 75, color: "blue" },
                    { label: "UI/UX Design", value: 45, color: "purple" },
                    { label: "Data Science", value: 60, color: "green" },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{item.label}</span>
                        <span className="text-slate-500">{item.value}%</span>
                      </div>
                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${item.value}%` }}
                          className={`h-full bg-${item.color === 'blue' ? 'sky' : item.color === 'purple' ? 'purple' : 'emerald'}-500`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
             </div>

             <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-center items-center text-center">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Dropout Rate</h3>
                <div className="relative w-32 h-32 flex items-center justify-center mb-4">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100 dark:text-slate-800" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={364} strokeDashoffset={364 - (364 * 12 / 100)} className="text-red-500" strokeLinecap="round" />
                  </svg>
                  <span className="absolute text-2xl font-black text-slate-900 dark:text-white">12%</span>
                </div>
                <p className="text-sm text-slate-500">Decreased by 2% from last month</p>
             </div>
           </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-[#1e293b] p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm h-full">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8 font-display">Recent Activity</h3>
          <div className="space-y-8">
            {[
              { name: "Riya", action: "enrolled in", target: "MERN Stack", time: "2 mins ago", color: "blue" },
              { name: "Arun", action: "completed", target: "UI/UX course", time: "1 hour ago", color: "green" },
              { name: "Suresh", action: "submitted", target: "Assignment #4", time: "3 hours ago", color: "purple" },
              { name: "Meera", action: "applied for", target: "Data Science", time: "5 hours ago", color: "orange" },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white`} style={{ background: '#1A9FD4' }}>
                  {activity.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-slate-900 dark:text-white font-medium">
                    <span className="font-bold">{activity.name}</span> {activity.action} <span className="text-sky-600 font-bold">{activity.target}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-10 py-4 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold rounded-2xl border border-slate-100 dark:border-slate-700 hover:bg-slate-100 transition">
            View All Activity
          </button>
        </div>
      </div>

      <div className="mt-12">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white font-display mb-6">Recent Admissions</h2>
      </div>

      {/* Pending Notification Banner */}
      {pendingCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-200 rounded-2xl p-5 flex items-center justify-between cursor-pointer hover:bg-orange-100 transition group"
          onClick={() => {
            // Scroll to the table or filter for pending
            const table = document.querySelector('table');
            if (table) table.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white relative">
              <Bell size={22} />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {pendingCount}
              </span>
            </div>
            <div>
              <p className="font-bold text-slate-900">{pendingCount} Pending Enrollment{pendingCount > 1 ? 's' : ''}</p>
              <p className="text-sm text-slate-500">Review and approve student applications below.</p>
            </div>
          </div>
          <ArrowRight className="text-slate-500 group-hover:text-orange-600 transition" size={20} />
        </motion.div>
      )}
      <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-none">
        {" "}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          {" "}
          <div className="relative">
            {" "}
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />{" "}
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm w-64 text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none"
            />{" "}
          </div>{" "}
          <div className="flex gap-2">
            {" "}
            <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase border border-slate-100">
              {" "}
              Pending First{" "}
            </button>{" "}
            <button className="p-2 bg-slate-50 text-slate-600 rounded-xl border border-slate-100">
              {" "}
              <Filter size={18} />{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        <div className="overflow-x-auto">
          {" "}
          <table className="w-full text-left">
            {" "}
            <thead>
              {" "}
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-xs font-bold text-slate-400 uppercase tracking-wider">
                {" "}
                <th className="px-6 py-4">Applicant</th>{" "}
                <th className="px-6 py-4">Course</th>{" "}
                <th className="px-6 py-4 hidden md:table-cell">Fees Info</th>
                <th className="px-6 py-4">Applied Date</th>{" "}
                <th className="px-6 py-4">Status</th>{" "}
                <th className="px-6 py-4 text-right">Actions</th>{" "}
              </tr>{" "}
            </thead>{" "}
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-500">Loading admissions...</td>
                </tr>
              ) : admissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-slate-500">No applications found.</td>
                </tr>
              ) : (
                admissions.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: '#1A9FD4' }}>
                          {app.fullName.charAt(0)}
                        </div>
                        <div>
                           <p className="text-sm font-bold text-slate-900 dark:text-white">{app.fullName}</p>
                           <p className="text-xs text-slate-500">{app.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium">{app.course?.title}</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      {app.feesDetails && typeof app.feesDetails === 'object' && app.feesDetails.totalAmount ? (
                        <div>
                          <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Total: ₹{app.feesDetails.totalAmount}</p>
                          <p className="text-[10px] text-emerald-600 font-bold">Paid: ₹{app.feesDetails.amountPaid || 0}</p>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">No Fees Set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(app.status)}`}>
                        {app.status === 'completed' ? 'Approved' : app.status === 'pending' ? 'Pending' : 'Rejected'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleUpdateStatus(app._id, "completed")}
                          className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition shadow-sm"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(app._id, "rejected")}
                          className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition shadow-sm"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedAdmission(app);
                            setFeesDetails(app.feesDetails || { totalAmount: '', amountPaid: '', paymentMethod: '' });
                            setIsFeesModalOpen(true);
                          }}
                          className="p-2 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-600 hover:text-white transition shadow-sm"
                          title="Add Fees"
                        >
                          <IndianRupee size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAdmission(app);
                            setReviewNotes(app.reviewNotes || "");
                            setFeesDetails(app.feesDetails || { totalAmount: '', amountPaid: '', paymentMethod: '' });
                          }}
                          className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-900 hover:text-white transition"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>{" "}
          </table>{" "}
        </div>{" "}
      </div>{" "}
      {/* Review Modal */}{" "}
      <AnimatePresence>
        {" "}
        {selectedAdmission && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {" "}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAdmission(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />{" "}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              {" "}
              <div className="p-8 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                {" "}
                <div className="flex items-center gap-4">
                  {" "}
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white text-xl font-bold" style={{ background: '#1A9FD4' }}>
                    {" "}
                    {selectedAdmission.fullName.charAt(0)}{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h3 className="text-xl font-bold">
                      Application Review
                    </h3>{" "}
                    <p className="text-sm text-slate-500">
                      Submitted on{" "}
                      {new Date(
                        selectedAdmission.appliedAt,
                      ).toLocaleDateString()}
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(selectedAdmission.status)}`}
                >
                  {" "}
                  {selectedAdmission.status}{" "}
                </span>{" "}
              </div>{" "}
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {" "}
                <div className="space-y-6">
                  {" "}
                  <div>
                    {" "}
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Applicant Information
                    </h4>{" "}
                    <div className="space-y-3">
                      {" "}
                      <div className="flex items-center gap-3 text-slate-600">
                        {" "}
                        <User size={16} />{" "}
                        <span className="text-sm font-medium">
                          {selectedAdmission.fullName}
                        </span>{" "}
                      </div>{" "}
                      <div className="flex items-center gap-3 text-slate-600">
                        {" "}
                        <Mail size={16} />{" "}
                        <span className="text-sm font-medium">
                          {selectedAdmission.email}
                        </span>{" "}
                      </div>{" "}
                      <div className="flex items-center gap-3 text-slate-600">
                        {" "}
                        <MessageCircle size={16} />{" "}
                        <span className="text-sm font-medium">
                          {selectedAdmission.phoneNumber}
                        </span>{" "}
                      </div>{" "}
                    </div>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Education & Course
                    </h4>{" "}
                    <p className="text-sm font-medium">
                      {selectedAdmission.previousEducation}
                    </p>{" "}
                    <p className="text-sm text-slate-500 mt-1">
                      Applying for:{" "}
                      <span className="text-primary-600">
                        {selectedAdmission.course?.title}
                      </span>
                    </p>{" "}
                  </div>{" "}
                </div>{" "}
                <div className="space-y-6">
                  {" "}
                  <div>
                    {" "}
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      HR Review Notes
                    </h4>{" "}
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add notes for this application..."
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none text-sm h-32 resize-none mb-4"
                    ></textarea>{" "}
                  </div>{" "}
                  <div>
                    {" "}
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Fees Details
                    </h4>
                    <div className="space-y-3">
                      <input
                        type="number"
                        value={feesDetails.totalAmount}
                        onChange={(e) => setFeesDetails({ ...feesDetails, totalAmount: e.target.value })}
                        placeholder="Total Course Amount (INR)"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none text-sm"
                      />
                      <input
                        type="number"
                        value={feesDetails.amountPaid}
                        onChange={(e) => setFeesDetails({ ...feesDetails, amountPaid: e.target.value })}
                        placeholder="Amount Paid (INR)"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none text-sm"
                      />
                      <select
                        value={feesDetails.paymentMethod}
                        onChange={(e) => setFeesDetails({ ...feesDetails, paymentMethod: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none text-sm"
                      >
                        <option value="">Select Payment Method</option>
                        <option value="UPI">UPI</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                        <option value="Cash">Cash</option>
                        <option value="Card">Card</option>
                      </select>
                      {feesDetails.totalAmount && feesDetails.amountPaid && (
                        <div className="p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-100 dark:border-sky-800 flex justify-between">
                          <span className="text-sm font-bold text-sky-700 dark:text-sky-300">Remaining Amount:</span>
                          <span className="text-sm font-bold text-sky-700 dark:text-sky-300">
                            INR {((Number(feesDetails.totalAmount) || 0) - (Number(feesDetails.amountPaid) || 0)).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>{" "}
                </div>{" "}
              </div>{" "}
              <div className="p-8 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex gap-4">
                {" "}
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedAdmission._id, "completed")
                  }
                  className="flex-1 py-4 bg-green-600 text-white font-bold rounded-2xl hover:bg-green-700 transition shadow-lg shadow-green-600/20 flex items-center justify-center gap-2"
                >
                  {" "}
                  <CheckCircle size={20} /> Mark as Completed{" "}
                </button>{" "}
                <button
                  onClick={() =>
                    handleUpdateStatus(selectedAdmission._id, "rejected")
                  }
                  className="flex-1 py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-600/20 flex items-center justify-center gap-2"
                >
                  {" "}
                  <XCircle size={20} /> Reject{" "}
                </button>{" "}
              </div>{" "}
            </motion.div>{" "}
          </div>
        )}{" "}
      </AnimatePresence>{" "}

      {/* Dedicated Fees Modal */}
      <AnimatePresence>
        {isFeesModalOpen && selectedAdmission && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFeesModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0f172a] rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500 flex items-center justify-center text-white">
                    <IndianRupee size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Add Fees Details</h3>
                    <p className="text-xs text-slate-500 font-medium">{selectedAdmission.fullName}</p>
                  </div>
                </div>
                <button onClick={() => setIsFeesModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition">
                  <XCircle size={20} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase">Total Course Amount (INR)</label>
                  <input
                    type="number"
                    value={feesDetails.totalAmount}
                    onChange={(e) => setFeesDetails({ ...feesDetails, totalAmount: e.target.value })}
                    placeholder="Enter total amount"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none text-sm"
                  />
                  
                  <label className="text-xs font-bold text-slate-500 uppercase mt-4 block">Amount Paid (INR)</label>
                  <input
                    type="number"
                    value={feesDetails.amountPaid}
                    onChange={(e) => setFeesDetails({ ...feesDetails, amountPaid: e.target.value })}
                    placeholder="Enter paid amount"
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none text-sm"
                  />
                  
                  <label className="text-xs font-bold text-slate-500 uppercase mt-4 block">Payment Method</label>
                  <select
                    value={feesDetails.paymentMethod}
                    onChange={(e) => setFeesDetails({ ...feesDetails, paymentMethod: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-sky-400/50 outline-none text-sm"
                  >
                    <option value="">Select Payment Method</option>
                    <option value="UPI">UPI</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cash">Cash</option>
                    <option value="Card">Card</option>
                  </select>

                  {feesDetails.totalAmount && feesDetails.amountPaid && (
                    <div className="mt-4 p-3 bg-sky-50 dark:bg-sky-900/20 rounded-xl border border-sky-100 dark:border-sky-800 flex justify-between">
                      <span className="text-sm font-bold text-sky-700 dark:text-sky-300">Remaining:</span>
                      <span className="text-sm font-bold text-sky-700 dark:text-sky-300">
                        INR {((Number(feesDetails.totalAmount) || 0) - (Number(feesDetails.amountPaid) || 0)).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => handleSaveFees(selectedAdmission._id)}
                  className="w-full py-4 bg-sky-600 text-white font-bold rounded-2xl hover:bg-sky-700 transition shadow-lg shadow-sky-600/20"
                >
                  Save Fees Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
