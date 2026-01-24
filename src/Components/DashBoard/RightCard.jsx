import React from "react";

const RightCard = ({ icon: Icon, title, count, color }) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg w-full">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-gray-500">{title}</p>
          <h2 className="font-bold text-3xl">{count}</h2>
        </div>
        <div className={`p-4 rounded-2xl text-white shadow-xl ${color}`}>
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
};

export default RightCard;
