import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/StatCard';
import { getCurrentUser, setCurrentUser } from '../../utils/localStorage';
import { apiGetChallenges, apiGetSubmissionsByUser, apiGetLeaderboard, apiGetMe } from '../../utils/api';

export const StudentDashboard = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [challenges, setChallengesList] = useState([]);
  const [submissions, setSubmissionsList] = useState([]);
  const [rank, setRank] = useState('-');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const loadData = async () => {
      try {
        // Fetch fresh user data from backend
        const freshUser = await apiGetMe().catch(() => currentUser);
        setUser(freshUser);
        setCurrentUser(freshUser);

        // Fetch challenges, submissions, leaderboard in parallel
        const [challengesData, submissionsData, leaderboardData] = await Promise.all([
          apiGetChallenges(),
          apiGetSubmissionsByUser(freshUser.id),
          apiGetLeaderboard()
        ]);

        const published = challengesData.filter(c => c.status === 'published');
        setChallengesList(published);
        setSubmissionsList(submissionsData);

        // Calculate rank
        const idx = leaderboardData.findIndex(s => s.id === freshUser.id);
        setRank(idx !== -1 ? idx + 1 : '-');
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="py-12 text-center text-xs text-gray-400">Loading dashboard...</div>
    );
  }

  if (!user) return null;

  const userSolvedIds = new Set(
    submissions.filter(s => s.status === 'Accepted').map(s => s.challengeId)
  );

  const inProgressChallenges = challenges.filter(
    c => !userSolvedIds.has(c.id) && submissions.some(s => s.challengeId === c.id)
  );

  const completedCount = userSolvedIds.size;
  const totalCount = challenges.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getLevelInfo = (pts = 0) => {
    if (pts >= 1000) return { level: 'Level 4', name: 'Master Coder', percent: 100 };
    if (pts >= 600) return { level: 'Level 3', name: 'Advanced', percent: Math.round(((pts - 600) / 400) * 100) };
    if (pts >= 300) return { level: 'Level 2', name: 'Intermediate', percent: Math.round(((pts - 300) / 300) * 100) };
    return { level: 'Level 1', name: 'Beginner', percent: Math.round((pts / 300) * 100) };
  };

  const levelInfo = getLevelInfo(user.skillPoints || 0);

  const difficultyBadges = {
    Easy: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Hard: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Welcome, {user.name}
        </h1>
        <p className="text-xs text-gray-600 mt-1">
          Continue your coding practice, earn skill points and climb the campus leaderboard.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Skill Points"
          value={`${user.skillPoints || 0} XP`}
        />
        <StatCard
          title="Challenges Completed"
          value={`${completedCount}`}
        />
        <StatCard
          title="Current Rank"
          value={`#${rank}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">

        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-lg p-4 shadow-xs flex flex-col justify-between">
          <div className="border-b border-gray-100 pb-2 mb-3">
            <h2 className="text-sm font-bold text-gray-900">
              Continue Coding
            </h2>
            <p className="text-[11px] text-gray-500">Pick up where you left off</p>
          </div>

          {inProgressChallenges.length > 0 ? (
            <div className="space-y-2.5">
              {inProgressChallenges.slice(0, 2).map((ch) => (
                <div
                  key={ch.id}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-md flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{ch.title}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 font-semibold rounded border ${difficultyBadges[ch.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                        {ch.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-500 text-[11px]">
                      Topic: {ch.topic} • Reward: <strong className="text-blue-600">{ch.points} XP</strong>
                    </p>
                  </div>

                  <Link
                    to={`/student/editor/${ch.id}`}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs transition whitespace-nowrap"
                  >
                    Continue
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-gray-500 bg-gray-50 rounded border border-dashed border-gray-200 space-y-2">
              <p>No challenges started yet.</p>
              <Link
                to="/student/challenges"
                className="inline-block px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold"
              >
                Browse Challenges
              </Link>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg p-4 shadow-xs space-y-3.5">
          <div className="border-b border-gray-100 pb-2">
            <h2 className="text-sm font-bold text-gray-900">
              Your Progress
            </h2>
            <p className="text-[11px] text-gray-500">Track your overall problem-solving metrics</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-gray-700 mb-1">
                <span>Challenges Completed</span>
                <span className="text-blue-600">{completedCount} / {totalCount}</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between font-semibold text-gray-700 mb-1">
                <span>Coding Progress</span>
                <span className="text-gray-800">{progressPercent}%</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200">
                <div
                  className="bg-green-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="pt-1">
              <div className="flex justify-between font-semibold text-gray-700 mb-1">
                <span>Current Level: <strong className="text-gray-900">{levelInfo.level} ({levelInfo.name})</strong></span>
                <span className="text-xs text-gray-500">{user.skillPoints || 0} XP</span>
              </div>
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden border border-gray-200">
                <div
                  className="bg-indigo-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.max(5, levelInfo.percent))}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">
            Available Challenges
          </h2>
          <Link
            to="/student/challenges"
            className="text-xs text-blue-600 hover:underline font-semibold"
          >
            View All ({challenges.length}) →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">Challenge</th>
                <th className="py-2.5 px-4">Topic</th>
                <th className="py-2.5 px-4">Difficulty</th>
                <th className="py-2.5 px-4">Points</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {challenges.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400">
                    No challenges available.
                  </td>
                </tr>
              ) : (
                challenges.slice(0, 5).map((ch) => {
                  const isSolved = userSolvedIds.has(ch.id);
                  const isAttempted = submissions.some(s => s.challengeId === ch.id);

                  return (
                    <tr key={ch.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-semibold text-gray-900">
                        {ch.title}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {ch.topic}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${difficultyBadges[ch.difficulty] || 'bg-gray-100 text-gray-700'}`}>
                          {ch.difficulty}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-blue-600">
                        {ch.points} XP
                      </td>
                      <td className="py-3 px-4 text-center">
                        {isSolved ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-50 text-green-700 border border-green-200">
                            Completed ✓
                          </span>
                        ) : isAttempted ? (
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
                            In Progress
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
                            Not Started
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Link
                          to={`/student/challenges/${ch.id}`}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold inline-block transition"
                        >
                          {isSolved ? 'Review' : 'Solve'}
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

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
              {submissions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-6 text-center text-gray-400">
                    No submissions yet. Start solving challenges above!
                  </td>
                </tr>
              ) : (
                submissions.slice(0, 4).map((s) => (
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
