const mongoose = require('mongoose');

const TestCaseResultSchema = new mongoose.Schema({
  id: Number,
  input: String,
  expectedOutput: String,
  actualOutput: String,
  passed: Boolean,
  isHidden: Boolean,
  time: String
}, { _id: false });

const SubmissionSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  userId: { type: String, required: true, index: true },
  userName: { type: String },
  challengeId: { type: String, required: true, index: true },
  challengeTitle: { type: String },
  topic: { type: String },
  language: { type: String, enum: ['python', 'cpp', 'java', 'c'], required: true },
  code: { type: String, default: '' },
  status: { type: String, required: true }, // Accepted, Wrong Answer, Compilation Error, etc.
  score: { type: Number, default: 0 },
  pointsEarned: { type: Number, default: 0 },
  testCasesPassed: { type: Number, default: 0 },
  totalTestCases: { type: Number, default: 0 },
  executionTime: { type: String, default: '0ms' },
  memory: { type: String, default: '0 MB' },
  submittedAt: { type: String, default: () => new Date().toLocaleString() },
  feedback: { type: String, default: '' },
  testCaseResults: { type: [TestCaseResultSchema], default: [] }
}, { timestamps: true });

SubmissionSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `sub_${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Submission', SubmissionSchema);
