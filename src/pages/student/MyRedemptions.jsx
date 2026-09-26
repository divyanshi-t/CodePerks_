import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser } from '../../utils/localStorage';
import { apiGetRedemptionsByUser } from '../../utils/api';

export const MyRedemptions = () => {
  const user = getCurrentUser();
  const [redemptions, setRedemptionsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    if (!user) return;
    apiGetRedemptionsByUser(user.id)
      .then(data => setRedemptionsList(data))
      .catch(() => setError('Failed to load redemptions.'))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (loading) {
    return <div className="py-12 text-center text-xs text-gray-400">Loading redemptions...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            My Redemptions
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Your active and claimed campus vouchers and discount codes.
          </p>
        </div>

        <Link
          to="/student/rewards"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition inline-block text-center"
        >
          + Redeem More Rewards
        </Link>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {error}
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-600">
            <thead className="bg-gray-50 text-gray-700 font-bold uppercase tracking-wider text-[10px] border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Reward</th>
                <th className="py-3 px-4">Points Used</th>
                <th className="py-3 px-4">Coupon Code</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {redemptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-gray-400">
                    <p className="font-semibold text-gray-600 text-sm mb-1">No redemptions yet.</p>
                    <p className="text-xs text-gray-400 mb-3">Solve challenges, earn skill points, and redeem rewards.</p>
                    <Link
                      to="/student/rewards"
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold inline-block"
                    >
                      Browse Rewards
                    </Link>
                  </td>
                </tr>
              ) : (
                redemptions.map((red) => (
                  <tr key={red.id} className="hover:bg-gray-50">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      <div>
                        <span>{red.rewardName}</span>
                        <p className="text-[11px] text-gray-400 font-normal">Vendor: {red.vendor}</p>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-blue-600">
                      {red.pointsUsed} XP
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-gray-800">
                      <span className="bg-gray-100 px-2 py-1 rounded border border-gray-200">
                        {red.couponCode}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-500 whitespace-nowrap">
                      {red.redeemedAt}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          red.status === 'Active'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : 'bg-gray-100 text-gray-600 border-gray-200'
                        }`}
                      >
                        {red.status || 'Active'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleCopy(red.couponCode, red.id)}
                        className="px-3 py-1.5 bg-white border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50 text-xs transition"
                      >
                        {copiedId === red.id ? 'Copied!' : 'Copy Code'}
                      </button>
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

export default MyRedemptions;
