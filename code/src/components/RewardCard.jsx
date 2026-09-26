import React from 'react';

export const RewardCard = ({ reward, userPoints = 0, onRedeem }) => {
  const inStock = reward.availableQuantity > 0;
  const canAfford = userPoints >= reward.pointsRequired;
  const isAvailable = inStock && canAfford;

  let buttonText = 'Redeem';
  if (!inStock) {
    buttonText = 'Unavailable';
  } else if (!canAfford) {
    buttonText = 'Not Enough Points';
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs flex flex-col justify-between hover:border-gray-300 transition">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
            {reward.category}
          </span>
          <span className={`text-[11px] font-semibold ${inStock ? 'text-gray-600' : 'text-red-600'}`}>
            {inStock ? `Available: ${reward.availableQuantity}` : 'Unavailable'}
          </span>
        </div>

        <h4 className="text-sm font-bold text-gray-900 mb-1">{reward.name}</h4>
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-2">
          {reward.description}
        </p>

        <p className="text-xs text-gray-500 mb-3">
          Vendor: <strong className="text-gray-700">{reward.vendor}</strong>
        </p>
      </div>

      <div className="pt-2.5 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2 text-xs">
          <span className="text-gray-500">Required Points:</span>
          <span className="font-bold text-blue-600 text-sm">{reward.pointsRequired} XP</span>
        </div>

        <button
          onClick={() => onRedeem(reward)}
          disabled={!isAvailable}
          className={`w-full py-2 px-3 rounded text-xs font-semibold transition ${
            isAvailable
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default RewardCard;
