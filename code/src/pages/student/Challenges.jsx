import React, { useState, useEffect } from 'react';
import { ChallengeCard } from '../../components/ChallengeCard';
import { getCurrentUser } from '../../utils/localStorage';
import { apiGetChallenges, apiGetSubmissionsByUser } from '../../utils/api';

export const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = getCurrentUser();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState('points-desc');

  const topics = [
    'All', 'Arrays', 'Strings', 'Linked List', 'Stack',
    'Queue', 'Trees', 'Searching', 'Sorting', 'Basic Programming'
  ];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  useEffect(() => {
    const loadData = async () => {
      try {
        const [challengesData, submissionsData] = await Promise.all([
          apiGetChallenges(),
          user ? apiGetSubmissionsByUser(user.id) : Promise.resolve([])
        ]);
        setChallenges(challengesData.filter(c => c.status === 'published'));
        setSubmissions(submissionsData);
      } catch (err) {
        setError('Failed to load challenges. Please check that the backend is running.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const userSolvedIds = new Set(
    submissions.filter(s => s.status === 'Accepted').map(s => s.challengeId)
  );
  const userAttemptedIds = new Set(submissions.map(s => s.challengeId));

  const filteredChallenges = challenges.filter(c => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.topic.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDifficulty = selectedDifficulty === 'All' || c.difficulty === selectedDifficulty;
    const matchesTopic = selectedTopic === 'All' || c.topic === selectedTopic;

    const isSolved = userSolvedIds.has(c.id);
    const isAttempted = userAttemptedIds.has(c.id);
    const matchesStatus =
      selectedStatus === 'All' ||
      (selectedStatus === 'Completed' && isSolved) ||
      (selectedStatus === 'In Progress' && !isSolved && isAttempted) ||
      (selectedStatus === 'Not Started' && !isSolved && !isAttempted);

    return matchesSearch && matchesDifficulty && matchesTopic && matchesStatus;
  });

  const diffOrder = { Easy: 1, Medium: 2, Hard: 3 };
  const sortedChallenges = [...filteredChallenges].sort((a, b) => {
    if (sortBy === 'points-desc') return (b.points || 0) - (a.points || 0);
    if (sortBy === 'points-asc') return (a.points || 0) - (b.points || 0);
    if (sortBy === 'diff-asc') return (diffOrder[a.difficulty] || 0) - (diffOrder[b.difficulty] || 0);
    if (sortBy === 'diff-desc') return (diffOrder[b.difficulty] || 0) - (diffOrder[a.difficulty] || 0);
    return 0;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedDifficulty('All');
    setSelectedTopic('All');
    setSelectedStatus('All');
    setSortBy('points-desc');
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-gray-400">Loading challenges...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Coding Challenges
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Practice problems across curriculum topics to build your skills.
          </p>
        </div>

        <div className="text-xs text-gray-600 bg-white border border-gray-200 px-3 py-1.5 rounded">
          <span>Solved: <strong className="text-green-700">{userSolvedIds.size}</strong> / {challenges.length}</span>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2.5 text-xs">
          <div className="md:col-span-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search challenges..."
              className="w-full px-3 py-1.5 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-gray-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-600"
            >
              {topics.map(t => (
                <option key={t} value={t}>Topic: {t}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-gray-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-600"
            >
              {difficulties.map(d => (
                <option key={d} value={d}>Difficulty: {d}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-300 rounded text-gray-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-600"
            >
              <option value="points-desc">Sort: Highest Points</option>
              <option value="points-asc">Sort: Lowest Points</option>
              <option value="diff-asc">Sort: Easy to Hard</option>
              <option value="diff-desc">Sort: Hard to Easy</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 font-semibold">Status:</span>
            {['All', 'Completed', 'In Progress', 'Not Started'].map(st => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                  selectedStatus === st
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            onClick={clearFilters}
            className="text-xs text-red-600 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedChallenges.length === 0 ? (
          <div className="col-span-full p-12 bg-white border border-gray-200 rounded-lg text-center text-xs text-gray-400">
            No matching challenges found.
          </div>
        ) : (
          sortedChallenges.map(c => (
            <ChallengeCard
              key={c.id}
              challenge={c}
              isSolved={userSolvedIds.has(c.id)}
              isAttempted={userAttemptedIds.has(c.id)}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Challenges;
