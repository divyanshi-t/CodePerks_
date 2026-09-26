const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  vendor: { type: String, default: '' },
  vendorId: { type: String, default: '' },
  discount: { type: String, required: true },
  expiryDate: { type: String },
  status: { type: String, enum: ['active', 'inactive', 'expired'], default: 'active' },
  totalRedeemed: { type: Number, default: 0 },
  description: { type: String, default: '' },
  // Extended fields for vendor manage coupons page
  title: { type: String, default: '' },
  storeName: { type: String, default: '' },
  minPoints: { type: Number, default: 0 },
  claimedCount: { type: Number, default: 0 }
}, { timestamps: true });

CouponSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `coup_${Date.now()}`;
  }
  next();
});

module.exports = mongoose.model('Coupon', CouponSchema);
