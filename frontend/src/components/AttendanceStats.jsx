import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
} from "lucide-react";
import api from "../utils/api";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
export default function AttendanceStats({ courseId }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (courseId) {
      const fetchStats = async () => {
        try {
          const { data } = await api.get(`/attendance/stats/${courseId}`);
          setStats(data.data);
        } catch (err) {
          console.error("Error fetching attendance stats:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchStats();
    }
  }, [courseId]);
  if (loading)
    return <div className="h-48 animate-pulse bg-slate-100 rounded-3xl"></div>;
  if (!stats) return null;
  const chartData = [
    { name: "Present", value: stats.present, color: "#10b981" },
    { name: "Absent", value: stats.total - stats.present, color: "#ef4444" },
  ];
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
      {" "}
      <div className="flex items-center justify-between mb-6">
        {" "}
        <h3 className="text-lg font-bold flex items-center gap-2">
          {" "}
          <Calendar className="text-primary-600" size={20} /> Attendance
          Analytics{" "}
        </h3>{" "}
        <span className="px-3 py-1 bg-primary-50 text-primary-600 rounded-lg text-xs font-bold">
          {" "}
          {stats.percentage.toFixed(1)}% Present{" "}
        </span>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {" "}
        <div className="h-48 relative">
          {" "}
          <ResponsiveContainer width="100%" height="100%">
            {" "}
            <PieChart>
              {" "}
              <Pie
                data={chartData}
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {" "}
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}{" "}
              </Pie>{" "}
              <Tooltip />{" "}
            </PieChart>{" "}
          </ResponsiveContainer>{" "}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {" "}
            <span className="text-2xl font-bold">{stats.present}</span>{" "}
            <span className="text-[10px] text-slate-500 uppercase">
              Days
            </span>{" "}
          </div>{" "}
        </div>{" "}
        <div className="space-y-4">
          {" "}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            {" "}
            <div className="flex items-center justify-between mb-1">
              {" "}
              <span className="text-xs font-bold text-slate-500 uppercase">
                Total Sessions
              </span>{" "}
              <TrendingUp size={14} className="text-primary-500" />{" "}
            </div>{" "}
            <p className="text-xl font-bold">{stats.total}</p>{" "}
          </div>{" "}
          <div className="flex gap-4">
            {" "}
            <div className="flex-1 p-3 bg-green-50 rounded-2xl border border-green-100">
              {" "}
              <p className="text-[10px] font-bold text-green-600 uppercase mb-1">
                Present
              </p>{" "}
              <p className="text-lg font-bold text-green-700">
                {stats.present}
              </p>{" "}
            </div>{" "}
            <div className="flex-1 p-3 bg-red-50 rounded-2xl border border-red-100">
              {" "}
              <p className="text-[10px] font-bold text-red-600 uppercase mb-1">
                Absent
              </p>{" "}
              <p className="text-lg font-bold text-red-700">
                {stats.total - stats.present}
              </p>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
