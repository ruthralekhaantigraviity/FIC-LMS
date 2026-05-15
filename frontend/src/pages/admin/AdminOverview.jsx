import React, { useState, useEffect } from 'react';
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  Clock, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  Search,
  Filter
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts';
import StatsCard from '../../components/admin/StatsCard';
import axios from 'axios';

// Mock Data for demonstration
const revenueData = [
  { name: 'Jan', value: 45000 },
  { name: 'Feb', value: 52000 },
  { name: 'Mar', value: 48000 },
  { name: 'Apr', value: 61000 },
  { name: 'May', value: 55000 },
  { name: 'Jun', value: 67000 },
];

const enrollmentData = [
  { name: 'React Fullstack', students: 120 },
  { name: 'Data Science', students: 85 },
  { name: 'UI/UX Design', students: 95 },
  { name: 'Digital Marketing', students: 60 },
  { name: 'Cyber Security', students: 45 },
];

const feeData = [
  { name: 'Collected', value: 75, color: '#3b82f6' },
  { name: 'Pending', value: 25, color: '#8b5cf6' },
];

const enquiryPipeline = [
  { label: 'New Enquiries', count: 42, color: 'blue' },
  { label: 'Contacted', count: 28, color: 'purple' },
  { label: 'Converted', count: 15, color: 'green' },
  { label: 'Dropped', count: 8, color: 'orange' },
];

const recentActivities = [
  { id: 1, type: 'registration', user: 'Rahul Sharma', course: 'React Fullstack', time: '2 mins ago', amount: '₹15,000' },
  { id: 2, type: 'payment', user: 'Sneha Patil', course: 'UI/UX Design', time: '15 mins ago', amount: '₹12,000' },
  { id: 3, type: 'enrollment', user: 'Amit Verma', course: 'Data Science', time: '1 hour ago', amount: '₹25,000' },
  { id: 4, type: 'registration', user: 'Priya Das', course: 'Digital Marketing', time: '3 hours ago', amount: '₹10,000' },
];

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin-dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back, here's what's happening today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300">
            <Clock size={16} className="text-blue-500" />
            Last 30 Days
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 text-slate-900 dark:text-white px-5 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2">
            <Filter size={18} />
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Students" 
          value={stats?.stats?.totalStudents || "1,284"} 
          icon={Users} 
          trend="up" 
          trendValue="+12.5%" 
          color="blue"
        />
        <StatsCard 
          title="Active Courses" 
          value={stats?.stats?.activeCourses || "42"} 
          icon={BookOpen} 
          trend="up" 
          trendValue="+4.2%" 
          color="purple"
        />
        <StatsCard 
          title="Total Revenue" 
          value={stats?.stats?.totalRevenue ? `₹${stats.stats.totalRevenue.toLocaleString()}` : "₹4.82M"} 
          icon={CreditCard} 
          trend="up" 
          trendValue="+18.7%" 
          color="green"
        />
        <StatsCard 
          title="Pending Fees" 
          value={stats?.stats?.pendingFees ? `₹${stats.stats.pendingFees.toLocaleString()}` : "₹152K"} 
          icon={Clock} 
          trend="down" 
          trendValue="-2.4%" 
          color="orange"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Overview - Line Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Revenue Overview</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs text-slate-500">Current Period</span>
              </div>
              <button className="text-slate-500 hover:text-slate-900 dark:text-white transition-colors">
                <MoreVertical size={20} />
              </button>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fee Collection - Pie Chart */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Fee Collection</h3>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={feeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {feeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">75%</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wider">Collected</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {feeData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-slate-500 dark:text-slate-400">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-slate-900 dark:text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Course Enrollment - Bar Chart */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Course-wise Enrollment</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#1e293b'}}
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px' }}
                />
                <Bar dataKey="students" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Enquiry Pipeline */}
        <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-none">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-8">Enquiry Pipeline</h3>
          <div className="space-y-6">
            {enquiryPipeline.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.label}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{item.count}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 bg-${item.color}-500 shadow-[0_0_10px_rgba(var(--color-${item.color}-500),0.3)]`} 
                    style={{ width: `${(item.count / 50) * 100}%`, backgroundColor: item.color === 'blue' ? '#3b82f6' : item.color === 'purple' ? '#8b5cf6' : item.color === 'green' ? '#10b981' : '#f59e0b' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Recent Activities</h3>
          <button className="text-blue-500 hover:text-blue-400 text-sm font-semibold">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30">
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Student Name</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Activity</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Course</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Time</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {recentActivities.map((activity) => (
                <tr key={activity.id} className="hover:bg-slate-50 dark:bg-slate-800/20 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-500">
                        {activity.user.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-slate-900 dark:text-white">{activity.user}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                      activity.type === 'registration' ? 'bg-blue-500/10 text-blue-500' : 
                      activity.type === 'payment' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-purple-500/10 text-purple-500'
                    }`}>
                      {activity.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-500 dark:text-slate-400">{activity.course}</td>
                  <td className="py-4 px-6 text-sm text-slate-500">{activity.time}</td>
                  <td className="py-4 px-6 text-right text-sm font-bold text-slate-900 dark:text-white">{activity.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;
