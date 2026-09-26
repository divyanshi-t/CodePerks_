const mongoose = require('mongoose');

const BadgeSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  icon: { type: String, default: '🏅' },
  category: { type: String, default: 'milestone' },
  type: { type: String, enum: ['solved_count', 'streak', 'skill_points'], required: true },
  requiredValue: { type: Number, required: true },
  color: { type: String, default: 'from-blue-500 to-indigo-600' }
}, { timestamps: true });

module.exports = mongoose.model('Badge', BadgeSchema);
