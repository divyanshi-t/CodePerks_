import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const NotificationPanel = ({
  notifications = [],
  onMarkAsRead,
  onMarkAllAsRead,
  onDeleteNotification
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    return true;
  });

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Notifications</h3>
          <p className="text-xs text-gray-500">Platform activity and reward alerts</p>
        </div>

        <div className="flex items-center space-x-2">
          {notifications.some(n => !n.read) && (
            <button
              onClick={onMarkAllAsRead}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded border border-gray-300 transition"
            >
              Mark All Read
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 pt-2 border-b border-gray-200 flex space-x-2 text-xs">
        {['all', 'unread'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-2 px-2 font-semibold capitalize border-b-2 transition ${
              filter === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            {tab} {tab === 'unread' && notifications.filter(n => !n.read).length > 0 && `(${notifications.filter(n => !n.read).length})`}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="divide-y divide-gray-100">
        {filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-xs">
            No notifications available.
          </div>
        ) : (
          filtered.map(item => (
            <div
              key={item.id}
              className={`p-4 flex items-start justify-between gap-4 text-xs ${
                !item.read ? 'bg-blue-50/40' : 'hover:bg-gray-50'
              }`}
            >
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-bold text-gray-900">{item.title}</h4>
                  {!item.read && (
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.2 rounded">
                      NEW
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{item.message}</p>
                <div className="flex items-center space-x-3 mt-2 text-[11px] text-gray-400">
                  <span>{item.createdAt}</span>
                  {item.link && (
                    <button
                      onClick={() => {
                        if (!item.read) onMarkAsRead(item.id);
                        navigate(item.link);
                      }}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      View Details →
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {!item.read && (
                  <button
                    onClick={() => onMarkAsRead(item.id)}
                    className="px-2 py-1 bg-white border border-gray-300 rounded text-[11px] font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Mark Read
                  </button>
                )}
                {onDeleteNotification && (
                  <button
                    onClick={() => onDeleteNotification(item.id)}
                    className="px-2 py-1 bg-white border border-gray-300 rounded text-[11px] font-semibold text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;
