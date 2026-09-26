import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../utils/localStorage';
import { apiGetChallenges, apiGetSubmissionsByUser, apiGetLeaderboard } from '../../utils/api';

export const MyProgress = () => {
  const user = getCurrentUser();
  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [rank, setRank] = useState('-');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    const loadData = async () => {
      try {
        const [challengesData, submissionsData, leaderboardData] = await Promise.all([
          apiGetChallenges(),
          apiGetSubmissionsByUser(user.id),
          apiGetLeaderboard()
        ]);
        setChallenges(challengesData.filter(c => c.status === 'published'));
        setSubmissions(submissionsData);
        const idx = leaderboardData.findIndex(s => s.id === user.id);
        setRank(idx !== -1 ? idx + 1 : '-');
      } catch (err) {
        setError('Failed to load progress data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return <div className="py-12 text-center text-xs text-gray-400">Loading progress...</div>;
  }

  if (!user) return null;

  const solvedChallengeIds = new Set(
    submissions.filter(s => s.status === 'Accepted').map(s => s.challengeId)
  );
  const completedChallenges = solvedChallengeIds.size;
  const totalChallenges = challenges.length;
  const overallPercent = totalChallenges > 0 ? Math.round((completedChallenges / totalChallenges) * 100) : 0;

  const allTopics = [
    'Arrays', 'Strings', 'Searching', 'Sorting',
    'Linked List', 'Stack', 'Queue', 'Trees', 'Basic Programming'
  ];

  const topicProgress = allTopics.map(topic => {
    const topicChallenges = challenges.filter(c => c.topic === topic);
    const totalInTopic = topicChallenges.length;
    const solvedInTopic = topicChallenges.filter(c => solvedChallengeIds.has(c.id)).length;
    const percent = totalInTopic > 0 ? Math.round((solvedInTopic / totalInTopic) * 100) : 0;
    return { topic, total: totalInTopic, solved: solvedInTopic, percent };
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          My Progress
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Track your problem-solving metrics and curriculum topic coverage.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-gray-900">
          Overall Progress
        </h2>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-semibold">
            <span className="text-gray-700">Challenges: {completedChallenges} / {totalChallenges}</span>
            <span className="text-blue-600 font-bold">{overallPercent}% Completed</span>
          </div>

          <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden border border-gray-200">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all"
              style={{ width: `${overallPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
            <span className="text-gray-500 block text-[11px]">Skill Points</span>
            <span className="text-sm font-bold text-blue-600">{user.skillPoints || 0} XP</span>
          </div>
          <div className="p-2.5 bg-gray-50 rounded border border-gray-100">
            <span className="text-gray-500 block text-[11px]">Campus Rank</span>
            <span className="text-sm font-bold text-gray-800">#{rank}</span>
          </div>
          <div className="p-2.5 bg-gray-50 rounded border border-gray-100 col-span-2 sm:col-span-1">
            <span className="text-gray-500 block text-[11px]">Accuracy</span>
            <span className="text-sm font-bold text-green-700">{user.accuracy || 100}%</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-gray-900">
          Topic Progress
        </h2>

        <div className="space-y-3">
          {topicProgress.map(tp => (
            <div key={tp.topic} className="p-3 bg-gray-50 border border-gray-200 rounded text-xs space-y-1.5">
              <div className="flex justify-between items-center font-semibold text-gray-800">
                <span>{tp.topic}</span>
                <span className="text-blue-600 font-mono">
                  {tp.solved} / {tp.total} ({tp.percent}%)
                </span>
              </div>

              <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-2.5 rounded-full transition-all"
                  style={{ width: `${tp.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-900">
            Submission History
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">Challenge</th>
                <th className="py-2.5 px-4">Topic</th>
                <th className="py-2.5 px-4">Language</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Score</th>
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
                submissions.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{s.challengeTitle}</td>
                    <td className="py-3 px-4">{s.topic}</td>
                    <td className="py-3 px-4 uppercase font-mono">{s.language}</td>
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
                    <td className="py-3 px-4 font-bold text-blue-600">
                      {s.pointsEarned ? `+${s.pointsEarned} XP` : '0 XP'}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-400">{s.submittedAt}</td>
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

export default MyProgress;
