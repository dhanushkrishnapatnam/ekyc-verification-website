import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import API from '../api/axios';

export default function KycForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const resubmitId = searchParams.get('resubmit');

  const [form, setForm] = useState({
    name: '', dob: '', aadhaarNumber: '', panNumber: ''
  });
  const [aadhaarImage, setAadhaarImage] = useState(null);
  const [panImage, setPanImage] = useState(null);
  const [aadhaarPreview, setAadhaarPreview] = useState(null);
  const [panPreview, setPanPreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!resubmitId) return;
    const fetchRejected = async () => {
      try {
        const { data } = await API.get('/api/kyc/status');
        if (data._id === resubmitId && data.status === 'rejected') {
          setForm({
            name: data.name,
            dob: data.dob,
            aadhaarNumber: data.aadhaarNumber,
            panNumber: data.panNumber
          });
          setAadhaarPreview(data.aadhaarImageUrl);
          setPanPreview(data.panImageUrl);
        }
      } catch {
        // ignore
      }
    };
    fetchRejected();
  }, [resubmitId]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    if (type === 'aadhaar') {
      setAadhaarImage(file);
      setAadhaarPreview(preview);
    } else {
      setPanImage(file);
      setPanPreview(preview);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('dob', form.dob);
      formData.append('aadhaarNumber', form.aadhaarNumber);
      formData.append('panNumber', form.panNumber);
      if (aadhaarImage) formData.append('aadhaarImage', aadhaarImage);
      if (panImage) formData.append('panImage', panImage);

      if (resubmitId) {
        await API.put(`/api/kyc/resubmit/${resubmitId}`, formData);
      } else {
        await API.post('/api/kyc/submit', formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            {resubmitId ? 'Resubmit KYC Application' : 'New KYC Application'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Fill in your details and upload your documents
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text" name="name" value={form.name}
              onChange={handleChange} placeholder="As per Aadhaar card" required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date" name="dob" value={form.dob}
              onChange={handleChange} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
            <input
              type="text" name="aadhaarNumber" value={form.aadhaarNumber}
              onChange={handleChange} placeholder="12-digit Aadhaar number"
              maxLength={12} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
            <input
              type="text" name="panNumber" value={form.panNumber}
              onChange={handleChange} placeholder="e.g. ABCDE1234F"
              maxLength={10} required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Card Image</label>
              <input
                type="file" accept="image/*"
                onChange={(e) => handleImageChange(e, 'aadhaar')}
                required={!resubmitId}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              />
              {aadhaarPreview && (
                <img src={aadhaarPreview} alt="Aadhaar preview"
                  className="mt-2 w-full h-28 object-cover rounded-lg border border-gray-200" />
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card Image</label>
              <input
                type="file" accept="image/*"
                onChange={(e) => handleImageChange(e, 'pan')}
                required={!resubmitId}
                className="w-full text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
              />
              {panPreview && (
                <img src={panPreview} alt="PAN preview"
                  className="mt-2 w-full h-28 object-cover rounded-lg border border-gray-200" />
              )}
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            {loading ? 'Submitting...' : resubmitId ? 'Resubmit Application' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}