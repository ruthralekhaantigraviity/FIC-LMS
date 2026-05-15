import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Download, Filter, Calendar } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Mock Data for Reports
const coursePerformanceData = [
  { name: 'React Fullstack', students: 120, completionRate: 85, revenue: 1800000 },
  { name: 'Data Science', students: 85, completionRate: 70, revenue: 2125000 },
  { name: 'UI/UX Design', students: 95, completionRate: 92, revenue: 1140000 },
  { name: 'Digital Marketing', students: 60, completionRate: 78, revenue: 600000 },
  { name: 'Cyber Security', students: 45, completionRate: 65, revenue: 900000 },
  { name: 'Cloud Computing', students: 75, completionRate: 80, revenue: 1500000 },
];

const revenueTrendData = [
  { month: 'Jan', revenue: 450000 },
  { month: 'Feb', revenue: 520000 },
  { month: 'Mar', revenue: 480000 },
  { month: 'Apr', revenue: 610000 },
  { month: 'May', revenue: 550000 },
  { month: 'Jun', revenue: 670000 },
  { month: 'Jul', revenue: 720000 },
  { month: 'Aug', revenue: 690000 },
];

const studentDemographics = [
  { name: 'Working Professionals', value: 45, color: '#3b82f6' },
  { name: 'College Students', value: 35, color: '#8b5cf6' },
  { name: 'Job Seekers', value: 20, color: '#10b981' },
];

const AdminReports = () => {
  const [timeframe, setTimeframe] = React.useState('Last 6 Months');
  const [showTimeframeDropdown, setShowTimeframeDropdown] = React.useState(false);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(26, 159, 212);
    doc.text("FIC LMS - Comprehensive Analytics Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report Period: ${timeframe}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 35);
    doc.text("---------------------------------------------------------------------------------------------------", 14, 40);

    // Section 1: Course Performance
    doc.setFontSize(16);
    doc.setTextColor(33);
    doc.text("Course Performance Metrics", 14, 50);

    const courseTableData = coursePerformanceData.map(c => [
      c.name,
      c.students.toString(),
      `${c.completionRate}%`,
      `₹${c.revenue.toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: 55,
      head: [["Course Name", "Enrolled Students", "Completion Rate", "Total Revenue"]],
      body: courseTableData,
      theme: 'grid',
      headStyles: { fillColor: [26, 159, 212] }
    });

    // Section 2: Revenue Trend
    doc.text("Monthly Revenue Trend", 14, doc.previousAutoTable.finalY + 15);
    
    const revenueTableData = revenueTrendData.map(r => [
      r.month,
      `₹${r.revenue.toLocaleString()}`
    ]);

    autoTable(doc, {
      startY: doc.previousAutoTable.finalY + 20,
      head: [["Month", "Revenue Collected"]],
      body: revenueTableData,
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] }
    });

    // Section 3: Demographics
    doc.text("Student Demographics", 14, doc.previousAutoTable.finalY + 15);
    
    const demoTableData = studentDemographics.map(d => [
      d.name,
      `${d.value}%`
    ]);

    autoTable(doc, {
      startY: doc.previousAutoTable.finalY + 20,
      head: [["Category", "Percentage share"]],
      body: demoTableData,
      theme: 'grid'
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for(let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text("Confidential Business Intelligence Report - FIC LMS", 14, doc.internal.pageSize.height - 10);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    }

    doc.save(`FIC_Detailed_Analytics_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const timeframes = ["Last 30 Days", "Last 3 Months", "Last 6 Months", "Last Year"];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Reports & Analytics</h1>
          <p className="text-slate-500 mt-1">Deep dive into performance metrics and business intelligence.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowTimeframeDropdown(!showTimeframeDropdown)}
              className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              <Calendar size={16} /> {timeframe}
            </button>
            {showTimeframeDropdown && (
              <div className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
                {timeframes.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setTimeframe(t);
                      setShowTimeframeDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${timeframe === t ? 'text-blue-500 font-bold bg-blue-50/50 dark:bg-blue-500/10' : 'text-slate-600 dark:text-slate-400'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={handleExportPDF}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
          >
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Trend Line Chart */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Growth</h3>
            <button className="text-slate-500 hover:text-slate-900 dark:text-white transition-colors">
              <Filter size={18} />
            </button>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                  formatter={(value) => `₹${value.toLocaleString()}`}
                />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Student Demographics Pie Chart */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Student Demographics</h3>
          <div className="flex flex-col md:flex-row items-center gap-8 h-[300px]">
            <div className="flex-1 h-full w-full">
               <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentDemographics}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {studentDemographics.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4">
              {studentDemographics.map((item, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{item.name}</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white pl-5">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course Performance Bar Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
           <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Course Performance Metrics</h3>
          </div>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coursePerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis yAxisId="left" orientation="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar yAxisId="left" dataKey="students" name="Enrolled Students" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar yAxisId="right" dataKey="completionRate" name="Completion Rate %" fill="#10b981" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
