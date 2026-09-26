const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, _id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// Helper: build safe user object (no password)
const safeUser = (user) => ({
  id: user.id,
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  status: user.status,
  joinedDate: user.joinedDate,
  studentId: user.studentId,
  rollNumber: user.rollNumber,
  department: user.department,
  semester: user.semester,
  bio: user.bio,
  skillPoints: user.skillPoints,
  streak: user.streak,
  longestStreak: user.longestStreak,
  solvedCount: user.solvedCount,
  attemptedCount: user.attemptedCount,
  accuracy: user.accuracy,
  unlockedBadges: user.unlockedBadges,
  designation: user.designation,
  businessName: user.businessName,
  category: user.category,
});

// @route  POST /api/auth/signup
// @access Public
const signup = async (req, res) => {
  try {
    const { name, email, password, role, studentId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    if (!['student', 'faculty', 'vendor'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Must be student, faculty, or vendor.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    // Check duplicate email
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email address already exists.' });
    }

    // Build new user
    const userId = `usr_${role}_${Date.now()}`;
    const newUser = new User({
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role,
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      skillPoints: role === 'student' ? 100 : 0,
      streak: role === 'student' ? 1 : 0,
      longestStreak: role === 'student' ? 1 : 0,
      solvedCount: 0,
      attemptedCount: 0,
      accuracy: 100,
      unlockedBadges: role === 'student' ? ['badge_first_blood'] : [],
    });

    if (role === 'student' && studentId) {
      newUser.studentId = studentId.trim();
      newUser.rollNumber = studentId.trim();
    }

    await newUser.save();

    const token = generateToken(newUser);
    return res.status(201).json({
      token,
      user: safeUser(newUser)
    });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Server error during signup.' });
  }
};

// @route  POST /api/auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({ message: 'Please provide email, password, and role.' });
    }

    // Find user by email and role
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
      role
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    if (user.status === 'deactivated' || user.status === 'inactive') {
      return res.status(403).json({ message: 'This account has been deactivated.' });
    }

    const token = generateToken(user);
    return res.status(200).json({
      token,
      user: safeUser(user)
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

// @route  GET /api/auth/me
// @access Private (requires JWT)
const getMe = async (req, res) => {
  try {
    const user = await User.findOne({ id: req.user.id }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(safeUser(user));
  } catch (err) {
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = { signup, login, getMe };
