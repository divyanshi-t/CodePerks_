// Notifications initial seed data
export const initialNotifications = [
  {
    id: 'notif_01',
    userId: 'usr_student_1',
    title: '5-Day Streak Achieved! 🔥',
    message: 'Awesome consistency! You have maintained a 5-day daily coding streak. Keep the momentum going!',
    type: 'streak',
    read: false,
    createdAt: '2025-08-24 09:00',
    link: '/student/progress'
  },
  {
    id: 'notif_02',
    userId: 'usr_student_1',
    title: 'Badge Unlocked: Problem Solver 🧩',
    message: 'Congratulations! You solved 5 coding challenges and unlocked the Problem Solver badge.',
    type: 'badge',
    read: false,
    createdAt: '2025-08-23 19:16',
    link: '/student/badges'
  },
  {
    id: 'notif_03',
    userId: 'usr_student_1',
    title: 'New Challenge Added: Fibonacci Generator',
    message: 'Dr. Sarah Sharma published a new Basic Programming challenge worth 30 points.',
    type: 'challenge',
    read: true,
    createdAt: '2025-08-20 14:00',
    link: '/student/challenges'
  },
  {
    id: 'notif_04',
    userId: 'usr_student_1',
    title: 'Rank Promotion: You are now Rank #4 🏆',
    message: 'Your recent problem submissions helped you climb to Rank 4 on the campus leaderboard!',
    type: 'rank',
    read: true,
    createdAt: '2025-08-22 17:30',
    link: '/student/leaderboard'
  }
];
