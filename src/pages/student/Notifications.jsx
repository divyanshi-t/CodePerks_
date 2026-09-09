import React, { useState, useEffect } from 'react';
import { NotificationPanel } from '../../components/NotificationPanel';
import { getNotifications, setNotifications, getCurrentUser } from '../../utils/localStorage';

export const Notifications = () => {
  const [notifications, setNotifs] = useState([]);
  const [user, setUser] = useState(getCurrentUser());

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    const all = getNotifications();
    setNotifs(all.filter(n => !n.userId || (u && n.userId === u.id)));
  }, []);

  const handleMarkAsRead = (id) => {
    const all = getNotifications();
    const updated = all.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    setNotifs(updated.filter(n => !n.userId || (user && n.userId === user.id)));
  };

  const handleMarkAllAsRead = () => {
    const all = getNotifications();
    const updated = all.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    setNotifs(updated.filter(n => !n.userId || (user && n.userId === user.id)));
  };

  const handleDeleteNotification = (id) => {
    const all = getNotifications();
    const updated = all.filter(n => n.id !== id);
    setNotifications(updated);
    setNotifs(updated.filter(n => !n.userId || (user && n.userId === user.id)));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <NotificationPanel
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onDeleteNotification={handleDeleteNotification}
      />
    </div>
  );
};

export default Notifications;
