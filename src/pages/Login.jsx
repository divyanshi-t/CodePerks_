import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getUsers, setCurrentUser } from '../utils/localStorage';
import { apiLogin, saveToken } from '../utils/api';

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState(location.state?.successMessage || '');
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessNotice('');

    try {
      // Try backend first
      const data = await apiLogin({ email: email.trim(), password, role });
      saveToken(data.token);
      setCurrentUser(data.user);

      if (data.user.role === 'student') navigate('/student/dashboard');
      else if (data.user.role === 'faculty') navigate('/faculty/dashboard');
      else if (data.user.role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/student/dashboard');
    } catch (backendErr) {
      // Fallback: try localStorage (demo accounts / offline)
      const users = getUsers();
      const foundUser = users.find(
        (u) =>
          u.email?.trim().toLowerCase() === email.trim().toLowerCase() &&
          u.password === password &&
          u.role === role
      );

      if (!foundUser) {
        setError(backendErr.message || 'Invalid email or password.');
        return;
      }

      if (foundUser.status === 'deactivated' || foundUser.status === 'inactive') {
        setError('This account has been deactivated.');
        return;
      }

      setCurrentUser(foundUser);

      if (foundUser.role === 'student') navigate('/student/dashboard');
      else if (foundUser.role === 'faculty') navigate('/faculty/dashboard');
      else if (foundUser.role === 'vendor') navigate('/vendor/dashboard');
      else navigate('/student/dashboard');
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

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-blue-600 hover:underline font-semibold text-[11px]"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs transition uppercase"
            >
              LOGIN
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

      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-lg border border-gray-200 text-xs space-y-3">
            <div className="flex items-center justify-between border-b border-gray-200 pb-2">
              <h3 className="font-bold text-gray-900 text-sm">Forgot Password</h3>
              <button
                onClick={() => setShowForgotModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Default demo accounts for testing:
            </p>
            <div className="bg-gray-50 p-2.5 rounded border border-gray-200 font-mono text-[11px] space-y-1">
              <p>Student: <strong>student@codeperks.com</strong> (student123)</p>
              <p>Faculty: <strong>faculty@codeperks.com</strong> (faculty123)</p>
              <p>Vendor: <strong>vendor@codeperks.com</strong> (vendor123)</p>
            </div>
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-3 py-1.5 bg-blue-600 text-white rounded font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
