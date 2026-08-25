import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/StatCard';
import {
  getUsers,
  getChallenges,
  getRewards,
  getSubmissions,
  getRedemptions,
  getCurrentUser,
  resetToDefaults
} from '../../utils/localStorage';

export const AdminDashboard = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [users, setUsersList] = useState([]);
  const [challenges, setChallengesList] = useState([]);
  const [rewards, setRewardsList] = useState([]);
  const [submissions, setSubmissionsList] = useState([]);
  const [redemptions, setRedemptionsList] = useState([]);
  const [resetDone, setResetDone] = useState(false);

  useEffect(() => {
    setUser(getCurrentUser());
    setUsersList(getUsers());
    setChallengesList(getChallenges());
    setRewardsList(getRewards());
    setSubmissionsList(getSubmissions());
    setRedemptionsList(getRedemptions());
  }, []);

  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalFaculty = users.filter(u => u.role === 'faculty').length;
  const totalVendors = users.filter(u => u.role === 'vendor').length;
  const totalChallenges = challenges.length;
  const totalRewards = rewards.length;
  const totalSubmissions = submissions.length;

  const handleResetData = () => {
    if (window.confirm('Reset all demo data back to default values?')) {
      resetToDefaults();
      setUsersList(getUsers());
      setChallengesList(getChallenges());
      setRewardsList(getRewards());
      setSubmissionsList(getSubmissions());
      setRedemptionsList(getRedemptions());
      setResetDone(true);
      setTimeout(() => setResetDone(false), 2500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Campus platform administration, user accounts moderation, and rewards control.
          </p>
        </div>

        <button
          onClick={handleResetData}
          className="px-3.5 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded border border-gray-300 font-semibold text-xs transition"
        >
          {resetDone ? '✓ Reset Complete' : 'Reset Demo Data'}
        </button>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          title="Students"
          value={totalStudents}
          subtitle="Enrolled students"
        />
        <StatCard
          title="Faculty"
          value={totalFaculty}
          subtitle="Course professors"
        />
        <StatCard
          title="Vendors"
          value={totalVendors}
          subtitle="Partner stores"
        />
        <StatCard
          title="Challenges"
          value={totalChallenges}
          subtitle="Total problems"
        />
      </div>

      {/* 2 Main Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Users Management Quick Box */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
              <h3 className="text-sm font-bold text-gray-900">Registered Accounts</h3>
              <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                {users.length} Total
              </span>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {users.slice(0, 4).map(u => (
                <div key={u.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block">{u.name}</span>
                    <span className="text-gray-400 text-[11px]">{u.email}</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                    {u.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 mt-3">
            <Link
              to="/admin/users"
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Manage All Users →
            </Link>
          </div>
        </div>

        {/* Rewards Quick Box */}
        <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
              <h3 className="text-sm font-bold text-gray-900">Campus Rewards Catalog</h3>
              <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 text-gray-700 rounded">
                {rewards.length} Perks
              </span>
            </div>

            <div className="divide-y divide-gray-100 text-xs">
              {rewards.slice(0, 4).map(r => (
                <div key={r.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-gray-900 block">{r.name}</span>
                    <span className="text-gray-400 text-[11px]">Vendor: {r.vendor}</span>
                  </div>
                  <span className="font-bold text-blue-600">
                    {r.pointsRequired} XP
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-gray-200 mt-3">
            <Link
              to="/admin/rewards"
              className="text-xs text-blue-600 font-semibold hover:underline"
            >
              Manage Rewards Catalog →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
