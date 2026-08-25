import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/StatCard';
import { getCurrentUser, getChallenges, getSubmissions } from '../../utils/localStorage';
import { calculateRank } from '../../utils/points';

export const StudentDashboard = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [challenges, setChallengesList] = useState([]);
  const [submissions, setSubmissionsList] = useState([]);
  const [rank, setRank] = useState(1);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    const ch = getChallenges().filter(c => c.status === 'published');
    setChallengesList(ch);
    const sub = getSubmissions();
    setSubmissionsList(sub);

    if (u) {
      setRank(calculateRank(u.id));
    }
  }, []);

  if (!user) return null;

  const userSubmissions = submissions.filter(s => s.userId === user.id);
  const userSolvedIds = new Set(
    userSubmissions.filter(s => s.status === 'Accepted').map(s => s.challengeId)
  );

  const difficultyBadges = {
    Easy: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Hard: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="space-y-6">
      {/* 1. Welcome Section */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Welcome, {user.name}
        </h1>
        <p className="text-xs text-gray-600 mt-1">
          Continue your coding practice and improve your skills.
        </p>
      </div>

      {/* 2. Basic Stats (Only 3 Simple Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Skill Points"
          value={`${user.skillPoints || 0} XP`}
        />
        <StatCard
          title="Challenges Completed"
          value={`${user.solvedCount || 0}`}
        />
        <StatCard
          title="Current Rank"
          value={`#${rank}`}
        />
      </div>

      {/* 3. Available Challenges Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">
            Available Challenges
          </h2>
          <Link
            to="/student/challenges"
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">Challenge</th>
                <th className="py-2.5 px-4">Difficulty</th>
                <th className="py-2.5 px-4">Points</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {challenges.slice(0, 5).map((ch) => {
                const isSolved = userSolvedIds.has(ch.id);
                return (
                  <tr key={ch.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {ch.title}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${difficultyBadges[ch.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                        {ch.difficulty}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-blue-600">
                      {ch.points} XP
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/student/challenges/${ch.id}`}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold inline-block transition"
                      >
                        {isSolved ? 'Review' : 'Start Challenge'}
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Recent Submissions Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">
            Recent Submissions
          </h2>
          <Link
            to="/student/progress"
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            Full History →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">Challenge</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {userSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-400">
                    No submissions yet. Start solving challenges above!
                  </td>
                </tr>
              ) : (
                userSubmissions.slice(0, 4).map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {s.challengeTitle}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[11px] border ${
                          s.status === 'Accepted'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-red-50 text-red-700 border-red-200'
                        }`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-blue-600">
                      {s.pointsEarned ? `+${s.pointsEarned} XP` : '0 XP'}
                    </td>
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

export default StudentDashboard;
