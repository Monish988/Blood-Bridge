import React from "react";
import { Building2, CircleCheckBig, SquarePen } from "lucide-react";

const InventoryItem = ({ data, onEdit }) => {
  const status =
    data.units <= 3 ? "Critical" : data.units <= 7 ? "Low" : "Sufficient";

  return (
    <div className="bg-white border-t border-t-gray-300 py-2 grid grid-cols-1 gap-2 md:grid-cols-7 md:gap-0 px-2 md:px-2 items-start md:items-center text-xs md:text-base">
      <div className="flex items-center gap-2">
        <Building2 size={16} className="md:w-5 md:h-5 flex-shrink-0" />
        <h3 className="font-semibold truncate">{data.hospitalName}</h3>
      </div>

      <div className="bg-lime-200 w-fit px-3 md:px-4 py-1 rounded-full font-semibold text-xs md:text-base">
        {data.bloodGroup}
      </div>

      <h2 className="font-bold">{data.units}</h2>

      <div className="bg-green-200 w-fit px-2 py-1 rounded flex gap-1 items-center text-xs md:text-sm">
        <CircleCheckBig size={12} className="md:w-3.5 md:h-3.5" />
        <span className="text-xs md:text-sm">{status}</span>
      </div>

      <h3 className="text-xs md:text-base">{data.expiry}</h3>
      <h3 className="text-xs md:text-base truncate">{data.updatedAt}</h3>

      <SquarePen
        size={16}
        className="md:w-4.5 md:h-4.5 cursor-pointer hover:text-red-600"
        onClick={onEdit}
      />
    </div>
  );
};

export default InventoryItem;
