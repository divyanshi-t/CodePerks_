import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../utils/localStorage';
import { apiGetLeaderboard } from '../../utils/api';

export const Leaderboard = () => {
  const currentUser = getCurrentUser();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    apiGetLeaderboard()
      .then(data => setStudents(data))
      .catch(() => setError('Failed to load leaderboard. Please check that the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.studentId && s.studentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (s.rollNumber && s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="py-12 text-center text-xs text-gray-400">Loading leaderboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Student Leaderboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Rankings based on verified challenge skill points.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Current Standings ({filteredStudents.length} Students)
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or roll number..."
            className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600 w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Student ID</th>
                <th className="py-3 px-4 text-center">Problems Solved</th>
                <th className="py-3 px-4 text-right">Skill Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    {students.length === 0 ? 'No students registered yet.' : 'No students found.'}
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, idx) => {
                  const rank = idx + 1;
                  const isMe = currentUser && currentUser.id === st.id;
                  return (
                    <tr
                      key={st.id}
                      className={`transition ${
                        isMe
                          ? 'bg-blue-50/70 font-semibold text-gray-900 border-l-4 border-blue-600'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <td className="py-3.5 px-4 whitespace-nowrap font-bold text-gray-800">
                        {rank === 1 && '🥇 #1'}
                        {rank === 2 && '🥈 #2'}
                        {rank === 3 && '🥉 #3'}
                        {rank > 3 && `#${rank}`}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-900">{st.name}</span>
                          {isMe && (
                            <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.2 rounded">
                              YOU
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-600 font-mono">
                        {st.studentId || st.rollNumber || '-'}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-center font-semibold text-gray-800">
                        {st.solvedCount || 0}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right font-extrabold text-blue-600 text-sm">
                        {st.skillPoints || 0} XP
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
