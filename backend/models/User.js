const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  // Shared fields (all roles)
  id: { type: String, unique: true }, // preserve frontend id format
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'faculty', 'vendor'], required: true },
  avatar: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive', 'deactivated'], default: 'active' },
  joinedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },

  // Student fields
  studentId: { type: String, default: '' },
  rollNumber: { type: String, default: '' },
  department: { type: String, default: '' },
  semester: { type: String, default: '' },
  bio: { type: String, default: '' },
  skillPoints: { type: Number, default: 0 },
  streak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  solvedCount: { type: Number, default: 0 },
  attemptedCount: { type: Number, default: 0 },
  accuracy: { type: Number, default: 100 },
  unlockedBadges: { type: [String], default: [] },

  // Faculty fields
  designation: { type: String, default: '' },

  // Vendor fields
  businessName: { type: String, default: '' },
  category: { type: String, default: '' },
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate a consistent id if not provided
UserSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `usr_${this.role}_${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('User', UserSchema);
