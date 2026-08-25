import React, { useState, useEffect } from 'react';
import { getUsers, setUsers, getCurrentUser } from '../../utils/localStorage';

export const ManageUsers = () => {
  const [users, setUsersList] = useState([]);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());
  const [roleFilter, setRoleFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const initialForm = {
    name: '',
    email: '',
    password: 'password123',
    role: 'student',
    department: 'Computer Science & Engineering',
    studentId: '',
    status: 'active'
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    setUsersList(getUsers());
    setCurrentUser(getCurrentUser());
  }, []);

  const handleToggleStatus = (targetUser) => {
    if (targetUser.id === currentUser?.id) {
      alert('Cannot deactivate your own logged-in admin account.');
      return;
    }

    const all = getUsers();
    const updated = all.map(u => {
      if (u.id === targetUser.id) {
        const newStatus = u.status === 'active' ? 'inactive' : 'active';
        return { ...u, status: newStatus };
      }
      return u;
    });

    setUsers(updated);
    setUsersList(updated);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const all = getUsers();

    const emailExists = all.some(
      u => u.email.toLowerCase() === formData.email.trim().toLowerCase()
    );
    if (emailExists) {
      alert('A user with this email address already exists.');
      return;
    }

    const newUser = {
      id: `usr_${formData.role}_${Date.now()}`,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      password: formData.password || 'password123',
      role: formData.role,
      department: formData.department,
      studentId: formData.studentId.trim() || `ID-${Math.floor(1000 + Math.random() * 9000)}`,
      rollNumber: formData.studentId.trim(),
      status: formData.status,
      joinedDate: new Date().toISOString().split('T')[0],
      skillPoints: formData.role === 'student' ? 100 : 0,
      streak: 1,
      solvedCount: 0,
      accuracy: 100,
      unlockedBadges: formData.role === 'student' ? ['badge_first_blood'] : []
    };

    all.push(newUser);
    setUsers(all);
    setUsersList(all);
    setIsModalOpen(false);
    setFormData(initialForm);
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'All' || u.role === roleFilter.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.department && u.department.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesRole && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Manage User Accounts
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Administer campus student, faculty, and vendor user accounts.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition"
        >
          + Add New User
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, or department..."
          className="w-full sm:w-72 px-3 py-1.5 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
        />

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {['All', 'Student', 'Faculty', 'Admin', 'Vendor'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1 rounded font-semibold transition ${
                roleFilter === r
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">User</th>
                <th className="py-2.5 px-4">Role</th>
                <th className="py-2.5 px-4">Department / Store</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-center">Points</th>
                <th className="py-2.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-bold text-gray-900">{u.name}</span>
                      <span className="text-gray-400 block text-[11px]">{u.email}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                      {u.role}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-gray-600">
                    {u.department || u.businessName || '—'}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                        u.status === 'active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {u.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-blue-600">
                    {u.role === 'student' ? `${u.skillPoints || 0} XP` : '—'}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleToggleStatus(u)}
                      disabled={u.id === currentUser?.id}
                      className={`px-2.5 py-1 rounded text-xs font-semibold border transition ${
                        u.status === 'active'
                          ? 'bg-white border-gray-300 text-red-600 hover:bg-red-50'
                          : 'bg-white border-gray-300 text-green-700 hover:bg-green-50'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {u.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-lg border border-gray-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-gray-900">Add New Account</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Ramesh Kumar"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@codeperks.com"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="vendor">Vendor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Student/Staff ID</label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    placeholder="e.g. CS22B1080"
                    className="w-full p-2 border border-gray-300 rounded font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Department / Branch</label>
                <input
                  type="text"
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="e.g. Computer Science & Engineering"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Initial Password</label>
                <input
                  type="text"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full p-2 border border-gray-300 rounded font-mono"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
