import React from "react";
import { Building2, CircleCheckBig,SquarePen } from "lucide-react";


const InventoryItem = () => {
  return (
    <div className=" bg-white border-t border-t-gray-400 py-2 grid grid-cols-7 px-2 items-center">
      <div className=" flex items-center gap-2 text-gray-600">
        <Building2 />
        <h3 className=" text-gray-900 font-semibold">Metro Blood Bank</h3>
      </div>
      <div>
        <div className=" bg-lime-200 w-fit py-2 px-5 text-base font-semibold text-green-700 rounded-full">
          <h3>B-</h3>
        </div>
      </div>
      <div>
        <h2 className=" font-bold text-xl">10</h2>
      </div>
      <div>
        <div className=" bg-green-200 w-fit text-green-700 py-1 px-2 rounded-lg h-fit flex  items-center gap-1">
          <CircleCheckBig size={16} />
          <p className=" font-base text-sm">Sufficient</p>
        </div>
      </div>
      <div>
        <div>
            <h3 className=" text-gray-900">Mar 10, 2025</h3>
        </div>
      </div>
      <div>
        <h3 className=" text-gray-900">Jan 24, 10:02 PM</h3>
      </div>
      <div className=" text-gray-900">
        <SquarePen size={20}/>
      </div>
    </div>
  );
};

export default InventoryItem;
