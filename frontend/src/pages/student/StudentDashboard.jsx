import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  User, Shield, CheckCircle, MonitorPlay, 
  Clock, PlayCircle, Loader2 
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import PendingApproval from "./PendingApproval";

export default function StudentDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyCourses = async () => {
      try {
        const { data } = await api.get("/admissions/my-courses");
        setCourses(data.data);
      } catch (err) {
        console.error("Error fetching enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (courses.length === 0) {
    return <PendingApproval />;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 font-sans bg-[#fdfdfd]">
      {/* Profile Avatar Section */}
      <div className="flex flex-col items-center justify-center py-6">
        <div className="w-32 h-32 bg-[#76A8F8] rounded-full flex items-center justify-center text-white shadow-sm border-[6px] border-white ring-1 ring-slate-200">
          <User size={64} />
        </div>
        <div className="flex gap-4 mt-3 text-sm text-[#2563EB] font-bold">
          <button className="hover:underline">Update Profile</button>
          <button className="hover:underline">Update Profile Image</button>
        </div>
      </div>

      <div className="px-4 max-w-4xl mx-auto space-y-6">
        {/* Banner Alert */}
        <div className="bg-[#84cc16] p-4 rounded-xl shadow-sm border border-[#65a30d]">
          <p className="text-red-700 font-bold text-[13px] leading-tight mb-2">
            Dear Candidate, The Free access to the portal has been extended till your placements. Please continue your learning without any interruptions. Happy Learning!
          </p>
          <div className="bg-[#9333ea] p-3 rounded-lg text-white font-bold text-xs leading-relaxed">
            IMPORTANT NOTE: If you fail to complete the required modules and assignments within the stipulated timeframe, your access might be restricted. Kindly focus on your curriculum. We have added a lot of new topics that might interest you. Please go to the learning path section and click the link to join new sessions.
          </div>
        </div>

        <button className="w-full bg-[#3b82f6] hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl text-sm transition shadow-sm">
          SUBMIT YOUR PLACEMENT DETAILS FOR PLACEMENT
        </button>

        <p className="text-center text-sm text-slate-600">
          Your profile isn't verified yet. So you are not allowed to edit the details. <span className="text-red-500 font-bold cursor-pointer hover:underline">VERIFY PROFILE NOW</span>
        </p>

        {/* Welcome Text and Badges */}
        <div className="text-center pt-2">
          <h1 className="text-2xl font-bold text-slate-800 mb-3">Welcome {user?.name || "Student"}</h1>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-[#e2e8f0] border border-[#cbd5e1] text-slate-700 text-xs font-bold rounded">
              Reg No: {user?.studentId || "1210411032"}
            </span>
            <span className="px-3 py-1 bg-[#22c55e] text-white text-xs font-bold rounded">
              Branch: {user?.courseDomain || "IT"}
            </span>
            <span className="px-3 py-1 bg-[#3b82f6] text-white text-xs font-bold rounded">
              Designation: Student
            </span>
          </div>
        </div>

        {/* Champion Box */}
        <div className="bg-[#fefce8] border border-[#fef08a] p-5 rounded-xl relative">
          <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2 text-red-500 font-bold text-lg mb-1">
                <Shield size={20} fill="currentColor" /> Team Champion
              </div>
              <p className="text-red-500 text-xs font-semibold cursor-pointer hover:underline">Know Your Benefits</p>
            </div>
            <select className="border border-slate-300 rounded-md px-3 py-1.5 text-sm bg-white font-medium text-slate-700 outline-none">
              <option>Cohort 1</option>
            </select>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <button className="flex-1 bg-[#fee2e2] border border-[#fca5a5] text-red-600 font-bold py-2.5 rounded text-sm hover:bg-red-200 transition">
              JOIN OUR TELEGRAM
            </button>
            <button className="flex-1 bg-[#dcfce7] border border-[#86efac] text-green-700 font-bold py-2.5 rounded text-sm hover:bg-green-200 transition">
              JOIN OUR WHATSAPP
            </button>
          </div>
        </div>

        {/* Instructions Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#fffbeb] border border-[#fde68a] p-6 rounded-xl">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Important instructions & Test details</h3>
            <ul className="list-disc list-inside text-xs space-y-2 text-slate-700 font-medium">
              <li>It is strictly advised to complete your assignments and assessments within the given timeframe.</li>
              <li>Please keep track of your progress on a weekly basis.</li>
              <li>For any technical issues during an assessment, take a screenshot immediately.</li>
              <li>Make sure you have an active internet connection before starting any live test.</li>
              <li>Plagiarism in assignments will lead to strict disciplinary actions.</li>
            </ul>
          </div>
          <div className="bg-[#f0fdf4] border border-[#bbf7d0] p-6 rounded-xl">
            <h3 className="font-bold text-slate-800 text-sm mb-3">Test details and instructions</h3>
            <ul className="list-disc list-inside text-xs space-y-2 text-slate-700 font-medium">
              <li>Do not refresh the page while attempting an online assessment.</li>
              <li>Clicking out of the exam window will be counted as a violation.</li>
              <li>Keep your webcam active if proctoring is enabled.</li>
              <li>Ensure your system time is accurate to prevent auto-submission errors.</li>
              <li>Submit your answers before the countdown timer hits zero.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12 space-y-10">
        
        {/* My Courses */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-slate-800 text-lg mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-purple-100 text-purple-600 flex items-center justify-center">
              <MonitorPlay size={14} />
            </span>
            My Courses
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {courses.slice(0, 4).map((course, i) => (
              <div key={course._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="h-28 bg-gradient-to-br from-purple-500 to-indigo-600 p-4 flex items-end">
                  <h3 className="text-white font-bold text-lg leading-tight">{course.title}</h3>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center text-xs text-slate-500 font-bold mb-1">
                      <span>Progress</span>
                      <span>0%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
                      <div className="bg-blue-500 h-full w-0 rounded-full"></div>
                    </div>
                  </div>
                  <Link 
                    to={`/dashboard/student/learn/${course._id}`} 
                    className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded text-center transition"
                  >
                    CONTINUE
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live tests / Assessments */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-slate-800 text-lg mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-pink-100 text-pink-600 flex items-center justify-center">
              <CheckCircle size={14} />
            </span>
            Live tests / Hacker / Skill assessments
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {/* Mock Test 1 */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="h-24 bg-gradient-to-r from-blue-400 to-indigo-500 flex items-center px-4">
                <h3 className="text-white font-bold text-lg">Module Test</h3>
              </div>
              <div className="p-4 text-center">
                <p className="text-xs text-slate-500 font-semibold mb-3 border-b pb-3">Available from 10:00 AM</p>
                <button className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded transition">
                  TAKE TEST
                </button>
              </div>
            </div>
            {/* Mock Test 2 */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="h-24 bg-gradient-to-r from-pink-500 to-rose-500 flex items-center px-4">
                <h3 className="text-white font-bold text-lg">Pre-Assessment</h3>
              </div>
              <div className="p-4 text-center">
                <p className="text-xs text-slate-500 font-semibold mb-3 border-b pb-3">Starts Tomorrow</p>
                <button className="w-full py-2 bg-slate-100 text-slate-400 text-xs font-bold rounded cursor-not-allowed">
                  UPCOMING
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Learning Paths */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h2 className="font-bold text-slate-800 text-lg mb-5 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-600 flex items-center justify-center">
              <PlayCircle size={14} />
            </span>
            Learning paths / Bootcamps / Programs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {courses.slice(1, 5).map((course, i) => {
              const bgGradients = [
                "from-red-500 to-pink-500",
                "from-purple-600 to-indigo-600",
                "from-blue-600 to-cyan-500",
                "from-green-500 to-emerald-600"
              ];
              return (
                <div key={course._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                  <div className={`h-28 bg-gradient-to-br ${bgGradients[i % 4]} p-4 flex flex-col justify-end`}>
                    <h3 className="text-white font-bold text-lg leading-tight">{course.title}</h3>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-slate-500 font-semibold mb-3 border-b pb-3">{course.category}</p>
                    <Link 
                      to={`/dashboard/student/learn/${course._id}`} 
                      className="block w-full py-2 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold rounded text-center transition"
                    >
                      EXPLORE
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-slate-800 text-slate-300 mt-16 pt-12 pb-8 px-4 rounded-t-3xl">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-3 font-bold text-white text-lg mb-4">
              <img src="/logo.jpg" alt="Logo" className="w-8 h-8 rounded-full object-cover" />
              Forge India Connect
            </div>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Empowering students with industry-relevant skills and practical knowledge to build successful careers in technology.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">About Us</a></li>
              <li><a href="#" className="hover:text-white transition">Careers</a></li>
              <li><a href="#" className="hover:text-white transition">Contact Support</a></li>
              <li><a href="#" className="hover:text-white transition">Help Center</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Refund Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-12 pt-8 border-t border-slate-700 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Forge India Connect. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
