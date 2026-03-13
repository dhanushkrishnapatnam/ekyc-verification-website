import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get('/api/admin/stats');
        setStats(data);
      } catch {
        setStats(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = stats ? [
    { label: 'Total Applications', value: stats.total, color: 'bg-blue-50 text-blue-700', border: 'border-blue-200' },
    { label: 'Pending', value: stats.pending, color: 'bg-yellow-50 text-yellow-700', border: 'border-yellow-200' },
    { label: 'Approved', value: stats.approved, color: 'bg-green-50 text-green-700', border: 'border-green-200' },
    { label: 'Rejected', value: stats.rejected, color: 'bg-red-50 text-red-700', border: 'border-red-200' },
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Overview of all KYC applications</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {cards.map((card) => (
                <div
                  key={card.label}
                  className={`bg-white rounded-2xl border ${card.border} p-5`}
                >
                  <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                  <p className={`text-3xl font-semibold ${card.color.split(' ')[1]}`}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex gap-4">
                <Link
                  to="/admin/applications"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  View All Applications
                </Link>
                <Link
                  to="/admin/applications?status=pending"
                  className="bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200 text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
                >
                  Review Pending ({stats?.pending})
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}