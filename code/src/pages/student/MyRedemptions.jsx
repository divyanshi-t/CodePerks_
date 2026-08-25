import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRedemptions, getCurrentUser } from '../../utils/localStorage';

export const MyRedemptions = () => {
  const [redemptions, setRedemptionsList] = useState([]);
  const [user, setUser] = useState(getCurrentUser());
  const [copiedId, setCopiedId] = useState(null);
  const [activeVoucher, setActiveVoucher] = useState(null);

  useEffect(() => {
    const all = getRedemptions();
    const u = getCurrentUser();
    setUser(u);
    setRedemptionsList(all.filter(r => !r.userId || (u && r.userId === u.id)));
  }, []);

  const handleCopy = (code, id) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            My Claimed Redemptions
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Active campus vouchers and discount codes ready for counter use.
          </p>
        </div>

        <Link
          to="/student/rewards"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold transition inline-block text-center"
        >
          + Redeem More Perks
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {redemptions.length === 0 ? (
          <div className="col-span-full p-12 bg-white border border-gray-200 rounded-lg text-center text-xs text-gray-400">
            <p className="font-bold text-sm text-gray-700 mb-1">No Redemptions Found</p>
            <p>Solve coding problems, earn XP, and redeem perks from the campus marketplace.</p>
            <Link
              to="/student/rewards"
              className="mt-3 inline-block px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-semibold"
            >
              Go to Rewards Store
            </Link>
          </div>
        ) : (
          redemptions.map((red) => (
            <div
              key={red.id}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-50 text-green-800 border border-green-200">
                    {red.status || 'Active'}
                  </span>
                  <span className="text-xs font-bold text-blue-600">
                    {red.pointsUsed} XP
                  </span>
                </div>

                <h4 className="text-sm font-bold text-gray-900 mb-0.5">{red.rewardName}</h4>
                <p className="text-xs text-gray-500 mb-3">Vendor: {red.vendor}</p>

                {/* Code Box */}
                <div className="bg-gray-50 border border-gray-200 rounded p-2.5 flex items-center justify-between mb-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block uppercase">Code</span>
                    <span className="font-mono font-bold text-blue-700 text-sm">
                      {red.couponCode}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopy(red.couponCode, red.id)}
                    className="px-2 py-1 bg-white border border-gray-300 rounded font-semibold text-gray-700 hover:bg-gray-50 text-xs"
                  >
                    {copiedId === red.id ? 'Copied!' : 'Copy'}
                  </button>
                </div>

                <div className="text-[11px] text-gray-400 space-y-0.5">
                  <p>Redeemed: {red.redeemedAt}</p>
                  {red.expiryDate && <p>Expires: {red.expiryDate}</p>}
                </div>
              </div>

              <div className="pt-2.5 border-t border-gray-100 mt-3">
                <button
                  onClick={() => setActiveVoucher(red)}
                  className="w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-xs font-semibold border border-gray-300 transition"
                >
                  View Voucher Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Voucher Pass Modal */}
      {activeVoucher && (
        <div className="fixed inset-0 z-50 bg-gray-900/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-sm w-full p-5 shadow-lg border border-gray-200 text-center space-y-4 text-xs">
            <div className="border-b border-gray-200 pb-3">
              <span className="text-[10px] uppercase font-bold text-gray-400 block">Campus Digital Voucher</span>
              <h3 className="text-base font-bold text-gray-900 mt-0.5">{activeVoucher.rewardName}</h3>
            </div>

            <div>
              <span className="text-gray-500 block">Beneficiary:</span>
              <p className="font-bold text-gray-800">{user?.name} ({user?.rollNumber || 'Student'})</p>
            </div>

            <div className="bg-gray-50 p-4 rounded border border-gray-300">
              <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Coupon Passcode</span>
              <p className="font-mono text-lg font-bold text-blue-700">
                {activeVoucher.couponCode}
              </p>
              <p className="text-[10px] text-gray-400 mt-2">
                Merchant: <strong>{activeVoucher.vendor}</strong>
              </p>
            </div>

            <p className="text-[11px] text-gray-500">
              Show this screen at the vendor checkout desk.
            </p>

            <button
              onClick={() => setActiveVoucher(null)}
              className="w-full py-2 bg-gray-800 hover:bg-gray-900 text-white rounded text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRedemptions;
