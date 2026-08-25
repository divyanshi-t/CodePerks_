import React from 'react';

export const StatCard = ({
  title,
  value,
  subtitle,
  trend,
  color = 'blue'
}) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
          {title}
        </span>
        {trend && (
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {trend}
          </span>
        )}
      </div>

      <div className="text-2xl font-bold text-gray-900 mt-2">
        {value}
      </div>

      {subtitle && (
        <div className="text-xs text-gray-500 mt-1.5 pt-1.5 border-t border-gray-100">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default StatCard;
