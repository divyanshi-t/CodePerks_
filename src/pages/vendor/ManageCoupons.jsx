import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../../utils/localStorage';
import { apiGetRewards, apiCreateReward, apiUpdateReward, apiDeleteReward } from '../../utils/api';

export const ManageCoupons = () => {
  const [rewards, setRewardsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const user = getCurrentUser();

  const CATEGORIES = ['Food', 'Stationery', 'Events', 'Campus Offers', 'Discounts'];
  const IMAGES = ['🍕', '🍔', '☕', '📚', '🎓', '🎪', '🎁', '💰', '🛒', '🏷️'];

  const initialForm = {
    name: '',
    description: '',
    vendor: user?.name || '',
    category: 'Food',
    pointsRequired: 100,
    availableQuantity: 10,
    totalQuantity: 10,
    image: '🎁',
    tag: '',
    status: 'active'
  };
  const [formData, setFormData] = useState(initialForm);

  const showToast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3000);
  };

  useEffect(() => {
    apiGetRewards()
      .then(data => setRewardsList(data))
      .catch(() => showToast('Failed to load rewards from backend.'))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenAdd = () => {
    setEditingReward(null);
    setFormData({ ...initialForm, vendor: user?.name || '' });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (reward) => {
    setEditingReward(reward);
    setFormData({
      name: reward.name || '',
      description: reward.description || '',
      vendor: reward.vendor || user?.name || '',
      category: reward.category || 'Food',
      pointsRequired: reward.pointsRequired || 100,
      availableQuantity: reward.availableQuantity || 0,
      totalQuantity: reward.totalQuantity || 0,
      image: reward.image || '🎁',
      tag: reward.tag || '',
      status: reward.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('Reward name is required.');
      return;
    }
    if (!formData.pointsRequired || Number(formData.pointsRequired) <= 0) {
      showToast('Please enter valid points required.');
      return;
    }

    const payload = {
      ...formData,
      pointsRequired: Number(formData.pointsRequired),
      availableQuantity: Number(formData.availableQuantity),
      totalQuantity: Number(formData.totalQuantity || formData.availableQuantity)
    };

    setSubmitting(true);
    try {
      if (editingReward) {
        const updated = await apiUpdateReward(editingReward.id, payload);
        setRewardsList(prev => prev.map(r => r.id === editingReward.id ? updated : r));
        showToast('Reward updated successfully.');
      } else {
        const created = await apiCreateReward(payload);
        setRewardsList(prev => [created, ...prev]);
        showToast('Reward added successfully!');
      }
      setIsModalOpen(false);
    } catch (err) {
      showToast(err.message || 'Failed to save reward.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await apiDeleteReward(id);
      setRewardsList(prev => prev.filter(r => r.id !== id));
      setDeleteConfirmId(null);
      showToast('Reward deleted.');
    } catch (err) {
      showToast(err.message || 'Failed to delete reward.');
    }
  };

  const toggleStatus = async (reward) => {
    const newStatus = reward.status === 'active' ? 'inactive' : 'active';
    try {
      await apiUpdateReward(reward.id, { status: newStatus });
      setRewardsList(prev => prev.map(r => r.id === reward.id ? { ...r, status: newStatus } : r));
      showToast(`Reward ${newStatus === 'active' ? 'activated' : 'deactivated'}.`);
    } catch (err) {
      showToast(err.message || 'Failed to update status.');
    }
  };

  const filteredRewards = rewards.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.category && r.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (r.vendor && r.vendor.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return <div className="py-12 text-center text-xs text-gray-400">Loading rewards...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Manage Campus Rewards
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Add, edit, and manage the rewards available for students to redeem with their skill points.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition"
        >
          + Add New Reward
        </button>
      </div>

      {notice && (
        <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded flex items-center justify-between">
          <span>✓ {notice}</span>
          <button onClick={() => setNotice('')} className="text-green-600 font-bold">✕</button>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search rewards by name, category, or vendor..."
          className="w-full px-3 py-1.5 border border-gray-300 rounded text-xs text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">Reward</th>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4 text-center">Points Required</th>
                <th className="py-2.5 px-4 text-center">Stock</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredRewards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    {rewards.length === 0 ? 'No rewards added yet. Click "+ Add New Reward" to get started.' : 'No matching rewards found.'}
                  </td>
                </tr>
              ) : (
                filteredRewards.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{r.image || '🎁'}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{r.name}</p>
                          <p className="text-[11px] text-gray-400 max-w-xs truncate">{r.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{r.category || '-'}</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-600">{r.pointsRequired} XP</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-semibold ${r.availableQuantity > 0 ? 'text-green-700' : 'text-red-600'}`}>
                        {r.availableQuantity} left
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => toggleStatus(r)}
                        className={`px-2 py-0.5 rounded text-[11px] font-bold border transition ${
                          r.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                            : 'bg-gray-100 text-gray-500 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        {r.status === 'active' ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        onClick={() => handleOpenEdit(r)}
                        className="px-2.5 py-1 bg-white border border-gray-300 rounded text-gray-700 font-semibold hover:bg-gray-50"
                      >
                        Edit
                      </button>
                      {deleteConfirmId === r.id ? (
                        <>
                          <button
                            onClick={() => handleDelete(r.id)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded font-semibold"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-2.5 py-1 bg-gray-100 border border-gray-300 rounded text-gray-700 font-semibold"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirmId(r.id)}
                          className="px-2.5 py-1 bg-white border border-red-300 rounded text-red-600 font-semibold hover:bg-red-50"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-lg w-full p-5 shadow-lg border border-gray-200 space-y-4 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h3 className="font-bold text-gray-900 text-sm">
                {editingReward ? 'Edit Reward' : 'Add New Reward'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Reward Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Free Coffee Voucher"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Brief description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-2 py-2 border border-gray-300 rounded text-gray-700 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  >
                    {CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Icon</label>
                  <select
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="w-full px-2 py-2 border border-gray-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  >
                    {IMAGES.map(img => (
                      <option key={img} value={img}>{img}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Points Required *</label>
                  <input
                    type="number"
                    name="pointsRequired"
                    value={formData.pointsRequired}
                    onChange={handleChange}
                    min={1}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Available Quantity</label>
                  <input
                    type="number"
                    name="availableQuantity"
                    value={formData.availableQuantity}
                    onChange={handleChange}
                    min={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Tag (Optional)</label>
                <input
                  type="text"
                  name="tag"
                  value={formData.tag}
                  onChange={handleChange}
                  placeholder="e.g. Hot Deal, Limited"
                  className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingReward ? 'Update Reward' : 'Add Reward'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;
