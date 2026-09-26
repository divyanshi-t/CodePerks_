import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/StatCard';
import { getUsers, getChallenges, getSubmissions, getCurrentUser } from '../../utils/localStorage';

export const FacultyDashboard = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [students, setStudents] = useState([]);
  const [challenges, setChallengesList] = useState([]);
  const [submissions, setSubmissionsList] = useState([]);

  useEffect(() => {
    setUser(getCurrentUser());
    setStudents(getUsers().filter(u => u.role === 'student'));
    setChallengesList(getChallenges());
    setSubmissionsList(getSubmissions());
  }, []);

  const totalStudents = students.length;
  const activeChallenges = challenges.filter(c => c.status === 'published').length;
  const totalSubmissions = submissions.length;

  const acceptedSubmissions = submissions.filter(s => s.status === 'Accepted');
  const completionRate = totalSubmissions > 0
    ? Math.round((acceptedSubmissions.length / totalSubmissions) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Faculty Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Welcome, {user?.name || 'Faculty Member'} — Manage challenges and oversee student performance.
          </p>
        </div>

        <Link
          to="/faculty/challenges"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition inline-block text-center"
        >
          + Add New Challenge
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={totalStudents}
          subtitle="Enrolled CSE students"
        />
        <StatCard
          title="Active Challenges"
          value={activeChallenges}
          subtitle={`${challenges.length} total challenges`}
        />
        <StatCard
          title="Total Submissions"
          value={totalSubmissions}
          subtitle="Code evaluations"
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          subtitle="Accepted solutions rate"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="border-b border-gray-100 pb-2">
          <h2 className="text-sm font-bold text-gray-900">
            Recent Student Activity
          </h2>
          <p className="text-[11px] text-gray-500">Live feed of student challenge completions</p>
        </div>

        {acceptedSubmissions.length === 0 ? (
          <p className="text-xs text-gray-400 py-4 text-center">No recent activity.</p>
        ) : (
          <div className="space-y-2 text-xs">
            {acceptedSubmissions.slice(0, 5).map((sub) => (
              <div
                key={sub.id}
                className="p-3 bg-gray-50 border border-gray-200 rounded flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="font-bold text-gray-900">{sub.userName || 'Student'}</span>
                  <span className="text-gray-600">completed</span>
                  <span className="font-semibold text-gray-900">"{sub.challengeTitle}"</span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 text-[11px]">
                    +{sub.pointsEarned || sub.score || 50} points
                  </span>
                  <span className="text-gray-400 text-[11px]">{sub.submittedAt}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">
            All Recent Submissions
          </h2>
          <Link
            to="/faculty/students"
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            View Student Roster →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">Student</th>
                <th className="py-2.5 px-4">Challenge</th>
                <th className="py-2.5 px-4">Language</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Tests Passed</th>
                <th className="py-2.5 px-4 text-right">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No submissions yet.
                  </td>
                </tr>
              ) : (
                submissions.slice(0, 6).map((sub) => (
                  <tr key={sub.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{sub.userName || 'Student'}</td>
                    <td className="py-3 px-4">{sub.challengeTitle}</td>
                    <td className="py-3 px-4 uppercase font-mono">{sub.language}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] border ${
                          sub.status === 'Accepted'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">
                      {sub.testCasesPassed} / {sub.totalTestCases}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-400">{sub.submittedAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
