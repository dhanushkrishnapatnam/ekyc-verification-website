import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatusBadge from '../components/StatusBadge';
import API from '../api/axios';

export default function ApplicationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const { data } = await API.get(`/api/admin/application/${id}`);
        setApplication(data);
        if (data.adminComment) setComment(data.adminComment);
      } catch {
        setApplication(null);
      } finally {
        setLoading(false);
      }
    };
    fetchApplication();
  }, [id]);

  const handleApprove = async () => {
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await API.put(`/api/admin/approve/${id}`);
      setSuccess('Application approved successfully!');
      setApplication(data.application);
      setComment('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to approve');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!comment.trim()) {
      setError('Please add a rejection comment');
      return;
    }
    setActionLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await API.put(`/api/admin/reject/${id}`, { comment });
      setSuccess('Application rejected.');
      setApplication(data.application);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this application? This cannot be undone.')) return;
    setDeleteLoading(true);
    try {
      await API.delete(`/api/admin/application/${id}`);
      navigate('/admin/applications');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete');
      setDeleteLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-10">

        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate('/admin/applications')}
            className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            ← Back to applications
          </button>
          <button
            onClick={handleDelete}
            disabled={deleteLoading}
            className="text-sm text-red-500 hover:text-red-600 border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors disabled:opacity-40"
          >
            {deleteLoading ? 'Deleting...' : '🗑 Delete Application'}
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : !application ? (
          <div className="text-center py-20 text-gray-400">Application not found.</div>
        ) : (
          <div className="space-y-4">

            {/* Header */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-xl font-semibold text-gray-900">Application Detail</h1>
                <StatusBadge status={application.status} />
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900 mt-0.5">{application.name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="font-medium text-gray-900 mt-0.5">{application.userId?.email}</p>
                </div>
                <div>
                  <p className="text-gray-500">Date of Birth</p>
                  <p className="font-medium text-gray-900 mt-0.5">{application.dob}</p>
                </div>
                <div>
                  <p className="text-gray-500">Submitted On</p>
                  <p className="font-medium text-gray-900 mt-0.5">
                    {new Date(application.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Aadhaar Number</p>
                  <p className="font-medium text-gray-900 mt-0.5">{application.aadhaarNumber}</p>
                </div>
                <div>
                  <p className="text-gray-500">PAN Number</p>
                  <p className="font-medium text-gray-900 mt-0.5">{application.panNumber}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Uploaded Documents</h2>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Aadhaar Card</p>
                  <img src={application.aadhaarImageUrl} alt="Aadhaar"
                    className="w-full h-40 object-cover rounded-xl border border-gray-200" />
                  <a href={application.aadhaarImageUrl} target="_blank" rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                    Open full image ↗
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">PAN Card</p>
                  <img src={application.panImageUrl} alt="PAN"
                    className="w-full h-40 object-cover rounded-xl border border-gray-200" />
                  <a href={application.panImageUrl} target="_blank" rel="noreferrer"
                    className="text-xs text-blue-600 hover:underline mt-1 inline-block">
                    Open full image ↗
                  </a>
                </div>
              </div>
            </div>

            {/* Actions — always visible for admin */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h2 className="font-semibold text-gray-900 mb-1">Review Application</h2>
              <p className="text-xs text-gray-400 mb-4">
                You can change the status at any time
              </p>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                  {success}
                </div>
              )}

              {/* Current status indicator */}
              <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-2">
                <span className="text-sm text-gray-500">Current status:</span>
                <StatusBadge status={application.status} />
                {application.adminComment && (
                  <span className="text-xs text-gray-400 ml-2">
                    — "{application.adminComment}"
                  </span>
                )}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rejection Comment
                  <span className="text-gray-400 font-normal ml-1">(required only for rejection)</span>
                </label>
                <textarea
                  rows={3} value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Explain why the application is being rejected..."
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                >
                  {actionLoading ? 'Processing...' : '✓ Approve'}
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                >
                  {actionLoading ? 'Processing...' : '✗ Reject'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}