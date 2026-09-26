import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StatCard } from '../../components/StatCard';
import { getCurrentUser } from '../../utils/localStorage';
import { apiGetRewards, apiGetRedemptions, apiUpdateRedemption } from '../../utils/api';

export const VendorDashboard = () => {
  const user = getCurrentUser();
  const [rewards, setRewardsList] = useState([]);
  const [redemptions, setRedemptionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verifyCode, setVerifyCode] = useState('');
  const [verifyResult, setVerifyResult] = useState(null);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [rewardsData, redemptionsData] = await Promise.all([
          apiGetRewards(),
          apiGetRedemptions()
        ]);
        setRewardsList(rewardsData);
        setRedemptionsList(redemptionsData);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const showToast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(''), 3000);
  };

  const handleVerifyCoupon = (e) => {
    e.preventDefault();
    if (!verifyCode.trim()) return;

    const trimmed = verifyCode.trim().toUpperCase();
    const found = redemptions.find(r => r.couponCode.toUpperCase() === trimmed);

    if (!found) {
      setVerifyResult({
        valid: false,
        message: 'Invalid Coupon Code. No matching voucher found in platform records.'
      });
      return;
    }

    setVerifyResult({
      valid: true,
      type: 'Student Skill Voucher',
      title: found.rewardName,
      details: `Issued to a student (${found.pointsUsed} XP used).`,
      code: found.couponCode,
      status: found.status || 'Active',
      id: found.id
    });
  };

  const handleMarkAsClaimed = async () => {
    if (!verifyResult || !verifyResult.id) return;
    try {
      await apiUpdateRedemption(verifyResult.id, { status: 'Claimed' });
      setRedemptionsList(prev =>
        prev.map(r => r.id === verifyResult.id ? { ...r, status: 'Claimed' } : r)
      );
      setVerifyResult(prev => ({ ...prev, status: 'Claimed' }));
      showToast('Reward marked as claimed and handed over to student.');
    } catch (err) {
      showToast('Failed to update status. Please try again.');
    }
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-gray-400">Loading dashboard...</div>;
  }

  const activeRewards = rewards.filter(r => r.status === 'active').length;
  const totalRedemptions = redemptions.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            Vendor Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Welcome, {user?.name || 'Campus Partner'} — Verify student vouchers and manage rewards.
          </p>
        </div>

        <Link
          to="/vendor/coupons"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition inline-block text-center"
        >
          + Manage Rewards
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {error}
        </div>
      )}

      {notice && (
        <div className="p-2.5 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded shadow-xs flex items-center justify-between">
          <span>✓ {notice}</span>
          <button onClick={() => setNotice('')} className="text-green-600 font-bold ml-2">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Active Rewards"
          value={activeRewards}
          subtitle="Listed in student marketplace"
        />
        <StatCard
          title="Total Redemptions"
          value={totalRedemptions}
          subtitle="Total vouchers generated"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-xs space-y-4">
        <div>
          <h2 className="text-sm font-bold text-gray-900">
            Cashier Voucher Verification Terminal
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Enter the student's coupon code (e.g. PERK-FOO-123456) to verify validity before handing over the reward.
          </p>
        </div>

        <form onSubmit={handleVerifyCoupon} className="flex gap-2">
          <input
            type="text"
            required
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value)}
            placeholder="Enter voucher code..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded text-xs font-mono font-bold uppercase text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-blue-600"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded text-xs transition"
          >
            Verify Code
          </button>
        </form>

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
                <p><strong>Item:</strong> {verifyResult.title}</p>
                <p><strong>Details:</strong> {verifyResult.details}</p>
                <p className="font-mono text-[11px]"><strong>Code:</strong> {verifyResult.code}</p>

                {verifyResult.status === 'Active' && verifyResult.id && (
                  <div className="pt-2">
                    <button
                      onClick={handleMarkAsClaimed}
                      className="px-3 py-1 bg-green-700 hover:bg-green-800 text-white font-semibold rounded text-xs transition"
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

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-bold text-gray-900">
            Recent Redemptions
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-2.5 px-4">Reward</th>
                <th className="py-2.5 px-4">Coupon Code</th>
                <th className="py-2.5 px-4">Points Used</th>
                <th className="py-2.5 px-4">Date</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {redemptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-400">
                    No redemptions yet.
                  </td>
                </tr>
              ) : (
                redemptions.slice(0, 8).map(r => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4 font-semibold text-gray-900">{r.rewardName}</td>
                    <td className="py-3 px-4 font-mono text-gray-700">{r.couponCode}</td>
                    <td className="py-3 px-4 font-bold text-blue-600">{r.pointsUsed} XP</td>
                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">{r.redeemedAt}</td>
                    <td className="py-3 px-4 text-right">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                        r.status === 'Active'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}>
                        {r.status || 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
