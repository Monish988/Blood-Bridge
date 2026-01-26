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
    <div className="bg-white rounded-lg py-4 h-fit  px-6 shadow-md hover:shadow-lg transition space-y-4">
      {/* HEADER */}
      <div className="py-4 flex gap-3">
        <div className="flex items-center text-white bg-blue-500 px-4 py-1 rounded-xl">
          <Building2 size={32} />
        </div>

        <div className="flex flex-col gap-1">
          <h2 className="font-bold text-xl">{props.name}</h2>

          {props.verified ? (
            <div className="bg-green-200 text-green-700 px-2 py-1 rounded-lg flex items-center gap-1 w-fit">
              <CircleCheckBig size={16} />
              <p className="text-sm">Verified</p>
            </div>
          ) : (
            <div className="bg-gray-200 text-gray-600 px-2 py-1 rounded-lg w-fit">
              <p className="text-sm">Unverified</p>
            </div>
          )}
        </div>
      </div>

      {/* INFO */}
      <div className="space-y-2 text-gray-500">
        <div className="flex items-center gap-2">
          <Mail size={16} />
          <p>{props.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={16} />
          <p>{props.phone}</p>
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <p>{props.city}</p>
        </div>
        <p className="text-sm">License: {props.license}</p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 items-center mt-5">
        <button
          onClick={props.onToggle}
          className="border px-6 py-1 rounded-lg w-full"
        >
          {props.verified ? "Unverify" : "Verify"}
        </button>

        <SquarePen
          size={19}
          className="cursor-pointer"
          onClick={props.onEdit}
        />

        <Trash2
          size={19}
          className="text-red-500 cursor-pointer"
          onClick={props.onDelete}
        />
      </div>
    </div>
  );
};

export default HospitalCard;
