const express = require('express');
const router = express.Router();
const {
  createSubmission, getSubmissions,
  getSubmissionsByUser, getSubmissionsByChallenge, getSubmissionById
} = require('../controllers/submissionController');
const { protect } = require('../middleware/authMiddleware');

// Order matters: specific routes before parameterized ones
router.get('/user/:userId', protect, getSubmissionsByUser);
router.get('/challenge/:challengeId', protect, getSubmissionsByChallenge);
router.get('/:id', protect, getSubmissionById);
router.get('/', protect, getSubmissions);
router.post('/', protect, createSubmission);

module.exports = router;
