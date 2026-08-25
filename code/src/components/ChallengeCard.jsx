import React from 'react';
import { Link } from 'react-router-dom';

export const ChallengeCard = ({ challenge, isSolved = false, isAttempted = false }) => {
  const difficultyBadges = {
    Easy: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Hard: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs flex flex-col justify-between hover:border-gray-300 transition">
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-1.5">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${difficultyBadges[challenge.difficulty] || 'bg-gray-100 text-gray-700'}`}>
              {challenge.difficulty}
            </span>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-200">
              {challenge.topic}
            </span>
          </div>

          {isSolved ? (
            <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
              ✓ Solved
            </span>
          ) : isAttempted ? (
            <span className="text-[11px] font-bold text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded border border-yellow-200">
              Attempted
            </span>
          ) : null}
        </div>

        {/* Title & Description */}
        <h4 className="text-sm font-bold text-gray-900 mb-1">
          {challenge.title}
        </h4>
        <p className="text-xs text-gray-600 line-clamp-2 mb-3 leading-relaxed">
          {challenge.description}
        </p>
      </div>

      {/* Footer Info & Action */}
      <div className="pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3 text-gray-500">
          <span className="font-bold text-blue-600">{challenge.points} XP</span>
          <span>Time: {challenge.timeLimit}</span>
        </div>

        <Link
          to={`/student/challenges/${challenge.id}`}
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition"
        >
          {isSolved ? 'Review' : 'Solve'}
        </Link>
      </div>
    </div>
  );
};

export default ChallengeCard;
