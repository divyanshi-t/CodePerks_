import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { RewardCard } from '../../components/RewardCard';
import {
  getRewards,
  setRewards,
  getCurrentUser,
  setCurrentUser,
  getUsers,
  setUsers,
  getRedemptions,
  setRedemptions,
  getNotifications,
  setNotifications
} from '../../utils/localStorage';

export const Rewards = () => {
  const navigate = useNavigate();
  const [rewards, setRewardsList] = useState([]);
  const [user, setUser] = useState(getCurrentUser());
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [redeemTarget, setRedeemTarget] = useState(null);
  const [successModalData, setSuccessModalData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const categories = [
    'All',
    'Food',
    'Stationery',
    'Events',
    'Campus Offers',
    'Discounts'
  ];

  useEffect(() => {
    setRewardsList(getRewards().filter(r => r.status === 'active'));
    setUser(getCurrentUser());
  }, []);

  const handleOpenRedeemModal = (reward) => {
    setErrorMsg('');
    if (!user || (user.skillPoints || 0) < reward.pointsRequired) {
      setErrorMsg(`Insufficient points. You have ${user?.skillPoints || 0} XP, but this perk requires ${reward.pointsRequired} XP.`);
      setRedeemTarget(reward);
      return;
    }
    if (reward.availableQuantity <= 0) {
      setErrorMsg('This reward is currently out of stock.');
      setRedeemTarget(reward);
      return;
    }
    setRedeemTarget(reward);
  };

  const handleConfirmRedeem = () => {
    if (!redeemTarget || !user) return;

    if ((user.skillPoints || 0) < redeemTarget.pointsRequired) {
      setErrorMsg('Insufficient skill points balance.');
      return;
    }

    if (redeemTarget.availableQuantity <= 0) {
      setErrorMsg('Reward is sold out.');
      return;
    }

    const allUsers = getUsers();
    const updatedUser = {
      ...user,
      skillPoints: (user.skillPoints || 0) - redeemTarget.pointsRequired
    };
    const updatedUsers = allUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsers(updatedUsers);
    setCurrentUser(updatedUser);
    setUser(updatedUser);

    const allRewards = getRewards();
    const updatedRewards = allRewards.map(r =>
      r.id === redeemTarget.id
        ? { ...r, availableQuantity: Math.max(0, r.availableQuantity - 1) }
        : r
    );
    setRewards(updatedRewards);
    setRewardsList(updatedRewards.filter(r => r.status === 'active'));

    const randomCode = `PERK-${redeemTarget.category.substring(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    const expiryFormatted = expiry.toISOString().split('T')[0];

    const allRedemptions = getRedemptions();
    const newRedemption = {
      id: `red_${Date.now()}`,
      userId: user.id,
      rewardId: redeemTarget.id,
      rewardName: redeemTarget.name,
      vendor: redeemTarget.vendor,
      pointsUsed: redeemTarget.pointsRequired,
      couponCode: randomCode,
      redeemedAt: new Date().toLocaleString(),
      status: 'Active',
      category: redeemTarget.category,
      expiryDate: expiryFormatted
    };
    allRedemptions.unshift(newRedemption);
    setRedemptions(allRedemptions);

    const allNotifs = getNotifications();
    allNotifs.unshift({
      id: `notif_${Date.now()}_redeem`,
      userId: user.id,
      title: `Perk Redeemed: ${redeemTarget.name}`,
      message: `You spent ${redeemTarget.pointsRequired} XP to redeem "${redeemTarget.name}". Code: ${randomCode}`,
      type: 'reward',
      read: false,
      createdAt: new Date().toLocaleString(),
      link: '/student/redemptions'
    });
    setNotifications(allNotifs);

    setSuccessModalData(newRedemption);
    setRedeemTarget(null);
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
      r.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
            No matching rewards found.
          </div>
        ) : (
          filteredRewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              userPoints={user?.skillPoints || 0}
              onRedeem={handleOpenRedeemModal}
            />
          ))
        )}
      </div>

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
                disabled={(user?.skillPoints || 0) < redeemTarget.pointsRequired || redeemTarget.availableQuantity <= 0}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold disabled:opacity-50"
              >
                Confirm Redemption
              </button>
            </div>
          </div>
        </div>
      )}

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
              <button
                onClick={() => {
                  setSuccessModalData(null);
                  navigate('/student/redemptions');
                }}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
              >
                View in My Redemptions →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rewards;
