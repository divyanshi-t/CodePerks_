const Coupon = require('../models/Coupon');

// @route  GET /api/coupons
// @access Private
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().select('-__v').sort({ createdAt: -1 });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  POST /api/coupons
// @access Private (vendor)
const createCoupon = async (req, res) => {
  try {
    const { code, vendor, vendorId, discount, expiryDate, status, totalRedeemed, description, title, storeName, minPoints } = req.body;

    if (!code || !discount) {
      return res.status(400).json({ message: 'Please provide coupon code and discount.' });
    }

    const existing = await Coupon.findOne({ code: code.trim().toUpperCase() });
    if (existing) {
      return res.status(400).json({ message: 'A coupon with this code already exists.' });
    }

    const coupon = new Coupon({
      id: `coup_${Date.now()}`,
      code: code.trim().toUpperCase(),
      vendor: vendor || '',
      vendorId: vendorId || '',
      discount,
      expiryDate: expiryDate || '',
      status: status || 'active',
      totalRedeemed: totalRedeemed || 0,
      description: description || '',
      title: title || '',
      storeName: storeName || '',
      minPoints: Number(minPoints || 0),
      claimedCount: 0
    });

    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/coupons/:id
// @access Private (vendor)
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOne({ id: req.params.id });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });

    const fields = ['code', 'vendor', 'vendorId', 'discount', 'expiryDate', 'status', 'totalRedeemed', 'description', 'title', 'storeName', 'minPoints'];
    fields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'code') {
          coupon[field] = req.body[field].trim().toUpperCase();
        } else if (['minPoints', 'totalRedeemed'].includes(field)) {
          coupon[field] = Number(req.body[field]);
        } else {
          coupon[field] = req.body[field];
        }
      }
    });

    const updated = await coupon.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  DELETE /api/coupons/:id
// @access Private (vendor)
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findOneAndDelete({ id: req.params.id });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found.' });
    res.json({ message: 'Coupon deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getCoupons, createCoupon, updateCoupon, deleteCoupon };
