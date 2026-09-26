const Notification = require('../models/Notification');

// @route  GET /api/notifications/user/:userId
// @access Private
const getNotificationsByUser = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId })
      .select('-__v')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  POST /api/notifications
// @access Private
const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, read, createdAt, link } = req.body;

    if (!userId || !title) {
      return res.status(400).json({ message: 'userId and title are required.' });
    }

    const notification = new Notification({
      userId,
      title,
      message: message || '',
      type: type || 'general',
      read: read || false,
      createdAt: createdAt || new Date().toLocaleString(),
      link: link || ''
    });

    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/notifications/:id (mark as read)
// @access Private
const updateNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({ id: req.params.id });
    if (!notification) return res.status(404).json({ message: 'Notification not found.' });

    if (req.body.read !== undefined) notification.read = req.body.read;
    const updated = await notification.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route  PUT /api/notifications/user/:userId/read-all
// @access Private
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.params.userId }, { read: true });
    res.json({ message: 'All notifications marked as read.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getNotificationsByUser, createNotification, updateNotification, markAllRead };
