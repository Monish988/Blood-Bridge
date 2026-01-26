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
    <div className="bg-white py-5 shadow px-4 rounded-lg flex justify-between items-center">
      <div className="flex gap-3 items-center">
        <div className="flex flex-col items-center gap-2">
          <h2 className="bg-red-300 py-2 px-5 text-red-700 font-bold rounded-full">
            {data.bloodGroup}
          </h2>
          <p className="text-gray-500 text-sm">{data.units} Units</p>
        </div>

        <div className="space-y-2">
          <div className="flex gap-3">
            <span className="bg-yellow-200 text-yellow-700 px-2 py-1 rounded text-sm">
              {data.urgency}
            </span>
            <span className="bg-blue-200 text-blue-700 px-2 py-1 rounded text-sm">
              {data.status}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Building2 size={16} />
            <h3 className="font-semibold">
              {data.hospital}
              <span className="text-gray-400"> • {data.city}</span>
            </h3>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Phone size={16} />
            <p>{data.phone}</p>
          </div>

          <div className="flex items-center gap-2 text-gray-600">
            <Clock size={16} />
            <p>{new Date(data.createdAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 text-blue-600 border border-blue-500 px-4 py-2 rounded">
          <Bell size={16} /> Notify
        </button>

        {data.status === "OPEN" && (
          <>
            <button
              onClick={onFulfill}
              className="flex items-center gap-2 text-green-600 border border-green-500 px-4 py-2 rounded"
            >
              <CircleCheckBig size={16} /> Fulfill
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-2 text-gray-600 border border-gray-500 px-4 py-2 rounded"
            >
              <CircleX size={16} /> Cancel
            </button>
          </>
        )}
      </div>
    </div>
  );
};
