import React from "react";

const RightCard = ({ icon, title, count, color }) => {
  return (
    <div className="bg-white rounded-lg py-10 px-12 shadow-lg w-full">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-lg text-gray-500">{title}</p>
          <h2 className="font-bold text-4xl">{count}</h2>
        </div>
        <div className={`p-4 rounded-2xl text-white shadow-xl ${color}`}>
          {React.createElement(icon, { size: 32 })}
        </div>
      </div>
    </div>
  );
};

export default RightCard;
