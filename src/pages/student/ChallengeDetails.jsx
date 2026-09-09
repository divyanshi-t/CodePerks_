import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getChallenges, getCurrentUser, getSubmissions } from '../../utils/localStorage';

export const ChallengeDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [user, setUser] = useState(getCurrentUser());
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const all = getChallenges();
    const found = all.find(c => c.id === id);
    setChallenge(found || null);
    setUser(getCurrentUser());
    setSubmissions(getSubmissions());
  }, [id]);

  if (!challenge) {
    return (
      <div className="p-8 bg-white border border-gray-200 rounded-lg text-center text-xs text-gray-500">
        <p className="font-bold text-sm text-gray-800">Challenge Not Found</p>
        <Link to="/student/challenges" className="text-blue-600 hover:underline mt-2 inline-block">
          ← Back to Challenges
        </Link>
      </div>
    );
  }

  const userSubmissions = submissions.filter(
    s => s.userId === user?.id && s.challengeId === challenge.id
  );
  const isSolved = userSubmissions.some(s => s.status === 'Accepted');

  const difficultyBadges = {
    Easy: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Hard: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <Link
          to="/student/challenges"
          className="text-xs text-blue-600 hover:underline font-semibold"
        >
          ← Back to All Challenges
        </Link>

        <button
          onClick={() => navigate(`/student/editor/${challenge.id}`)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition"
        >
          {isSolved ? 'Open Code Editor' : 'Start Challenge'}
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-6">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center space-x-2 mb-2">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded border ${difficultyBadges[challenge.difficulty]}`}>
              {challenge.difficulty}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
              {challenge.topic}
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {challenge.points} XP
            </span>
            {isSolved && (
              <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                ✓ Solved
              </span>
            )}
          </div>

          <h1 className="text-xl font-bold text-gray-900">
            {challenge.title}
          </h1>

          <div className="text-xs text-gray-500 mt-1 flex items-center space-x-3">
            <span>Author: <strong>{challenge.createdBy || 'CSE Faculty'}</strong></span>
            <span>•</span>
            <span>Time Limit: <strong>{challenge.timeLimit}</strong></span>
          </div>
        </div>

        <div className="space-y-4 text-xs text-gray-800 leading-relaxed">
          <div>
            <h3 className="font-bold text-gray-900 uppercase text-[11px] mb-1">
              Problem Description
            </h3>
            <p className="whitespace-pre-line text-gray-700">
              {challenge.description}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-1">Input Format</h4>
              <p className="text-gray-600 font-mono whitespace-pre-line">{challenge.inputFormat}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-200">
              <h4 className="font-bold text-gray-800 mb-1">Output Format</h4>
              <p className="text-gray-600 font-mono whitespace-pre-line">{challenge.outputFormat}</p>
            </div>
          </div>

          {challenge.constraints && (
            <div>
              <h4 className="font-bold text-gray-800 mb-1">Constraints:</h4>
              <pre className="bg-gray-100 p-2.5 rounded text-[11px] font-mono border border-gray-200 text-gray-800 leading-relaxed">
                {challenge.constraints}
              </pre>
            </div>
          )}

          <div>
            <h4 className="font-bold text-gray-800 mb-1">Sample 1:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <span className="text-[10px] font-semibold text-gray-500 block">Input:</span>
                <pre className="bg-gray-50 p-2.5 rounded text-xs font-mono text-gray-800 border border-gray-200">
                  {challenge.sampleInput}
                </pre>
              </div>
              <div>
                <span className="text-[10px] font-semibold text-gray-500 block">Output:</span>
                <pre className="bg-gray-50 p-2.5 rounded text-xs font-mono text-gray-800 border border-gray-200">
                  {challenge.sampleOutput}
                </pre>
              </div>
            </div>
            {challenge.explanation && (
              <p className="mt-2 text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                <strong>Explanation:</strong> {challenge.explanation}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => navigate(`/student/editor/${challenge.id}`)}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition"
          >
            Start Challenge →
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChallengeDetails;
