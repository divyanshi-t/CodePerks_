const express = require('express');
const router = express.Router();
const { getRewards, createReward, updateReward, deleteReward } = require('../controllers/rewardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getRewards);
router.post('/', protect, createReward);
router.put('/:id', protect, updateReward);
router.delete('/:id', protect, deleteReward);

module.exports = router;
