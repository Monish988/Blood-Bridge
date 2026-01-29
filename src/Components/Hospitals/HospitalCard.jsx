import {
  Building2,
  CircleCheckBig,
  Mail,
  Phone,
  MapPin,
  SquarePen,
  Trash2,
} from "lucide-react";

const HospitalCard = (props) => {
  return (
    <div className="bg-white rounded-lg py-3 md:py-4 h-fit px-4 md:px-6 shadow-md hover:shadow-lg transition space-y-3 md:space-y-4">
      {/* HEADER */}
      <div className="py-2 md:py-4 flex gap-2 md:gap-3">
        <div className="flex items-center text-white bg-blue-500 px-2 md:px-4 py-1 rounded-xl flex-shrink-0">
          <Building2 size={20} className="md:w-8 md:h-8" />
        </div>

        <div className="flex flex-col gap-1 min-w-0">
          <h2 className="font-bold text-base md:text-xl truncate">{props.name}</h2>

          {props.verified ? (
            <div className="bg-green-200 text-green-700 px-2 py-1 rounded-lg flex items-center gap-1 w-fit">
              <CircleCheckBig size={14} className="md:w-4 md:h-4" />
              <p className="text-xs md:text-sm">Verified</p>
            </div>
          ) : (
            <div className="bg-gray-200 text-gray-600 px-2 py-1 rounded-lg w-fit">
              <p className="text-xs md:text-sm">Unverified</p>
            </div>
          )}
        </div>
      </div>

      {/* INFO */}
      <div className="space-y-1 md:space-y-2 text-gray-500 text-sm md:text-base">
        <div className="flex items-center gap-2 min-w-0">
          <Mail size={14} className="md:w-4 md:h-4 flex-shrink-0" />
          <p className="truncate text-xs md:text-sm">{props.email}</p>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <Phone size={14} className="md:w-4 md:h-4 flex-shrink-0" />
          <p className="truncate text-xs md:text-sm">{props.phone}</p>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <MapPin size={14} className="md:w-4 md:h-4 flex-shrink-0" />
          <p className="truncate text-xs md:text-sm">{props.city}</p>
        </div>
        <p className="text-xs md:text-sm">License: {props.license}</p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2 md:gap-4 items-center mt-3 md:mt-5">
        <button
          onClick={props.onToggle}
          className="border px-3 md:px-6 py-1 rounded-lg flex-1 text-xs md:text-base"
        >
          {props.verified ? "Unverify" : "Verify"}
        </button>

        <SquarePen
          size={16}
          className="md:w-4.5 md:h-4.5 cursor-pointer flex-shrink-0"
          onClick={props.onEdit}
        />

        <Trash2
          size={16}
          className="md:w-4.5 md:h-4.5 text-red-500 cursor-pointer flex-shrink-0"
          onClick={props.onDelete}
        />
      </div>
    </div>
  );
};

export default HospitalCard;
