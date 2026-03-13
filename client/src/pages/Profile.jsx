import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';

const SECURITY_QUESTIONS = [
  'What was the name of your first pet?',
  "What is your mother's maiden name?",
  'What was the name of your first school?',
  'What is your favourite movie?',
  'What city were you born in?',
];

const validatePassword = (p) =>
  /^(?=.*[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(p);

export default function Profile() {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('info');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Info form
  const [infoForm, setInfoForm] = useState({ name: '', email: '' });
  const [infoSuccess, setInfoSuccess] = useState('');
  const [infoError, setInfoError] = useState('');
  const [infoLoading, setInfoLoading] = useState(false);

  // Password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Security form
  const [securityForm, setSecurityForm] = useState({
    securityQuestion: SECURITY_QUESTIONS[0],
    securityAnswer: ''
  });
  const [securitySuccess, setSecuritySuccess] = useState('');
  const [securityError, setSecurityError] = useState('');
  const [securityLoading, setSecurityLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get('/api/auth/profile');
        setProfile(data);
        setInfoForm({ name: data.name, email: data.email });
        setSecurityForm({
          securityQuestion: data.securityQuestion || SECURITY_QUESTIONS[0],
          securityAnswer: ''
        });
      } catch {
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setInfoError('');
    setInfoSuccess('');
    setInfoLoading(true);
    try {
      const { data } = await API.put('/api/auth/profile', infoForm);
      login(data);
      setProfile(data);
      setInfoSuccess('Profile updated successfully!');
    } catch (err) {
      setInfoError(err.response?.data?.message || 'Update failed');
    } finally {
      setInfoLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!validatePassword(passwordForm.newPassword)) {
      setPasswordError('New password must be at least 8 characters with 1 number or symbol');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    setPasswordLoading(true);
    try {
      const { data } = await API.put('/api/auth/profile', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      login(data);
      setPasswordSuccess('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Password change failed');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setSecurityError('');
    setSecuritySuccess('');
    if (!securityForm.securityAnswer.trim()) {
      setSecurityError('Please provide a security answer');
      return;
    }
    setSecurityLoading(true);
    try {
      const { data } = await API.put('/api/auth/profile', securityForm);
      login(data);
      setSecuritySuccess('Security question updated successfully!');
      setSecurityForm((f) => ({ ...f, securityAnswer: '' }));
    } catch (err) {
      setSecurityError(err.response?.data?.message || 'Update failed');
    } finally {
      setSecurityLoading(false);
    }
  };

  const tabs = [
    { id: 'info', label: 'Account Info' },
    { id: 'password', label: 'Change Password' },
    { id: 'security', label: 'Security Question' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your account settings</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : (
          <>
            {/* Avatar card */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6 flex items-center gap-5">
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-blue-600 text-2xl font-semibold">
                  {profile?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">{profile?.name}</p>
                <p className="text-sm text-gray-500">{profile?.email}</p>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    profile?.role === 'admin'
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-blue-50 text-blue-700 border border-blue-200'
                  }`}>
                    {profile?.role}
                  </span>
                  <span className="text-xs text-gray-400">
                    Joined {new Date(profile?.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 text-sm py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab: Account Info */}
            {activeTab === 'info' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Update Name & Email</h2>

                {infoError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {infoError}
                  </div>
                )}
                {infoSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                    {infoSuccess}
                  </div>
                )}

                <form onSubmit={handleInfoSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text" value={infoForm.name}
                      onChange={(e) => setInfoForm((f) => ({ ...f, name: e.target.value }))}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email" value={infoForm.email}
                      onChange={(e) => setInfoForm((f) => ({ ...f, email: e.target.value }))}
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit" disabled={infoLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                  >
                    {infoLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Change Password */}
            {activeTab === 'password' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4">Change Password</h2>

                {passwordError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                    {passwordSuccess}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrent ? 'text' : 'password'}
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm((f) => ({ ...f, currentPassword: e.target.value }))}
                        placeholder="••••••••" required
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button type="button" onClick={() => setShowCurrent((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                        {showCurrent ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                    <div className="relative">
                      <input
                        type={showNew ? 'text' : 'password'}
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
                        placeholder="Min 8 chars + 1 number or symbol" required
                        className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button type="button" onClick={() => setShowNew((s) => !s)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs">
                        {showNew ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                      placeholder="••••••••" required
                      className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        passwordForm.confirmPassword && passwordForm.confirmPassword !== passwordForm.newPassword
                          ? 'border-red-400' : 'border-gray-300'
                      }`}
                    />
                    {passwordForm.confirmPassword && passwordForm.confirmPassword !== passwordForm.newPassword && (
                      <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                    )}
                  </div>

                  <button
                    type="submit" disabled={passwordLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                  >
                    {passwordLoading ? 'Changing...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}

            {/* Tab: Security Question */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-1">Security Question</h2>
                <p className="text-sm text-gray-500 mb-4">
                  This is used to recover your account if you forget your password
                </p>

                {securityError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                    {securityError}
                  </div>
                )}
                {securitySuccess && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                    {securitySuccess}
                  </div>
                )}

                <form onSubmit={handleSecuritySubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Security Question</label>
                    <select
                      value={securityForm.securityQuestion}
                      onChange={(e) => setSecurityForm((f) => ({ ...f, securityQuestion: e.target.value }))}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    >
                      {SECURITY_QUESTIONS.map((q) => (
                        <option key={q} value={q}>{q}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">New Answer</label>
                    <input
                      type="text" value={securityForm.securityAnswer}
                      onChange={(e) => setSecurityForm((f) => ({ ...f, securityAnswer: e.target.value }))}
                      placeholder="Your answer" required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit" disabled={securityLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
                  >
                    {securityLoading ? 'Saving...' : 'Update Security Question'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}