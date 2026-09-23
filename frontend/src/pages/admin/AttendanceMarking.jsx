import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Search,
  Calendar,
  Users,
  Save,
  ChevronLeft,
} from "lucide-react";
import api from "../../utils/api";
export default function AttendanceMarking() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const { data } = await api.get("/courses");
        setCourses(data.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      }
    };
    fetchCourses();
  }, []);
  const handleCourseChange = async (courseId) => {
    setSelectedCourse(courseId);
    setLoading(true);
    try {
      const { data } = await api.get("/admissions/all");
      const enrolledStudents = data.data
        .filter(
          (app) => app.course?._id === courseId && app.status === "approved",
        )
        .map((app) => app.student);
      setStudents(enrolledStudents);
      const initialAttendance = {};
      enrolledStudents.forEach((s) => {
        initialAttendance[s._id] = "present";
      });
      setAttendance(initialAttendance);
    } catch (err) {
      console.error("Error fetching students:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({ ...prev, [studentId]: status }));
  };
  const handleSave = async () => {
    try {
      const attendanceData = Object.entries(attendance).map(
        ([studentId, status]) => ({ studentId, status }),
      );
      await api.post("/attendance/mark", {
        courseId: selectedCourse,
        date,
        attendanceData,
      });
      alert("Attendance marked successfully!");
    } catch (err) {
      alert("Error marking attendance");
    }
  };
  return (
    <div className="space-y-8">
      {" "}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        {" "}
        <div>
          {" "}
          <h1 className="text-3xl font-bold text-slate-900 font-display">
            Mark Attendance
          </h1>{" "}
          <p className="text-slate-500">
            Daily presence tracking for your batches.
          </p>{" "}
        </div>{" "}
        <div className="flex items-center gap-4">
          {" "}
          <div className="relative">
            {" "}
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />{" "}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
            />{" "}
          </div>{" "}
          <button
            onClick={handleSave}
            disabled={!selectedCourse || students.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-600/20 disabled:opacity-50"
          >
            {" "}
            <Save size={20} /> Save Attendance{" "}
          </button>{" "}
        </div>{" "}
      </div>{" "}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {" "}
        {/* Course Sidebar */}{" "}
        <div className="lg:col-span-1 space-y-4">
          {" "}
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">
            Select Course
          </h3>{" "}
          <div className="space-y-2">
            {" "}
            {courses.map((course) => (
              <button
                key={course._id}
                onClick={() => handleCourseChange(course._id)}
                className={`w-full text-left p-4 rounded-2xl border transition ${selectedCourse === course._id ? "bg-primary-50 border-primary-500 text-primary-600" : "bg-white border-slate-100 text-slate-600 hover:border-primary-300"}`}
              >
                {" "}
                <p className="font-bold text-sm truncate">
                  {course.title}
                </p>{" "}
                <p className="text-[10px] mt-1 uppercase tracking-tighter opacity-70">
                  {course.category}
                </p>{" "}
              </button>
            ))}{" "}
          </div>{" "}
        </div>{" "}
        {/* Student List */}{" "}
        <div className="lg:col-span-3">
          {" "}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            {" "}
            {!selectedCourse ? (
              <div className="py-20 text-center">
                {" "}
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  {" "}
                  <Users size={32} />{" "}
                </div>{" "}
                <h3 className="text-lg font-bold">
                  Select a course to mark attendance
                </h3>{" "}
                <p className="text-sm text-slate-500">
                  Pick a batch from the sidebar to see students.
                </p>{" "}
              </div>
            ) : loading ? (
              <div className="py-20 text-center">
                {" "}
                <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>{" "}
              </div>
            ) : students.length === 0 ? (
              <div className="py-20 text-center text-slate-500">
                No students enrolled in this course.
              </div>
            ) : (
              <div className="overflow-x-auto">
                {" "}
                <table className="w-full text-left">
                  {" "}
                  <thead>
                    {" "}
                    <tr className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50">
                      {" "}
                      <th className="px-6 py-4">Student</th>{" "}
                      <th className="px-6 py-4">Status</th>{" "}
                      <th className="px-6 py-4 text-right">
                        Quick Action
                      </th>{" "}
                    </tr>{" "}
                  </thead>{" "}
                  <tbody className="divide-y divide-slate-100">
                    {" "}
                    {students.map((student) => (
                      <tr
                        key={student._id}
                        className="hover:bg-slate-50 transition"
                      >
                        {" "}
                        <td className="px-6 py-4">
                          {" "}
                          <div className="flex items-center gap-3">
                            {" "}
                            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                              {" "}
                              {student.name.charAt(0)}{" "}
                            </div>{" "}
                            <div>
                              {" "}
                              <p className="text-sm font-bold text-slate-900">
                                {student.name}
                              </p>{" "}
                              <p className="text-[10px] text-slate-500">
                                {student.email}
                              </p>{" "}
                            </div>{" "}
                          </div>{" "}
                        </td>{" "}
                        <td className="px-6 py-4">
                          {" "}
                          <div className="flex items-center gap-2">
                            {" "}
                            {["present", "absent", "late"].map((status) => (
                              <button
                                key={status}
                                onClick={() =>
                                  handleStatusChange(student._id, status)
                                }
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition ${attendance[student._id] === status ? (status === "present" ? "bg-green-600 text-white" : status === "absent" ? "bg-red-600 text-white" : "bg-orange-500 text-white") : "bg-slate-100 text-slate-400"}`}
                              >
                                {" "}
                                {status}{" "}
                              </button>
                            ))}{" "}
                          </div>{" "}
                        </td>{" "}
                        <td className="px-6 py-4 text-right">
                          {" "}
                          <div className="flex items-center justify-end gap-2">
                            {" "}
                            <button
                              onClick={() =>
                                handleStatusChange(student._id, "present")
                              }
                              className={`p-2 rounded-lg transition ${attendance[student._id] === "present" ? "text-green-500 bg-green-50 " : "text-slate-300"}`}
                            >
                              {" "}
                              <CheckCircle size={20} />{" "}
                            </button>{" "}
                            <button
                              onClick={() =>
                                handleStatusChange(student._id, "absent")
                              }
                              className={`p-2 rounded-lg transition ${attendance[student._id] === "absent" ? "text-red-500 bg-red-50 " : "text-slate-300"}`}
                            >
                              {" "}
                              <XCircle size={20} />{" "}
                            </button>{" "}
                          </div>{" "}
                        </td>{" "}
                      </tr>
                    ))}{" "}
                  </tbody>{" "}
                </table>{" "}
              </div>
            )}{" "}
          </div>{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
