import React, { useState, useEffect } from 'react';
import { BadgeCard } from '../../components/BadgeCard';
import { getBadges, getCurrentUser } from '../../utils/localStorage';

export const Badges = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [badges, setBadgesList] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setUser(getCurrentUser());
    setBadgesList(getBadges());
  }, []);

  if (!user) return null;

  const unlockedBadgeIds = new Set(user.unlockedBadges || []);

  const calculateBadgeProgress = (badge) => {
    let current = 0;
    let target = badge.requiredValue;

    if (badge.type === 'solved_count') {
      current = user.solvedCount || 0;
    } else if (badge.type === 'streak') {
      current = user.streak || 0;
    } else if (badge.type === 'skill_points') {
      current = user.skillPoints || 0;
    }

    const percent = Math.min(100, Math.round((current / target) * 100));
    return {
      current: Math.min(current, target),
      target,
      percent
    };
  };

  const filteredBadges = badges.filter((b) => {
    const isUnlocked = unlockedBadgeIds.has(b.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  const unlockedCount = badges.filter(b => unlockedBadgeIds.has(b.id)).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Badges & Achievements
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Earn milestone badges by solving challenges and maintaining your coding streak.
          </p>
        </div>

        <div className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded text-gray-600">
          <span>Unlocked: <strong className="text-green-700">{unlockedCount}</strong> / {badges.length}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 bg-white border border-gray-200 p-2 rounded-lg text-xs">
        <span className="text-gray-500 font-semibold mr-1">Filter:</span>
        {['all', 'unlocked', 'locked'].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1 rounded font-semibold capitalize transition ${
              filter === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredBadges.map((badge) => {
          const isUnlocked = unlockedBadgeIds.has(badge.id);
          const progress = calculateBadgeProgress(badge);
          return (
            <BadgeCard
              key={badge.id}
              badge={badge}
              isUnlocked={isUnlocked}
              progress={progress}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Badges;
