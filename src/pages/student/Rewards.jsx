import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, setCurrentUser } from '../../utils/localStorage';
import { apiGetRewards, apiCreateRedemption } from '../../utils/api';

export const Rewards = () => {
  const [rewards, setRewardsList] = useState([]);
  const [user, setUser] = useState(getCurrentUser());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [redeemTarget, setRedeemTarget] = useState(null);
  const [successModalData, setSuccessModalData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [redeeming, setRedeeming] = useState(false);

  const categories = ['All', 'Food', 'Stationery', 'Events', 'Campus Offers', 'Discounts'];

  useEffect(() => {
    apiGetRewards()
      .then(data => setRewardsList(data.filter(r => r.status === 'active')))
      .catch(() => setError('Failed to load rewards. Please check that the backend is running.'))
      .finally(() => setLoading(false));
  }, []);

  const handleOpenRedeemModal = (reward) => {
    setErrorMsg('');
    setRedeemTarget(reward);
  };

  const handleConfirmRedeem = async () => {
    if (!redeemTarget || !user) return;
    setRedeeming(true);
    setErrorMsg('');

    try {
      const result = await apiCreateRedemption({
        userId: user.id,
        rewardId: redeemTarget.id
      });

      // Backend handles all validation, deduction, and coupon generation
      const { redemption, updatedUser } = result;

      // Update local user points
      if (updatedUser) {
        const refreshedUser = { ...user, skillPoints: updatedUser.skillPoints };
        setCurrentUser(refreshedUser);
        setUser(refreshedUser);
      }

      // Refresh rewards list to show updated quantity
      apiGetRewards()
        .then(data => setRewardsList(data.filter(r => r.status === 'active')))
        .catch(() => {});

      setSuccessModalData(redemption);
      setRedeemTarget(null);
    } catch (err) {
      setErrorMsg(err.message || 'Redemption failed. Please try again.');
    } finally {
      setRedeeming(false);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredRewards = rewards.filter((r) => {
    const matchesCategory = selectedCategory === 'All' || r.category === selectedCategory;
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.description && r.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (r.vendor && r.vendor.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (loading) {
    return <div className="py-12 text-center text-xs text-gray-400">Loading rewards...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Campus Rewards Marketplace
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Redeem your skill points for cafeteria vouchers, stationery, and department passes.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="bg-white border border-gray-200 px-3 py-1.5 rounded">
            <span>Available Balance: <strong className="text-blue-600">{user?.skillPoints || 0} XP</strong></span>
          </div>
          <Link
            to="/student/redemptions"
            className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded border border-gray-300 transition"
          >
            My Redemptions →
          </Link>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search rewards by name or vendor..."
          className="w-full sm:w-72 px-3 py-1.5 border border-gray-300 rounded text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
        />

        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRewards.length === 0 ? (
          <div className="col-span-full p-12 bg-white border border-gray-200 rounded-lg text-center text-xs text-gray-400">
            No rewards available yet.
          </div>
        ) : (
          filteredRewards.map((reward) => {
            const canAfford = (user?.skillPoints || 0) >= reward.pointsRequired;
            const inStock = reward.availableQuantity > 0;
            return (
              <div key={reward.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-2xl">{reward.image || '🎁'}</span>
                    <h3 className="font-bold text-gray-900 mt-1">{reward.name}</h3>
                    <p className="text-gray-500 text-[11px]">by {reward.vendor}</p>
                  </div>
                  {reward.tag && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                      {reward.tag}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 leading-relaxed">{reward.description}</p>

                <div className="flex items-center justify-between pt-1 border-t border-gray-100">
                  <div>
                    <span className="font-bold text-blue-600 text-sm">{reward.pointsRequired} XP</span>
                    <span className="text-gray-400 ml-2 text-[11px]">
                      {inStock ? `${reward.availableQuantity} left` : 'Out of stock'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenRedeemModal(reward)}
                    disabled={!canAfford || !inStock}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {!inStock ? 'Out of Stock' : !canAfford ? 'Not Enough XP' : 'Redeem'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Redeem Confirmation Modal */}
      {redeemTarget && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-lg border border-gray-200 space-y-4 text-xs">
            <div className="flex items-start justify-between border-b border-gray-200 pb-3">
              <div>
                <h3 className="font-bold text-gray-900 text-sm">{redeemTarget.name}</h3>
                <span className="text-gray-500">Vendor: {redeemTarget.vendor}</span>
              </div>
              <button
                onClick={() => setRedeemTarget(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-gray-600 leading-relaxed">
              {redeemTarget.description}
            </p>

            <div className="bg-gray-50 p-3 rounded border border-gray-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-600">Points Cost:</span>
                <span className="font-bold text-blue-600">{redeemTarget.pointsRequired} XP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Current Balance:</span>
                <span className="font-bold text-gray-800">{user?.skillPoints || 0} XP</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-1.5 font-bold">
                <span>Remaining Balance:</span>
                <span className={(user?.skillPoints || 0) >= redeemTarget.pointsRequired ? 'text-green-700' : 'text-red-700'}>
                  {(user?.skillPoints || 0) - redeemTarget.pointsRequired} XP
                </span>
              </div>
            </div>

            {errorMsg && (
              <div className="p-2.5 bg-red-50 border border-red-200 rounded text-red-700">
                {errorMsg}
              </div>
            )}

            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setRedeemTarget(null)}
                className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmRedeem}
                disabled={redeeming || (user?.skillPoints || 0) < redeemTarget.pointsRequired}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold disabled:opacity-50"
              >
                {redeeming ? 'Processing...' : 'Confirm Redemption'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {successModalData && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-lg border border-gray-200 text-center space-y-4 text-xs">
            <h3 className="text-base font-bold text-green-700">
              ✓ Reward redeemed successfully!
            </h3>

            <p className="text-gray-600">
              You redeemed <strong>{successModalData.rewardName}</strong>.
            </p>

            <div className="bg-gray-50 p-4 rounded border border-gray-200 space-y-1">
              <span className="text-[10px] font-bold text-gray-500 uppercase block">Coupon Code</span>
              <div className="flex items-center justify-center space-x-2">
                <span className="font-mono text-base font-extrabold text-blue-700">
                  {successModalData.couponCode}
                </span>
                <button
                  onClick={() => handleCopyCode(successModalData.couponCode)}
                  className="px-2 py-1 bg-white border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <span className="text-[10px] text-gray-400 block">Valid until {successModalData.expiryDate}</span>
            </div>

            <p className="text-[11px] text-gray-500">
              Present this code at the campus vendor counter to claim your reward.
            </p>

            <div className="flex justify-center space-x-2 pt-2">
              <button
                onClick={() => setSuccessModalData(null)}
                className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium"
              >
                Close
              </button>
              <Link
                to="/student/redemptions"
                onClick={() => setSuccessModalData(null)}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold inline-block"
              >
                View in My Redemptions →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;
