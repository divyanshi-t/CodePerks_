const mongoose = require('mongoose');

const RedemptionSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  userId: { type: String, required: true, index: true },
  rewardId: { type: String, required: true },
  rewardName: { type: String },
  vendor: { type: String },
  pointsUsed: { type: Number, required: true },
  couponCode: { type: String, required: true, unique: true },
  redeemedAt: { type: String, default: () => new Date().toLocaleString() },
  status: { type: String, enum: ['Active', 'Claimed', 'Expired'], default: 'Active' },
  category: { type: String, default: '' },
  expiryDate: { type: String },
  terms: { type: String, default: 'Show this voucher code at the vendor counter to claim.' }
}, { timestamps: true });

RedemptionSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `red_${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Redemption', RedemptionSchema);
