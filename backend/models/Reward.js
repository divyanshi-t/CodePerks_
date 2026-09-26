const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  name: { type: String, required: true },
  description: { type: String, default: '' },
  vendor: { type: String, default: '' },
  category: { type: String, default: '' },
  pointsRequired: { type: Number, required: true, min: 1 },
  availableQuantity: { type: Number, default: 0 },
  totalQuantity: { type: Number, default: 0 },
  status: { type: String, enum: ['active', 'inactive', 'draft'], default: 'active' },
  image: { type: String, default: '🎁' },
  tag: { type: String, default: '' }
}, { timestamps: true });

RewardSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `rew_${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Reward', RewardSchema);
