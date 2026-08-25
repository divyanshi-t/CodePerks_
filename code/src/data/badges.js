// Badges & Achievements Data for CodePerks
export const initialBadges = [
  {
    id: 'badge_first_blood',
    name: 'First Blood',
    description: 'Successfully solve your very first coding challenge on CodePerks.',
    icon: '⚡',
    category: 'milestone',
    type: 'solved_count',
    requiredValue: 1,
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 'badge_problem_solver',
    name: 'Problem Solver',
    description: 'Solve 5 different algorithmic coding challenges.',
    icon: '🧩',
    category: 'milestone',
    type: 'solved_count',
    requiredValue: 5,
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'badge_streak_5',
    name: '5-Day Streak',
    description: 'Maintain a continuous coding streak for 5 consecutive days.',
    icon: '🔥',
    category: 'streak',
    type: 'streak',
    requiredValue: 5,
    color: 'from-orange-500 to-red-500'
  },
  {
    id: 'badge_streak_7',
    name: '7-Day Master Streak',
    description: 'Achieve a full week unbroken 7-day coding streak.',
    icon: '🏆',
    category: 'streak',
    type: 'streak',
    requiredValue: 7,
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'badge_ten_solved',
    name: '10 Challenges Completed',
    description: 'Solve 10 algorithm and data structures challenges.',
    icon: '🎯',
    category: 'milestone',
    type: 'solved_count',
    requiredValue: 10,
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 'badge_points_500',
    name: '500 Skill Points Club',
    description: 'Accumulate 500+ total skill points from verified submissions.',
    icon: '💎',
    category: 'points',
    type: 'skill_points',
    requiredValue: 500,
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'badge_top_performer',
    name: 'Top Performer',
    description: 'Reach 800+ skill points and enter the elite campus coder league.',
    icon: '👑',
    category: 'rank',
    type: 'skill_points',
    requiredValue: 800,
    color: 'from-yellow-400 to-amber-600'
  },
  {
    id: 'badge_century_solved',
    name: 'Algorithmic Virtuoso',
    description: 'Solve 25+ problems and achieve 1000+ points.',
    icon: '🚀',
    category: 'master',
    type: 'solved_count',
    requiredValue: 25,
    color: 'from-fuchsia-500 to-purple-700'
  }
];
