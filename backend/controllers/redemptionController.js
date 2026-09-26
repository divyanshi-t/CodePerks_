const Redemption = require('../models/Redemption');
const Reward = require('../models/Reward');
const User = require('../models/User');

// @route  POST /api/redemptions
// @access Private (student)
const createRedemption = async (req, res) => {
  try {
    const { userId, rewardId } = req.body;

    if (!userId || !rewardId) {
      return res.status(400).json({ message: 'userId and rewardId are required.' });
    }

    // Get user
    const user = await User.findOne({ id: userId });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Get reward
    const reward = await Reward.findOne({ id: rewardId });
    if (!reward) {
      return res.status(404).json({ message: 'Reward not found.' });
    }

    if (reward.status !== 'active') {
      return res.status(400).json({ message: 'This reward is not currently available.' });
    }

    if (reward.availableQuantity <= 0) {
      return res.status(400).json({ message: 'This reward is out of stock.' });
    }

    if ((user.skillPoints || 0) < reward.pointsRequired) {
      return res.status(400).json({
        message: `Insufficient points. You have ${user.skillPoints || 0} XP but need ${reward.pointsRequired} XP.`
      });
    }

    // Generate a coupon code
    const categoryCode = (reward.category || 'GEN').substring(0, 3).toUpperCase();
    const couponCode = `PERK-${categoryCode}-${Math.floor(100000 + Math.random() * 900000)}`;

    // Expiry = 30 days from now
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    const expiryDate = expiry.toISOString().split('T')[0];

    // Deduct points
    user.skillPoints = (user.skillPoints || 0) - reward.pointsRequired;
    await user.save();

    // Decrement reward quantity
    reward.availableQuantity = Math.max(0, reward.availableQuantity - 1);
    await reward.save();

    // Create redemption
    const redemptionId = `red_${Date.now()}`;
    const redemption = new Redemption({
      id: redemptionId,
      userId,
      rewardId,
      rewardName: reward.name,
      vendor: reward.vendor || '',
      pointsUsed: reward.pointsRequired,
      couponCode,
      redeemedAt: new Date().toLocaleString(),
      status: 'Active',
      category: reward.category || '',
      expiryDate,
      terms: 'Show this voucher code at the vendor counter to claim.'
    });

    await redemption.save();

    // Return redemption + updated user points
    res.status(201).json({
      redemption,
      updatedUser: {
        id: user.id,
        skillPoints: user.skillPoints
      }
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'A coupon code conflict occurred. Please try again.' });
    }
    console.error('Redemption error:', err);
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/redemptions
// @access Private
const getRedemptions = async (req, res) => {
  try {
    const redemptions = await Redemption.find().select('-__v').sort({ createdAt: -1 });
    res.json(redemptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/redemptions/user/:userId
// @access Private
const getRedemptionsByUser = async (req, res) => {
  try {
    const redemptions = await Redemption.find({ userId: req.params.userId })
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(redemptions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/redemptions/:id
// @access Private (vendor - mark as claimed)
const updateRedemption = async (req, res) => {
  try {
    const redemption = await Redemption.findOne({ id: req.params.id });
    if (!redemption) return res.status(404).json({ message: 'Redemption not found.' });

    if (req.body.status !== undefined) redemption.status = req.body.status;
    const updated = await redemption.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createRedemption, getRedemptions, getRedemptionsByUser, updateRedemption };
