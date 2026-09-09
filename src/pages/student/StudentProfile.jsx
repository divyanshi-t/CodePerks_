import React, { useState, useEffect } from 'react';
import { getCurrentUser, setCurrentUser, getUsers, setUsers } from '../../utils/localStorage';
import { calculateRank } from '../../utils/points';

export const StudentProfile = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      setBioText(u.bio || '');
    }
  }, []);

  if (!user) return null;

  const rank = calculateRank(user.id);

  const handleSaveBio = () => {
    const allUsers = getUsers();
    const updated = { ...user, bio: bioText };
    const updatedList = allUsers.map(u => u.id === user.id ? updated : u);
    setUsers(updatedList);
    setCurrentUser(updated);
    setUser(updated);
    setIsEditingBio(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-xs space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                {user.role}
              </span>
            </div>
            <p className="text-gray-500 mt-1">
              {user.department} ({user.semester || '6th Semester'}) • Roll No: <strong>{user.rollNumber || 'CS21B1042'}</strong>
            </p>
            <p className="text-gray-500">Email: {user.email}</p>
          </div>

          <div className="text-right">
            <span className="text-gray-500 block">Total Points</span>
            <span className="text-2xl font-extrabold text-blue-600">{user.skillPoints || 0} XP</span>
          </div>
        </div>

        <div>
          <span className="font-bold text-gray-700 uppercase text-[11px] block mb-1">
            Student Bio & Placement Goals
          </span>
          {isEditingBio ? (
            <div className="space-y-2">
              <textarea
                value={bioText}
                onChange={(e) => setBioText(e.target.value)}
                rows={2}
                className="w-full p-2 border border-gray-300 rounded text-xs text-gray-800 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveBio}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold text-xs"
                >
                  Save Bio
                </button>
                <button
                  onClick={() => setIsEditingBio(false)}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded font-semibold text-xs hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200">
              <p className="text-gray-700 italic">"{user.bio || 'Coding enthusiast at CodePerks.'}"</p>
              <button
                onClick={() => setIsEditingBio(true)}
                className="text-blue-600 hover:underline font-semibold text-xs ml-3"
              >
                Edit
              </button>
            </div>
          )}
          {savedSuccess && <p className="text-green-700 font-semibold mt-1">✓ Bio updated successfully.</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-center">
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xs">
          <span className="text-gray-500 block">Campus Rank</span>
          <span className="text-xl font-bold text-gray-900 mt-1 block">#{rank}</span>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xs">
          <span className="text-gray-500 block">Streak</span>
          <span className="text-xl font-bold text-amber-600 mt-1 block">{user.streak || 0} Days</span>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xs">
          <span className="text-gray-500 block">Solved</span>
          <span className="text-xl font-bold text-gray-900 mt-1 block">{user.solvedCount || 0}</span>
        </div>
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-xs">
          <span className="text-gray-500 block">Accuracy</span>
          <span className="text-xl font-bold text-green-700 mt-1 block">{user.accuracy || 78}%</span>
        </div>
      </div>

    </div>
  );
};

export default StudentProfile;
