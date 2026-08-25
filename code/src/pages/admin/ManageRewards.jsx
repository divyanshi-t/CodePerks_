import React, { useState, useEffect } from 'react';
import { getRewards, setRewards } from '../../utils/localStorage';

export const ManageRewards = () => {
  const [rewards, setRewardsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState(null);

  const initialForm = {
    name: '',
    description: '',
    category: 'Food',
    pointsRequired: 150,
    availableQuantity: 20,
    vendor: 'Campus Cafeteria',
    status: 'active'
  };
  const [formData, setFormData] = useState(initialForm);

  const categories = [
    'All',
    'Food',
    'Stationery',
    'Events',
    'Campus Offers',
    'Discounts'
  ];

  useEffect(() => {
    setRewardsList(getRewards());
  }, []);

  const handleOpenAdd = () => {
    setEditingReward(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (reward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name || '',
      description: reward.description || '',
      category: reward.category || 'Food',
      pointsRequired: reward.pointsRequired || 100,
      availableQuantity: reward.availableQuantity || 10,
      vendor: reward.vendor || 'Campus Cafeteria',
      status: reward.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSaveReward = (e) => {
    e.preventDefault();
    const all = getRewards();

    if (editingReward) {
      const updated = all.map(r =>
        r.id === editingReward.id
          ? {
              ...r,
              ...formData,
              pointsRequired: Number(formData.pointsRequired),
              availableQuantity: Number(formData.availableQuantity)
            }
          : r
      );
      setRewards(updated);
      setRewardsList(updated);
    } else {
      const newReward = {
        id: `rew_${Date.now()}`,
        ...formData,
        pointsRequired: Number(formData.pointsRequired),
        availableQuantity: Number(formData.availableQuantity),
        redeemedCount: 0
      };
      all.unshift(newReward);
      setRewards(all);
      setRewardsList(all);
    }

    setIsModalOpen(false);
  };

  const handleDeleteReward = (id) => {
    if (window.confirm('Are you sure you want to delete this reward?')) {
      const all = getRewards();
      const filtered = all.filter(r => r.id !== id);
      setRewards(filtered);
      setRewardsList(filtered);
    }
  };

  const filteredRewards = rewards.filter(r => {
    const matchesCat = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Manage Campus Rewards
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Add perks, adjust skill point requirements, and configure vendor allocations.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition"
        >
          + Add New Reward
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by reward name or vendor..."
          className="w-full sm:w-72 px-3 py-1.5 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
        />

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded font-semibold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Rewards Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">Reward Name</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Vendor</th>
                <th className="py-2.5 px-4 text-center">Points Cost</th>
                <th className="py-2.5 px-4 text-center">Stock</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRewards.map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <span className="font-bold text-gray-900">{r.name}</span>
                      <p className="text-[11px] text-gray-400 font-normal line-clamp-1">{r.description}</p>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                      {r.category}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-gray-700 font-medium">
                    {r.vendor}
                  </td>

                  <td className="py-3 px-4 text-center font-bold text-blue-600">
                    {r.pointsRequired} XP
                  </td>

                  <td className="py-3 px-4 text-center text-gray-700">
                    {r.availableQuantity} left
                  </td>

                  <td className="py-3 px-4 text-center">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded border ${
                      r.status === 'active'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {r.status || 'Active'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(r)}
                      className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteReward(r.id)}
                      className="px-2 py-1 bg-white border border-gray-300 rounded text-red-600 hover:bg-red-50 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-lg border border-gray-200 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {editingReward ? 'Edit Reward' : 'Add New Reward'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReward} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Reward Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Free Cafeteria Coffee Pass"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  >
                    {categories.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Points Required *</label>
                  <input
                    type="number"
                    required
                    min="10"
                    value={formData.pointsRequired}
                    onChange={(e) => setFormData({ ...formData, pointsRequired: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Vendor Partner *</label>
                  <input
                    type="text"
                    required
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    placeholder="Campus Store / Cafeteria"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Available Stock *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.availableQuantity}
                    onChange={(e) => setFormData({ ...formData, availableQuantity: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Terms and details of redemption..."
                  className="w-full p-2 border border-gray-300 rounded"
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
                  {editingReward ? 'Save Changes' : 'Create Reward'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRewards;
