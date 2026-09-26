const Reward = require('../models/Reward');

// @route  GET /api/rewards
// @access Private
const getRewards = async (req, res) => {
  try {
    const rewards = await Reward.find().select('-__v').sort({ createdAt: -1 });
    res.json(rewards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  POST /api/rewards
// @access Private (vendor)
const createReward = async (req, res) => {
  try {
    const { name, description, vendor, category, pointsRequired, availableQuantity, totalQuantity, status, image, tag } = req.body;

    if (!name || !pointsRequired) {
      return res.status(400).json({ message: 'Please provide name and pointsRequired.' });
    }

    const reward = new Reward({
      id: `rew_${Date.now()}`,
      name, description, vendor, category,
      pointsRequired: Number(pointsRequired),
      availableQuantity: Number(availableQuantity || 0),
      totalQuantity: Number(totalQuantity || 0),
      status: status || 'active',
      image: image || '🎁',
      tag: tag || ''
    });

    await reward.save();
    res.status(201).json(reward);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/rewards/:id
// @access Private (vendor)
const updateReward = async (req, res) => {
  try {
    const reward = await Reward.findOne({ id: req.params.id });
    if (!reward) return res.status(404).json({ message: 'Reward not found.' });

    const fields = ['name', 'description', 'vendor', 'category', 'pointsRequired', 'availableQuantity', 'totalQuantity', 'status', 'image', 'tag'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        reward[field] = ['pointsRequired', 'availableQuantity', 'totalQuantity'].includes(field)
          ? Number(req.body[field])
          : req.body[field];
      }
    });

    const updated = await reward.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  DELETE /api/rewards/:id
// @access Private (vendor)
const deleteReward = async (req, res) => {
  try {
    const reward = await Reward.findOneAndDelete({ id: req.params.id });
    if (!reward) return res.status(404).json({ message: 'Reward not found.' });
    res.json({ message: 'Reward deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRewards, createReward, updateReward, deleteReward };
