const User = require('../models/User');

// Safe user object (no password)
const safeUser = (user) => {
  const obj = user.toObject ? user.toObject() : user;
  delete obj.password;
  delete obj.__v;
  return obj;
};

// @route  GET /api/users
// @access Private
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password -__v');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/users/leaderboard
// @access Private
const getLeaderboard = async (req, res) => {
  try {
    // Get all students sorted by skillPoints descending
    const students = await User.find({ role: 'student' })
      .select('-password -__v')
      .sort({ skillPoints: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/users/:id
// @access Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.params.id }).select('-password -__v');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/users/:id
// @access Private
const updateUser = async (req, res) => {
  try {
    const {
      name, bio, avatar, department, semester,
      skillPoints, streak, longestStreak,
      solvedCount, attemptedCount, accuracy,
      unlockedBadges, status
    } = req.body;

    const user = await User.findOne({ id: req.params.id });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Only update provided fields
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (department !== undefined) user.department = department;
    if (semester !== undefined) user.semester = semester;
    if (skillPoints !== undefined) user.skillPoints = skillPoints;
    if (streak !== undefined) user.streak = streak;
    if (longestStreak !== undefined) user.longestStreak = longestStreak;
    if (solvedCount !== undefined) user.solvedCount = solvedCount;
    if (attemptedCount !== undefined) user.attemptedCount = attemptedCount;
    if (accuracy !== undefined) user.accuracy = accuracy;
    if (unlockedBadges !== undefined) user.unlockedBadges = unlockedBadges;
    if (status !== undefined) user.status = status;

    const updated = await user.save();
    res.json(safeUser(updated));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers, getLeaderboard, getUserById, updateUser };
