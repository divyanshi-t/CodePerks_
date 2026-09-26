import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setCurrentUser } from '../utils/localStorage';
import { apiLogin, saveToken } from '../utils/api';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successNotice] = useState(location.state?.successMessage || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await apiLogin({ email: email.trim(), password, role });
      saveToken(data.token);
      setCurrentUser(data.user);

      if (data.user.role === 'student') navigate('/student/dashboard');
      else if (data.user.role === 'faculty') navigate('/faculty/dashboard');
      else if (data.user.role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/student/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 border border-gray-200 rounded-lg shadow-xs sm:px-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              CODEPERKS
            </h1>
            <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
              A campus coding platform that helps students practice coding, earn points, compete on leaderboards and redeem campus rewards.
            </p>
          </div>

          {successNotice && (
            <div className="mb-4 p-2.5 bg-green-50 border border-green-200 text-green-800 rounded text-xs font-semibold">
              ✓ {successNotice}
            </div>
          )}

          {error && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty / Teacher</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs transition uppercase disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'LOGIN'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
            <span>Don't have an account? </span>
            <Link to="/signup" className="text-blue-600 font-semibold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
