import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import API from '../api/axios';

export default function KycHistory() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await API.get('/api/kyc/history');
        setApplications(data);
      } catch {
        setApplications([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Application History</h1>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
            <p className="text-gray-500">No applications found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div key={app._id} className="bg-white rounded-2xl border border-gray-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-gray-900">{app.name}</span>
                  <StatusBadge status={app.status} />
                </div>
                <div className="flex gap-6 text-sm text-gray-500">
                  <span>PAN: {app.panNumber}</span>
                  <span>Aadhaar: XXXX XXXX {app.aadhaarNumber.slice(-4)}</span>
                  <span>Submitted: {new Date(app.createdAt).toLocaleDateString()}</span>
                </div>
                {app.status === 'rejected' && app.adminComment && (
                  <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {app.adminComment}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}