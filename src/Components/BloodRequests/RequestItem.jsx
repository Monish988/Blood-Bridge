import {
  CircleCheckBig,
  Building2,
  Phone,
  Clock,
  Bell,
  CircleX,
} from "lucide-react";

export const RequestItem = ({ data, onFulfill, onCancel }) => {
  return (
    <div className="bg-white py-3 md:py-5 shadow px-3 md:px-4 rounded-lg flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-0">
      <div className="flex gap-2 md:gap-3 items-start md:items-center flex-1">
        <div className="flex flex-col items-center gap-2">
          <h2 className="bg-red-300 py-1 md:py-2 px-3 md:px-5 text-red-700 font-bold rounded-full text-sm md:text-base">
            {data.bloodGroup}
          </h2>
          <p className="text-gray-500 text-xs md:text-sm">{data.units} Units</p>
        </div>

        <div className="space-y-1 md:space-y-2 flex-1">
          <div className="flex gap-2 md:gap-3 flex-wrap">
            <span className="bg-yellow-200 text-yellow-700 px-2 py-1 rounded text-xs md:text-sm">
              {data.urgency}
            </span>
            <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded text-xs md:text-sm">
              {data.status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600 text-xs md:text-sm">
            <Building2 size={14} className="md:w-4 md:h-4 flex-shrink-0" />
            <h3 className="font-semibold truncate">
              {data.hospital}
              <span className="text-gray-400 hidden md:inline"> • {data.city}</span>
            </h3>
          </div>

          <div className="flex items-center gap-2 text-gray-600 text-xs md:text-sm">
            <Phone size={14} className="md:w-4 md:h-4 flex-shrink-0" />
            <p className="truncate">{data.phone}</p>
          </div>

          <div className="flex items-center gap-2 text-gray-600 text-xs md:text-sm">
            <Clock size={14} className="md:w-4 md:h-4 flex-shrink-0" />
            <p className="truncate">{new Date(data.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 md:gap-3 flex-wrap md:flex-nowrap">
        <button className="flex items-center gap-1 md:gap-2 text-blue-600 border border-blue-500 px-2 md:px-4 py-1 md:py-2 rounded text-xs md:text-base">
          <Bell size={14} className="md:w-4 md:h-4" /> Notify
        </button>

        {data.status === "OPEN" && (
          <>
            <button
              onClick={onFulfill}
              className="flex items-center gap-1 md:gap-2 text-green-600 border border-green-500 px-2 md:px-4 py-1 md:py-2 rounded text-xs md:text-base"
            >
              <CircleCheckBig size={14} className="md:w-4 md:h-4" /> Fulfill
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-1 md:gap-2 text-gray-600 border border-gray-500 px-2 md:px-4 py-1 md:py-2 rounded text-xs md:text-base"
            >
              <CircleX size={14} className="md:w-4 md:h-4" /> Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};
