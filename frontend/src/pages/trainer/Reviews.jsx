import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Filter, TrendingUp, ThumbsUp, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const BRAND = "#1A9FD4";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('all');

  const fetchReviews = async () => {
    try {
      const { data } = await api.get('/reviews/trainer-reviews');
      setReviews(data.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      toast.error('Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Calculate stats dynamically
  const totalReviews = reviews.length;
  
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.stars, 0) / totalReviews).toFixed(1)
    : "0.0";

  const fiveStarCount = reviews.filter(r => r.stars === 5).length;

  const filteredReviews = reviews.filter(rev => {
    if (filterRating === 'all') return true;
    return rev.stars === parseInt(filterRating);
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white font-display">Student Reviews</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track student feedback and course ratings.</p>
        </div>
        <div className="flex bg-sky-50 dark:bg-sky-500/10 px-6 py-3 rounded-2xl border border-sky-100 dark:border-sky-500/20 animate-fadeIn">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-sky-600">{averageRating}</span>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  size={16} 
                  fill={i < Math.round(parseFloat(averageRating)) ? "currentColor" : "none"} 
                  className={i < Math.round(parseFloat(averageRating)) ? "" : "text-slate-300 dark:text-slate-600"} 
                />
              ))}
            </div>
            <span className="text-xs font-bold text-sky-600/60 uppercase ml-2">Average Rating</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Reviews", value: totalReviews, icon: ThumbsUp, color: "text-sky-500", bg: "bg-sky-50 dark:bg-sky-500/10" },
          { label: "5-Star Ratings", value: fiveStarCount, icon: Star, color: "text-amber-500", bg: "bg-amber-50 dark:bg-amber-500/10" },
          { label: "Active Feedback", value: totalReviews > 0 ? "100%" : "0%", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-[#0f172a] p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-[#0f172a] rounded-[32px] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 dark:text-white">Recent Feedback</h2>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-4 py-2 rounded-xl text-xs font-bold border-none outline-none focus:ring-1 focus:ring-sky-500/30"
            >
              <option value="all">All Stars</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">Loading reviews...</div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredReviews.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm italic">
                No reviews found matching the criteria.
              </div>
            ) : (
              filteredReviews.map((rev, i) => (
                <motion.div 
                  key={rev._id || i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-8 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400">
                        <User size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{rev.student?.name || "Student"}</h4>
                        <p className="text-xs text-sky-500 font-bold">{rev.course || "General Course"}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <div className="flex text-amber-400 mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < rev.stars ? "currentColor" : "none"} 
                            className={i < rev.stars ? "" : "text-slate-300 dark:text-slate-600"} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-medium text-slate-400">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed italic">
                    "{rev.comment}"
                  </p>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
