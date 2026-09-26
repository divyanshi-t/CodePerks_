const Badge = require('../models/Badge');

// @route  GET /api/badges
// @access Private
const getBadges = async (req, res) => {
  try {
    const badges = await Badge.find().select('-__v');
    res.json(badges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getBadges };
