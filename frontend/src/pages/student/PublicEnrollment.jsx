import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  User, Mail, Phone, Calendar, MapPin, 
  GraduationCap, Briefcase, CheckCircle, ArrowRight,
  ShieldCheck, Zap, Award, Loader2
} from "lucide-react";
import api from "../../utils/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";
import toast from "react-hot-toast";

export default function PublicEnrollment() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const queryCourseId = searchParams.get("courseId") || "";
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingCourses, setFetchingCourses] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    previousEducation: "",
    targetDomain: "",
    courseId: queryCourseId
  });

  useEffect(() => {
    api.get("/courses")
      .then(res => setCourses(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setFetchingCourses(false));
  }, []);

  useEffect(() => {
    if (queryCourseId) {
      setFormData(prev => ({ ...prev, courseId: queryCourseId }));
    }
  }, [queryCourseId]);

  const [isSuccess, setIsSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.phoneNumber.length !== 10) {
      return toast.error("Phone number must be exactly 10 digits");
    }
    setLoading(true);
    try {
      // 1. Register User & Submit Admission in one go
      await api.post("/admissions/public-enroll", formData);
      
      // Enrollment & account creation successful
      setIsSuccess(true);
      toast.success("Application submitted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Enrollment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const selectedCourse = courses.find(c => c._id === formData.courseId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      {/* Left Panel: Branding & Trust */}
      <div className="lg:w-1/3 bg-primary-600 p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-white rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center mb-12">
            <img src="/logo.jpg" alt="FIC Logo" className="h-16 w-auto object-contain bg-white rounded-xl p-2" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight mb-6">
            Begin Your <span className="text-primary-200">Career Transformation</span> Today.
          </h1>
          <p className="text-primary-100 text-lg mb-10 leading-relaxed">
            Join 10,000+ students mastering industry-leading skills through our expert-led programs.
          </p>

          <div className="space-y-6">
            {[
              { icon: ShieldCheck, text: "Industry Recognized Certification", desc: "Gain credentials that top employers value globally." },
              { icon: Zap, text: "Hands-on Project Experience", desc: "Work on real-world projects with expert guidance." },
              { icon: Award, text: "100% Placement Support", desc: "Dedicated career coaching and interview preparation." }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{item.text}</h4>
                  <p className="text-xs text-primary-200 mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 pt-12 border-t border-white/20 mt-12 lg:mt-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <img key={i} className="w-8 h-8 rounded-full border-2 border-primary-600" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="" />
              ))}
            </div>
            <span className="text-xs font-medium text-primary-100">Joined by 500+ students this week</span>
          </div>
        </div>
      </div>

      {/* Right Panel: The Form */}
      <div className="flex-1 p-6 lg:p-16 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-3xl"
        >
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Student Enrollment</h2>
            <p className="text-slate-500">Fill out the form below to secure your spot in our upcoming batch.</p>
          </div>

          {isSuccess ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-12 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/50 text-center space-y-8"
            >
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600 mb-6">
                <CheckCircle size={48} />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold text-slate-900">Application Submitted!</h2>
                <p className="text-slate-500 text-lg leading-relaxed max-w-md mx-auto">
                  Thank you for your interest in FIC Learning. Your application has been received and is currently under review by our admissions team.
                </p>
                
                {/* Temporary Credentials Notice */}
                <div className="p-6 bg-primary-50/80 border border-primary-100/50 rounded-3xl max-w-md mx-auto mt-6 text-left space-y-3 shadow-inner">
                  <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <ShieldCheck className="text-primary-600" size={18} /> Student Login Credentials
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    A temporary student profile has been provisioned. Use these credentials to sign in and view your progress and courses:
                  </p>
                  <div className="space-y-1.5 font-mono text-xs mt-2 pt-2 border-t border-slate-100">
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Email Address:</span>
                      <span className="font-bold text-slate-800">{formData.email}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Password:</span>
                      <span className="font-bold text-primary-600 bg-primary-100/60 px-2 py-0.5 rounded">123456</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pt-6 flex flex-col gap-4">
                <button 
                  onClick={() => navigate('/login')}
                  className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition shadow-lg shadow-primary-600/20 flex items-center justify-center gap-2"
                >
                  Go to Login Screen <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="w-full py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition"
                >
                  Return to Home
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 lg:p-10 rounded-[32px] border border-slate-200 shadow-xl shadow-slate-200/50">
              
              {/* Step 1: Course Selection */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary-600 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold">1</div>
                  <h3 className="text-sm font-bold uppercase tracking-wider">Choose Your Domain</h3>
                </div>
                
                {fetchingCourses ? (
                  <div className="h-14 bg-slate-50 animate-pulse rounded-2xl" />
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="col-span-full">
                      <select
                        required
                        value={formData.courseId}
                        onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                        className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:border-primary-500 focus:bg-white outline-none transition font-medium text-slate-700"
                      >
                        <option value="">Select a course to enroll...</option>
                        {courses.map(c => (
                          <option key={c._id} value={c._id}>{c.title} ({c.category})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Personal Details */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-primary-600 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold">2</div>
                  <h3 className="text-sm font-bold uppercase tracking-wider">Personal Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      required
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="tel"
                      required
                      placeholder="Phone Number (10 digits)"
                      pattern="[0-9]{10}"
                      maxLength="10"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value.replace(/\D/g, '') })}
                      className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="date"
                      required
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Residential Address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Academic Details */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-primary-600 mb-2">
                  <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold">3</div>
                  <h3 className="text-sm font-bold uppercase tracking-wider">Academic & Professional</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Previous Education"
                      value={formData.previousEducation}
                      onChange={(e) => setFormData({ ...formData, previousEducation: e.target.value })}
                      className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      required
                      placeholder="Target Specialization (e.g. AI, Web)"
                      value={formData.targetDomain}
                      onChange={(e) => setFormData({ ...formData, targetDomain: e.target.value })}
                      className="w-full pl-12 pr-5 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-5 bg-primary-600 text-white font-bold rounded-[20px] hover:bg-primary-700 transition flex items-center justify-center gap-3 shadow-xl shadow-primary-600/20 active:scale-95 disabled:opacity-50 text-lg"
                >
                  {loading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>Submit Enrollment Application <ArrowRight size={22} /></>
                  )}
                </button>
                <p className="text-center text-slate-400 text-sm mt-6">
                  By submitting, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
