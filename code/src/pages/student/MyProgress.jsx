import React, { useState, useEffect } from 'react';
import { StatCard } from '../../components/StatCard';
import { getCurrentUser, getChallenges, getSubmissions } from '../../utils/localStorage';
import { calculateRank } from '../../utils/points';

export const MyProgress = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    setUser(getCurrentUser());
    setChallenges(getChallenges().filter(c => c.status === 'published'));
    setSubmissions(getSubmissions());
  }, []);

  if (!user) return null;

  const rank = calculateRank(user.id);
  const userSubmissions = submissions.filter(s => s.userId === user.id);
  const solvedSubmissions = userSubmissions.filter(s => s.status === 'Accepted');
  const solvedChallengeIds = new Set(solvedSubmissions.map(s => s.challengeId));

  const allTopics = [
    'Arrays',
    'Strings',
    'Linked List',
    'Stack',
    'Queue',
    'Trees',
    'Searching',
    'Sorting',
    'Basic Programming'
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
      {/* Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          My Progress & Performance
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">
          Detailed metrics across curriculum topics, solve accuracy, and submission logs.
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Skill Points"
          value={`${user.skillPoints || 0} XP`}
          subtitle="Total points accumulated"
        />
        <StatCard
          title="Campus Rank"
          value={`#${rank}`}
          subtitle="Department leaderboard"
        />
        <StatCard
          title="Current Streak"
          value={`${user.streak || 0} Days`}
          subtitle={`Best: ${user.longestStreak || 12} days`}
        />
        <StatCard
          title="Accuracy"
          value={`${user.accuracy || 78}%`}
          subtitle={`${user.solvedCount || 0}/${user.attemptedCount || 0} solved`}
        />
      </div>

      {/* Topic Mastery Progress */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
        <h2 className="text-sm font-bold text-gray-900">
          Topic-wise Curriculum Coverage
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topicProgress.map(tp => (
            <div key={tp.topic} className="p-3 bg-gray-50 border border-gray-200 rounded text-xs space-y-1.5">
              <div className="flex justify-between font-semibold text-gray-800">
                <span>{tp.topic}</span>
                <span className="text-blue-600">{tp.solved} / {tp.total} ({tp.percent}%)</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded transition-all"
                  style={{ width: `${tp.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-900">
            Complete Submission History
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
              {userSubmissions.map((s) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyProgress;
