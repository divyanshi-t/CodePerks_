const express = require('express');
const router = express.Router();
const { createRedemption, getRedemptions, getRedemptionsByUser, updateRedemption } = require('../controllers/redemptionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/user/:userId', protect, getRedemptionsByUser);
router.get('/', protect, getRedemptions);
router.post('/', protect, createRedemption);
router.put('/:id', protect, updateRedemption);

module.exports = router;
