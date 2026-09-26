const mongoose = require('mongoose');

const TestCaseSchema = new mongoose.Schema({
  id: Number,
  input: String,
  expectedOutput: String,
  isHidden: { type: Boolean, default: false }
}, { _id: false });

const ChallengeSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  title: { type: String, required: true, trim: true },
  topic: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  points: { type: Number, required: true, min: 1 },
  timeLimit: { type: String, default: '1.0s' },
  status: { type: String, enum: ['published', 'draft'], default: 'published' },
  createdBy: { type: String, default: 'Faculty' },
  createdAt: { type: String, default: () => new Date().toISOString().split('T')[0] },
  updatedAt: { type: String },
  acceptanceRate: { type: String, default: '100%' },
  description: { type: String, default: '' },
  inputFormat: { type: String, default: '' },
  outputFormat: { type: String, default: '' },
  constraints: { type: String, default: '' },
  sampleInput: { type: String, default: '' },
  sampleOutput: { type: String, default: '' },
  explanation: { type: String, default: '' },
  starterCodes: {
    python: { type: String, default: '' },
    cpp: { type: String, default: '' },
    java: { type: String, default: '' },
    c: { type: String, default: '' }
  },
  testCases: { type: [TestCaseSchema], default: [] }
}, { timestamps: true });

// Auto-generate id before save
ChallengeSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `chall_${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Challenge', ChallengeSchema);
