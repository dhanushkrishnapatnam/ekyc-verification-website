import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import UserDashboard from './pages/UserDashboard';
import KycForm from './pages/KycForm';
import KycStatus from './pages/KycStatus';
import KycHistory from './pages/KycHistory';
import AdminDashboard from './pages/AdminDashboard';
import AdminApplications from './pages/AdminApplications';
import ApplicationDetail from './pages/ApplicationDetail';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
        <Route path="/kyc/submit" element={<ProtectedRoute><KycForm /></ProtectedRoute>} />
        <Route path="/kyc/status" element={<ProtectedRoute><KycStatus /></ProtectedRoute>} />
        <Route path="/kyc/history" element={<ProtectedRoute><KycHistory /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/applications" element={<ProtectedRoute adminOnly><AdminApplications /></ProtectedRoute>} />
        <Route path="/admin/application/:id" element={<ProtectedRoute adminOnly><ApplicationDetail /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}