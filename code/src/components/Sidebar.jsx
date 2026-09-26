import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getCurrentUser, setCurrentUser } from '../utils/localStorage';

export const Sidebar = ({ isOpen, closeSidebar }) => {
  const navigate = useNavigate();
  const user = getCurrentUser();

  if (!user) return null;

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  const studentLinks = [
    { name: 'Dashboard', path: '/student/dashboard' },
    { name: 'Challenges', path: '/student/challenges' },
    { name: 'Leaderboard', path: '/student/leaderboard' },
    { name: 'My Progress', path: '/student/progress' },
    { name: 'Rewards', path: '/student/rewards' },
    { name: 'My Redemptions', path: '/student/redemptions' },
    { name: 'Profile', path: '/student/profile' },
  ];

  const facultyLinks = [
    { name: 'Dashboard', path: '/faculty/dashboard' },
    { name: 'Manage Challenges', path: '/faculty/challenges' },
    { name: 'Student Performance', path: '/faculty/students' },
  ];

  const vendorLinks = [
    { name: 'Dashboard', path: '/vendor/dashboard' },
    { name: 'Manage Coupons', path: '/vendor/coupons' },
  ];

  let currentNavLinks = studentLinks;
  let roleTitle = 'Student Portal';

  if (user.role === 'faculty') {
    currentNavLinks = facultyLinks;
    roleTitle = 'Faculty Portal';
  } else if (user.role === 'vendor') {
    currentNavLinks = vendorLinks;
    roleTitle = 'Vendor Portal';
  }

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-gray-900/40 md:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-56 bg-white border-r border-gray-200 flex flex-col transition-transform md:translate-x-0 md:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Menu</span>
            <span className="text-sm font-bold text-gray-800">{roleTitle}</span>
          </div>
          <button
            onClick={closeSidebar}
            className="md:hidden text-gray-400 hover:text-gray-700 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-2 space-y-1 overflow-y-auto text-xs">
          {currentNavLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `block px-3 py-2 rounded font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <div className="mb-2 text-xs">
            <span className="font-bold text-gray-800 block truncate">{user.name}</span>
            <span className="text-gray-500 text-[11px] capitalize">{user.role} Account</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full text-center py-1.5 px-2 bg-white border border-gray-300 rounded text-xs font-semibold text-red-600 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
