import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Send,
  Upload,
  User,
  Mail,
  Phone,
  Calendar,
  Book,
  Info,
} from "lucide-react";
import api from "../../utils/api";
export default function AdmissionForm() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [course, setCourse] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState(courseId || "");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    address: "",
    previousEducation: "",
    targetDomain: "",
  });
  useEffect(() => {
    if (courseId) {
      api
        .get(`/courses/${courseId}`)
        .then((res) => {
          setCourse(res.data.data);
          setSelectedCourseId(courseId);
        })
        .catch((err) => console.error(err));
    } else {
      // Fetch all courses for the dropdown
      api
        .get("/courses")
        .then((res) => setAllCourses(res.data.data))
        .catch((err) => console.error(err));
    }
  }, [courseId]);

  useEffect(() => {
    if (selectedCourseId && !courseId) {
      const found = allCourses.find(c => c._id === selectedCourseId);
      if (found) setCourse(found);
    }
  }, [selectedCourseId, allCourses]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/admissions/apply",
        { ...formData, course: selectedCourseId }
      );
      alert("Application submitted successfully!");
      navigate("/dashboard/student/applications");
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting application");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {" "}
      <div className="text-center">
        {" "}
        <h1 className="text-3xl font-bold text-slate-900 font-display">
          Admission Application
        </h1>{" "}
        <p className="text-slate-500">
          Please provide your details to apply for the course.
        </p>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {" "}
        {/* Course Summary */}{" "}
        <div className="lg:col-span-1">
          {" "}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 sticky top-28">
            {" "}
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              {" "}
              <Book className="text-primary-600" size={20} /> Enrollment
              Details{" "}
            </h3>{" "}
            {!courseId && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Select Domain / Course</label>
                <select 
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none"
                  required
                >
                  <option value="">Choose a course...</option>
                  {allCourses.map(c => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>
            )}
            {course ? (
              <div className="space-y-4">
                {" "}
                <div className="w-full h-20 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4">
                  <Book size={32} />
                </div>
                <div>
                  {" "}
                  <p className="font-bold text-sm">{course.title}</p>{" "}
                  <p className="text-xs text-slate-500">
                    {course.category}
                  </p>{" "}
                </div>{" "}
                <div className="p-4 bg-primary-50 rounded-xl">
                  {" "}
                  <div className="flex items-center gap-2 text-primary-600 text-xs font-bold uppercase">
                    {" "}
                    <Info size={14} /> Next Steps{" "}
                  </div>{" "}
                  <p className="text-[11px] text-slate-500 mt-2">
                    {" "}
                    Once you submit, our HR team will review your application for the {course.title} program.{" "}
                  </p>{" "}
                </div>{" "}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-sm text-slate-400 italic">
                  Please select a course to continue.
                </p>
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
        {/* Application Form */}{" "}
        <div className="lg:col-span-2">
          {" "}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6"
          >
            {" "}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {" "}
              <div className="col-span-2">
                {" "}
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Full Name
                </label>{" "}
                <div className="relative">
                  {" "}
                  <User
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />{" "}
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="Enter your full name"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Email Address
                </label>{" "}
                <div className="relative">
                  {" "}
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />{" "}
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="you@example.com"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Phone Number
                </label>{" "}
                <div className="relative">
                  {" "}
                  <Phone
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />{" "}
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    placeholder="+91 XXXXX XXXXX"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Date of Birth
                </label>{" "}
                <div className="relative">
                  {" "}
                  <Calendar
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />{" "}
                  <input
                    type="date"
                    required
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData({ ...formData, dateOfBirth: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  />{" "}
                </div>{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Previous Education
                </label>{" "}
                <input
                  type="text"
                  required
                  value={formData.previousEducation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      previousEducation: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g. B.Tech Computer Science"
                />{" "}
              </div>{" "}
              <div>
                {" "}
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Target Domain / Specialization
                </label>{" "}
                <input
                  type="text"
                  required
                  value={formData.targetDomain}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      targetDomain: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="e.g. Frontend, Data Science, AI"
                />{" "}
              </div>{" "}
              <div className="col-span-2">
                {" "}
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Residential Address
                </label>{" "}
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  rows="2"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-primary-500 outline-none resize-none"
                  placeholder="Enter your full address"
                ></textarea>{" "}
              </div>{" "}
            </div>{" "}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary-600 text-white font-bold rounded-2xl hover:bg-primary-700 transition shadow-lg shadow-primary-600/30 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {" "}
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  {" "}
                  Submit Application <Send size={18} />{" "}
                </>
              )}{" "}
            </button>{" "}
          </form>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
