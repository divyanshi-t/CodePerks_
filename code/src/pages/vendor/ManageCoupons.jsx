import React, { useState, useEffect } from 'react';
import { getCoupons, setCoupons } from '../../utils/localStorage';

export const ManageCoupons = () => {
  const [coupons, setCouponsList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const initialForm = {
    code: '',
    title: '',
    description: '',
    discount: '20% OFF',
    minPoints: 100,
    storeName: 'Campus Bites Cafeteria',
    expiryDate: '',
    status: 'active'
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    setCouponsList(getCoupons());
  }, []);

  const handleOpenAdd = () => {
    setEditingCoupon(null);
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    setFormData({
      ...initialForm,
      expiryDate: expiry.toISOString().split('T')[0]
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      title: coupon.title || '',
      description: coupon.description || '',
      discount: coupon.discount || '20% OFF',
      minPoints: coupon.minPoints || 100,
      storeName: coupon.storeName || 'Campus Bites Cafeteria',
      expiryDate: coupon.expiryDate || '',
      status: coupon.status || 'active'
    });
    setIsModalOpen(true);
  };

  const handleSaveCoupon = (e) => {
    e.preventDefault();
    const all = getCoupons();

    if (editingCoupon) {
      const updated = all.map(c =>
        c.id === editingCoupon.id
          ? {
              ...c,
              ...formData,
              code: formData.code.trim().toUpperCase(),
              minPoints: Number(formData.minPoints)
            }
          : c
      );
      setCoupons(updated);
      setCouponsList(updated);
    } else {
      const newCoupon = {
        id: `coup_${Date.now()}`,
        ...formData,
        code: formData.code.trim().toUpperCase(),
        minPoints: Number(formData.minPoints),
        claimedCount: 0
      };
      all.unshift(newCoupon);
      setCoupons(all);
      setCouponsList(all);
    }

    setIsModalOpen(false);
  };

  const handleToggleStatus = (coupon) => {
    const all = getCoupons();
    const newStatus = coupon.status === 'active' ? 'inactive' : 'active';
    const updated = all.map(c => c.id === coupon.id ? { ...c, status: newStatus } : c);
    setCoupons(updated);
    setCouponsList(updated);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this promotional coupon?')) {
      const all = getCoupons();
      const filtered = all.filter(c => c.id !== id);
      setCoupons(filtered);
      setCouponsList(filtered);
    }
  };

  const filteredCoupons = coupons.filter(
    c =>
      c.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.storeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Manage Promotional Coupons
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure merchant discount codes, expiry dates, and required skill point tiers.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition"
        >
          + Add Promo Coupon
        </button>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs flex items-center justify-between text-xs">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by promo code or title..."
          className="w-full sm:w-72 px-3 py-1.5 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
        />
        <span className="text-gray-500">{filteredCoupons.length} Offers</span>
      </div>

      {/* Coupons Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">Coupon Code</th>
                <th className="py-2.5 px-4">Offer Title</th>
                <th className="py-2.5 px-4">Discount</th>
                <th className="py-2.5 px-4">Store</th>
                <th className="py-2.5 px-4 text-center">Expires</th>
                <th className="py-2.5 px-4 text-center">Status</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCoupons.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{c.code}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{c.title}</td>
                  <td className="py-3 px-4 font-bold text-gray-800">{c.discount}</td>
                  <td className="py-3 px-4 text-gray-600">{c.storeName}</td>
                  <td className="py-3 px-4 text-center text-gray-500">{c.expiryDate || 'Ongoing'}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(c)}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        c.status === 'active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {c.status === 'active' ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
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
                {editingCoupon ? 'Edit Coupon' : 'Add New Promo Coupon'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveCoupon} className="space-y-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. CAMPUS50"
                  className="w-full p-2 border border-gray-300 rounded font-mono font-bold focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Offer Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 50% Off on Lunch Meal"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-hidden focus:ring-1 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Discount Tag *</label>
                  <input
                    type="text"
                    required
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="e.g. 30% OFF / Flat Rs.50"
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Min XP Required</label>
                  <input
                    type="number"
                    value={formData.minPoints}
                    onChange={(e) => setFormData({ ...formData, minPoints: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Store / Counter *</label>
                  <input
                    type="text"
                    required
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded"
                  />
                </div>
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
                  {editingCoupon ? 'Save Changes' : 'Create Coupon'}
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
