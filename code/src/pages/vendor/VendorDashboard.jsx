import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/StatCard';
import {
  getCurrentUser,
  getRewards,
  getCoupons,
  getRedemptions,
  setRedemptions
} from '../../utils/localStorage';

export const VendorDashboard = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [rewards, setRewardsList] = useState([]);
  const [coupons, setCouponsList] = useState([]);
  const [redemptions, setRedemptionsList] = useState([]);
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);

  useEffect(() => {
    setUser(getCurrentUser());
    setRewardsList(getRewards());
    setCouponsList(getCoupons());
    setRedemptionsList(getRedemptions());
  }, []);

  const handleVerifyCoupon = (e) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    const trimmed = verifyCode.trim().toUpperCase();
    const allReds = getRedemptions();
    const found = allReds.find(r => r.couponCode.toUpperCase() === trimmed);

    if (!found) {
      // Check promo coupons as well
      const promoFound = coupons.find(c => c.code.toUpperCase() === trimmed);
      if (promoFound) {
        setVerifyResult({
          valid: true,
          type: 'Promo Discount Coupon',
          title: promoFound.title,
          details: `${promoFound.discount} at ${promoFound.storeName}`,
          code: promoFound.code,
          status: 'Valid Promotional Offer'
        });
      } else {
        setVerifyResult({
          valid: false,
          message: 'Invalid Coupon Code. No matching voucher found in platform records.'
        });
      }
      return;
    }

    setVerifyResult({
      valid: true,
      type: 'Student Skill Voucher',
      title: found.rewardName,
      details: `Issued to student (${found.userId}). Redeemed for ${found.pointsUsed} XP.`,
      code: found.couponCode,
      status: found.status || 'Active',
      id: found.id
    });
  };

  const handleMarkAsClaimed = () => {
    if (!verifyResult || !verifyResult.id) return;
    const allReds = getRedemptions();
    const updated = allReds.map(r =>
      r.id === verifyResult.id ? { ...r, status: 'Claimed' } : r
    );
    setRedemptions(updated);
    setRedemptionsList(updated);
    setVerifyResult(prev => ({ ...prev, status: 'Claimed' }));
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Vendor Portal
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Welcome, {user?.name || 'Campus Partner'} — Verify student vouchers and manage promotional offers.
          </p>
        </div>

        <Link
          to="/vendor/coupons"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition inline-block text-center"
        >
          + Manage Store Coupons
        </Link>
      </div>

      {/* 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Active Rewards"
          value={rewards.length}
          subtitle="Listed in student marketplace"
        />
        <StatCard
          title="Promotional Coupons"
          value={coupons.length}
          subtitle="Partner discount codes"
        />
        <StatCard
          title="Student Redemptions"
          value={redemptions.length}
          subtitle="Total vouchers generated"
        />
      </div>

      {/* Cashier Voucher Verification Terminal */}
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900">
            Cashier Voucher Verification Terminal
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Enter the student's coupon code (e.g. PERK-FOO-123456 or CAMPUS50) to verify validity before handing over the reward.
          </p>
        </div>

        <form onSubmit={handleVerifyCoupon} className="flex gap-2">
          <input
            type="text"
            required
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            placeholder="Enter coupon or voucher code..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs font-mono font-bold uppercase text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs transition"
          >
            Verify Code
          </button>
        </form>

        {/* Verification Result */}
        {verifyResult && (
          <div
            className={`p-4 rounded-lg border text-xs space-y-2 ${
              verifyResult.valid
                ? 'bg-green-50/70 border-green-200 text-green-900'
                : 'bg-red-50/70 border-red-200 text-red-900'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm">
                {verifyResult.valid ? '✓ Valid Voucher' : '✕ Invalid Voucher'}
              </span>
              {verifyResult.status && (
                <span className="px-2 py-0.5 rounded font-bold text-[11px] bg-white border">
                  Status: {verifyResult.status}
                </span>
              )}
            </div>

            {verifyResult.valid ? (
              <div className="space-y-1">
                <p><strong>Item / Offer:</strong> {verifyResult.title}</p>
                <p><strong>Details:</strong> {verifyResult.details}</p>
                <p className="font-mono text-[11px]"><strong>Code:</strong> {verifyResult.code}</p>

                {verifyResult.status === 'Active' && verifyResult.id && (
                  <div className="pt-2">
                    <button
                      onClick={handleMarkAsClaimed}
                      className="px-3 py-1 bg-green-700 hover:bg-green-800 text-white font-semibold rounded text-xs"
                    >
                      Mark as Claimed (Hand Over Item)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <p>{verifyResult.message}</p>
            )}
          </div>
        )}
      </div>

      {/* Redemptions Table */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-900">
            Recent Student Redemptions
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">Coupon Code</th>
                <th className="py-2.5 px-4">Reward</th>
                <th className="py-2.5 px-4">Points</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4 text-right">Redeemed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {redemptions.slice(0, 5).map(r => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-mono font-bold text-blue-700">{r.couponCode}</td>
                  <td className="py-3 px-4 font-semibold text-gray-900">{r.rewardName}</td>
                  <td className="py-3 px-4 text-gray-700">{r.pointsUsed} XP</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      r.status === 'Active'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-gray-100 text-gray-600 border-gray-200'
                    }`}>
                      {r.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-400">{r.redeemedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
