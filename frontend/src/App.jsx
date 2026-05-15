import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { setTheme } from "./store/slices/uiSlice";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./components/layout/DashboardLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCourseManagement from "./pages/admin/AdminCourseManagement";
import HRDashboard from "./pages/admin/HRDashboard";
import AttendanceMarking from "./pages/admin/AttendanceMarking";
import StudentDashboard from "./pages/student/StudentDashboard";
import AdmissionForm from "./pages/student/AdmissionForm";
import PublicEnrollment from "./pages/student/PublicEnrollment";
import MyApplications from "./pages/student/MyApplications";
import StudentMyCourses from "./pages/student/StudentMyCourses";
import StudentCourseViewer from "./pages/student/StudentCourseViewer";
import TrainerDashboard from "./pages/trainer/TrainerDashboard";
import TrainerCourses from "./pages/trainer/TrainerCourses";
import TrainerCourseManager from "./pages/trainer/TrainerCourseManager";
import Discussions from "./pages/trainer/Discussions";
import Reviews from "./pages/trainer/Reviews";
import Achievements from "./pages/trainer/Achievements";
import TrainerStudents from "./pages/trainer/TrainerStudents";
import CourseCatalog from "./pages/courses/CourseCatalog";
import CourseDetail from "./pages/courses/CourseDetail";
import Assignments from "./pages/common/Assignments";
import UserManagement from "./pages/admin/UserManagement";
import AllBookings from "./pages/admin/AllBookings";
import Settings from "./pages/common/Settings";
import { Toaster } from 'react-hot-toast';
import NotFound from "./pages/NotFound";
import AdminLayout from "./components/admin/AdminLayout";
import AdminOverview from "./pages/admin/AdminOverview";
import AdminStudents from "./pages/admin/AdminStudents";
import AdminTrainers from "./pages/admin/AdminTrainers";
import AdminEnrollments from "./pages/admin/AdminEnrollments";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminEnquiries from "./pages/admin/AdminEnquiries";
import AdminReports from "./pages/admin/AdminReports";
import AdminSettings from "./pages/admin/AdminSettings";
import PlaceholderPage from "./pages/admin/PlaceholderPage";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

const DashboardOverview = () => {
  const { user } = useSelector((state) => state.auth);
  
  if (user?.role === 'admin') return <AdminDashboard />;
  if (user?.role === 'student') return <StudentDashboard />;
  if (user?.role === 'hr') return <HRDashboard />;
  if (user?.role === 'trainer') return <TrainerDashboard />;
  return <div>Dashboard Overview</div>;
};

function App() {
  const { theme } = useSelector((state) => state.ui);

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Triggering HMR
  return (
    <>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#334155',
            borderRadius: '16px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          },
        }} 
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:id" element={<CourseDetail />} />
        <Route path="/enroll" element={<PublicEnrollment />} />

        {/* Admin Dashboard Routes (Standalone Layout) */}
        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminOverview />} />
          <Route path="students" element={<AdminStudents />} />
          <Route path="courses" element={<AdminCourseManagement />} />
          <Route path="trainers" element={<AdminTrainers />} />
          <Route path="enrollments" element={<AdminEnrollments />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="users" element={<UserManagement />} />
        </Route>

        {/* Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="overview" />} />



          <Route
            path="attendance"
            element={
              <ProtectedRoute allowedRoles={["admin", "hr", "trainer"]}>
                <AttendanceMarking />
              </ProtectedRoute>
            }
          />

          {/* Trainer Routes */}
          <Route
            path="trainer"
            element={
              <ProtectedRoute allowedRoles={["trainer"]}>
                <TrainerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="trainer/courses"
            element={
              <ProtectedRoute allowedRoles={["trainer"]}>
                <TrainerCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="trainer/courses/:id"
            element={
              <ProtectedRoute allowedRoles={["trainer"]}>
                <TrainerCourseManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="discussions"
            element={
              <ProtectedRoute allowedRoles={["trainer"]}>
                <Discussions />
              </ProtectedRoute>
            }
          />
          <Route
            path="reviews"
            element={
              <ProtectedRoute allowedRoles={["trainer"]}>
                <Reviews />
              </ProtectedRoute>
            }
          />
          <Route
            path="achievements"
            element={
              <ProtectedRoute allowedRoles={["trainer"]}>
                <Achievements />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/students"
            element={
              <ProtectedRoute allowedRoles={["trainer"]}>
                <TrainerStudents />
              </ProtectedRoute>
            }
          />

          {/* Student Routes */}
          <Route
            path="student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="student/courses"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentMyCourses />
              </ProtectedRoute>
            }
          />
          <Route
            path="student/learn/:id"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentCourseViewer />
              </ProtectedRoute>
            }
          />
          <Route
            path="student/apply/:courseId?"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <AdmissionForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="student/applications"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <MyApplications />
              </ProtectedRoute>
            }
          />



          {/* Common Routes */}
          <Route path="assignments" element={<Assignments />} />
          <Route path="settings" element={<Settings />} />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="profile" element={<div>User Profile</div>} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
