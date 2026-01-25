import React from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CircleCheckBig,
  Eye,
} from "lucide-react";

const DonorItem = (props) => {
  return (
    <div className="
      bg-white
      p-4
      rounded-lg
      hover:bg-gray-50
      grid
      grid-cols-1
      gap-4
      shadow
      lg:grid-cols-6
      lg:items-center
    ">
      {/* DONOR */}
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-red-500 p-3 text-white">
          <User size={18} />
        </div>
        <div>
          <h3 className="font-semibold">{props.name}</h3>
          <p className="text-sm text-gray-500">{props.sex}</p>
        </div>
      </div>

      {/* BLOOD */}
      <div className="bg-blue-100 text-blue-600 w-fit px-4 py-2 rounded-2xl font-bold">
        O+
      </div>

      {/* CONTACT */}
      <div className="text-gray-500 text-base space-y-1">
        <div className="flex items-center gap-2">
          <Mail size={14} />
          <p>{props.mail}</p>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={14} />
          <p>{props.phone}</p>
        </div>
      </div>

      {/* LOCATION */}
      <div className="flex items-center gap-2 text-base text-gray-500">
        <MapPin size={14} />
        <p>{props.location}</p>
      </div>

      {/* STATUS */}
      <div className="flex items-center gap-2 bg-gray-200 px-4 py-2 rounded-lg text-base text-gray-600 w-fit">
        <CircleCheckBig size={14} />
        {props.status}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-between lg:justify-start gap-7">
        <Eye size={18} />
        <button className=" border cursor-pointer border-gray-500 px-4 py-2 rounded-lg text-base">
          Mark Available
        </button>
      </div>
    </div>
  );
};

export default DonorItem;
