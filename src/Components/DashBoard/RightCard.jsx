import React from "react";

const RightCard = ({ icon, title, count, color }) => {
  return (
    <div className="bg-white rounded-lg py-6 md:py-10 px-4 md:px-12 shadow-lg w-full">
      <div className="flex items-center justify-between gap-2">
        <div className="space-y-1">
          <p className="text-xs md:text-lg text-gray-500">{title}</p>
          <h2 className="font-bold text-2xl md:text-4xl">{count}</h2>
        </div>
        <div className={`p-2 md:p-4 rounded-2xl text-white shadow-xl ${color}`}>
          {React.createElement(icon, { size: 24, className: "md:w-8 md:h-8" })}
        </div>
      </div>
    </div>
  );
};

export default RightCard;
