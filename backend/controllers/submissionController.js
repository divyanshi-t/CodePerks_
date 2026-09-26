const Submission = require('../models/Submission');
const User = require('../models/User');
const Challenge = require('../models/Challenge');

// Simple simulated evaluation (no real compiler)
const simulateEvaluation = (challenge, code, language) => {
  if (!code || code.trim().length < 10) {
    return {
      status: 'Compilation Error',
      score: 0,
      passedCount: 0,
      totalCount: 1,
      executionTime: '0ms',
      memory: '0 MB',
      feedback: 'Compilation failed: Source code is empty or too short.',
      testCaseResults: []
    };
  }

  // Check for obvious unbalanced brackets
  let open = 0;
  for (const ch of code) {
    if (ch === '{' || ch === '(' || ch === '[') open++;
    if (ch === '}' || ch === ')' || ch === ']') open--;
  }
  if (open !== 0) {
    return {
      status: 'Compilation Error',
      score: 0,
      passedCount: 0,
      totalCount: 1,
      executionTime: '2ms',
      memory: '4.2 MB',
      feedback: 'SyntaxError: Mismatched brackets or parentheses.',
      testCaseResults: []
    };
  }

  const testCases = challenge.testCases && challenge.testCases.length > 0
    ? challenge.testCases
    : [{ id: 1, input: challenge.sampleInput, expectedOutput: challenge.sampleOutput, isHidden: false }];

  const isIntentionalFail = code.toLowerCase().includes('fail') || code.toLowerCase().includes('wrong');
  let passedCount = 0;
  const testCaseResults = testCases.map((tc, idx) => {
    const passed = !isIntentionalFail;
    if (passed) passedCount++;
    return {
      id: tc.id || idx + 1,
      input: tc.isHidden ? '[Hidden]' : tc.input,
      expectedOutput: tc.isHidden ? '[Hidden]' : tc.expectedOutput,
      actualOutput: passed ? (tc.isHidden ? '[Passed]' : tc.expectedOutput) : 'Wrong Output',
      passed,
      isHidden: tc.isHidden || false,
      time: `${Math.floor(Math.random() * 20 + 5)}ms`
    };
  });

  const totalCount = testCases.length;
  const isAccepted = passedCount === totalCount;
  const status = isAccepted ? 'Accepted' : 'Wrong Answer';
  const score = isAccepted ? challenge.points : Math.floor((passedCount / totalCount) * challenge.points);
  const feedback = isAccepted
    ? `All ${totalCount} test case(s) passed successfully!`
    : `Passed ${passedCount}/${totalCount} test cases. Check your logic.`;

  return {
    status,
    score,
    passedCount,
    totalCount,
    executionTime: `${Math.floor(Math.random() * 35 + 10)}ms`,
    memory: `${(Math.random() * 6 + 10).toFixed(1)} MB`,
    feedback,
    testCaseResults
  };
};

// @route  POST /api/submissions
// @access Private (student)
const createSubmission = async (req, res) => {
  try {
    const { userId, challengeId, language, code } = req.body;

    if (!userId || !challengeId || !language || !code) {
      return res.status(400).json({ message: 'Missing required fields: userId, challengeId, language, code.' });
    }

    // Fetch challenge from DB
    const challenge = await Challenge.findOne({ id: challengeId });
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found.' });
    }

    // Fetch user
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Evaluate
    const evaluation = simulateEvaluation(challenge, code, language);
    const isAccepted = evaluation.status === 'Accepted';

    // Check if user already solved this challenge (no double points)
    const existingAccepted = await Submission.findOne({
      userId,
      challengeId,
      status: 'Accepted'
    });
    const alreadySolved = !!existingAccepted;
    const pointsEarned = isAccepted && !alreadySolved ? challenge.points : 0;

    // Create submission
    const submissionId = `sub_${Date.now()}`;
    const submission = new Submission({
      id: submissionId,
      userId,
      userName: user.name,
      challengeId,
      challengeTitle: challenge.title,
      topic: challenge.topic,
      language,
      code,
      status: evaluation.status,
      score: evaluation.score,
      pointsEarned,
      testCasesPassed: evaluation.passedCount,
      totalTestCases: evaluation.totalCount,
      executionTime: evaluation.executionTime,
      memory: evaluation.memory,
      submittedAt: new Date().toLocaleString(),
      feedback: evaluation.feedback,
      testCaseResults: evaluation.testCaseResults
    });

    await submission.save();

    // Update user stats if accepted for first time
    if (isAccepted && !alreadySolved) {
      user.skillPoints = (user.skillPoints || 0) + pointsEarned;
      user.solvedCount = (user.solvedCount || 0) + 1;
      user.attemptedCount = (user.attemptedCount || 0) + 1;
      user.streak = (user.streak || 0) + 1;
    } else {
      user.attemptedCount = (user.attemptedCount || 0) + 1;
    }
    if (user.attemptedCount > 0) {
      user.accuracy = Math.round((user.solvedCount / user.attemptedCount) * 100);
    }
    await user.save();

    // Return submission + updated user info
    const updatedUserSafe = {
      id: user.id,
      name: user.name,
      skillPoints: user.skillPoints,
      solvedCount: user.solvedCount,
      attemptedCount: user.attemptedCount,
      streak: user.streak,
      accuracy: user.accuracy
    };

    res.status(201).json({ submission, updatedUser: updatedUserSafe });
  } catch (err) {
    console.error('Submission error:', err);
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/submissions
// @access Private
const getSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.find().select('-__v').sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/submissions/user/:userId
// @access Private
const getSubmissionsByUser = async (req, res) => {
  try {
    const submissions = await Submission.find({ userId: req.params.userId })
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/submissions/challenge/:challengeId
// @access Private
const getSubmissionsByChallenge = async (req, res) => {
  try {
    const submissions = await Submission.find({ challengeId: req.params.challengeId })
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/submissions/:id
// @access Private
const getSubmissionById = async (req, res) => {
  try {
    const submission = await Submission.findOne({ id: req.params.id }).select('-__v');
    if (!submission) return res.status(404).json({ message: 'Submission not found.' });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSubmission,
  getSubmissions,
  getSubmissionsByUser,
  getSubmissionsByChallenge,
  getSubmissionById
};
