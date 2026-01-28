import React from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CircleCheckBig,
  Eye,
  CircleX,
} from "lucide-react";

const DonorItem = (props) => {
  const CheckIcon = props.icon;
  const bloodGroupStyles = {
    "A+": "bg-red-100 text-red-600",
    "A-": "bg-red-200 text-red-700",
    "B+": "bg-blue-100 text-blue-600",
    "B-": "bg-blue-200 text-blue-700",
    "AB+": "bg-purple-100 text-purple-600",
    "AB-": "bg-purple-200 text-purple-700",
    "O+": "bg-green-100 text-green-600",
    "O-": "bg-green-200 text-green-700",
  };
  const bgClass = bloodGroupStyles[props.BG] || "bg-blue-100 text-gray-600";

  return (
    <div
      className="
      bg-white
      p-4
      rounded-lg
      grid
      grid-cols-1
      gap-4
      shadow
      lg:grid-cols-6
      lg:items-center
      
    "
    >
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
      <div className={`${bgClass}  w-fit px-4 py-2 rounded-2xl font-bold`}>
        {props.BG}
      </div>

      {/* CONTACT */}
      <div className="text-gray-500 text-base space-y-1">
        <div className="flex items-center gap-2">
          <Mail size={14} />
          <p>{props.email}</p>
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
      <div
        className={`flex items-center gap-2 ${props.status == "Available" ? "bg-green-200 text-green-700" : "bg-gray-300"} px-3 py-1 rounded-lg text-sm text-gray-700 w-fit`}
      >
        <CheckIcon size={14} />
        {props.status}
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-between lg:justify-start gap-7">
        <Eye size={18} />
        <button
          onClick={props.onToggle}
          className="border cursor-pointer border-gray-500 px-4 py-2 rounded-lg text-base"
        >
          {props.status === "Available" ? "Mark Unavailable" : "Mark Available"}
        </button>
      </div>
    </div>
  );
};

export default DonorItem;
