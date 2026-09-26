import React, { useState, useEffect } from 'react';
import { getUsers, getCurrentUser } from '../../utils/localStorage';

export const Leaderboard = () => {
  const [students, setStudents] = useState([]);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [timeframe, setTimeframe] = useState('overall');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const all = getUsers().filter(u => u.role === 'student');
    setStudents(all);
    setCurrentUser(getCurrentUser());
  }, []);

  const getAdjustedPoints = (student) => {
    const base = student.skillPoints || 0;
    if (timeframe === 'weekly') return Math.round(base * 0.35);
    if (timeframe === 'monthly') return Math.round(base * 0.75);
    return base;
  };

  const sortedStudents = [...students]
    .map(s => ({ ...s, displayPoints: getAdjustedPoints(s) }))
    .sort((a, b) => b.displayPoints - a.displayPoints)
    .map((s, idx) => ({ ...s, rank: idx + 1 }));

  const filteredStudents = sortedStudents.filter(
    s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

        <div className="flex items-center space-x-1 bg-white border border-gray-200 p-1 rounded text-xs">
          {['overall', 'weekly', 'monthly'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded font-semibold capitalize transition ${
                timeframe === tf
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
            Current Standings ({filteredStudents.length} Students)
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search student or roll number..."
            className="px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600 w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Rank</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Department & Roll No</th>
                <th className="py-3 px-4 text-center">Problems Solved</th>
                <th className="py-3 px-4 text-center">Streak</th>
                <th className="py-3 px-4 text-right">Skill Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st) => {
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
                        {st.rank === 1 && '🥇 #1'}
                        {st.rank === 2 && '🥈 #2'}
                        {st.rank === 3 && '🥉 #3'}
                        {st.rank > 3 && `#${st.rank}`}
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

                      <td className="py-3.5 px-4 whitespace-nowrap text-gray-600">
                        {st.department} ({st.rollNumber || 'CS'})
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-center font-semibold text-gray-800">
                        {st.solvedCount || 0}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-center">
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-semibold text-[11px]">
                          {st.streak || 0} Days
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap text-right font-extrabold text-blue-600 text-sm">
                        {st.displayPoints} XP
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
