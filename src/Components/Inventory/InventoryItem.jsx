import React from "react";
import { Building2, CircleCheckBig, SquarePen } from "lucide-react";

const InventoryItem = ({ data, onEdit }) => {
  const status =
    data.units <= 3 ? "Critical" : data.units <= 7 ? "Low" : "Sufficient";

  return (
    <div className="bg-white border-t border-t-gray-300 py-2 grid grid-cols-7 px-2 items-center">
      <div className="flex items-center gap-2">
        <Building2 />
        <h3 className="font-semibold">{data.hospitalName}</h3>
      </div>

      <div className="bg-lime-200 w-fit px-4 py-1 rounded-full font-semibold">
        {data.bloodGroup}
      </div>

      <h2 className="font-bold">{data.units}</h2>

      <div className="bg-green-200 w-fit px-2 py-1 rounded flex gap-1 items-center">
        <CircleCheckBig size={14} />
        <span className="text-sm">{status}</span>
      </div>

      <h3>{data.expiry}</h3>
      <h3>{data.updatedAt}</h3>

      <SquarePen
        size={18}
        onClick={onEdit}
        className="cursor-pointer hover:text-red-600"
      />
    </div>
  );
};

export default InventoryItem;
