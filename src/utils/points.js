import { getUsers, setUsers, getCurrentUser, setCurrentUser, getBadges, getNotifications, setNotifications } from './localStorage';

export const calculateLevel = (points = 0) => {
  const levels = [
    { level: 1, name: 'Novice Coder', min: 0, max: 200 },
    { level: 2, name: 'Algorithm Apprentice', min: 200, max: 500 },
    { level: 3, name: 'Code Contender', min: 500, max: 900 },
    { level: 4, name: 'Campus Champion', min: 900, max: 1400 },
    { level: 5, name: 'Master Grandmaster', min: 1400, max: 2500 }
  ];

  for (let i = 0; i < levels.length; i++) {
    const lvl = levels[i];
    if (points < lvl.max || i === levels.length - 1) {
      const currentLevelXP = points - lvl.min;
      const neededLevelXP = lvl.max - lvl.min;
      const progressPercent = Math.min(100, Math.max(0, Math.round((currentLevelXP / neededLevelXP) * 100)));
      return {
        level: lvl.level,
        title: lvl.name,
        currentPoints: points,
        min: lvl.min,
        max: lvl.max,
        progressPercent
      };
    }
  }

  return {
    level: 5,
    title: 'Master Grandmaster',
    currentPoints: points,
    min: 1400,
    max: 2500,
    progressPercent: 100
  };
};

// Calculate Leaderboard Rank for a student
export const calculateRank = (studentId, allUsers = null) => {
  const users = (allUsers || getUsers()).filter(u => u.role === 'student');
  const sorted = [...users].sort((a, b) => (b.skillPoints || 0) - (a.skillPoints || 0));
  const index = sorted.findIndex(u => u.id === studentId);
  return index !== -1 ? index + 1 : '-';
};

// Check for and unlock eligible badges
export const evaluateBadgeUnlocks = (updatedUser) => {
  const allBadges = getBadges();
  const unlockedIds = new Set(updatedUser.unlockedBadges || []);
  const newlyUnlocked = [];
  const currentNotifs = getNotifications();

  allBadges.forEach(badge => {
    if (!unlockedIds.has(badge.id)) {
      let isEligible = false;
      if (badge.type === 'solved_count' && (updatedUser.solvedCount || 0) >= badge.requiredValue) {
        isEligible = true;
      } else if (badge.type === 'streak' && (updatedUser.streak || 0) >= badge.requiredValue) {
        isEligible = true;
      } else if (badge.type === 'skill_points' && (updatedUser.skillPoints || 0) >= badge.requiredValue) {
        isEligible = true;
      }

      if (isEligible) {
        unlockedIds.add(badge.id);
        newlyUnlocked.push(badge);

        // Add Notification
        currentNotifs.unshift({
          id: `notif_${Date.now()}_${badge.id}`,
          userId: updatedUser.id,
          title: `Badge Unlocked: ${badge.name} ${badge.icon}`,
          message: `Congratulations! You fulfilled the criteria for "${badge.name}". ${badge.description}`,
          type: 'badge',
          read: false,
          createdAt: new Date().toLocaleString(),
          link: '/student/badges'
        });
      }
    }
  });

  if (newlyUnlocked.length > 0) {
    updatedUser.unlockedBadges = Array.from(unlockedIds);
    setNotifications(currentNotifs);
  }

  return { updatedUser, newlyUnlocked };
};

// Simulated Code Runner and Evaluator for Frontend
export const simulateEvaluation = (challenge, code, language, isCustomRun = false, customInput = '') => {
  // Check for simple compilation / syntax errors
  if (!code || code.trim().length < 15) {
    return {
      status: 'Compilation Error',
      score: 0,
      passedCount: 0,
      totalCount: challenge.testCases ? challenge.testCases.length : 0,
      executionTime: '0ms',
      memory: '0 MB',
      feedback: 'Compilation failed: Source code is empty or missing main logic implementation.',
      testCaseResults: []
    };
  }

  // Bracket balance check for obvious syntax errors
  let openBrackets = 0;
  for (const char of code) {
    if (char === '{' || char === '(' || char === '[') openBrackets++;
    if (char === '}' || char === ')' || char === ']') openBrackets--;
  }

  if (openBrackets !== 0) {
    return {
      status: 'Compilation Error',
      score: 0,
      passedCount: 0,
      totalCount: challenge.testCases ? challenge.testCases.length : 0,
      executionTime: '2ms',
      memory: '4.2 MB',
      feedback: 'SyntaxError: Mismatched parentheses or brackets in source code. Please verify your syntax.',
      testCaseResults: []
    };
  }

  // If custom run
  if (isCustomRun) {
    return {
      status: 'Run Successful',
      customInput,
      output: challenge.sampleOutput || 'Execution completed with return code 0.',
      executionTime: '24ms',
      memory: '12.4 MB'
    };
  }

  // Predefined evaluation logic:
  // Most valid submissions pass all or all-but-one test case based on keyword presence
  const testCases = challenge.testCases || [
    { id: 1, input: challenge.sampleInput, expectedOutput: challenge.sampleOutput, isHidden: false }
  ];

  // Simulating realistic test case runs
  const isIntentionalFailure = code.toLowerCase().includes('fail') || code.toLowerCase().includes('wrong');

  let passedCount = 0;
  const testCaseResults = testCases.map((tc, index) => {
    // If user wrote explicit fail keyword, fail some cases
    const passed = isIntentionalFailure ? index === 0 : true;
    if (passed) passedCount++;

    return {
      id: tc.id || index + 1,
      input: tc.isHidden ? '[Hidden Campus Testcase]' : tc.input,
      expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
      actualOutput: passed ? (tc.isHidden ? '[Passed]' : tc.expectedOutput) : 'Wrong Output Result',
      passed,
      isHidden: tc.isHidden,
      time: `${Math.floor(Math.random() * 20 + 5)}ms`
    };
  });

  const totalCount = testCases.length;
  const isAccepted = passedCount === totalCount;
  const status = isAccepted ? 'Accepted' : 'Wrong Answer';
  const score = isAccepted ? challenge.points : Math.floor((passedCount / totalCount) * challenge.points);
  const time = `${Math.floor(Math.random() * 35 + 10)}ms`;
  const memory = `${(Math.random() * 6 + 10).toFixed(1)} MB`;

  const feedback = isAccepted
    ? `All ${totalCount} test cases passed successfully! Code complexity is optimal.`
    : `Passed ${passedCount}/${totalCount} test cases. Failed on corner case conditions. Review boundary constraints.`;

  return {
    status,
    score,
    passedCount,
    totalCount,
    executionTime: time,
    memory,
    feedback,
    testCaseResults
  };
};
