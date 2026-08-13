import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Register from "../pages/Register/Register";
import Login from "../pages/Login/Login";
import AdminLogin from "../pages/AdminLogin/AdminLogin";

import Landing from "../pages/Landing/Landing";
import CollegeSelection from "../pages/CollegeSelection/CollegeSelection";
import RoleSelection from "../pages/RoleSelection/RoleSelection";

import StudentDashboard from "../pages/StudentDashboard/StudentDashboard";
import Profile from "../pages/Profile/Profile";
import Companies from "../pages/Companies/Companies";
import Announcements from "../pages/Announcements/Announcements";
import AIDashboard from "../pages/AI/AIDashboard";
import Tickets from "../pages/Tickets/Tickets";
import ResumeUpload from "../pages/Resume/ResumeUpload";
import ApplicationPage from "../pages/Companies/ApplicationPage";

import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
import AdminCompanies from "../pages/AdminCompanies/AdminCompanies";
import AdminAnnouncements from "../pages/AdminAnnouncements/AdminAnnouncements";
import AdminProfile from "../pages/AdminProfile/AdminProfile";
import AdminQueries from "../pages/AdminQueries/AdminQueries";

import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import AdminProtectedRoute from "../components/AdminProtectedRoute/AdminProtectedRoute";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ========================= */}
        {/* PUBLIC PLACEWISE ROUTES */}
        {/* ========================= */}

        <Route path="/" element={<CollegeSelection />} />

        <Route path="/landing" element={<Landing />} />

        <Route
          path="/role-selection"
          element={<RoleSelection />}
        />


        {/* ========================= */}
        {/* STUDENT AUTH ROUTES */}
        {/* ========================= */}

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/login"
          element={<Login />}
        />


        {/* ========================= */}
        {/* STUDENT PROTECTED ROUTES */}
        {/* ========================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/companies"
          element={
            <ProtectedRoute>
              <Companies />
            </ProtectedRoute>
          }
        />

        <Route
          path="/apply/:companyId"
          element={
            <ProtectedRoute>
              <ApplicationPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/resume"
          element={
            <ProtectedRoute>
              <ResumeUpload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-dashboard"
          element={
            <ProtectedRoute>
              <AIDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets"
          element={
            <ProtectedRoute>
              <Tickets />
            </ProtectedRoute>
          }
        />

        <Route
          path="/announcements"
          element={
            <ProtectedRoute>
              <Announcements />
            </ProtectedRoute>
          }
        />


        {/* ========================= */}
        {/* ADMIN AUTH ROUTE */}
        {/* ========================= */}

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/admin/register"
          element={<Navigate to="/admin/login" replace />}
        />

        {/* ========================= */}
        {/* ADMIN PROTECTED ROUTE */}
        {/* ========================= */}

        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/companies"
          element={
            <AdminProtectedRoute>
              <AdminCompanies />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/announcements"
          element={
            <AdminProtectedRoute>
              <AdminAnnouncements />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/profile"
          element={
            <AdminProtectedRoute>
              <AdminProfile />
            </AdminProtectedRoute>
          }
        />

        <Route
          path="/admin/queries"
          element={
            <AdminProtectedRoute>
              <AdminQueries />
            </AdminProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
