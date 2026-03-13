import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">eK</span>
          </div>
          <span className="font-semibold text-gray-900">eKYC Portal</span>
        </div>

        <div className="flex items-center gap-6">
          {user?.role === 'admin' ? (
            <>
              <Link to="/admin" className="text-sm text-gray-600 hover:text-blue-600">Dashboard</Link>
              <Link to="/admin/applications" className="text-sm text-gray-600 hover:text-blue-600">Applications</Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="text-sm text-gray-600 hover:text-blue-600">Dashboard</Link>
              <Link to="/kyc/status" className="text-sm text-gray-600 hover:text-blue-600">Status</Link>
              <Link to="/kyc/history" className="text-sm text-gray-600 hover:text-blue-600">History</Link>
            </>
          )}

          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <span className="text-sm text-gray-500">{user?.name}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-red-500 hover:text-red-600 font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}