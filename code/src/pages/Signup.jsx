import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setCurrentUser } from '../utils/localStorage';
import { apiSignup, saveToken } from '../utils/api';

export const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    role: ''
  });

  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setServerError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full Name is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
    }

    if (!['student', 'faculty', 'vendor'].includes(formData.role)) {
      newErrors.role = 'Please select a valid role.';
    }

    if (formData.role === 'student' && !formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    if (!validateForm()) return;

    setLoading(true);
    try {
      const data = await apiSignup({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
        studentId: formData.role === 'student' ? formData.studentId.trim() : undefined
      });

      saveToken(data.token);
      setCurrentUser(data.user);
      setSuccessMsg('Account created successfully!');

      const targetRoute =
        data.user.role === 'student'
          ? '/student/dashboard'
          : data.user.role === 'faculty'
          ? '/faculty/dashboard'
          : data.user.role === 'vendor'
          ? '/vendor/dashboard'
          : '/student/dashboard';

      setTimeout(() => {
        navigate(targetRoute);
      }, 600);
    } catch (err) {
      setServerError(err.message || 'Signup failed. Please try again.');
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

          {successMsg && (
            <div className="mb-4 p-2.5 bg-green-50 border border-green-200 text-green-800 rounded text-xs text-center font-semibold">
              ✓ {successMsg}
            </div>
          )}

          {serverError && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 rounded text-xs font-semibold">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Rahul Sharma"
                className={`w-full px-3 py-2 border rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  errors.name ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="text-red-600 text-[11px] mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="user@codeperks.com"
                className={`w-full px-3 py-2 border rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  errors.email ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-600 text-[11px] mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className={`w-full px-3 py-2 border rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  errors.password ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                }`}
              />
              {errors.password && (
                <p className="text-red-600 text-[11px] mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-600 ${
                  errors.role ? 'border-red-400 bg-red-50/20 text-gray-900' : 'border-gray-300 text-gray-900'
                }`}
              >
                <option value="" disabled>Select a role</option>
                <option value="student">Student</option>
                <option value="faculty">Faculty / Teacher</option>
                <option value="vendor">Vendor</option>
              </select>
              {errors.role && (
                <p className="text-red-600 text-[11px] mt-1">{errors.role}</p>
              )}
            </div>

            {formData.role === 'student' && (
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Student ID *
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  placeholder="e.g. CS22B1045"
                  className={`w-full px-3 py-2 border rounded text-gray-900 font-mono focus:outline-hidden focus:ring-1 focus:ring-blue-600 ${
                    errors.studentId ? 'border-red-400 bg-red-50/20' : 'border-gray-300'
                  }`}
                />
                {errors.studentId && (
                  <p className="text-red-600 text-[11px] mt-1">{errors.studentId}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs transition disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center text-xs text-gray-600">
            <span>Already have an account? </span>
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
