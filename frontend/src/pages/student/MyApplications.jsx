import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, CheckCircle, XCircle, Book, ChevronRight } from "lucide-react";
import api from "../../utils/api";
export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get("/admissions/my-applications");
        setApplications(data.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);
  const getStatusDisplay = (status) => {
    switch (status) {
      case "approved":
        return {
          icon: <CheckCircle className="text-green-500" size={20} />,
          label: "Approved",
          color: "text-green-600",
        };
      case "rejected":
        return {
          icon: <XCircle className="text-red-500" size={20} />,
          label: "Rejected",
          color: "text-red-600",
        };
      default:
        return {
          icon: <Clock className="text-orange-500" size={20} />,
          label: "Pending Review",
          color: "text-orange-600",
        };
    }
  };
  return (
    <div className="space-y-8">
      {" "}
      <div>
        {" "}
        <h1 className="text-3xl font-bold text-slate-900 font-display">
          My Applications
        </h1>{" "}
        <p className="text-slate-500">
          Track the status of your course enrollment requests.
        </p>{" "}
      </div>{" "}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          {" "}
          <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>{" "}
        </div>
      ) : applications.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
          {" "}
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            {" "}
            <Book size={32} />{" "}
          </div>{" "}
          <h3 className="text-xl font-bold">No applications yet</h3>{" "}
          <p className="text-slate-500 mt-2">
            Browse our courses and start your application today.
          </p>{" "}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {" "}
          {applications.map((app, i) => {
            const status = getStatusDisplay(app.status);
            return (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6"
              >
                {" "}
                <div className="w-full md:w-32 h-20 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                  {" "}
                  <img
                    src={app.course?.thumbnail}
                    alt=""
                    className="w-full h-full object-cover"
                  />{" "}
                </div>{" "}
                <div className="flex-1 text-center md:text-left">
                  {" "}
                  <h3 className="font-bold text-lg">
                    {app.course?.title}
                  </h3>{" "}
                  <p className="text-sm text-slate-500">
                    Applied on {new Date(app.appliedAt).toLocaleDateString()}
                  </p>{" "}
                </div>{" "}
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-2xl">
                  {" "}
                  {status.icon}{" "}
                  <span
                    className={`text-sm font-bold uppercase tracking-wider ${status.color}`}
                  >
                    {" "}
                    {status.label}{" "}
                  </span>{" "}
                </div>{" "}
                <button className="p-3 text-slate-400 hover:text-primary-600 transition">
                  {" "}
                  <ChevronRight size={24} />{" "}
                </button>{" "}
              </motion.div>
            );
          })}{" "}
        </div>
      )}{" "}
    </div>
  );
}
