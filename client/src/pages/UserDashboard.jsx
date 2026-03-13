import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import API from '../api/axios';

export default function UserDashboard() {
  const { user } = useAuth();
  const [application, setApplication] = useState(null);
  const [totalApplications, setTotalApplications] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statusRes, historyRes] = await Promise.all([
          API.get('/api/kyc/status').catch(() => ({ data: null })),
          API.get('/api/kyc/history').catch(() => ({ data: [] }))
        ]);
        setApplication(statusRes.data);
        setTotalApplications(historyRes.data.length);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const canSubmitNew =
    totalApplications < 3 &&
    (!application || application.status === 'approved' || application.status === 'rejected');

  const canResubmit = application && application.status === 'rejected';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Welcome, {user?.name} 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your KYC verification from here
          </p>
        </div>

        {/* Submission counter */}
        <div className="mb-6 flex items-center gap-2">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium border ${
                n <= totalApplications
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-400 border-gray-300'
              }`}
            >
              {n}
            </div>
          ))}
          <span className="text-sm text-gray-500 ml-2">
            {totalApplications}/3 applications used
          </span>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : !application ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📋</span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">No KYC application yet</h2>
            <p className="text-gray-500 text-sm mb-6">
              Submit your KYC documents to get verified
            </p>
            <Link
              to="/kyc/submit"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
            >
              Start KYC Application
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Latest Application</h2>
                <StatusBadge status={application.status} />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900 mt-0.5">{application.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-900 mt-0.5">{application.dob}</p>
                </div>
                <div>
                  <p className="text-gray-500">Aadhaar Number</p>
                  <p className="font-medium text-gray-900 mt-0.5">
                    XXXX XXXX {application.aadhaarNumber.slice(-4)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">PAN Number</p>
                  <p className="font-medium text-gray-900 mt-0.5">{application.panNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">Submitted On</p>
                  <p className="font-medium text-gray-900 mt-0.5">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {application.status === 'rejected' && application.adminComment && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm font-medium text-red-700 mb-1">Rejection Reason</p>
                  <p className="text-sm text-red-600">{application.adminComment}</p>
                </div>
              )}

              {application.status === 'approved' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-medium text-green-700">
                    ✅ Your KYC has been verified successfully!
                  </p>
                </div>
              )}

              <div className="mt-6 flex gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-2">Aadhaar Card</p>
                  <img
                    src={application.aadhaarImageUrl}
                    alt="Aadhaar"
                    className="w-40 h-24 object-cover rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-2">PAN Card</p>
                  <img
                    src={application.panImageUrl}
                    alt="PAN"
                    className="w-40 h-24 object-cover rounded-lg border border-gray-200"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3 flex-wrap">
                {canResubmit && (
                  <Link
                    to={`/kyc/submit?resubmit=${application._id}`}
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                  >
                    Resubmit Application
                  </Link>
                )}
                {canSubmitNew && application.status !== 'pending' && (
                  <Link
                    to="/kyc/submit"
                    className="inline-block bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                  >
                    + New Application
                  </Link>
                )}
                {totalApplications >= 3 && application.status !== 'pending' && !canResubmit && (
                  <p className="text-sm text-gray-400 italic">
                    Maximum of 3 submissions reached
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}