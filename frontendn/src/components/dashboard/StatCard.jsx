import React from 'react';

const StatCard = ({ label, value, color }) => {
  const colorMap = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    yellow: 'text-yellow-500',
    red: 'text-red-600',
    purple: 'text-purple-600',
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow text-center">
      <h2 className={`text-2xl font-bold ${colorMap[color] || 'text-gray-700'}`}>{value}</h2>
      <p className="text-gray-500">{label}</p>
    </div>
  );
};

export default StatCard;
