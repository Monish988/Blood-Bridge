import React from "react";
import RightCard from "./RightCard";
import {
  Users,
  Activity,
  Droplet,
  CircleAlert,
  Building2,
  Clock,
} from "lucide-react";

const Right = () => {
  return (
    <div className="
      w-full
      lg:w-4/5
      bg-gray-100
      px-4 sm:px-6 lg:px-9
      py-6
      space-y-8
    ">
      {/* SECTION 1 */}
      <div>
        <h2 className="font-bold text-2xl">Dashboard</h2>
        <p className="text-sm text-gray-400">
          Real-time overview of blood bank operations
        </p>
      </div>

      {/* SECTION 2 - CARDS */}
      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-4
        gap-6
      ">
        <RightCard count={6} icon={Users} title="Total Donors" color="bg-red-500" />
        <RightCard count={4} icon={Activity} title="Active Donors" color="bg-green-500" />
        <RightCard count={2} icon={Droplet} title="New Donors" color="bg-blue-500" />
        <RightCard count={3} icon={CircleAlert} title="Pending Requests" color="bg-yellow-500" />
      </div>

      {/* SECTION 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg h-80 shadow-lg" />
        <div className="bg-white rounded-lg h-80 shadow-lg" />
      </div>

      {/* SECTION 4 */}
      <div className="bg-white p-4 sm:p-5 rounded-lg space-y-4">
        <div className="flex items-center gap-3">
          <CircleAlert size={22} className="text-red-500" />
          <h2 className="font-bold text-lg">Recent Blood Requests</h2>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg space-y-3">
          <div className="flex gap-3 items-center">
            <h2 className="text-red-500 font-bold text-2xl">AB+</h2>
            <span className="px-2 py-1 text-sm rounded bg-amber-50 text-amber-600">
              High
            </span>
            <span className="px-2 py-1 text-sm rounded bg-blue-100 text-blue-600">
              Pending
            </span>
          </div>

          <div className="flex gap-2 text-sm text-gray-500 items-center">
            <Building2 size={16} />
            <p>Regional Medical Center</p>
          </div>

          <div className="flex gap-4 text-sm text-gray-500 items-center">
            <p>2 units needed</p>
            <div className="flex gap-1 items-center">
              <Clock size={14} />
              <p>Jan 24, 12:33 PM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Right;
