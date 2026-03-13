import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import API from '../api/axios';

export default function KycStatus() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/api/kyc/status');
        setApplication(data);
      } catch {
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Application Status</h1>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : !application ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500">No application found.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-gray-900">Latest Application</h2>
              <StatusBadge status={application.status} />
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Name</span>
                <span className="font-medium">{application.name}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-500">Submitted</span>
                <span className="font-medium">{new Date(application.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Status</span>
                <StatusBadge status={application.status} />
              </div>
            </div>

            {application.status === 'rejected' && application.adminComment && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm font-medium text-red-700 mb-1">Rejection Reason</p>
                <p className="text-sm text-red-600">{application.adminComment}</p>
              </div>
            )}

            {application.status === 'approved' && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-700">
                  ✅ Your KYC has been verified successfully!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}