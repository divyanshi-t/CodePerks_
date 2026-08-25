import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { initLocalStorage, getCurrentUser } from './utils/localStorage';

// Auth Pages
import Login from './pages/Login';
import Signup from './pages/Signup';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import Challenges from './pages/student/Challenges';
import ChallengeDetails from './pages/student/ChallengeDetails';
import CodeEditor from './pages/student/CodeEditor';
import SubmissionResult from './pages/student/SubmissionResult';
import Leaderboard from './pages/student/Leaderboard';
import MyProgress from './pages/student/MyProgress';
import Rewards from './pages/student/Rewards';
import MyRedemptions from './pages/student/MyRedemptions';
import StudentProfile from './pages/student/StudentProfile';
import Notifications from './pages/student/Notifications';

// Faculty Pages
import FacultyDashboard from './pages/faculty/FacultyDashboard';
import ManageChallenges from './pages/faculty/ManageChallenges';
import StudentPerformance from './pages/faculty/StudentPerformance';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageRewards from './pages/admin/ManageRewards';

// Vendor Pages
import VendorDashboard from './pages/vendor/VendorDashboard';
import ManageCoupons from './pages/vendor/ManageCoupons';

// Role-based Dashboard Layout Shell
const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Navbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
      <div className="flex flex-1 relative">
        <Sidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />
        <main className="flex-1 p-4 sm:p-6 max-w-6xl w-full mx-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Root Redirect Component
const RootRedirect = () => {
  const user = getCurrentUser();
  if (!user) return <Navigate to="/login" replace />;
  const roleRoutes = {
    student: '/student/dashboard',
    faculty: '/faculty/dashboard',
    admin: '/admin/dashboard',
    vendor: '/vendor/dashboard'
  };
  return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
};

export function App() {
  useEffect(() => {
    // Initialize seed data if not present in localStorage
    initLocalStorage();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Authentication Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<RootRedirect />} />

        {/* STUDENT ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['student']} />}>
          <Route element={<AppLayout />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/challenges" element={<Challenges />} />
            <Route path="/student/challenges/:id" element={<ChallengeDetails />} />
            <Route path="/student/editor/:id" element={<CodeEditor />} />
            <Route path="/student/submission/:id" element={<SubmissionResult />} />
            <Route path="/student/leaderboard" element={<Leaderboard />} />
            <Route path="/student/progress" element={<MyProgress />} />
            <Route path="/student/rewards" element={<Rewards />} />
            <Route path="/student/redemptions" element={<MyRedemptions />} />
            <Route path="/student/profile" element={<StudentProfile />} />
            <Route path="/student/notifications" element={<Notifications />} />
          </Route>
        </Route>

        {/* FACULTY ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['faculty']} />}>
          <Route element={<AppLayout />}>
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/faculty/challenges" element={<ManageChallenges />} />
            <Route path="/faculty/students" element={<StudentPerformance />} />
          </Route>
        </Route>

        {/* ADMIN ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AppLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<ManageUsers />} />
            <Route path="/admin/rewards" element={<ManageRewards />} />
          </Route>
        </Route>

        {/* VENDOR ROUTES */}
        <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
          <Route element={<AppLayout />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor/coupons" element={<ManageCoupons />} />
          </Route>
        </Route>

        {/* Fallback Catch-all */}
        <Route path="*" element={<RootRedirect />} />
      </Routes>
    </Router>
  );
}

export default App;
