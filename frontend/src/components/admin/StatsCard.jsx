import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
  const colorMap = {
    blue: 'bg-blue-500/10 text-blue-500',
    purple: 'bg-purple-500/10 text-purple-500',
    green: 'bg-emerald-500/10 text-emerald-500',
    orange: 'bg-orange-500/10 text-orange-500',
  };

  return (
    <div className="bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-800 p-6 rounded-2xl hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 group shadow-sm dark:shadow-none">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</h3>
          
          <div className="flex items-center gap-1.5 mt-3">
            <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${trend === 'up' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
              {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {trendValue}
            </span>
            <span className="text-slate-600 text-xs font-medium">vs last month</span>
          </div>
        </div>
        
        <div className={`p-4 rounded-xl ${colorMap[color] || 'bg-blue-500/10 text-blue-500'} group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
