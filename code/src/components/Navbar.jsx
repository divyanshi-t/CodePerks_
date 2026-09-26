import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, setCurrentUser } from '../utils/localStorage';
import { saveToken } from '../utils/api';

export const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(getCurrentUser());
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const updateUserState = () => {
      setUser(getCurrentUser());
    };

    updateUserState();
    window.addEventListener('storage', updateUserState);
    return () => window.removeEventListener('storage', updateUserState);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    saveToken(null);
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-2.5 max-w-7xl mx-auto">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleSidebar}
            className="p-1.5 text-gray-600 rounded border border-gray-300 md:hidden hover:bg-gray-100"
            aria-label="Toggle Menu"
          >
            <span className="text-sm font-bold">☰</span>
          </button>

          <Link to={user ? `/${user.role}/dashboard` : '/login'} className="flex items-center space-x-2">
            <span className="bg-blue-600 text-white font-bold text-sm px-2 py-1 rounded">
              CP
            </span>
            <span className="text-base font-bold text-gray-900 tracking-tight">
              CODEPERKS
            </span>
            <span className="text-xs text-gray-500 hidden sm:inline border-l border-gray-300 pl-2">
              Campus Coding & Rewards
            </span>
          </Link>
        </div>

        {/* Right: User Profile & Logout */}
        <div className="flex items-center space-x-3">
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-2 py-1 text-xs border border-gray-200 rounded hover:bg-gray-100 bg-white"
              >
                <span className="font-semibold text-gray-800">{user.name}</span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded">
                  {user.role}
                </span>
                <span className="text-gray-400">▾</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-1 w-52 bg-white rounded border border-gray-200 shadow-md py-2 z-50 text-xs">
                  <div className="px-3 py-1.5 border-b border-gray-100">
                    <p className="font-bold text-gray-900">{user.name}</p>
                    <p className="text-gray-500 text-[11px]">{user.email}</p>
                    <p className="text-[10px] uppercase font-semibold text-blue-600 mt-0.5">{user.role} Account</p>
                  </div>

                  {user.role === 'student' && (
                    <Link
                      to="/student/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-3 py-1.5 text-gray-700 hover:bg-gray-50"
                    >
                      View Profile
                    </Link>
                  )}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 font-semibold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
