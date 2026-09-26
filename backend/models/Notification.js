const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  id: { type: String, unique: true },
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, default: '' },
  type: { type: String, enum: ['challenge', 'badge', 'reward', 'streak', 'rank', 'general'], default: 'general' },
  read: { type: Boolean, default: false },
  createdAt: { type: String, default: () => new Date().toLocaleString() },
  link: { type: String, default: '' }
}, { timestamps: true });

NotificationSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = `notif_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
  }
  next();
});

module.exports = mongoose.model('Notification', NotificationSchema);
