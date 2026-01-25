import React from "react";

const Unit = () => {
  return (
    <div className=" bg-white w-48 shadow flex space-y-2 flex-col items-center py-4 px-3 rounded-lg hover:ring hover:ring-red-500">
      <div className=" text-red-700 bg-red-100 px-6 py-3 rounded-full">
        <h2 className=" text-lg font-bold">A+</h2>
      </div>
      <div>
        <h2 className=" font-bold text-3xl">25</h2>
        <p className=" text-gray-500 text-base">units</p>
      </div>
    </div>
  );
};

export default Unit;
