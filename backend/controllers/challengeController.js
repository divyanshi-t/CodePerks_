const Challenge = require('../models/Challenge');

// @route  GET /api/challenges
// @access Private
const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().select('-__v').sort({ createdAt: -1 });
    res.json(challenges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  GET /api/challenges/:id
// @access Private
const getChallengeById = async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ id: req.params.id }).select('-__v');
    if (!challenge) return res.status(404).json({ message: 'Challenge not found.' });
    res.json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  POST /api/challenges
// @access Private (faculty)
const createChallenge = async (req, res) => {
  try {
    const {
      title, topic, difficulty, points, timeLimit, status,
      description, inputFormat, outputFormat, constraints,
      sampleInput, sampleOutput, explanation,
      starterCodes, testCases, createdBy
    } = req.body;

    if (!title || !topic || !difficulty || !points) {
      return res.status(400).json({ message: 'Please provide title, topic, difficulty, and points.' });
    }

    const challengeId = `chall_${Date.now()}`;
    const challenge = new Challenge({
      id: challengeId,
      title: title.trim(),
      topic,
      difficulty,
      points: Number(points),
      timeLimit: timeLimit || '1.0s',
      status: status || 'published',
      description: description || '',
      inputFormat: inputFormat || '',
      outputFormat: outputFormat || '',
      constraints: constraints || '',
      sampleInput: sampleInput || '',
      sampleOutput: sampleOutput || '',
      explanation: explanation || '',
      createdBy: createdBy || 'Faculty',
      createdAt: new Date().toISOString().split('T')[0],
      acceptanceRate: '100%',
      starterCodes: starterCodes || {
        python: `import sys\n# Write solution here\nprint("Result")`,
        cpp: `#include <iostream>\nusing namespace std;\nint main() { return 0; }`,
        java: `import java.util.*;\npublic class Solution {\n    public static void main(String[] args) {}\n}`,
        c: `#include <stdio.h>\nint main() { return 0; }`
      },
      testCases: testCases || [
        {
          id: 1,
          input: sampleInput || '1',
          expectedOutput: sampleOutput || '1',
          isHidden: false
        }
      ]
    });

    await challenge.save();
    res.status(201).json(challenge);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/challenges/:id
// @access Private (faculty)
const updateChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findOne({ id: req.params.id });
    if (!challenge) return res.status(404).json({ message: 'Challenge not found.' });

    const fields = [
      'title', 'topic', 'difficulty', 'points', 'timeLimit', 'status',
      'description', 'inputFormat', 'outputFormat', 'constraints',
      'sampleInput', 'sampleOutput', 'explanation', 'starterCodes', 'testCases'
    ];

    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        challenge[field] = field === 'points' ? Number(req.body[field]) : req.body[field];
      }
    });

    challenge.updatedAt = new Date().toISOString().split('T')[0];
    const updated = await challenge.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  DELETE /api/challenges/:id
// @access Private (faculty)
const deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findOneAndDelete({ id: req.params.id });
    if (!challenge) return res.status(404).json({ message: 'Challenge not found.' });
    res.json({ message: 'Challenge deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getChallenges, getChallengeById, createChallenge, updateChallenge, deleteChallenge };
