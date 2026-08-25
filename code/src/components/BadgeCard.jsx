import React from 'react';

export const BadgeCard = ({
  badge,
  isUnlocked = false,
  progress = { current: 0, target: 100, percent: 0 },
}) => {
  return (
    <div
      className={`border rounded-lg p-4 shadow-xs flex flex-col justify-between ${
        isUnlocked
          ? 'bg-white border-gray-200'
          : 'bg-gray-50 border-gray-200 opacity-80'
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl">{badge.icon || '🏅'}</span>
          {isUnlocked ? (
            <span className="text-[11px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200">
              ✓ Unlocked
            </span>
          ) : (
            <span className="text-[11px] font-semibold text-gray-500 bg-gray-200 px-2 py-0.5 rounded">
              Locked
            </span>
          )}
        </div>

        <h4 className="text-sm font-bold text-gray-900 mb-1">{badge.name}</h4>
        <p className="text-xs text-gray-600 leading-relaxed mb-3">
          {badge.description}
        </p>
      </div>

      {!isUnlocked ? (
        <div className="pt-2 border-t border-gray-200 text-xs">
          <div className="flex justify-between text-[11px] text-gray-500 mb-1">
            <span>Progress</span>
            <span className="font-semibold">{progress.current} / {progress.target}</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded overflow-hidden">
            <div
              className="bg-blue-600 h-2 rounded"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="pt-2 border-t border-gray-100 text-[11px] text-green-700 font-semibold">
          Completed Milestone
        </div>
      )}
    </div>
  );
};

export default BadgeCard;
