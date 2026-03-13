import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/axios';

const validatePassword = (p) =>
  /^(?=.*[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(p);

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [securityQuestion, setSecurityQuestion] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFindAccount = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/api/auth/get-security-question', { email });
      setSecurityQuestion(data.securityQuestion);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Account not found');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    if (!validatePassword(newPassword)) {
      setPasswordError('Min 8 characters with at least 1 number or symbol');
      return;
    }
    setLoading(true);
    try {
      await API.post('/api/auth/reset-password', {
        email, securityAnswer, newPassword
      });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Check your answer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-xl font-bold">eK</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Reset Password</h1>
          <p className="text-gray-500 text-sm mt-1">
            {step === 1 && 'Enter your email to find your account'}
            {step === 2 && 'Answer your security question'}
            {step === 3 && 'Password reset successfully'}
          </p>
        </div>

        {step < 3 && (
          <div className="flex items-center mb-6">
            {[1, 2].map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium shrink-0 ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-400'
                }`}>{s}</div>
                <span className={`text-xs ml-2 ${step >= s ? 'text-gray-700' : 'text-gray-400'}`}>
                  {s === 1 ? 'Find account' : 'Reset password'}
                </span>
                {i === 0 && (
                  <div className={`flex-1 h-px mx-3 ${step > 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleFindAccount} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Finding account...' : 'Find Account'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-600 font-medium mb-1">Your Security Question</p>
              <p className="text-sm text-blue-900">{securityQuestion}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Answer</label>
              <input
                type="text" value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                placeholder="Enter your answer" required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setPasswordError(
                      e.target.value && !validatePassword(e.target.value)
                        ? 'Min 8 characters with at least 1 number or symbol'
                        : ''
                    );
                  }}
                  placeholder="Min 8 chars + 1 number or symbol" required
                  className={`w-full px-4 py-2.5 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    passwordError ? 'border-red-400' : 'border-gray-300'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {passwordError && <p className="text-xs text-red-500 mt-1">{passwordError}</p>}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
              type="button"
              onClick={() => { setStep(1); setError(''); setSecurityAnswer(''); setNewPassword(''); }}
              className="w-full text-sm text-gray-500 hover:text-gray-700 py-1"
            >
              ← Back
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
              <span className="text-3xl">✅</span>
            </div>
            <p className="text-gray-600 text-sm">
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
            >
              Go to Login
            </button>
          </div>
        )}

        {step < 3 && (
          <p className="text-center text-sm text-gray-500 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          </p>
        )}
      </div>
    </div>
  );
}